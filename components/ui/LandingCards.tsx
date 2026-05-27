'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import React from 'react';

export function MissionCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay }}
      className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all group"
    >
      <div className="h-12 w-12 rounded-xl bg-white border border-slate-100 shadow-sm text-emerald-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}

export function StatCounter({ target, label, delay }: { target: string, label: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay }}
      className="py-8 md:py-4"
    >
      <h4 className="text-5xl lg:text-6xl font-extrabold text-slate-300 mb-2 tracking-tight">{target}</h4>
      <p className="text-slate-400 font-medium">{label}</p>
    </motion.div>
  );
}

export function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -5 }}
      className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all cursor-pointer group flex flex-col sm:flex-row gap-6"
    >
      <div className="h-14 w-14 shrink-0 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors flex items-center gap-2">
          {title} <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </h3>
        <p className="text-slate-600 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}