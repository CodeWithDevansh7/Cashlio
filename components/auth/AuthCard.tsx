import * as React from "react";
import { cn } from "@/lib/utils";

interface AuthCardProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    className?: string;
}

export function AuthCard({ title, subtitle, children, className }: AuthCardProps) {
    return (
        <div
            className={cn(
                "w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm",
                className
            )}
        >
            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                {subtitle ? (
                    <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
                ) : null}
            </div>
            {children}
        </div>
    );
}
