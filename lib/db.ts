import { Pool, type QueryResultRow } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error(
        "[db] DATABASE_URL is not set. Copy .env.local.example to .env.local and configure it."
    );
}

// Singleton across HMR: cache the pool on globalThis so Next.js dev
// hot-reloads don't open a new pool on every file edit.
const globalForPg = globalThis as unknown as { __cashlio_pg_pool__?: Pool };

export const pool: Pool =
    globalForPg.__cashlio_pg_pool__ ??
    new Pool({
        connectionString,
        max: 10,
        idleTimeoutMillis: 30_000,
        connectionTimeoutMillis: 5_000,
        ssl:
            process.env.NODE_ENV === "production"
                ? { rejectUnauthorized: false }
                : false,
    });

if (process.env.NODE_ENV !== "production") {
    globalForPg.__cashlio_pg_pool__ = pool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params: unknown[] = []
): Promise<{ rows: T[]; rowCount: number }> {
    const result = await pool.query<T>(text, params);
    return { rows: result.rows, rowCount: result.rowCount ?? 0 };
}
