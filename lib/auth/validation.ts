export type RegistrationField = "name" | "email" | "password";

export type RegistrationInput = {
    name: string;
    email: string;
    password: string;
};

export type ValidationErrors = Record<RegistrationField, string | null>;

export type ValidationResult =
    | { ok: true; value: RegistrationInput }
    | { ok: false; errors: ValidationErrors };

export type LoginField = "email" | "password";

export type LoginInput = {
    email: string;
    password: string;
};

export type LoginErrors = Record<LoginField, string | null>;

export type LoginValidationResult =
    | { ok: true; value: LoginInput }
    | { ok: false; errors: LoginErrors };

const NAME_MAX = 100; // matches users.name VARCHAR(100)
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 200; // sanity cap to avoid bcrypt DoS

// Pragmatic email regex — RFC 5322 in full is impractical; this catches the
// cases the spec calls out (e.g. "not-an-email") while staying readable.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegistrationInput(raw: unknown): ValidationResult {
    const errors: ValidationErrors = { name: null, email: null, password: null };

    if (typeof raw !== "object" || raw === null) {
        return {
            ok: false,
            errors: { name: null, email: null, password: "Invalid request body." },
        };
    }

    const body = raw as Record<string, unknown>;
    const rawName = typeof body.name === "string" ? body.name : "";
    const rawEmail = typeof body.email === "string" ? body.email : "";
    const rawPassword = typeof body.password === "string" ? body.password : "";

    const name = rawName.trim();
    if (name.length === 0) {
        errors.name = "Name is required.";
    } else if (name.length > NAME_MAX) {
        errors.name = `Name must be at most ${NAME_MAX} characters.`;
    }

    const email = rawEmail.trim().toLowerCase();
    if (email.length === 0) {
        errors.email = "Email is required.";
    } else if (!EMAIL_RE.test(email)) {
        errors.email = "Enter a valid email address.";
    } else if (email.length > 255) {
        // matches users.email VARCHAR(255)
        errors.email = "Email must be at most 255 characters.";
    }

    if (rawPassword.length === 0) {
        errors.password = "Password is required.";
    } else if (rawPassword.length < PASSWORD_MIN) {
        errors.password = `Password must be at least ${PASSWORD_MIN} characters.`;
    } else if (rawPassword.length > PASSWORD_MAX) {
        errors.password = `Password must be at most ${PASSWORD_MAX} characters.`;
    }

    if (errors.name !== null || errors.email !== null || errors.password !== null) {
        return { ok: false, errors };
    }

    return {
        ok: true,
        value: { name, email, password: rawPassword },
    };
}

const EMAIL_MAX = 255; // matches users.email VARCHAR(255)
const LOGIN_PASSWORD_MAX = 200; // sanity cap to avoid bcrypt DoS

export function validateLoginInput(raw: unknown): LoginValidationResult {
    const errors: LoginErrors = { email: null, password: null };

    if (typeof raw !== "object" || raw === null) {
        return {
            ok: false,
            errors: { email: null, password: "Invalid request body." },
        };
    }

    const body = raw as Record<string, unknown>;
    const rawEmail = typeof body.email === "string" ? body.email : "";
    const rawPassword = typeof body.password === "string" ? body.password : "";

    const email = rawEmail.trim().toLowerCase();
    if (email.length === 0) {
        errors.email = "Email is required.";
    } else if (!EMAIL_RE.test(email)) {
        errors.email = "Enter a valid email address.";
    } else if (email.length > EMAIL_MAX) {
        errors.email = `Email must be at most ${EMAIL_MAX} characters.`;
    }

    if (rawPassword.length === 0) {
        errors.password = "Password is required.";
    } else if (rawPassword.length > LOGIN_PASSWORD_MAX) {
        errors.password = `Password must be at most ${LOGIN_PASSWORD_MAX} characters.`;
    }

    if (errors.email !== null || errors.password !== null) {
        return { ok: false, errors };
    }

    return {
        ok: true,
        value: { email, password: rawPassword },
    };
}
