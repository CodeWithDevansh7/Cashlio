# Spec: Login and Logout

## Overview

Add a self-service login and logout flow to Cashlio so that registered users can authenticate, access the application, and end their session securely.

This feature builds on the existing session infrastructure (JWT cookie in `lib/auth/session.ts`) and the existing `users` table, and complements the registration feature delivered in step 02.

This spec covers:

* A public login page.
* A login form for collecting credentials.
* A login API endpoint that verifies credentials and creates a session.
* A logout API endpoint that clears the session.
* A logout entry point surfaced in the navigation for authenticated users.
* Wiring the navbar so the "Log in" entry becomes a real link and an authenticated user is shown a "Log out" action.

This feature does not include:

* Password reset.
* Email verification.
* OAuth providers.
* Multi-factor authentication.
* Account management (name change, email change, password change).
* Server-side route protection (middleware or layout guards) — these will be specified separately in a follow-up "Protected Routes" feature, since that work also needs to gate `/dashboard`.

## Depends On

* Spec 01 — Database Setup.
* Spec 02 — Registration (provides the `users` table, `bcrypt` hashing, and JWT session helpers).
* `lib/auth/session.ts` — `createSession`, `getSessionUserId`, `clearSession`.
* `lib/auth/password.ts` — `verifyPassword`.
* `lib/queries/users.ts` — `getUserByEmail`, `getUserById`.

## User Stories

* As a registered user, I can open `/login` and see a login form.
* As a registered user, I can submit my email and password to log in.
* As a registered user, I am informed when my credentials are invalid.
* As a registered user, I am informed when required fields are missing.
* As a registered user, after successful login I am redirected to the dashboard.
* As a registered user, after successful login I remain logged in across page refreshes (via the existing session cookie).
* As a logged-in user, I can click "Log out" in the navbar and end my session.
* As a logged-in user, after logging out I am redirected to the login page and my authenticated session is cleared.
* As a new visitor, I can navigate from the landing page to the login page.

## Routes / Pages

* `app/login/page.tsx` — Public login page containing the login form.

The login page should reuse the same visual layout as `app/register/page.tsx` (Navbar, ambient background, AuthCard, Footer).

## API Routes

### POST `/api/auth/login`

Request Body:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Behavior:

1. Parse and validate input.
2. Normalize email to lowercase.
3. Look up the user by email.
4. If the user does not exist, return a generic credential failure (do not disclose which field was wrong).
5. Verify the password against the stored bcrypt hash.
6. If verification fails, return the same generic credential failure.
7. On success, create a session via `createSession(user.id)` (sets the `cashlio_session` cookie).
8. Return a success response with a non-sensitive user payload.

Success Response (200):

