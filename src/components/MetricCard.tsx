import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  amount: number;
  type?: 'default' | 'income' | 'expense';
  icon: React.ReactNode;
}

export const MetricCard = ({ title, amount, type = 'default', icon }: MetricCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className={cn(
      "bg-gradient-card shadow-elevated hover:shadow-glow transition-all duration-300",
      type === 'income' && "border-income/20",
      type === 'expense' && "border-expense/20"
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <p className={cn(
              "text-2xl font-bold",
              type === 'income' && "text-income",
              type === 'expense' && "text-expense",
              type === 'default' && "text-foreground"
            )}>
              {formatCurrency(amount)}
            </p>
          </div>
          <div className={cn(
            "p-3 rounded-full",
            type === 'income' && "bg-income/10 text-income",
            type === 'expense' && "bg-expense/10 text-expense",
            type === 'default' && "bg-primary/10 text-primary"
          )}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};