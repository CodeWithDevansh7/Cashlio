import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "cashlio_session";
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

const secret = process.env.AUTH_SECRET;
if (!secret || secret.length === 0) {
    throw new Error(
        "[auth] AUTH_SECRET is not set. Add it to .env.local (see .env.local.example)."
    );
}

const SIGNING_KEY = new TextEncoder().encode(secret);

export async function createSessionToken(userId: number): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    return new SignJWT({})
        .setProtectedHeader({ alg: "HS256" })
        .setSubject(String(userId))
        .setIssuedAt(now)
        .setExpirationTime(now + SESSION_TTL_SECONDS)
        .sign(SIGNING_KEY);
}

export async function setSessionCookie(token: string): Promise<void> {
    const store = await cookies();
    store.set({
        name: COOKIE_NAME,
        value: token,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: SESSION_TTL_SECONDS,
    });
}

export async function createSession(userId: number): Promise<void> {
    const token = await createSessionToken(userId);
    await setSessionCookie(token);
}

export async function getSessionUserId(): Promise<number | null> {
    const store = await cookies();
    const token = store.get(COOKIE_NAME)?.value;
    if (!token) return null;
    try {
        const { payload } = await jwtVerify(token, SIGNING_KEY);
        const sub = payload.sub;
        if (!sub) return null;
        const id = Number(sub);
        return Number.isFinite(id) ? id : null;
    } catch {
        return null;
    }
}

export async function clearSession(): Promise<void> {
    const store = await cookies();
    store.set({
        name: COOKIE_NAME,
        value: "",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 0,
    });
}
