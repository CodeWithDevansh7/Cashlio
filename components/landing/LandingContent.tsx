"use client";

import { useState } from "react";

import {
    BarChart3,
    PieChart,
    TrendingUp,
    ShieldCheck,
    Smartphone,
    Mic,
    ArrowRight,
    CheckCircle2,
    X,
} from "lucide-react";

import { HeroCarousel } from "../sections/HeroCarousel";
import {
    MissionCard,
    StatCounter,
    FeatureCard,
} from "../ui/LandingCards";

export function LandingContent() {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                <div className="flex-1 text-center lg:text-left z-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium mb-6">
                        <span className="relative flex h-2 w-2"></span>
                        Personal Finance Tracker
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 text-slate-900 leading-[1.1]">
                        Track Every Rupee.
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
                            Save Smarter.
                        </span>
                    </h1>

                    <p className="text-lg lg:text-xl text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                        Gain complete control over your finances. Cashlio helps
                        you monitor daily habits, visualize weekly trends, and
                        achieve your yearly savings goals with effortless
                        precision.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                        <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer">
                            Get Started Free <ArrowRight size={18} />
                        </button>

                        <button
                            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 hover:shadow-sm transition-all cursor-pointer"
                            onClick={() => setModalOpen(true)}
                        >
                            View Demo
                        </button>
                    </div>
                </div>

                <div className="flex-1 w-full max-w-lg lg:max-w-none relative z-10">
                    <HeroCarousel />
                </div>
            </section>

            {/* Mission */}
            <section className="py-24 bg-white border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-slate-900">
                            Your Path to Financial Clarity
                        </h2>
                        <p className="text-slate-600 text-lg">
                            Cashlio is designed to replace chaotic spreadsheets
                            and confusing bank apps with an elegant, focused
                            experience.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <MissionCard
                            icon={<TrendingUp />}
                            title="Smart Tracking"
                            description="Automatically categorize expenses and watch spending habits map out in real-time."
                            delay={0.1}
                        />

                        <MissionCard
                            icon={<PieChart />}
                            title="Effortless Budgeting"
                            description="Set custom limits and receive alerts before crossing them."
                            delay={0.2}
                        />

                        <MissionCard
                            icon={<CheckCircle2 />}
                            title="Automated Savings"
                            description="Discover hidden money in your routine and divert it toward your goals."
                            delay={0.3}
                        />
                    </div>
                </div>
            </section>

            {/* Keep the remaining sections exactly as they are now */}
            {/* Stats */}
            {/* Features */}
            {/* Modal */}

            {modalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={() => setModalOpen(false)}
                >
                    <div
                        className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 py-3"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-2 right-2 text-slate-500 hover:text-slate-900 cursor-pointer"
                        >
                            <X size={20} />
                        </button>

                        <div className="py-6">
                            <iframe
                                className="w-full h-[400px]"
                                src="https://www.youtube.com/embed/VIDEO_ID?autoplay=1"
                                title="Demo video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}