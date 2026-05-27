export interface TransactionItemProps { 
    icon: React.ReactNode, 
    color: string, 
    title: string, 
    time: string, 
    note: string, 
    amount: string
}

export function TransactionItem({ icon, color, title, time, note, amount }: TransactionItemProps) {
  return (
    <div className="flex items-center justify-between py-2 group hover:bg-muted/50 px-2 -mx-2 rounded-lg transition-colors">
      <div className="flex items-center gap-4">
        <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white shadow-sm ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{time} • {note}</p>
        </div>
      </div>
      <span className="font-semibold text-foreground text-sm">
        {amount}
      </span>
    </div>
  );
}