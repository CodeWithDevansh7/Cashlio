# Database Setup — Implementation Plan

## Context

Cashlio (Next.js 16.2.6 / App Router / TypeScript) currently has no data layer — `app/dashboard/page.tsx` and the landing pages render hard-coded mock data. The spec `.claude/specs/01-database-setup.md` requires establishing the PostgreSQL data layer using the native `pg` driver (no ORM, no query builder) so that authentication, transaction management, budgeting, and analytics features can be built on top. This plan covers Task 1–4 from the spec: the connection pool, schema/seed initialization, and the reusable query modules.

**Note on the plan path:** the user instruction pointed at `C:\Users\mohit\.claude\plans\read-txt-claude-specs-01-database-setup-...` (a per-session scaffold path), but the project lives at `C:\Users\mohit\Desktop\expense_tracker\cashlio` and the spec/references/CLAUDE.md all sit inside that project. The plan is therefore written into the project itself at `cashlio/.claude/plans/01-database-setup.md` so it travels with the codebase, matching the conventional location used for `specs/` and `references/`.

---

## Current State (verified)

- `cashlio/package.json` — no `pg`, no `bcrypt`, no `@types/pg` in dependencies.
- `cashlio/lib/` contains only `utils.ts` (`cn()` helper). No `db.ts`, no `init-db.ts`, no `queries/`.
- `cashlio/sql/` does not exist.
- `cashlio/.gitignore` already ignores `.env*` (good for `.env.local`).
- `cashlio/tsconfig.json` — `strict: true`, `paths: { "@/*": ["./*"] }` → use `@/lib/...` imports.
- Existing app uses Tailwind v4, lucide-react, framer-motion. The data layer is orthogonal; no UI changes in this phase.
- All referenced docs (`database-schema.md`, `coding-rules.md`, `project-structure.md`) read in full; constraints summarised below.

---

## Constraints Carried From References

These are non-negotiable and must be honoured in every file:

- **Driver**: `pg` (node-postgres) only. No ORM, no Knex, no Drizzle, no Prisma.
- **Money**: `NUMERIC(10,2)` — never `FLOAT` / `REAL` / `DOUBLE`.
- **Queries**: Always parameterized (`$1`, `$2`, …). No string interpolation of user input.
- **Dates**: store as `DATE` in `YYYY-MM-DD`; never pass JS `Date` objects for the `DATE` column.
- **Transaction / category types**: validated at DB level via `CHECK (… IN ('income','expense'))`.
- **Auth (relevant for seed only here)**: `bcrypt.hash()` / `bcrypt.compare()` — never plain text.
- **Seeding**: idempotent — `ON CONFLICT DO NOTHING` keyed on `email` (users) and `name` (categories); transactions seeded with a deterministic date+description so a uniqueness check can also be added if desired.
- **FK enforcement**: `user_id … ON DELETE CASCADE`; `category_id …` plain reference.
- **Connection**: singleton pool reused across hot-reloads in dev (attach to `globalThis`).

---

## Files To Create / Modify

### New files

| Path | Purpose |
| --- | --- |
| `cashlio/lib/db.ts` | Singleton `pg.Pool`, exported `query()` helper. |
| `cashlio/lib/init-db.ts` | Idempotent `initializeDatabase()` that runs `schema.sql` then `seed.sql`. |
| `cashlio/lib/queries/users.ts` | `createUser`, `getUserByEmail`, `getUserById`. |
| `cashlio/lib/queries/transactions.ts` | `createTransaction`, `getTransactionsByUser`, `getTransactionById`, `updateTransaction`, `deleteTransaction`, `filterTransactions`. |
| `cashlio/lib/queries/categories.ts` | `getAllCategories`, `getCategoriesByType`, `getCategoryById`. |
| `cashlio/sql/schema.sql` | DDL for `users`, `categories`, `transactions` with constraints. |
| `cashlio/sql/seed.sql` | Idempotent seed: 7 expense + 5 income categories, 1 demo user, sample transactions. |
| `cashlio/.env.local.example` | Documents required `DATABASE_URL` variable (do NOT commit real secrets). |

