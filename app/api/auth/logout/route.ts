import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth/session";

export async function POST(): Promise<NextResponse> {
    try {
        await clearSession();
        return NextResponse.json({ message: "Logged out" }, { status: 200 });
    } catch (err) {
        console.error("[api/auth/logout] unexpected error", err);
        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
}
