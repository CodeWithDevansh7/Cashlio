import { NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/lib/queries/users";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { validateRegistrationInput } from "@/lib/auth/validation";

export async function POST(request: Request): Promise<NextResponse> {
    try {
        let body: unknown;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { error: "Invalid JSON body." },
                { status: 400 }
            );
        }

        const result = validateRegistrationInput(body);
        if (!result.ok) {
            return NextResponse.json({ errors: result.errors }, { status: 400 });
        }

        const { name, email, password } = result.value;

        const existing = await getUserByEmail(email);
        if (existing) {
            return NextResponse.json(
                { error: "Email already registered" },
                { status: 409 }
            );
        }

        const passwordHash = await hashPassword(password);
        let user;
        try {
            user = await createUser(name, email, passwordHash);
        } catch (err) {
            // Race: another request inserted the same email between our
            // check and our insert. Surface as 409, not 500.
            if (isUniqueViolation(err)) {
                return NextResponse.json(
                    { error: "Email already registered" },
                    { status: 409 }
                );
            }
            throw err;
        }

        await createSession(user.id);

        return NextResponse.json(
            { user: { id: user.id, name: user.name, email: user.email } },
            { status: 201 }
        );
    } catch (err) {
        console.error("[api/auth/register] unexpected error", err);
        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
}

function isUniqueViolation(err: unknown): boolean {
    return (
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        (err as { code?: unknown }).code === "23505"
    );
}
