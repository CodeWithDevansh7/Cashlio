---

description: Seed realistic transactions for a user
argument-hint: "<user_id> <count> <months>"
allowed-tools: Read, Bash(node:*), Bash(npx tsx:*)
--------------------------------------------------

Read:

* lib/db.ts
* lib/queries/users.ts
* lib/queries/categories.ts
* lib/queries/transactions.ts

User input: $ARGUMENTS

### Parse Arguments

Expected:

/seed-transactions <user_id> <count> <months>

Example:

/seed-transactions 1 100 6

If arguments are invalid, print usage and stop.

### Verify User

Verify the user exists.

If not:

No user found with id <user_id>.

### Load Categories

Load categories from the database.

Do not hardcode category IDs.

Build a category name → category_id map.

If no categories exist:

No categories found. Run database initialization first.

### Generate Transactions

Create and execute a temporary TypeScript script using:

npx tsx

Generate <count> realistic transactions spread across the previous <months> months.

Distribution:

* ~85% expenses
* ~15% income

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

Use realistic Indian descriptions and category-appropriate amounts.

### Insert Transactions

* Prefer existing query functions.
* Use parameterized SQL only.
* Use valid category IDs from the database.
* Store dates as YYYY-MM-DD.
* Insert everything inside a single database transaction.
* Roll back if any insert fails.

### Output

Print:

* user id
* transactions inserted
* date range
* expense count
* income count

Also print 5 sample transactions.

### Rules

* Do not modify application source files.
* Use temporary scripts only.
* Delete temporary files after execution.
* Maintain referential integrity.
