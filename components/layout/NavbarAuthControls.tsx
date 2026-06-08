"use client";

import { signOut } from "@/lib/auth/actions";

export function NavbarAuthControls() {
    return (
        <form action={signOut}>
            <button
                type="submit"
                className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-slate-800 transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
                Log out
            </button>
        </form>
    );
}
