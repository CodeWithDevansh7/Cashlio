export interface CategoryProgressProps {
  title: string;
  amount: string;
  percentage: number;
  color: string;
}

export function CategoryProgress({ title, amount, percentage, color }: CategoryProgressProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <span className="text-sm font-medium text-foreground">{amount}</span>
      </div>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${color}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}