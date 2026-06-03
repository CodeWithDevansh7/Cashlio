# Database Setup

## Goal

Implement PostgreSQL connectivity for Cashlio using the native `pg` driver.

This establishes the application's data layer and must be completed before authentication, transaction management, budgeting, or analytics features.

---

## Tech Stack

* Next.js 15 (App Router)
* TypeScript
* PostgreSQL
* pg (node-postgres)
* Raw SQL

No ORM or query builders are allowed.

---

## References

Read before implementation:

* `/references/database-schema.md`
* `/references/coding-rules.md`
* `/references/project-structure.md`

---

## Tasks

### 1. Database Connection

Implement:

```txt
lib/db.ts
```

Requirements:

* PostgreSQL connection pool
* Singleton pattern
* Shared query helper
* Reusable across all API routes

---

### 2. Database Initialization

Implement:

```txt
lib/init-db.ts
```

Requirements:

* Create all tables if they do not exist
* Create constraints
* Safe to run repeatedly
* Initialize schema before application usage

---

### 3. Database Seeding

Requirements:

* Seed categories
* Seed demo user
* Seed sample transactions
* Prevent duplicate inserts
* Safe to run multiple times

---

### 4. Query Layer

Implement:

```txt
lib/queries/
```

Files:

* users.ts
* transactions.ts
* categories.ts

Each file should contain reusable database functions related to its domain.

---

## Acceptance Criteria

* PostgreSQL database connects successfully
* Connection pool implemented
* Tables created automatically
* Categories seeded once
* Demo user seeded once
* Sample transactions seeded once
* Password hashing works
* Foreign keys enforced
* All queries parameterized
* No ORM used
