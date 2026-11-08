CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    order_id UUID NOT NULL
        REFERENCES orders(id) ON DELETE RESTRICT,

    provider VARCHAR(50) NOT NULL,

    transaction_id VARCHAR(255),

    amount DECIMAL(10,2) NOT NULL
        CHECK (amount >= 0),

    status VARCHAR(30) NOT NULL DEFAULT 'pending',

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ
);
