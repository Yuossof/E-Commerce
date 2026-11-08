import sql from "../../config/db";
import { ICartItemWithSku } from "../orders/orders.types";

export class CartItemsRepository {
    async addItemToCart(cartId: string, product_sku_id: string, quantity: number) {
        const [cartItem] = await sql`
         INSERT INTO cart_items (cart_id, product_sku_id, quantity)
         VALUES (${cartId}, ${product_sku_id}, ${quantity})
         ON CONFLICT (cart_id, product_sku_id)
         DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
         RETURNING *
        `

        return cartItem
    }

    async getCartItems(userId: string) {
        const cartItems = await sql<ICartItemWithSku[]>`
          SELECT 
            ci.id as cart_item_id,
            ci.quantity, 
            ps.id AS sku_id,
            ps.price,
            p.name AS product_name,
            COALESCE(ps.cover, p.cover) AS cover,
            p.summary,
            c.user_id,
            ci.cart_id
          FROM cart_items ci
          INNER JOIN carts c ON ci.cart_id = c.id
          INNER JOIN products_skus ps ON ci.product_sku_id = ps.id
          INNER JOIN products p ON ps.product_id = p.id
          WHERE c.user_id = ${userId}
        `
        return cartItems
    }

    async deleteCartItem(userId: string, cartItemId: string) {
        const [deletedItem] = await sql`
          DELETE FROM cart_items ci
          USING carts c
          WHERE ci.id = ${cartItemId}
          AND ci.cart_id = c.id
          AND c.user_id = ${userId}
          RETURNING ci.id
        `

        return deletedItem
    }
}
