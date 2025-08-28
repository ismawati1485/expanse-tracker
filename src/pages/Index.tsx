import { useState, useEffect } from 'react';
import { Transaction } from '@/types/transaction';
import { dummyTransactions } from '@/data/dummyTransactions';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Dashboard } from '@/components/Dashboard';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { Charts } from '@/components/Charts';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('expense-tracker-transactions', []);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

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
    setIsFormOpen(false);
    
    toast({
      title: "Transaksi berhasil ditambahkan",
      description: `${transactionData.title} - ${new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(transactionData.amount)}`,
    });
  };

  const handleEditTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    if (!editingTransaction) return;
    
    const updatedTransactions = transactions.map(t =>
      t.id === editingTransaction.id
        ? { ...transactionData, id: editingTransaction.id }
        : t
    );
    
    setTransactions(updatedTransactions);
    setEditingTransaction(undefined);
    setIsFormOpen(false);
    
    toast({
      title: "Transaksi berhasil diperbarui",
      description: `${transactionData.title} telah diperbarui`,
    });
  };

  const handleDeleteTransaction = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    setTransactions(transactions.filter(t => t.id !== id));
    setDeleteId(null);
    
    toast({
      title: "Transaksi berhasil dihapus",
      description: transaction ? `${transaction.title} telah dihapus` : "Transaksi telah dihapus",
      variant: "destructive",
    });
  };

  const openEditForm = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(undefined);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Expense Tracker
            </h1>
            <p className="text-muted-foreground mt-1">
              Kelola keuangan Anda dengan mudah
            </p>
          </div>
          
          <div className="flex gap-3 mt-4 sm:mt-0">
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                  onClick={() => setEditingTransaction(undefined)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Transaksi
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <TransactionForm
                  transaction={editingTransaction}
                  onSubmit={editingTransaction ? handleEditTransaction : handleAddTransaction}
                  onCancel={closeForm}
                />
              </DialogContent>
            </Dialog>
          </div>
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

        {/* Transaction List */}
        <TransactionList
          transactions={transactions}
          onEdit={openEditForm}
          onDelete={setDeleteId}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Transaksi</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteId && handleDeleteTransaction(deleteId)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Index;