import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Transaction } from '@/types/transaction';
import { dummyTransactions } from '@/data/dummyTransactions';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Navigation } from '@/components/Navigation';
import DashboardPage from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
import NotFound from "./pages/NotFound";
import { useToast } from '@/hooks/use-toast';
import GeminiTestPage from './pages/GeminiTestPage';

const queryClient = new QueryClient();

const App = () => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('expense-tracker-transactions', []);
  const { toast } = useToast();

    useEffect(() => {
    console.log("API Key dari .env:", import.meta.env.VITE_GEMINI_API_KEY);
  }, []);
  
  // Initialize with dummy data if localStorage is empty
  useEffect(() => {
    if (transactions.length === 0) {
      const initialTransactions: Transaction[] = dummyTransactions.map((t, index) => ({
        ...t,
        id: `dummy-${index}`,
        date: new Date(t.date),
        createdAt: new Date(t.createdAt),
      }));
      setTransactions(initialTransactions);
    }
  }, [transactions.length, setTransactions]);

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const handleAddTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: generateId(),
    };
    
    setTransactions([newTransaction, ...transactions]);
    
    toast({
      title: "Transaksi berhasil ditambahkan",
      description: `${transactionData.title} - ${new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(transactionData.amount)}`,
    });
  };

  const handleEditTransaction = (id: string, transactionData: Omit<Transaction, 'id'>) => {
    const updatedTransactions = transactions.map(t =>
      t.id === id
        ? { ...transactionData, id }
        : t
    );
    
    setTransactions(updatedTransactions);
    
    toast({
      title: "Transaksi berhasil diperbarui",
      description: `${transactionData.title} telah diperbarui`,
    });
  };

  const handleDeleteTransaction = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    setTransactions(transactions.filter(t => t.id !== id));
    
    toast({
      title: "Transaksi berhasil dihapus",
      description: transaction ? `${transaction.title} telah dihapus` : "Transaksi telah dihapus",
      variant: "destructive",
    });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Navigation />
            <Routes>
              <Route path="/gemini-test" element={<GeminiTestPage />} />
              <Route path="/not-found" element={<NotFound />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route 
                path="/dashboard" 
                element={<DashboardPage transactions={transactions} />} 
              />
              <Route 
                path="/transactions" 
                element={
                  <TransactionsPage 
                    transactions={transactions}
                    onAddTransaction={handleAddTransaction}
                    onEditTransaction={handleEditTransaction}
                    onDeleteTransaction={handleDeleteTransaction}
                  />
                } 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
