import sql from "../../config/db";
import { ICartItemWithSku, IOrder, IOrderItem, OrderPaymentStatus } from "./orders.types";

export class OrdersRepository {
    async createWithItems(
        userId: string,
        cartId: string,
        subtotal: number,
        cartItems: ICartItemWithSku[]
    ) {
        return sql.begin(async (tx) => {
            const [order] = await tx<IOrder[]>`
                INSERT INTO orders (user_id, subtotal, total)
                VALUES (${userId}, ${subtotal}, ${subtotal})
                RETURNING *
            `;

            const itemsToInsert = cartItems.map((item) => ({
                order_id: order.id,
                products_sku_id: item.sku_id,
                quantity: item.quantity,
                unit_price: item.price,
            }));

            const orderItems = await tx<IOrderItem[]>`
                INSERT INTO order_items ${tx(
                itemsToInsert,
                'order_id',
                'products_sku_id',
                'quantity',
                'unit_price'
            )}
                RETURNING *
            `;

            await tx`
                DELETE FROM cart_items WHERE cart_id = ${cartId}
            `;

            return { order, orderItems };
        })
    }

    async findAll(userId: string, orderId: string) {
        const orders = await sql`
          SELECT *
          FROM orders
          WHERE user_id = ${userId}
        `
        return orders
    }

    async findAllByUserId(userId: string) {
        const orders = await sql`
            SELECT 
             o.id AS order_id,
             o.user_id,
             o.subtotal,
             o.total,
             o.status,
             payment_status,
             o.created_at,
             COALESCE(
               json_agg(
                 json_build_object(
                   'id', oi.id,
                   'products_sku_id', oi.products_sku_id,
                   'quantity', oi.quantity,
                   'unit_price', oi.unit_price
                 )
               ) FILTER (WHERE oi.id IS NOT NULL), '[]'
             ) AS items
           FROM orders o
           LEFT JOIN order_items oi ON o.id = oi.order_id
           WHERE o.user_id = ${userId}
           GROUP BY o.id
           ORDER BY o.created_at DESC;
         `

        return orders
    }

    async findByIdAndUserId(userId: string, orderId: string) {
        const [order] = await sql`
            SELECT 
             o.id AS order_id,
             o.user_id,
             o.subtotal,
             o.total,
             o.status,
             o.created_at,
             COALESCE(
               json_agg(
                 json_build_object(
                   'id', oi.id,
                   'products_sku_id', oi.products_sku_id,
                   'quantity', oi.quantity,
                   'unit_price', oi.unit_price
                 )
               ) FILTER (WHERE oi.id IS NOT NULL), '[]'
             ) AS items
           FROM orders o
           LEFT JOIN order_items oi ON o.id = oi.order_id
           WHERE o.user_id = ${userId}
           AND o.id = ${orderId}
           GROUP BY o.id
           ORDER BY o.created_at DESC;
        `

        return order
    }


    async updatePaymentStatus(status: OrderPaymentStatus, orderId: string) {
        await sql`
          UPDATE orders SET payment_status = ${status} WHERE id = ${orderId}
        `
    }

}