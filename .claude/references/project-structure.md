# Project Structure

```txt
cashlio/
│
├── app/
│
├── lib/
│   ├── db.ts
│   ├── init-db.ts
│   │
│   └── queries/
│       ├── users.ts
│       ├── transactions.ts
│       └── categories.ts
│
├── sql/
│   ├── schema.sql
│   └── seed.sql
│
├── public/
├── components/
├── .env.local
│
└── ...
```

---

## Responsibilities

### db.ts

Responsible for:

* PostgreSQL connection pool
* Shared query helper

---

### init-db.ts

Responsible for:

* Schema creation
* Database initialization
* Seed execution

---

### users.ts

Responsible for:

* User creation
* User lookup
* User retrieval

---

### transactions.ts

Responsible for:

* Transaction CRUD operations
* Transaction retrieval
* Transaction filtering

---

### categories.ts

Responsible for:

* Category retrieval
* Category management
