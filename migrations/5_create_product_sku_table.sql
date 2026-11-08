CREATE TABLE
    IF NOT EXISTS product_attributes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        type VARCHAR(200) NOT NULL,
        value VARCHAR(200) NOT NULL,
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

CREATE TABLE
    IF NOT EXISTS products_skus (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        product_id UUID NOT NULL REFERENCES products (id) ON DELETE RESTRICT,
        sku VARCHAR(200) NOT NULL UNIQUE,
        quantity INTEGER NOT NULL CHECK (quantity >= 0),
        price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
        cover TEXT,
        images TEXT[],
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

CREATE TABLE IF NOT EXISTS
    product_sku_attributes (
        sku_id UUID NOT NULL REFERENCES products_skus (id) ON DELETE CASCADE,
        attribute_id UUID NOT NULL REFERENCES product_attributes (id) ON DELETE CASCADE,
        PRIMARY KEY (sku_id, attribute_id)
    );