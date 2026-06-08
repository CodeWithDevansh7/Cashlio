import { PieChart } from "lucide-react";
import Link from "next/link";
import { getSessionUserId } from "@/lib/auth/session";
import { NavbarScrollEffect } from "@/components/layout/NavbarScrollEffect";
import { NavbarAuthControls } from "@/components/layout/NavbarAuthControls";

export async function Navbar() {
    const userId = await getSessionUserId();
    const isAuthenticated = userId !== null;

    return (
        <NavbarScrollEffect>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white">
                        <PieChart size={18} />
                    </div>
                    <Link href="/">
                        <span className="text-2xl font-bold tracking-tight text-slate-900">
                            Cashlio
                        </span>
                    </Link>
                </div>
                <div className="hidden md:flex items-center gap-6">
                    {isAuthenticated ? (
                        <NavbarAuthControls />
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/register"
                                className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-slate-800 transition-all shadow-md hover:shadow-lg"
                            >
                                Create Account
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </NavbarScrollEffect>
    );
}