### Modified files

| Path | Change |
| --- | --- |
| `cashlio/package.json` | Add runtime deps `pg` and `bcrypt`; add dev dep `@types/pg`. |
| `cashlio/.gitignore` | Already ignores `.env*`; no edit needed, but verify after the example file is added that the real `.env.local` stays ignored. |

No app/page files are touched in this phase — the data layer is decoupled and will be wired in by the auth/transactions specs.

---

## Phased Implementation

The phases are ordered so each step produces something runnable and the next step has a stable foundation.

### Phase 0 — Dependencies (prerequisite for everything else)

**Goal:** install `pg`, `@types/pg`, `bcrypt`, and `@types/bcrypt`.

- Add to `package.json`:
  - `dependencies`: `pg`, `bcrypt`.
  - `devDependencies`: `@types/pg`, `@types/bcrypt`.
- Run `npm install`.
- Verify: `node_modules/pg` and `node_modules/bcrypt` exist; `npm run lint` still passes.

**Why first:** TypeScript will refuse to compile `lib/db.ts` and the queries without these packages present. `bcrypt` is needed by the seed step that hashes the demo user's password.

---

### Phase 1 — Environment Configuration

**Goal:** establish a documented connection-string contract before writing any DB code.

- Create `cashlio/.env.local.example` containing a single `DATABASE_URL=postgres://user:pass@host:5432/cashlio` placeholder plus a short comment explaining local dev vs. production.
- Do not create a real `.env.local` (developer creates their own). The `.gitignore` already excludes it.
- Note: code reads `process.env.DATABASE_URL` with a non-null assertion (`process.env.DATABASE_URL!`) and a single startup check that throws a descriptive error if missing — keeps TypeScript happy without leaking secrets.

**Why before the pool:** every later phase fails fast with a clear error if the variable is missing; surfacing the contract now avoids confusing 500s during development.

---

### Phase 2 — Connection Pool (`lib/db.ts`)

**Goal:** a single, shared, hot-reload-safe `pg.Pool` plus a thin `query` helper.

Key design points (strategy, not code):

- Construct `Pool` once with the values recommended by `pg` for serverless-adjacent Next.js: `max` ~10, `idleTimeoutMillis` 30s, `connectionTimeoutMillis` 5s, `ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false`.
- **Singleton across HMR**: cache the pool on `globalThis` under a unique symbol key (`__cashlio_pg_pool__`). Without this, Next.js dev mode opens a new pool on every file edit and exhausts Postgres connections.
- Export:
  - `pool` — the raw pool, for advanced use (transactions in queries that need `BEGIN`/`COMMIT`).
  - `query<T>(text: string, params?: unknown[]): Promise<{ rows: T[]; rowCount: number }>` — typed wrapper around `pool.query` that uses `unknown[]` for params so callers can pass primitive arrays safely. Returns a small object (not the full `QueryResult`) to keep call-sites simple.
- Use `Promise<QueryResultRow>` generics; do not `any`.

**Why a separate `query()` instead of importing `pool` directly everywhere:** the spec mandates a "shared query helper", and centralising it gives one place to add logging, slow-query tracing, or per-tenant session settings later without touching call-sites.

---

### Phase 3 — Schema (`sql/schema.sql`)

**Goal:** one SQL file the initializer can run on a fresh or existing database, idempotent.

Tables (matches `database-schema.md` exactly):

