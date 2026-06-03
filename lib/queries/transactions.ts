import type { QueryResultRow } from "pg";
import { query } from "@/lib/db";

export interface TransactionRow extends QueryResultRow {
    id: number;
    user_id: number;
    category_id: number;
    amount: string; // NUMERIC comes back as string to preserve precision
    transaction_type: "income" | "expense";
    transaction_date: string; // YYYY-MM-DD
    description: string | null;
    created_at: Date;
}

export interface CreateTransactionInput {
    userId: number;
    categoryId: number;
    amount: string;
    transactionType: "income" | "expense";
    transactionDate: string; // YYYY-MM-DD
    description?: string | null;
}

export async function createTransaction(
    input: CreateTransactionInput
): Promise<TransactionRow> {
    const { rows } = await query<TransactionRow>(
        `INSERT INTO transactions
            (user_id, category_id, amount, transaction_type, transaction_date, description)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
            input.userId,
            input.categoryId,
            input.amount,
            input.transactionType,
            input.transactionDate,
            input.description ?? null,
        ]
    );
    return rows[0];
}

export async function getTransactionById(
    id: number,
    userId: number
): Promise<TransactionRow | null> {
    const { rows } = await query<TransactionRow>(
        `SELECT * FROM transactions WHERE id = $1 AND user_id = $2`,
        [id, userId]
    );
    return rows[0] ?? null;
}

export interface GetTransactionsOptions {
    limit?: number;
    offset?: number;
}

export async function getTransactionsByUser(
    userId: number,
    options: GetTransactionsOptions = {}
): Promise<TransactionRow[]> {
    const limit = options.limit ?? 100;
    const offset = options.offset ?? 0;
    const { rows } = await query<TransactionRow>(
        `SELECT * FROM transactions
         WHERE user_id = $1
         ORDER BY transaction_date DESC, id DESC
         LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
    );
    return rows;
}
