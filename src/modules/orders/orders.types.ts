export interface CreateOrderDTO {
    user_id: string;
    subtotal: number;
    discount?: number;
    shipping_cost: number;
    total: number;
    status?: string;
    payment_status?: string
}

export interface IOrder {
    id: string;
    user_id: string;
    subtotal: number;
    discount?: number;
    shipping_cost: number;
    total: number;
    status?: string;
    payment_status?: string
    created_at: string;
    updated_at: string;
}


export interface IOrderItem {
    id: string;
    order_id: string;
    products_sku_id: string;
    quantity: number;
    unit_price: number;
    created_at: string;
    updated_at: string;
}

export interface ICartItemWithSku {
    cart_item_id: string;
    cart_id: string;
    sku_id: string;
    user_id: string;
    product_name: string;
    quantity: number;
    cover: string;
    summary: string;
    sku: string;
    price: number;
    created_at: string;
    updated_at: string;
}



export type OrderPaymentStatus = "pending" | "paid" | "failed"
