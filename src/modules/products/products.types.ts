export interface CreateProductDTO {
    name: string;
    description: string;
    summary: string;
    category_id: string;
}

// Product skus
export interface CreateSkuDTO {
    product_id: string;
    sku: string;
    price: number | string;
    attributes_ids: string[],
    quantity: number | string;
}

export interface IProduct {
    id: string
    name: string;
    description: string;
    summary: string;
    cover: string;
    images: string[];
    category_id: string;
    created_at: string;
}

export interface ISku {
    id: string;
    product_id?: string;
    sku: string;
    price: string;
    quantity: number;
    cover: string;
    images: string[];
    category_id: string;
    created_at: string;
}

export interface CreateProductAttributeDTO {
    type: string;
    value: string;
}

export interface IProductAttribute {
    id: string;
    type: string;
    value: string;
    created_at: string;
}