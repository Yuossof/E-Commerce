export interface CreateCartDTO {
    user_id?: string;
}

export interface CreateCartItemDTO {
    product_sku_id: string;
    quantity: number;
}


export interface ICart {
    id: string;
    user_id?: string;
    total: number;
    created_at: string;
    updated_at: string;
}

export interface ICartItem {
    cart_id: string;
    products_sku_id: string;
    quantity: number;
    created_at: string;
    updated_at: string;
}

export interface CreateCartItemDTO {
    cart_id: string;
    product_id: string;
    quantity: number
}