- `users`: `id SERIAL PK`, `name VARCHAR(100) NOT NULL`, `email VARCHAR(255) UNIQUE NOT NULL`, `password_hash TEXT NOT NULL`, `created_at TIMESTAMP DEFAULT NOW()`.
- `categories`: `id SERIAL PK`, `name VARCHAR(50) UNIQUE NOT NULL`, `category_type VARCHAR(20) NOT NULL CHECK (category_type IN ('income','expense'))`, `created_at TIMESTAMP DEFAULT NOW()`.
- `transactions`: `id SERIAL PK`, `user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE`, `category_id INTEGER NOT NULL REFERENCES categories(id)`, `amount NUMERIC(10,2) NOT NULL`, `transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('income','expense'))`, `transaction_date DATE NOT NULL`, `description TEXT`, `created_at TIMESTAMP DEFAULT NOW()`.

Strategy details:

- Use `CREATE TABLE IF NOT EXISTS` so re-running on an existing DB is a no-op.
- `CHECK` constraints are the authoritative gate for `transaction_type` and `category_type` — the app layer can also validate, but the DB must be the final word (per coding-rules.md).
- Indexes: add `INDEX idx_transactions_user_date ON transactions(user_id, transaction_date DESC)` — the dashboard will list recent transactions per user, this is the hot path. The unique constraints on `users.email` and `categories.name` automatically create indexes.
- No `DROP` statements. No destructive migrations in this phase.

---

### Phase 4 — Seed (`sql/seed.sql`)

**Goal:** populate categories, a demo user, and a small set of sample transactions, all without duplicating on re-run.

- **Categories** — insert 7 expense + 5 income rows with `ON CONFLICT (name) DO NOTHING`. Names and types match `database-schema.md`:
  - Expense: Food, Transport, Bills, Health, Entertainment, Shopping, Other.
  - Income: Salary, Freelance, Investment, Business, Other Income.
- **Demo user** — single row: `name='Demo User'`, `email='demo@cashlio.app'`, `password_hash` set to a placeholder that the initializer script will overwrite at runtime using `bcrypt.hash('Demo@123', 10)`. The seed file therefore cannot contain a static hash (bcrypt salts are random — but the email check still uses `ON CONFLICT (email) DO NOTHING`). Strategy: SQL file inserts with a clearly-marked sentinel hash like `__BCRYPT_PLACEHOLDER__`; the TS initializer detects that sentinel and runs an `UPDATE users SET password_hash = $1 WHERE email = 'demo@cashlio.app'` using `bcrypt.hash`. On subsequent runs the placeholder is no longer present, so the update is a no-op.
- **Sample transactions** — 4–6 rows tied to the demo user, mixing income and expense across several categories, with dates within the last 30 days. Use `ON CONFLICT` is not possible without a unique constraint on transactions, so prevent duplicates by:
  1. Wrapping the inserts in a `WHERE NOT EXISTS (SELECT 1 FROM transactions WHERE user_id = … AND transaction_date = … AND description = …)` subquery, **or**
  2. Counting first and skipping the section if the demo user already has ≥1 transaction.

  Strategy: use the count check (`SELECT COUNT(*) FROM transactions WHERE user_id = (SELECT id FROM users WHERE email='demo@cashlio.app')`) — if 0, insert. Cleaner SQL and easy to reason about.

- Wrap all inserts in a single transaction (`BEGIN; … COMMIT;`) so a partial failure rolls back cleanly.

---

### Phase 5 — Initialiser (`lib/init-db.ts`)

**Goal:** one exported `initializeDatabase()` function the app can call at startup or on first DB request to make the schema + seed "just exist".

- Read `sql/schema.sql` and `sql/seed.sql` at runtime via `fs.readFile(path.join(process.cwd(), 'sql', 'schema.sql'), 'utf8')`. Do NOT bundle the SQL into a TS string — keep it editable as plain SQL.
- Execute schema first (idempotent because of `IF NOT EXISTS`).
- Execute seed second.
- For the demo-user password fix-up: after seed runs, check `SELECT password_hash FROM users WHERE email='demo@cashlio.app'`. If it equals the sentinel, run `UPDATE` with `bcrypt.hash('Demo@123', 10)`.
- Expose a separate `seedDatabase()` for re-seeding scenarios (e.g., a future `/api/admin/seed` route) that re-runs the seed file.
- **Connection-from-init pattern:** use a dedicated short-lived `Client` (not the shared pool) for the initial DDL. This avoids a chicken-and-egg where the pool isn't created yet. Reuse the same `Client` for both SQL files in a single connection.
- Error mode: on failure, log and rethrow with a clear prefix (`[init-db] schema failed: …`) so the operator can tell initialization errors from runtime query errors.

