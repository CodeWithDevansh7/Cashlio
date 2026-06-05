# Spec: Registration

## Overview

Add a self-service user registration flow to Cashlio so that new users can create an account and gain access to the application.

This feature serves as the entry point into the Cashlio ecosystem and lays the foundation for future authentication, expense tracking, budgeting, and analytics features.

This spec covers:

* A public registration page.
* A registration form for collecting user information.
* A registration API endpoint.
* Input validation.
* Password hashing.
* User creation in the database.

This feature does not include login, session management, password reset, or any other authentication functionality.

## Depends On

* PostgreSQL database setup
* Users table
* Database query layer

## User Stories

* As a new visitor, I can open `/register` and see a registration form.
* As a new visitor, I can submit my name, email, and password to create an account.
* As a new visitor, I receive clear validation errors for invalid or missing fields.
* As a new visitor, I am informed when an email address is already registered.
* As a new user, my password is never stored or returned in plaintext.
* As a new user, after successful registration I am redirected to the login page.

## Routes / Pages

* `app/register/page.tsx` — Public registration page containing the registration form.

If a login page exists, add a link between login and registration pages.

## API Routes

### POST `/api/auth/register`

Request Body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Behavior:

1. Validate input.
2. Normalize email to lowercase.
3. Trim name and email values.
4. Check whether the email already exists.
5. Hash the password using bcrypt.
6. Create the user.
7. Return a success response.

Success Response (201):

```json
{
  "message": "Registration successful"
}
```

Error Responses:

* `400 Bad Request` — Validation failure.
* `409 Conflict` — Email already exists.
* `500 Internal Server Error` — Unexpected failure.

## Database Changes

No database changes.

The existing `users` table already supports this feature.

## Query Layer Changes

Reuse existing query functions whenever possible.

Expected functions:

* `createUser`
* `getUserByEmail`

If either function does not exist, add it to:

```txt
lib/queries/users.ts
```

No additional query modules are required.

## Components

### Create

* `components/auth/RegisterForm.tsx` — Registration form component.
* `components/auth/AuthCard.tsx` — Reusable authentication card wrapper.

### Modify

* `app/page.tsx` — Add registration link if appropriate.

## Files To Change

* `app/page.tsx` (if needed)

## Files To Create

```txt
app/register/page.tsx
app/api/auth/register/route.ts
components/auth/RegisterForm.tsx
components/auth/AuthCard.tsx
```

## Environment Variables

No new environment variables.

## Security Considerations

* Passwords must be hashed before storage.
* Password hashes must never be returned in API responses.
* Email addresses must be normalized before lookup and storage.
* Validation must occur server-side.
* Sensitive information must not be logged.

## New Dependencies

No new dependencies.

Use existing project dependencies where possible.

## Out Of Scope

The following are not part of this feature:

* Login
* Session management
* Authentication middleware
* Protected routes
* Password reset
* Email verification
* OAuth providers
* Multi-factor authentication
* Analytics
* Budgeting

## Implementation Rules

* Use PostgreSQL with `pg` only.
* No ORM usage.
* No Prisma.
* No Drizzle.
* No Sequelize.
* Parameterized SQL only.
* Reuse existing query modules whenever possible.
* Database logic must remain in `lib/queries`.
* Prefer Server Components.
* Use Client Components only when necessary.
* Use TypeScript strict mode.
* Preserve foreign-key relationships.
* Do not hardcode category IDs.
* Never return `password_hash` in API responses.

## Definition Of Done

A reviewer can verify:

1. Navigating to `/register` displays the registration form.
2. Submitting an empty form shows validation errors.
3. Invalid email addresses are rejected.
4. Passwords shorter than the required minimum length are rejected.
5. Names longer than the allowed limit are rejected.
6. A valid registration creates a new row in the `users` table.
7. The stored password is hashed.
8. Duplicate email addresses return a `409 Conflict` response.
9. Successful registration returns a `201` response and redirects to the login page.
10. No SQL string interpolation exists in the new code.
11. `next build` completes without TypeScript errors.
