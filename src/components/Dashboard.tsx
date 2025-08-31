import { Transaction } from '@/types/transaction';
import { MetricCard } from './MetricCard';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { useState } from 'react';
import { analyzeExpenses } from '@/services/analyze'; // ✅ pakai ini aja

interface DashboardProps {
  transactions: Transaction[];
}

export const Dashboard = ({ transactions }: DashboardProps) => {
  const [analysis, setAnalysis] = useState<string>("");

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const handleAnalyze = async () => {
    console.log("Memulai analisis AI...");
    try{
const result = await analyzeExpenses(transactions);
    console.log("Hasil dari AI:", result);
    setAnalysis(result);
  } catch (err) {
    console.error("Gagal analisis:", err);
    setAnalysis("❌ Gagal melakukan analisis. Cek API key atau koneksi.");
    }

  };

  return (
    <div>
      {/* Kartu Statistik */}
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


      {/* Hasil Analisis */}
      {analysis && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">Hasil Analisis AI:</h3>
          <p>{analysis}</p>
        </div>
      )}
    </div>
  );
};
