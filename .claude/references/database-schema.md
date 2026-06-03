# Database Schema

## Users

| Column        | Type         | Constraints      |
| ------------- | ------------ | ---------------- |
| id            | SERIAL       | Primary Key      |
| name          | VARCHAR(100) | NOT NULL         |
| email         | VARCHAR(255) | UNIQUE, NOT NULL |
| password_hash | TEXT         | NOT NULL         |
| created_at    | TIMESTAMP    | DEFAULT NOW()    |

---

## Categories

| Column        | Type        | Constraints      |
| ------------- | ----------- | ---------------- |
| id            | SERIAL      | Primary Key      |
| name          | VARCHAR(50) | UNIQUE, NOT NULL |
| category_type | VARCHAR(20) | income / expense |
| created_at    | TIMESTAMP   | DEFAULT NOW()    |

Constraint:

```sql
CHECK (category_type IN ('income', 'expense'))
```

---

## Transactions

| Column           | Type          | Constraints        |
| ---------------- | ------------- | ------------------ |
| id               | SERIAL        | Primary Key        |
| user_id          | INTEGER       | FK → users.id      |
| category_id      | INTEGER       | FK → categories.id |
| amount           | NUMERIC(10,2) | NOT NULL           |
| transaction_type | VARCHAR(20)   | income / expense   |
| transaction_date | DATE          | NOT NULL           |
| description      | TEXT          | Nullable           |
| created_at       | TIMESTAMP     | DEFAULT NOW()      |

Constraints:

```sql
CHECK (transaction_type IN ('income', 'expense'))
```

Foreign Keys:

```sql
user_id REFERENCES users(id) ON DELETE CASCADE
```

```sql
category_id REFERENCES categories(id)
```

---

## Expense Categories

* Food
* Transport
* Bills
* Health
* Entertainment
* Shopping
* Other

---

## Income Categories

* Salary
* Freelance
* Investment
* Business
* Other Income
