-- Cashlio database schema
-- Idempotent: safe to run on a fresh or existing database.

CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT         NOT NULL,
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(50) UNIQUE NOT NULL,
    category_type VARCHAR(20) NOT NULL,
    created_at    TIMESTAMP   NOT NULL DEFAULT NOW(),
    CONSTRAINT categories_type_chk CHECK (category_type IN ('income', 'expense'))
);

CREATE TABLE IF NOT EXISTS transactions (
    id               SERIAL PRIMARY KEY,
    user_id          INTEGER       NOT NULL REFERENCES users(id)      ON DELETE CASCADE,
    category_id      INTEGER       NOT NULL REFERENCES categories(id),
    amount           NUMERIC(10,2) NOT NULL,
    transaction_type VARCHAR(20)   NOT NULL,
    transaction_date DATE          NOT NULL,
    description      TEXT,
    created_at       TIMESTAMP     NOT NULL DEFAULT NOW(),
    CONSTRAINT transactions_type_chk CHECK (transaction_type IN ('income', 'expense'))
);

-- Hot path: per-user recent transaction list.
CREATE INDEX IF NOT EXISTS idx_transactions_user_date
    ON transactions (user_id, transaction_date DESC);