**Where it gets called in the app:** defer this to the auth/transactions specs. For this spec, exporting the function and confirming it runs once via a one-off `npx tsx lib/init-db.ts` (or a small dev script) is enough. The initializer must be **safe to call on every request** (e.g., wrapped to "create extension / set search_path" only on first call) so future routes can just call it at the top of an API handler.

---

### Phase 6 — Query Layer (`lib/queries/*.ts`)

Each file exports a small set of typed functions. The shape mirrors the responsibilities listed in `project-structure.md`.

**Strategy common to all three files:**

- Import `query` and `pool` from `@/lib/db`.
- Use `QueryResultRow` typing — define a local `interface UserRow`, `TransactionRow`, `CategoryRow` per file so the SQL and TS stay in sync.
- Every public function takes primitives only; never raw `FormData`, never untyped `req.body`.
- All `INSERT` statements return the created row (use `INSERT … RETURNING *`).
- Filter / list functions return arrays (empty array, not `null`, on no match — easier for callers).
- Money is round-tripped as **string** from `pg` (NUMERIC comes back as string to avoid JS float loss) — convert with a `toCents()` helper at the boundary if the app needs integers, otherwise keep as string and format on display.

**`lib/queries/users.ts`:**

- `createUser(name, email, passwordHash): Promise<UserRow>` — `INSERT … RETURNING *`; rely on `UNIQUE(email)` to surface duplicates; map PG error code `23505` to a typed `UserExistsError`.
- `getUserByEmail(email): Promise<UserRow | null>` — single row query.
- `getUserById(id): Promise<UserRow | null>`.

**`lib/queries/transactions.ts`:**

- `createTransaction(input: { userId, categoryId, amount, transactionType, transactionDate, description? })` — returns inserted row.
- `getTransactionById(id, userId)` — always scoped to `userId` so user A can never read user B's row.
- `getTransactionsByUser(userId, opts?: { from?: string; to?: string; limit?: number; offset?: number })` — order by `transaction_date DESC, id DESC`. `from`/`to` are `YYYY-MM-DD` strings; bound as params.
- `filterTransactions(userId, filters: { type?, categoryId?, month? })` — builds a dynamic `WHERE` with a parameter array; **never** concatenate user input into the SQL.
- `updateTransaction(id, userId, patch)` — partial update; `WHERE id = $1 AND user_id = $2` to prevent cross-user writes; `RETURNING *`.
- `deleteTransaction(id, userId)` — `DELETE … WHERE id=$1 AND user_id=$2 RETURNING id`; returns `boolean` indicating whether a row was actually deleted.

**`lib/queries/categories.ts`:**

- `getAllCategories(): Promise<CategoryRow[]>`.
- `getCategoriesByType(type: 'income' | 'expense'): Promise<CategoryRow[]>`.
- `getCategoryById(id): Promise<CategoryRow | null>`.

