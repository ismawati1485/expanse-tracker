import React, { useState } from "react";
import { Transaction } from '@/types/transaction';
import { MetricCard } from '@/components/MetricCard';
import { Charts } from '@/components/Charts';
import { analyzeExpenses } from "@/services/analyze";
import { ExportButton } from '@/components/ExportButton';
import { Wallet, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

interface DashboardPageProps {
  transactions: Transaction[];
}

const DashboardPage = ({ transactions }: DashboardPageProps) => {
  const [analysis, setAnalysis] = useState("");

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const handleAnalyze = async () => {
    try {
      const expenseData = transactions.map(t => ({
        category: t.category,
        amount: t.amount,
      }));
      const result = await analyzeExpenses(expenseData);
      setAnalysis(result);
    } catch (err) {
      console.error("Gagal analisis:", err);
      setAnalysis("❌ Gagal melakukan analisis. Cek API key atau koneksi.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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

      {/* Metrics */}
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

      {/* Charts */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Analisis Keuangan</h2>
        </div>
        <Charts transactions={transactions} />

        {/* AI Analysis */}
        <button
          onClick={handleAnalyze}
          className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Analisis Pengeluaran dengan AI
        </button>

        {analysis && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">Hasil Analisis AI:</h3>
            <p>{analysis}</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default DashboardPage;
