import type { QueryResultRow } from "pg";
import { query } from "@/lib/db";

export interface UserRow extends QueryResultRow {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    created_at: Date;
}

export async function createUser(
    name: string,
    email: string,
    passwordHash: string
): Promise<UserRow> {
    const { rows } = await query<UserRow>(
        `INSERT INTO users (name, email, password_hash)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [name, email, passwordHash]
    );
    return rows[0];
}

export async function getUserByEmail(email: string): Promise<UserRow | null> {
    const { rows } = await query<UserRow>(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    );
    return rows[0] ?? null;
}

export async function getUserById(id: number): Promise<UserRow | null> {
    const { rows } = await query<UserRow>(
        `SELECT * FROM users WHERE id = $1`,
        [id]
    );
    return rows[0] ?? null;
}
