CREATE TABLE
    IF NOT EXISTS carts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        user_id UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMPTZ,
        updated_at TIMESTAMPTZ,
        UNIQUE (user_id)
    );