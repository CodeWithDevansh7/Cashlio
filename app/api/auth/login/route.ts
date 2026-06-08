import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/queries/users";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { validateLoginInput } from "@/lib/auth/validation";

const GENERIC_CREDENTIAL_ERROR = "Invalid email or password.";

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

        const result = validateLoginInput(body);
        if (!result.ok) {
            return NextResponse.json({ errors: result.errors }, { status: 400 });
        }

        const { email, password } = result.value;

        const user = await getUserByEmail(email);
        if (!user) {
            return NextResponse.json(
                { error: GENERIC_CREDENTIAL_ERROR },
                { status: 401 }
            );
        }

        const ok = await verifyPassword(password, user.password_hash);
        if (!ok) {
            return NextResponse.json(
                { error: GENERIC_CREDENTIAL_ERROR },
                { status: 401 }
            );
        }

        await createSession(user.id);

        return NextResponse.json(
            { user: { id: user.id, name: user.name, email: user.email } },
            { status: 200 }
        );
    } catch (err) {
        console.error("[api/auth/login] unexpected error", err);
        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
}
