import { PieChart } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-black border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded border-2 border-emerald-500 text-emerald-500 flex items-center justify-center">
              <PieChart size={14} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-400">Cashlio</span>
          </div>
          <div className="flex gap-8 text-sm font-medium text-slate-400">
            <Link href="#" className="hover:text-emerald-500 transition-colors">
              Product
            </Link>
            <Link href="#" className="hover:text-emerald-500 transition-colors">
              Pricing
            </Link>
            <Link href="#" className="hover:text-emerald-500 transition-colors">
              Company
            </Link>
            <Link href="/terms" className="hover:text-emerald-500 transition-colors">
              Terms and Conditions
            </Link>
            <Link href="/privacy" className="hover:text-emerald-500 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-300">
          <p>© 2026 Cashlio. All Rights Reserved.</p>
          <p>Designed for financial growth.</p>
        </div>
      </div>
    </footer>
  );
}