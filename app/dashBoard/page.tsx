import { 
  Search, 
  Mic, 
  LayoutDashboard, 
  Send, 
  Clock, 
  User,
  ShoppingCart, 
  Bus, 
  Home, 
  Utensils,
  MoreHorizontal
} from "lucide-react";

import { CategoryProgress } from "@/components/categoryProgress";
import { TransactionItem } from "@/components/transactionItem";
import { NavItem } from "@/components/navItem";
import { StatCard } from "@/components/statCard";

export default function Dashboard() {
  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans">
      
      {/* 1. LEFT SIDEBAR */}
      <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col z-20">
        <div className="p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-primary tracking-tight">CashLio</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavItem icon={<LayoutDashboard size={20} />} label="Overview" active />
          <NavItem icon={<Send size={20} />} label="Transfers" />
          <NavItem icon={<Clock size={20} />} label="History" />
          <NavItem icon={<User size={20} />} label="Account" />
        </nav>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* 2. HEADER (With Voice/Intent Recognition Input) */}
        <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6 sticky top-0 z-10">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          
          <div className="flex items-center gap-4">
            <div className="relative flex items-center w-80">
              <Search className="absolute left-3 text-muted-foreground" size={18} />
              <input 
                type="text" 
                placeholder="Try: 'Transfer ₹500 to Manan'" 
                className="w-full pl-10 pr-10 py-2 rounded-full border border-input bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
              <button className="absolute right-3 text-primary hover:text-primary/80 transition-colors">
                <Mic size={18} />
              </button>
            </div>
            <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
              K
            </div>
          </div>
        </header>

        {/* 3. SCROLLABLE DASHBOARD CONTENT */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col xl:flex-row gap-6 max-w-7xl mx-auto">
            
            {/* Left Column: Stats & Detailed History */}
            <div className="flex-1 space-y-6">
              
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Total Balance" value="₹ 1,24,500.00" trend="+2.4%" />
                <StatCard title="Monthly Expenses" value="₹ 32,400.00" trend="-1.2%" />
                <StatCard title="Active Savings" value="₹ 45,000.00" trend="+5.0%" />
              </div>

              {/* Transaction History */}
              <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-6">Recent Activity</h3>
                
                <div className="space-y-6">
                  {/* Today Group */}
                  <div>
                    <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-2">
                      <h4 className="text-sm font-semibold text-muted-foreground">Today</h4>
                      <MoreHorizontal className="text-muted-foreground" size={16} />
                    </div>
                    <div className="space-y-2">
                      <TransactionItem 
                        icon={<ShoppingCart size={18} />} color="bg-blue-500" 
                        title="Grocery" time="5:12 pm" note="Local market" amount="-₹ 3,268.00" 
                      />
                      <TransactionItem 
                        icon={<Send size={18} />} color="bg-purple-500" 
                        title="Transfer to Manan" time="2:30 pm" note="UPI Payment" amount="-₹ 5,000.00" 
                      />
                    </div>
                  </div>

                  {/* Yesterday Group */}
                  <div>
                    <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-2">
                      <h4 className="text-sm font-semibold text-muted-foreground">Yesterday, 24 May</h4>
                      <MoreHorizontal className="text-muted-foreground" size={16} />
                    </div>
                    <div className="space-y-2">
                      <TransactionItem 
                        icon={<Home size={18} />} color="bg-orange-500" 
                        title="Housing" time="10:00 am" note="Electricity bill" amount="-₹ 1,857.50" 
                      />
                      <TransactionItem 
                        icon={<Utensils size={18} />} color="bg-red-500" 
                        title="Food and Drink" time="8:45 pm" note="Restaurant" amount="-₹ 1,560.00" 
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Categories & Tips */}
            <aside className="w-full xl:w-80 space-y-6 shrink-0">
              
              {/* Category Progress Card */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-6">Where your money goes</h3>
                <div className="space-y-5">
                  <CategoryProgress title="Food and Drinks" amount="₹ 8,724" percentage={35} color="bg-emerald-500" />
                  <CategoryProgress title="Shopping" amount="₹ 13,782" percentage={55} color="bg-blue-500" />
                  <CategoryProgress title="Housing" amount="₹ 9,285" percentage={40} color="bg-orange-500" />
                  <CategoryProgress title="Transportation" amount="₹ 4,207" percentage={25} color="bg-purple-500" />
                </div>
              </div>

              {/* Tips Card */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="text-base font-bold text-foreground mb-2">Save more money</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Based on your patterns, you can save up to ₹2,500 this month by adjusting your grocery spending limits.
                  </p>
                  <button className="w-full bg-foreground text-background text-sm font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity">
                    VIEW TIPS
                  </button>
                </div>
                {/* Decorative background shape */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
              </div>

            </aside>
            
          </div>
        </main>
      </div>
    </div>
  );
}




