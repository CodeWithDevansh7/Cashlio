"use client";

import { useState } from "react";
import Link from "next/link";
import { FormField } from "@/components/ui/FormField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import type { ValidationErrors } from "@/lib/auth/validation";

type FieldKey = "name" | "email" | "password";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 200;
const NAME_MAX = 100;

export function RegisterForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({
        name: null,
        email: null,
        password: null,
    });
    const [formError, setFormError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    function validateClient(): ValidationErrors {
        const errors: ValidationErrors = { name: null, email: null, password: null };

        const trimmedName = name.trim();
        if (trimmedName.length === 0) {
            errors.name = "Name is required.";
        } else if (trimmedName.length > NAME_MAX) {
            errors.name = `Name must be at most ${NAME_MAX} characters.`;
        }

        const trimmedEmail = email.trim();
        if (trimmedEmail.length === 0) {
            errors.email = "Email is required.";
        } else if (!EMAIL_RE.test(trimmedEmail)) {
            errors.email = "Enter a valid email address.";
        }

        if (password.length === 0) {
            errors.password = "Password is required.";
        } else if (password.length < PASSWORD_MIN) {
            errors.password = `Password must be at least ${PASSWORD_MIN} characters.`;
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
        if (errors.name || errors.email || errors.password) {
            setFieldErrors(errors);
            return;
        }

        setFieldErrors({ name: null, email: null, password: null });
        setPending(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            if (res.status === 201) {
                window.location.assign("/dashboard");
                return;
            }

            let body: unknown = null;
            try {
                body = await res.json();
            } catch {
                // fall through to generic error
            }

            if (body && typeof body === "object") {
                const b = body as { errors?: Partial<Record<FieldKey, string>>; error?: string };
                if (b.errors) {
                    setFieldErrors({
                        name: b.errors.name ?? null,
                        email: b.errors.email ?? null,
                        password: b.errors.password ?? null,
                    });
                }
                if (b.error) {
                    setFormError(b.error);
                }
                if (!b.errors && !b.error) {
                    setFormError(`Registration failed (${res.status}).`);
                }
            } else {
                setFormError(`Registration failed (${res.status}).`);
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
                id="register-name"
                label="Full name"
                name="name"
                type="text"
                value={name}
                onChange={(v) => {
                    setName(v);
                    clearError("name");
                }}
                error={fieldErrors.name}
                autoComplete="name"
                required
                disabled={pending}
            />
            <FormField
                id="register-email"
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
                id="register-password"
                label="Password"
                name="password"
                type="password"
                value={password}
                onChange={(v) => {
                    setPassword(v);
                    clearError("password");
                }}
                error={fieldErrors.password}
                autoComplete="new-password"
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

            <SubmitButton pending={pending} pendingLabel="Creating account…">
                Create account
            </SubmitButton>

            <p className="text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                    Log in
                </Link>
            </p>
        </form>
    );
}
