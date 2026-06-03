import type { QueryResultRow } from "pg";
import { query } from "@/lib/db";

export interface CategoryRow extends QueryResultRow {
    id: number;
    name: string;
    category_type: "income" | "expense";
    created_at: Date;
}

export async function getAllCategories(): Promise<CategoryRow[]> {
    const { rows } = await query<CategoryRow>(
        `SELECT * FROM categories ORDER BY category_type, name`
    );
    return rows;
}

export async function getCategoriesByType(
    type: "income" | "expense"
): Promise<CategoryRow[]> {
    const { rows } = await query<CategoryRow>(
        `SELECT * FROM categories WHERE category_type = $1 ORDER BY name`,
        [type]
    );
    return rows;
}

export async function getCategoryById(id: number): Promise<CategoryRow | null> {
    const { rows } = await query<CategoryRow>(
        `SELECT * FROM categories WHERE id = $1`,
        [id]
    );
    return rows[0] ?? null;
}
