export interface NavItemProps {
    icon: React.ReactNode, 
    label: string, 
    active?: boolean
}

export function NavItem({ icon, label, active = false }: NavItemProps) {
  return (
    <a href="#" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
      active ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
    }`}>
      {icon}
      <span>{label}</span>
    </a>
  );
}
