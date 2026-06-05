"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

interface SubmitButtonProps
    extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
    pending: boolean;
    pendingLabel?: string;
    children: React.ReactNode;
}

export const SubmitButton = React.forwardRef<HTMLButtonElement, SubmitButtonProps>(
    function SubmitButton(
        { pending, pendingLabel = "Please wait…", children, disabled, ...rest },
        ref
    ) {
        return (
            <Button
                ref={ref}
                type="submit"
                disabled={disabled || pending}
                className="w-full"
                {...rest}
            >
                {pending ? pendingLabel : children}
            </Button>
        );
    }
);
