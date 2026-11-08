export interface CreatePaymentDTO {
    order_id: string;
    transaction_id: string;
    provider: string;
    amount: number;
    status: string;
}

export interface IPayment {
    id: string;
    order_id: string;
    transaction_id: string;
    provider: string;
    amount: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export type PaymentStatus = "pending" | "paid" | "failed" | "success" | "canceled"