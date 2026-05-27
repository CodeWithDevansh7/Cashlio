export interface StatCardProps { 
    title: string, 
    value: string, 
    trend: string 
}

export function StatCard({ title, value, trend }: StatCardProps) {
  const isPositive = trend.startsWith('+');
  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <h3 className="text-xl font-bold mt-2 text-foreground">{value}</h3>
      <p className={`text-sm mt-2 font-medium ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
        {trend} from last month
      </p>
    </div>
  );
}