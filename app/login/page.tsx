import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
    title: "Log in | Cashlio",
};

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#fafbfc] text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
            {/* Background Ambient Blobs */}
            <div className="absolute top-0 left-0 w-full overflow-hidden -z-10 pointer-events-none h-screen">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-200/40 blur-[100px]" />
                <div className="absolute top-[20%] right-[-5%] w-[600px] h-[600px] rounded-full bg-blue-200/30 blur-[120px]" />
            </div>

            <Navbar />

            <main className="flex min-h-screen items-center justify-center px-6 pt-32 pb-16">
                <AuthCard
                    title="Log in"
                    subtitle="Welcome back. Sign in to continue tracking your finances."
                >
                    <LoginForm />
                </AuthCard>
            </main>

            <Footer />
        </div>
    );
}
