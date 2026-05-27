'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function HeroCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const slides = [
    {
      id: 0,
      title: "Expense Analytics",
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-end h-32 px-2">
            {[40, 70, 45, 90, 65, 85, 50].map((h, i) => (
              <motion.div 
                key={i} 
                initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 0.5, delay: i * 0.05 }}
                className={`w-8 rounded-t-md ${i === 3 ? 'bg-emerald-500' : 'bg-slate-100'}`}
              />
            ))}
          </div>
          <div className="pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Weekly Average</span>
              <span className="font-semibold text-slate-900">₹ 8,450.00</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 1,
      title: "Category Breakdown",
      content: (
        <div className="space-y-5 mt-2">
          <ProgressRow label="Food & Drinks" amount="₹ 4,200" percent={65} color="bg-emerald-500" />
          <ProgressRow label="Housing" amount="₹ 15,000" percent={80} color="bg-blue-500" />
          <ProgressRow label="Shopping" amount="₹ 2,150" percent={30} color="bg-teal-400" />
        </div>
      )
    },
    {
      id: 2,
      title: "Recent Activity",
      content: (
        <div className="space-y-4 mt-2">
          <ActivityRow title="Grocery Supermarket" date="Today, 10:24 AM" amount="-₹ 1,250" />
          <ActivityRow title="Transfer to Manan" date="Yesterday" amount="-₹ 5,000" />
          <ActivityRow title="Salary Deposit" date="May 25" amount="+₹ 85,000" positive />
        </div>
      )
    }
  ];

  return (
    <div className="relative w-full aspect-square md:aspect-[4/3] rounded-[2rem] bg-white/50 backdrop-blur-xl border border-white/60 shadow-2xl shadow-slate-200/50 p-6 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-slate-200" />
          <div className="w-3 h-3 rounded-full bg-slate-200" />
          <div className="w-3 h-3 rounded-full bg-slate-200" />
        </div>
        <div className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Cashlio UI</div>
      </div>

      <div className="flex-1 relative overflow-hidden w-full h-full min-h-[250px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
            className="absolute inset-0 w-full h-full bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-6">{slides[activeSlide].title}</h3>
            {slides[activeSlide].content}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-2 mt-6 z-20 relative">
        {slides.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setActiveSlide(i)} 
            className={`w-2 h-2 rounded-full transition-all duration-300 ${activeSlide === i ? 'w-6 bg-emerald-500' : 'bg-slate-300'}`} 
          />
        ))}
      </div>
    </div>
  );
}

function ProgressRow({ label, amount, percent, color }: { label: string, amount: string, percent: number, color: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="font-semibold text-slate-900">{amount}</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 1, delay: 0.2 }} className={`h-full rounded-full ${color}`} />
      </div>
    </div>
  );
}

function ActivityRow({ title, date, amount, positive = false }: { title: string, date: string, amount: string, positive?: boolean }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
      <div>
        <p className="font-medium text-slate-900 text-sm">{title}</p>
        <p className="text-xs text-slate-400 mt-0.5">{date}</p>
      </div>
      <span className={`font-semibold text-sm ${positive ? 'text-emerald-500' : 'text-slate-900'}`}>{amount}</span>
    </div>
  );
}