import React, { useState } from "react";
import { Transaction } from '@/types/transaction';
import { Dashboard } from '@/components/Dashboard';
import { Charts } from '@/components/Charts';
import { BarChart3 } from 'lucide-react';
import { analyzeExpenses } from "@/services/analyze";

interface DashboardPageProps {
  transactions: Transaction[];
}

const DashboardPage = ({ transactions }: DashboardPageProps) => {
  const [analysis, setAnalysis] = useState("");

  const handleAnalyze = async () => {
    // mapping transactions biar cocok sama service
    const expenseData = transactions.map((t) => ({
      category: t.category,
      amount: t.amount,
    }));

    const result = await analyzeExpenses(expenseData);
    setAnalysis(result);
  };

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

        {/* Tambahin Tombol Analisis */}
        <button
          onClick={handleAnalyze}
          className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Analisis Pengeluaran dengan AI
        </button>

        {/* Hasil Analisis */}
        {analysis && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">Hasil Analisis:</h3>
            <p>{analysis}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
