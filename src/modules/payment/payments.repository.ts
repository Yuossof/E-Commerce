import sql from "../../config/db";
import { IOrderItem } from "../orders/orders.types";
import { InventoryRepository } from "../products/inventory.repository";
import { CreatePaymentDTO, PaymentStatus } from "./payments.types";

export class PaymentsRepository {
    private inventoryRepository: InventoryRepository
    constructor(inventoryRepository: InventoryRepository) {
        this.inventoryRepository = inventoryRepository
    }

    async createPayment(data: CreatePaymentDTO) {
        const [payment] = await sql`
          INSERT INTO payments (order_id, provider, transaction_id, amount, status)
          VALUES (
           ${data.order_id},
           ${data.provider},
           ${data.transaction_id},
           ${data.amount},
           ${data.status}
           )
           RETURNING *
        `

        return payment
    }

    async updatePaymentStatus(status: PaymentStatus, orderId: string) {
        if (!orderId) {
            return
        }

        await sql.begin(async (transaction) => {
            if (status == "success") {
                const orderItems = await transaction<IOrderItem[]>`
                  SELECT products_sku_id, quantity
                  FROM order_items
                  WHERE order_id = ${orderId}
                `

                if (orderItems.length <= 0) {
                    throw new Error("No order items found")
                }

                await this.inventoryRepository.updateInventory(transaction, orderItems)
            }

            await transaction`
              UPDATE orders SET payment_status = ${status} WHERE id = ${orderId}
            `

            await transaction`
              UPDATE payments SET status = ${status} WHERE order_id = ${orderId}
            `
        })
    }

    // async markOrderAsPaid(orderId: string) {
    //     await this.updatePaymentStatus("paid", orderId)
    // }
}