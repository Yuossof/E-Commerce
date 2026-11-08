CREATE TABLE
    IF NOT EXISTS order_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        order_id UUID NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
        -- product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
        products_sku_id UUID NOT NULL REFERENCES products_skus (id) ON DELETE RESTRICT,
        quantity INTEGER NOT NULL,
        unit_price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            deleted_at TIMESTAMP
        WITH
            TIME ZONE,
            updated_at TIMESTAMP
        WITH
            TIME ZONE
    );