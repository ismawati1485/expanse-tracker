import { Transaction } from '@/types/transaction';
import { MetricCard } from './MetricCard';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
}

export const Dashboard = ({ transactions }: DashboardProps) => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <MetricCard
        title="Total Saldo"
        amount={balance}
        type={balance >= 0 ? 'income' : 'expense'}
        icon={<Wallet className="h-6 w-6" />}
      />
      <MetricCard
        title="Total Pemasukan"
        amount={totalIncome}
        type="income"
        icon={<TrendingUp className="h-6 w-6" />}
      />
      <MetricCard
        title="Total Pengeluaran"
        amount={totalExpense}
        type="expense"
        icon={<TrendingDown className="h-6 w-6" />}
      />
    </div>
  );
};
