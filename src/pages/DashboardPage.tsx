import { Transaction } from '@/types/transaction';
import { Dashboard } from '@/components/Dashboard';
import { Charts } from '@/components/Charts';
import { ExportButton } from '@/components/ExportButton';
import { MonthlyReport } from '@/components/MonthlyReport';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, FileSpreadsheet, Calendar } from 'lucide-react';

interface DashboardPageProps {
  transactions: Transaction[];
}

const DashboardPage = ({ transactions }: DashboardPageProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Lihat ringkasan keuangan Anda
            </p>
          </div>
          <ExportButton transactions={transactions} />
        </div>
      </div>

      {/* Dashboard Metrics */}
      <Dashboard transactions={transactions} />

      {/* Tabs for Analytics and Reports */}
      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analisis Keuangan
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Laporan Bulanan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Grafik & Analisis</h2>
          </div>
          <Charts transactions={transactions} />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Laporan Bulanan</h2>
          </div>
          <MonthlyReport transactions={transactions} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;