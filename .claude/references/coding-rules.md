# Coding Rules

## SQL

Use parameterized queries only.

Allowed:

```ts
await query(
  "SELECT * FROM users WHERE email = $1",
  [email]
);
```

Not Allowed:

```ts
`SELECT * FROM users WHERE email = '${email}'`
```

---

## Authentication

Use:

```ts
bcrypt.hash()
bcrypt.compare()
```

Never store plain text passwords.

---

## Money Storage

Store monetary values as:

```sql
NUMERIC(10,2)
```

Do not use:

```sql
FLOAT
REAL
DOUBLE
```

Reason:

Financial data must be stored precisely.

---

## Database Access

* Use raw SQL only
* No ORM
* No query builders
* Reuse shared query helper

---

## Transactions

Allowed values:

```txt
income
expense
```

Validation must be enforced at the database level.

---

## Dates

Store all dates using:

```txt
YYYY-MM-DD
```

format.

---

## Seeding

* Must be idempotent
* No duplicate records
* Use ON CONFLICT DO NOTHING where applicable

---

## Error Handling

The database must enforce:

* Unique email constraint
* Foreign key relationships
* Transaction type validation
* Category type validation
