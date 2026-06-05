"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type FieldName = "name" | "email" | "password";

interface FormFieldProps {
    id: string;
    label: string;
    name: FieldName;
    type?: "text" | "email" | "password";
    value: string;
    onChange: (value: string) => void;
    error?: string | null;
    autoComplete?: string;
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
    function FormField(
        {
            id,
            label,
            name,
            type = "text",
            value,
            onChange,
            error,
            autoComplete,
            required = false,
            disabled = false,
            placeholder,
        },
        ref
    ) {
        const errorId = `${id}-error`;
        const hasError = Boolean(error);

        return (
            <div className="flex flex-col gap-1.5">
                <label
                    htmlFor={id}
                    className="text-sm font-medium text-slate-700"
                >
                    {label}
                </label>
                <input
                    ref={ref}
                    id={id}
                    name={name}
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    autoComplete={autoComplete}
                    required={required}
                    disabled={disabled}
                    placeholder={placeholder}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? errorId : undefined}
                    className={cn(
                        "w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400",
                        "focus:outline-none focus:ring-2 focus:ring-emerald-500/30",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        hasError
                            ? "border-red-500 focus:border-red-500"
                            : "border-slate-300 focus:border-emerald-500"
                    )}
                />
                {hasError ? (
                    <p
                        id={errorId}
                        role="alert"
                        className="text-xs text-red-600"
                    >
                        {error}
                    </p>
                ) : null}
            </div>
        );
    }
);
