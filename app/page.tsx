'use client';

import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  ShieldCheck, 
  Smartphone, 
  Mic, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

// Import your new components
import { Navbar } from '../components/layout/navbar';
import { Footer } from '../components/layout/footer';
import { HeroCarousel } from '../components/sections/HeroCarousel';
import { MissionCard, StatCounter, FeatureCard } from '../components/ui/LandingCards';

export default function CashlioLanding() {
  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      
      {/* Background Ambient Blobs */}
      <div className="absolute top-0 left-0 w-full overflow-hidden -z-10 pointer-events-none h-screen">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-200/40 blur-[100px]" />
        <div className="absolute top-[20%] right-[-5%] w-[600px] h-[600px] rounded-full bg-blue-200/30 blur-[120px]" />
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 text-center lg:text-left z-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Financial clarity achieved
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 text-slate-900 leading-[1.1]">
            Track Every Rupee. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
              Save Smarter.
            </span>
          </h1>
          <p className="text-lg lg:text-xl text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Gain complete control over your finances. Cashlio helps you monitor daily habits, visualize weekly trends, and achieve your yearly savings goals with effortless precision.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2">
              Get Started Free <ArrowRight size={18} />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 hover:shadow-sm transition-all">
              View Demo
            </button>
          </div>
        </div>
        <div className="flex-1 w-full max-w-lg lg:max-w-none relative z-10">
          <HeroCarousel />
        </div>
      </section>

      {/* Section 1 - Our Mission */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-slate-900">Your Path to Financial Clarity</h2>
            <p className="text-slate-600 text-lg">Cashlio is designed to replace chaotic spreadsheets and confusing bank apps with an elegant, focused experience that builds lasting savings habits.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <MissionCard icon={<TrendingUp />} title="Smart Tracking" description="Automatically categorize expenses and watch your spending habits map out in real-time." delay={0.1} />
            <MissionCard icon={<PieChart />} title="Effortless Budgeting" description="Set custom limits for dining, shopping, and bills. We'll alert you before you cross the line." delay={0.2} />
            <MissionCard icon={<CheckCircle2 />} title="Automated Savings" description="Discover hidden money in your routine and seamlessly divert it toward your financial goals." delay={0.3} />
          </div>
        </div>
      </section>

      {/* Section 2 - Impact Stats */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 -z-20" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 -z-10 mix-blend-overlay" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-slate-700/50">
            <StatCounter target="50,000+" label="Active Users Managing Wealth" delay={0.1} />
            <StatCounter target="₹12 Cr+" label="Total Expenses Tracked" delay={0.2} />
            <StatCounter target="35%" label="Average Savings Increase" delay={0.3} />
          </div>
        </div>
      </section>

      {/* Section 3 - Why Choose Cashlio */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-slate-900">Built for modern finance.</h2>
          <p className="text-slate-600 text-lg">Everything you need, nothing you don't.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <FeatureCard icon={<BarChart3 size={24} />} title="Visual Analytics" description="Beautiful, interactive charts that turn your raw transaction data into understandable insights at a glance." />
          <FeatureCard icon={<Mic size={24} />} title="Voice-Powered Tracking" description="Skip the complex menus. Just speak naturally to log expenses, check balances, or analyze spending habits in local languages." />
          <FeatureCard icon={<ShieldCheck size={24} />} title="Secure Cloud Sync" description="Your data is encrypted with bank-grade security and synced seamlessly across all your devices in real-time." />
          <FeatureCard icon={<Smartphone size={24} />} title="Monthly Reports" description="Receive beautifully formatted PDF reports summarizing your financial health directly to your inbox every 1st of the month." />
        </div>
      </section>

      <Footer />
    </div>
  );
}