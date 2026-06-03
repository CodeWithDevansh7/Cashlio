import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Client } from "pg";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({path : ".env.local"});

const DEMO_EMAIL = "demo@cashlio.com";
const DEMO_PASSWORD = "demo123";
const BCRYPT_COST = 10;

const EXPENSE_CATEGORIES = [
    "Food",
    "Transport",
    "Bills",
    "Health",
    "Entertainment",
    "Shopping",
    "Other",
] as const;

const INCOME_CATEGORIES = [
    "Salary",
    "Freelance",
    "Investment",
    "Business",
    "Other Income",
] as const;

type SampleTransaction = {
    categoryName: string;
    amount: string;
    transactionType: "income" | "expense";
    daysAgo: number;
    description: string;
};

const SAMPLE_TRANSACTIONS: SampleTransaction[] = [
    { categoryName: "Salary",     amount: "85000.00", transactionType: "income",  daysAgo: 2,  description: "Monthly salary" },
    { categoryName: "Food",       amount: "8724.00",  transactionType: "expense", daysAgo: 0,  description: "Groceries and dining" },
    { categoryName: "Shopping",   amount: "13782.00", transactionType: "expense", daysAgo: 1,  description: "Clothing and household" },
    { categoryName: "Bills",      amount: "9285.00",  transactionType: "expense", daysAgo: 3,  description: "Electricity bill" },
    { categoryName: "Transport",  amount: "4207.00",  transactionType: "expense", daysAgo: 4,  description: "Fuel and transit" },
    { categoryName: "Freelance",  amount: "15000.00", transactionType: "income",  daysAgo: 6,  description: "Side project payment" },
];

function dateNDaysAgo(daysAgo: number): string {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - daysAgo);
    return d.toISOString().slice(0, 10);
}

async function ensureSchema(client: Client): Promise<void> {
    const schemaPath = join(process.cwd(), "sql", "schema.sql");
    const ddl = readFileSync(schemaPath, "utf8");
    await client.query(ddl);
}

async function ensureCategories(client: Client): Promise<Map<string, number>> {
    const idByName = new Map<string, number>();

    for (const name of EXPENSE_CATEGORIES) {
        const { rows } = await client.query<{ id: number }>(
            `INSERT INTO categories (name, category_type)
             VALUES ($1, 'expense')
             ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
             RETURNING id`,
            [name]
        );
        idByName.set(name, rows[0].id);
    }

    for (const name of INCOME_CATEGORIES) {
        const { rows } = await client.query<{ id: number }>(
            `INSERT INTO categories (name, category_type)
             VALUES ($1, 'income')
             ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
             RETURNING id`,
            [name]
        );
        idByName.set(name, rows[0].id);
    }

    return idByName;
}

async function ensureDemoUser(client: Client): Promise<number> {
    const { rows } = await client.query<{ id: number }>(
        `SELECT id FROM users WHERE email = $1`,
        [DEMO_EMAIL]
    );

    if (rows.length > 0) {
        return rows[0].id;
    }

    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, BCRYPT_COST);
    const { rows: inserted } = await client.query<{ id: number }>(
        `INSERT INTO users (name, email, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id`,
        ["Demo User", DEMO_EMAIL, passwordHash]
    );
    return inserted[0].id;
}

async function ensureSampleTransactions(
    client: Client,
    userId: number,
    categoryIds: Map<string, number>
): Promise<void> {
    const { rows } = await client.query<{ count: string }>(
        `SELECT COUNT(*)::text AS count FROM transactions WHERE user_id = $1`,
        [userId]
    );

    if (Number(rows[0].count) > 0) {
        return;
    }

    for (const tx of SAMPLE_TRANSACTIONS) {
        const categoryId = categoryIds.get(tx.categoryName);
        if (categoryId === undefined) {
            throw new Error(`[init-db] missing category id for "${tx.categoryName}"`);
        }
        await client.query(
            `INSERT INTO transactions
                (user_id, category_id, amount, transaction_type, transaction_date, description)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
                userId,
                categoryId,
                tx.amount,
                tx.transactionType,
                dateNDaysAgo(tx.daysAgo),
                tx.description,
            ]
        );
    }
}

/**
 * Create schema, seed categories, demo user, and sample transactions.
 * Idempotent: safe to call repeatedly. Uses a dedicated short-lived Client
 * (not the shared pool) so initialization never depends on it.
 */
export async function initializeDatabase(): Promise<void> {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    try {
        await client.query("BEGIN");
        await ensureSchema(client);
        const categoryIds = await ensureCategories(client);
        const demoUserId = await ensureDemoUser(client);
        await ensureSampleTransactions(client, demoUserId, categoryIds);
        await client.query("COMMIT");
    } catch (err) {
        await client.query("ROLLBACK").catch(() => undefined);
        throw new Error(
            `[init-db] initialization failed: ${(err as Error).message}`
        );
    } finally {
        await client.end();
    }
}

// Allow `npx tsx lib/init-db.ts` for one-off initialisation.
if (process.argv[1]?.endsWith("init-db.ts") || process.argv[1]?.endsWith("init-db.js")) {
    initializeDatabase()
        .then(() => {
            console.log("[init-db] database initialized");
            process.exit(0);
        })
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });
}

