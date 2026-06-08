"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormField } from "@/components/ui/FormField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import type { LoginErrors } from "@/lib/auth/validation";

type FieldKey = "email" | "password";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_MAX = 255;
const PASSWORD_MAX = 200;

export function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fieldErrors, setFieldErrors] = useState<LoginErrors>({
        email: null,
        password: null,
    });
    const [formError, setFormError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    function validateClient(): LoginErrors {
        const errors: LoginErrors = { email: null, password: null };

        const trimmedEmail = email.trim();
        if (trimmedEmail.length === 0) {
            errors.email = "Email is required.";
        } else if (!EMAIL_RE.test(trimmedEmail)) {
            errors.email = "Enter a valid email address.";
        } else if (trimmedEmail.length > EMAIL_MAX) {
            errors.email = `Email must be at most ${EMAIL_MAX} characters.`;
        }

        if (password.length === 0) {
            errors.password = "Password is required.";
        } else if (password.length > PASSWORD_MAX) {
            errors.password = `Password must be at most ${PASSWORD_MAX} characters.`;
        }

        return errors;
    }

    function clearError(field: FieldKey) {
        if (fieldErrors[field]) {
            setFieldErrors((prev) => ({ ...prev, [field]: null }));
        }
        if (formError) setFormError(null);
    }

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setFormError(null);

        const errors = validateClient();
        if (errors.email || errors.password) {
            setFieldErrors(errors);
            return;
        }

        setFieldErrors({ email: null, password: null });
        setPending(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (res.status === 200) {
                router.push("/dashboard");
                router.refresh();
                return;
            }

            let body: unknown = null;
            try {
                body = await res.json();
            } catch {
                // fall through to generic error
            }

            if (body && typeof body === "object") {
                const b = body as {
                    errors?: Partial<Record<FieldKey, string>>;
                    error?: string;
                };
                if (b.errors) {
                    setFieldErrors({
                        email: b.errors.email ?? null,
                        password: b.errors.password ?? null,
                    });
                }
                if (b.error) {
                    setFormError(b.error);
                }
                if (!b.errors && !b.error) {
                    setFormError(`Login failed (${res.status}).`);
                }
            } else {
                setFormError(`Login failed (${res.status}).`);
            }
        } catch {
            setFormError("Network error. Please try again.");
        } finally {
            setPending(false);
        }
    }

    return (
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
            <FormField
                id="login-email"
                label="Email"
                name="email"
                type="email"
                value={email}
                onChange={(v) => {
                    setEmail(v);
                    clearError("email");
                }}
                error={fieldErrors.email}
                autoComplete="email"
                required
                disabled={pending}
            />
            <FormField
                id="login-password"
                label="Password"
                name="password"
                type="password"
                value={password}
                onChange={(v) => {
                    setPassword(v);
                    clearError("password");
                }}
                error={fieldErrors.password}
                autoComplete="current-password"
                required
                disabled={pending}
            />

            {formError ? (
                <p
                    role="alert"
                    className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                >
                    {formError}
                </p>
            ) : null}

            <SubmitButton pending={pending} pendingLabel="Signing in…">
                Log in
            </SubmitButton>

            <p className="text-center text-sm text-slate-600">
                Don&apos;t have an account?{" "}
                <Link
                    href="/register"
                    className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                    Create one
                </Link>
            </p>
        </form>
    );
}
