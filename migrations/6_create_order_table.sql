CREATE TABLE
    IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
        discount DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
        shipping_cost DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (shipping_cost >= 0),
        total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
        status VARCHAR(30) NOT NULL DEFAULT 'pending',
        payment_status VARCHAR(30) NOT NULL DEFAULT 'pending',
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