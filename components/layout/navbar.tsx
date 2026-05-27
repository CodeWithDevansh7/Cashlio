'use client';

import { useState, useEffect } from 'react';
import { PieChart } from 'lucide-react';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-slate-200/50 py-4 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white">
            <PieChart size={18} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">Cashlio</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Log in
          </button>
          <button className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-slate-800 transition-all shadow-md hover:shadow-lg">
            Create Account
          </button>
        </div>
      </div>
    </header>
  );
}