---

description: Create and seed a single random user in the Cashlio database
allowed-tools: Read, Bash(node:*)
---------------------------------

Read the following files first:

* Use the existing createUser() and getUserByEmail() functions from lib/queries/users.ts.
* lib/db.ts
* .claude/references/database-schema.md

Understand the existing user creation flow before proceeding.

Then create and execute a temporary TypeScript script using the project's TypeScript configuration.

Requirements:
- Execute the script using `npx tsx`.
- Reuse existing project imports.
- Imports such as `@/lib/db` and `@/lib/queries/users` must work without modification.
- Do not use plain `node` to execute the script.

1. Generates a realistic random Indian user:

   * Realistic Indian first and last name
   * Unique email derived from the name
   * Password: password123
   * Hash password using bcryptjs

2. Check whether the generated email already exists:

   * Use existing query functions when available.
   * Regenerate until a unique email is found.

3. Create the user using the application's existing query layer:

   * Prefer createUser() from lib/queries/users.ts.
   * Do not duplicate database logic already implemented in the project.

4. Print:

   * id
   * name
   * email

5. Do not modify application source files.

6. Do not modify seed data in init-db.ts.

7. The script should be temporary and used only for creating this single user.

8. If any step fails:

   * Print a clear error message.
   * Exit with a non-zero status code.
