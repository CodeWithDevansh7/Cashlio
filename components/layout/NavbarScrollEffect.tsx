"use client";

import { useState, useEffect, type ReactNode } from "react";

interface NavbarScrollEffectProps {
    children: ReactNode;
}

export function NavbarScrollEffect({ children }: NavbarScrollEffectProps) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${
                isScrolled
                    ? "bg-white/80 backdrop-blur-md border-b border-slate-200/50 py-4 shadow-sm"
                    : "bg-transparent py-6"
            }`}
        >
            {children}
        </header>
    );
}
