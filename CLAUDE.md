# CLAUDE.md

## Project Overview

Cashlio is a personal finance and expense tracking application built with Next.js and PostgreSQL.

The long-term goal is to support:

* Authentication
* Expense tracking
* Income tracking
* Budgeting
* Financial analytics
* Dashboard insights

Current development follows a spec-driven workflow using the `.claude/` directory.

---

## Tech Stack

### Frontend

* Next.js 16 (App Router)
* React
* TypeScript
* Tailwind CSS v4
* Framer Motion
* Lucide React

### Backend

* Next.js Route Handlers / Server Components
* PostgreSQL
* pg (node-postgres)

### Database Access

Raw SQL only.

Do NOT use:

* Prisma
* Drizzle
* Sequelize
* TypeORM
* Knex
* Any ORM or query builder

---

## Project Structure

```txt
cashlio/
│
├── app/
│   ├── dashboard/
│   ├── privacy/
│   ├── terms/
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── layout/
│   ├── sections/
│   └── ui/
│
├── lib/
│   ├── db.ts
│   ├── init-db.ts
│   ├── utils.ts
│   └── queries/
│       ├── users.ts
│       ├── categories.ts
│       └── transactions.ts
│
├── sql/
│   ├── schema.sql
│   └── seed.sql
│
└── .claude/
    ├── commands/
    ├── plans/
    ├── references/
    └── specs/
```

---

## Database Architecture

Current database tables:

### users

Stores application users.

Key fields:

* id
* name
* email
* password_hash
* created_at

### categories

Stores transaction categories.

Expense categories:

* Food
* Transport
* Bills
* Health
* Entertainment
* Shopping
* Other

Income categories:

* Salary
* Freelance
* Investment
* Business
* Other Income

### transactions

Stores income and expense records.

Key fields:

* id
* user_id
* category_id
* amount
* transaction_type
* transaction_date
* description
* created_at

---

## Database Rules

All SQL must be parameterized.

Allowed:

```ts
await query(
  "SELECT * FROM users WHERE email = $1",
  [email]
);
```

Not allowed:

```ts
`SELECT * FROM users WHERE email = '${email}'`
```

Store money as:

```sql
NUMERIC(10,2)
```

Never use:

```sql
FLOAT
REAL
DOUBLE
```

Passwords must be hashed using bcrypt.

Maintain referential integrity.

Do not hardcode category IDs.

Load categories from the database when needed.

---

## Query Layer

Database access should be centralized in:

```txt
lib/queries/
```

Available modules:

* users.ts
* categories.ts
* transactions.ts

Before creating new queries:

1. Check existing query modules.
2. Reuse existing functions whenever possible.
3. Keep database logic out of UI components.

---

## App Router Rules

* Prefer Server Components by default.
* Use Client Components only when required.
* New pages should be added under `app/`.
* New API endpoints should be added under `app/api/`.

---

## Spec Workflow

Specifications are stored in:

```txt
.claude/specs/
```

Implementation plans are stored in:

```txt
.claude/plans/
```

Reference documents are stored in:

```txt
.claude/references/
```

When creating a new spec:

1. Read CLAUDE.md.
2. Review existing specs.
3. Respect current project structure.
4. Reuse existing database architecture.
5. Avoid introducing conflicting patterns.

---

## Current Status

Completed:

* PostgreSQL setup
* Connection pool
* Database initialization
* Database seeding
* Query layer

In Progress:

* Backend foundation

Not Yet Implemented:

* Authentication
* User registration/login
* API routes
* Budgeting
* Analytics
* Dashboard database integration

---

## Validation Checklist

Before proposing or implementing a feature:

* Follows existing project structure
* Uses PostgreSQL and pg
* Uses parameterized SQL
* Reuses query layer when possible
* Preserves foreign key relationships
* Uses TypeScript strict mode
* Avoids ORM usage
* Avoids duplicate architecture
* Keeps features compatible with future authentication and analytics modules

```
```
