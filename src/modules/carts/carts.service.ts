import { CartItemsRepository } from "./cart-items.repository";
import { CartsRepository } from "./carts.repository";
import { BaseError } from "../../common/errors/base.error";

export class CartsService {
    private cartItemsRepository: CartItemsRepository
    private cartsRepository: CartsRepository
    constructor(cartItemsRepository: CartItemsRepository, cartsRepository: CartsRepository) {
        this.cartItemsRepository = cartItemsRepository
        this.cartsRepository = cartsRepository
    }

    async addItemToCart(userId: string, quantity: number, product_sku_id: string) {
        if (!Number.isInteger(quantity) || quantity <= 0) {
            throw new BaseError("InvalidQuantity", 400, true, "Quantity must be a positive integer")
        }

        if (!product_sku_id) {
            throw new BaseError("InvalidProductSku", 400, true, "Product SKU is required")
        }

        let cart = await this.cartsRepository.findByUserId(userId)
        if (!cart) {
            cart = await this.cartsRepository.create(userId)
        }

        await this.cartItemsRepository.addItemToCart(cart.id, product_sku_id, quantity)
    }

    async getCartItems(userId: string) {
        const cartItems = await this.cartItemsRepository.getCartItems(userId)
        return cartItems
    }

    async deleteCartItem(userId: string, cartItemId: string) {
        if (!cartItemId) {
            throw new BaseError("InvalidCartItem", 400, true, "Cart item is required")
        }

        const deletedItem = await this.cartItemsRepository.deleteCartItem(userId, cartItemId)
        if (!deletedItem) {
            throw new BaseError("CartItemNotFound", 404, true, "Cart item not found")
        }
    }
}