import { Transaction } from '@/types/transaction';
import { Dashboard } from '@/components/Dashboard';
import { Charts } from '@/components/Charts';
import { BarChart3 } from 'lucide-react';

interface DashboardPageProps {
  transactions: Transaction[];
}

const DashboardPage = ({ transactions }: DashboardPageProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Lihat ringkasan keuangan Anda
        </p>
      </div>

      {/* Dashboard Metrics */}
      <Dashboard transactions={transactions} />

      {/* Charts Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Analisis Keuangan</h2>
        </div>
        <Charts transactions={transactions} />
      </div>
    </div>
  );
};

export default DashboardPage;