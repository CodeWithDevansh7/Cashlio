---

description: Create a specification document and feature branch for a new Cashlio feature
argument-hint: "Step number and feature name e.g. 02 authentication"
allowed-tools: Read, Write, Glob, Bash(git:*)
---------------------------------------------

You are a senior software engineer creating the next feature specification for Cashlio.

Always follow every rule in CLAUDE.md before generating a spec.

User input: $ARGUMENTS

# Step 1 — Verify clean git state

Run:

git status --porcelain

If any modified, staged, or untracked files exist:

STOP.

Tell the user:

"Working tree is not clean. Commit or stash your changes before creating a new feature spec."

Do not continue.

# Step 2 — Parse arguments

Extract:

1. step_number

   * Zero-padded to 2 digits
   * Examples:

     * 2 → 02
     * 11 → 11

2. feature_title

   * Human-readable title in Title Case

3. feature_slug

   * Lowercase kebab-case
   * a-z, 0-9 and -
   * Maximum 40 characters

4. branch_name

   * Format:
     feature/<feature_slug>

If parsing fails, ask for clarification.

# Step 3 — Ensure branch name is unique

Check:

git branch --all

If branch exists:

feature/<slug>-01
feature/<slug>-02

Continue incrementing until unique.

# Step 4 — Update main

Run:

git checkout main
git pull origin main

# Step 5 — Create feature branch

Run:

git checkout -b <branch_name>

# Step 6 — Research the codebase

Read:

* CLAUDE.md
* sql/schema.sql
* lib/db.ts
* lib/init-db.ts
* lib/queries/users.ts
* lib/queries/categories.ts
* lib/queries/transactions.ts
* All files in .claude/specs/

Determine:

* Current implementation status
* Existing database architecture
* Existing query functions
* Existing feature specifications

If the requested feature is already completed or already has a spec, stop and warn the user.

# Step 7 — Generate the specification

Use exactly this structure:

# Spec: <feature_title>

## Overview

Describe:

* What the feature does
* Why it exists
* How it fits into the Cashlio roadmap

## Depends On

List prerequisite features.

If none:

None.

## User Stories

List primary user stories.

Example:

* As a user, I can sign up with email and password.
* As a user, I can log in securely.

## Routes / Pages

List new App Router pages.

Example:

* app/login/page.tsx
* app/register/page.tsx

If none:

No new pages.

## API Routes

List all new route handlers.

Example:

* app/api/auth/login/route.ts
* app/api/auth/register/route.ts

If none:

No API routes.

## Database Changes

Verify against sql/schema.sql.

Specify:

* New tables
* New columns
* New indexes
* New constraints

If none:

No database changes.

## Query Layer Changes

Specify additions or modifications to:

* lib/queries/users.ts
* lib/queries/categories.ts
* lib/queries/transactions.ts

If none:

No query-layer changes.

## Components

### Create

List new components.

### Modify

List existing components requiring changes.

## Files To Change

Complete file list.

## Files To Create

Complete file list.

## New Dependencies

List packages required.

If none:

No new dependencies.

## Implementation Rules

Always include:

* Use PostgreSQL with pg only
* No ORM usage
* No Prisma
* No Drizzle
* No Sequelize
* Parameterized SQL only
* Reuse existing query modules whenever possible
* Database logic must remain in lib/queries
* Prefer Server Components
* Use Client Components only when necessary
* Use TypeScript strict mode
* Store money as NUMERIC(10,2)
* Preserve foreign-key relationships
* Do not hardcode category IDs
* Remain compatible with future authentication and analytics modules

## Definition Of Done

Create a testable checklist that can be verified by running the application.

# Step 8 — Save spec

Save to:

.claude/specs/<step_number>-<feature_slug>.md

# Step 9 — Report

Print exactly:

Branch:    <branch_name>
Spec file: .claude/specs/<step_number>-<feature_slug>.md
Title:     <feature_title>

Then print:

Review the spec at .claude/specs/<step_number>-<feature_slug>.md and begin implementation planning.
