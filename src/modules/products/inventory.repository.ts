import postgres from "postgres";
import { IOrderItem } from "../orders/orders.types";
export class InventoryRepository {
    async updateInventory(tx: postgres.TransactionSql, items: IOrderItem[]) {
        const values = items.map(item => [
            item.products_sku_id,
            item.quantity
        ])

        const updatedRows = await tx`
          UPDATE products_skus SET quantity = quantity - t.quantity
          FROM (
            VALUES ${tx(values)}
          ) as  t(products_sku_id, quantity)
          WHERE products_skus.id = t.products_sku_id 
          AND products_skus.quantity >= t.quantity
          RETURNING products_skus.id
        `


        if(updatedRows.length !== values.length) {
            throw new Error("Insufficient stock")
        }
    }
}