```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

Error Responses:

* `400 Bad Request` — Validation failure (missing email, missing password, invalid email format, over-length values).
* `401 Unauthorized` — Credentials are invalid (user not found OR password mismatch). Use a single error code/message for both cases to avoid email enumeration.
* `500 Internal Server Error` — Unexpected failure.

### POST `/api/auth/logout`

Request Body: None.

Behavior:

1. Call `clearSession()` to invalidate the `cashlio_session` cookie.
2. Return a success response.

Success Response (200):

```json
{
  "message": "Logged out"
}
```

Error Responses:

* `500 Internal Server Error` — Unexpected failure.

The logout endpoint should be POST (not GET) so it cannot be triggered by link prefetch, image tags, or accidental navigation, and so that `SameSite=Lax` cookie semantics work as expected.

## Database Changes

No database changes.

The existing `users` table, `getUserByEmail` query, and `verifyPassword` helper already support this feature.

## Query Layer Changes

No new query-layer changes.

Reuse existing query functions:

* `getUserByEmail` — for credential lookup.
* `getUserById` (only if a future caller needs to re-hydrate a user from the session — not required for this spec).

If any helper used here does not exist, add it to:

```txt
lib/queries/users.ts
```

## Validation

A new validation helper should be added alongside the existing `validateRegistrationInput` for consistency:

```txt
lib/auth/validation.ts
```

New function: `validateLoginInput(raw: unknown): ValidationResult` returning the same `{ ok, value | errors }` shape used by registration.

Field rules:

* `email` — required, must be a valid email format, must be at most 255 characters.
* `password` — required, must be 1–200 characters (presence check; the actual credential check is `verifyPassword`).

Trimming and lowercasing rules follow the same conventions as the registration validator.

## Components

### Create

* `components/auth/LoginForm.tsx` — Client Component containing the login form. Mirrors the structure of `RegisterForm.tsx` (uses `FormField` and `SubmitButton`).
* `app/login/page.tsx` — Server Component page that renders the login form inside `AuthCard`, with `Navbar` and `Footer`.

### Modify

* `components/layout/navbar.tsx` — Make the existing "Log in" entry an actual `<Link href="/login">`. Add a client-side indicator that calls `getSessionUserId` (or reads session state via a small helper) to show a "Log out" button instead of "Log in" / "Create Account" for authenticated users. The "Log out" button must POST to `/api/auth/logout` and then refresh/redirect to `/login`.

  Notes for the implementer:

  * `lib/auth/session.ts` uses `next/headers` `cookies()`, which can only be called from a Server Component, Route Handler, or Server Action. The navbar is currently a Client Component.
  * To keep this spec scoped, render the navbar's auth-aware portion from a thin Server Component wrapper, OR introduce a small Server Action `lib/auth/actions.ts` that exposes `getCurrentUser()` and `signOut()`. Whichever is chosen, the navbar must not block the landing page from being statically renderable beyond what is already required.
  * Acceptable: a Server Component `components/layout/navbar.tsx` (rename of current client file or split into `Navbar.tsx` server + `NavbarAuthControls.tsx` client). Either is fine as long as the landing page is still served and the auth state is read on the server.
  * The "Log out" button should call a server action that performs the same work as `POST /api/auth/logout` (calls `clearSession()` and redirects to `/login`).

* `app/page.tsx` — The landing page should expose a working link to `/login` (currently the navbar "Log in" button is non-functional). This is handled by the navbar change above; no edits to the landing page body are required.

* `components/auth/RegisterForm.tsx` — The "Already have an account? Log in" footer link already targets `/login`; no change required, but verify it after the navbar change.

## Files To Change

* `components/layout/navbar.tsx` — Replace placeholder "Log in" button with real link, add auth-aware state and "Log out" action.
* `lib/auth/validation.ts` — Add `validateLoginInput`.

## Files To Create

```txt
app/login/page.tsx
app/api/auth/login/route.ts
app/api/auth/logout/route.ts
components/auth/LoginForm.tsx
```

If a server-action approach is used for the navbar logout (recommended), also create:

```txt
lib/auth/actions.ts
```

## Environment Variables

No new environment variables.

`AUTH_SECRET` and `DATABASE_URL` are already required by the session helper and the database client respectively.

## Security Considerations

* Passwords are verified using the existing `verifyPassword` bcrypt helper.
* Generic "Invalid email or password." error for both "user not found" and "wrong password" — must not disclose which side failed.
* Email is normalized to lowercase before lookup.
* Session cookies continue to be `httpOnly`, `sameSite=lax`, and `secure` in production (handled by the existing `lib/auth/session.ts`).
* Login and logout must be POST. The logout endpoint must not be a GET.
* Rate limiting is out of scope for this spec and will be handled in a future feature.
* Server-side route protection (redirecting unauthenticated users away from `/dashboard`) is out of scope for this spec; this feature only delivers the login/logout primitives. A follow-up spec will add protected-route middleware or layout guards.

## New Dependencies

No new dependencies.

Use existing project dependencies:

* `bcryptjs` (already installed).
* `jose` (already installed).

## Out Of Scope

* Password reset / forgot password.
* Email verification.
* OAuth providers.
* Multi-factor authentication.
* Account management (rename, email change, password change).
* Server-side route protection (gating `/dashboard` etc. for unauthenticated users).
* "Remember me" controls.
* Rate limiting / lockout.
* Analytics on login events.

## Implementation Rules

* Use PostgreSQL with `pg` only.
* No ORM usage.
* No Prisma.
* No Drizzle.
* No Sequelize.
* Parameterized SQL only.
* Reuse existing query modules whenever possible.
* Reuse `lib/auth/session.ts` and `lib/auth/password.ts` — do not duplicate session or hashing logic.
* Database logic must remain in `lib/queries`.
* Prefer Server Components.
* Use Client Components only when necessary (the login form and the navbar auth controls require client interactivity).
* Use TypeScript strict mode.
* Never return `password_hash` in API responses.
* Do not introduce a new session strategy — continue using the existing JWT cookie.

## Definition Of Done

A reviewer can verify:

1. Navigating to `/login` displays a login form with email and password fields.
2. Submitting the form with empty fields shows validation errors.
3. Submitting the form with an invalid email format shows a validation error.
4. Submitting valid credentials for an existing user returns a `200` response, sets the `cashlio_session` cookie, and the client redirects to `/dashboard`.
5. Submitting a valid email format but a non-existent account returns `401` with a generic "Invalid email or password." error — it does not disclose that the account does not exist.
6. Submitting an existing account with the wrong password returns `401` with the same generic error.
7. After successful login, the `cashlio_session` cookie is present in the browser and is `httpOnly`, `sameSite=lax`, and (in production builds) `secure`.
8. After successful login, refreshing the page keeps the user logged in (session cookie is still valid).
9. While logged in, the navbar shows a "Log out" entry in place of (or alongside) the "Log in" entry.
10. Clicking "Log out" clears the `cashlio_session` cookie and redirects to `/login`.
11. After logout, the `cashlio_session` cookie value is empty / expired when inspecting the browser.
12. The navbar "Log in" entry on the landing page is a real link that navigates to `/login`.
13. `next build` completes without TypeScript errors.
14. No SQL string interpolation is introduced in the new code.
15. No new dependencies are added to `package.json`.