No mutations on categories from app code — categories are seeded-only in this phase (spec doesn't list create/delete endpoints).

---

## Dependency Graph Between Phases

```
Phase 0 (deps) ──► Phase 1 (.env.example) ──► Phase 2 (db.ts) ──► Phase 3 (schema.sql) ──► Phase 5 (init-db.ts) ──► Phase 4 (seed.sql) — merged in Phase 5
                                                                                                       │
                                                                                                       ▼
                                                                                              Phase 6 (queries/*)
```

Strict order: 0 → 1 → 2 → 3 → 5 → 4 → 6. Phases 3 and 4 are both inputs to Phase 5; Phase 5 actually runs both files in sequence. Phase 6 is the last because it depends on `db.ts` and the schema being final.

---

## Verification Checklist (maps to spec's Acceptance Criteria)

Run these in order after each phase; the final run covers the whole feature.

- [ ] **AC1 — PostgreSQL connects successfully**
  - `psql "$DATABASE_URL" -c '\conninfo'` succeeds.
  - From a TS script: `await query('SELECT 1')` returns `{ rows: [{ ?column?: 1 }] }`.
- [ ] **AC2 — Connection pool implemented**
  - `lib/db.ts` exports a `Pool`; in dev, two consecutive `query()` calls reuse the same pool (assert by logging pool totalCount).
  - Re-importing `db.ts` in dev (HMR) does NOT create a new pool — verify by editing an unrelated file and observing pool count unchanged.
- [ ] **AC3 — Tables created automatically**
  - `await initializeDatabase()` on an empty DB creates `users`, `categories`, `transactions` (verify via `\dt`).
  - Running it again is a no-op (no errors, no duplicate objects).
  - `CHECK` constraints are present (`\d transactions` shows `transaction_type` check).
  - `FOREIGN KEY` constraints are present (show in `\d transactions`).
- [ ] **AC4 — Categories seeded once**
  - After init, `SELECT COUNT(*) FROM categories` = 12 (7 expense + 5 income).
  - Re-running `initializeDatabase()` does not change the count.
  - `SELECT name, category_type FROM categories` matches the list in `database-schema.md`.
- [ ] **AC5 — Demo user seeded once**
  - `SELECT email FROM users WHERE email='demo@cashlio.app'` returns one row.
  - `password_hash` starts with `$2b$` (bcrypt) — not the sentinel string.
  - `bcrypt.compare('Demo@123', row.password_hash)` returns `true`.
  - Re-running init does not insert a duplicate user.
- [ ] **AC6 — Sample transactions seeded once**
  - `SELECT COUNT(*) FROM transactions WHERE user_id = (SELECT id FROM users WHERE email='demo@cashlio.app')` ≥ 4.
  - Re-running init does not increase the count.
  - Every transaction's `user_id` and `category_id` resolve to existing rows (no orphan FKs).
- [ ] **AC7 — Password hashing works**
  - `getUserByEmail('demo@cashlio.app')` returns a row whose `password_hash` is a bcrypt hash; `bcrypt.compare('Demo@123', hash)` = true; `bcrypt.compare('wrong', hash)` = false.
- [ ] **AC8 — Foreign keys enforced**
  - `INSERT INTO transactions (user_id, category_id, …) VALUES (99999, …)` raises a `foreign_key_violation` (PG error code `23503`).
  - `INSERT INTO transactions (user_id, category_id, …) VALUES (<demo user id>, 99999)` similarly fails.
  - `DELETE FROM users WHERE email='demo@cashlio.app'` cascades and removes that user's transactions.
- [ ] **AC9 — All queries parameterized**
  - Grep the queries directory: every `query(` call passes a values array as the second argument.
  - No backtick-templated SQL anywhere in `lib/queries/` or `lib/db.ts`.
- [ ] **AC10 — No ORM used**
  - `package.json` contains no `prisma`, `drizzle-orm`, `knex`, `typeorm`, `sequelize`, `mikro-orm`, etc.
  - `lib/queries/` only imports from `@/lib/db`; no ORM client.

**Final cross-check command set** (manual run after all phases):

```bash
cd cashlio
npm install
cp .env.local.example .env.local       # then edit DATABASE_URL
npx tsx lib/init-db.ts                  # initialise + seed
psql "$DATABASE_URL" -c '\dt'           # tables exist
psql "$DATABASE_URL" -c 'SELECT COUNT(*) FROM categories; SELECT COUNT(*) FROM users; SELECT COUNT(*) FROM transactions;'
npm run lint                            # no errors
npm run build                           # compiles with strict TS
```

If all of the above pass, the spec is complete and the next spec (auth or transactions) can build on the query layer without modification.
