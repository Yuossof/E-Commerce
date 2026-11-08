import { CartItemsRepository } from "../carts/cart-items.repository";
import { OrdersRepository } from "./orders.repository";
import { PaymentsService } from "../payment/payments.service";
import { BaseError } from "../../common/errors/base.error";

export class OrdersService {
    private orderRepository: OrdersRepository
    private cartItemsRepository: CartItemsRepository
    private paymentsService: PaymentsService

    constructor(orderRepo: OrdersRepository, cartItemsRepository: CartItemsRepository, paymentsService: PaymentsService) {
        this.orderRepository = orderRepo
        this.cartItemsRepository = cartItemsRepository
        this.paymentsService = paymentsService
    }

    async create(userId: string) {
        const cartItems = await this.cartItemsRepository.getCartItems(userId)

        if (!cartItems || cartItems.length === 0) {
            throw new BaseError(
                "EmptyCart",
                400,
                true,
                "Cannot create order from an empty cart"
            );
        }

        let subtotal: number = 0
        cartItems.forEach((ci) => {
            subtotal += ci.quantity * ci.price
        })

        const cartId = cartItems[0].cart_id;

        const { order, orderItems } = await this.orderRepository.createWithItems(
            userId,
            cartId,
            subtotal,
            cartItems
        )

        const { clientSecret } = await this.paymentsService.createPaymentIntent(order.id, order.total, userId)

        return {
            order: {
                ...order,
                orderItems: orderItems
            },
            clientSecret
        }
    }

    async getOrders(userId: string) {
        return this.orderRepository.findAllByUserId(userId)
    }

    async getOrder(userId: string, orderId: string) {
        return this.orderRepository.findByIdAndUserId(userId, orderId)
    }

}