import { Transaction } from '@/types/transaction';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';

interface MonthlyReportProps {
  transactions: Transaction[];
}

export const MonthlyReport = ({ transactions }: MonthlyReportProps) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  // Get available months from transactions
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    transactions.forEach(transaction => {
      const monthKey = new Date(transaction.date).toLocaleDateString('id-ID', { 
        month: 'long', 
        year: 'numeric' 
      });
      months.add(monthKey);
    });
    return Array.from(months).sort((a, b) => {
      const dateA = new Date(a + ' 01');
      const dateB = new Date(b + ' 01');
      return dateB.getTime() - dateA.getTime();
    });
  }, [transactions]);

  // Set default to current month if available
  useMemo(() => {
    if (availableMonths.length > 0 && !selectedMonth) {
      setSelectedMonth(availableMonths[0]);
    }
  }, [availableMonths, selectedMonth]);

  // Filter transactions by selected month
  const monthlyTransactions = useMemo(() => {
    if (!selectedMonth) return [];
    
    return transactions.filter(transaction => {
      const transactionMonth = new Date(transaction.date).toLocaleDateString('id-ID', { 
        month: 'long', 
        year: 'numeric' 
      });
      return transactionMonth === selectedMonth;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, selectedMonth]);

  // Calculate monthly summary
  const monthlySummary = useMemo(() => {
    const income = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = income - expense;
    
    // Category breakdown
    const categoryExpenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    return { income, expense, balance, categoryExpenses };
  }, [monthlyTransactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (availableMonths.length === 0) {
    return (
      <Card className="bg-gradient-card shadow-elevated">
        <CardContent className="p-8 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Belum ada data transaksi untuk laporan bulanan</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Month Selector */}
      <Card className="bg-gradient-card shadow-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Laporan Bulanan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih bulan" />
            </SelectTrigger>
            <SelectContent>
              {availableMonths.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedMonth && (
        <>
          {/* Monthly Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-card shadow-elevated border-income/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Pemasukan</p>
                    <p className="text-2xl font-bold text-income">
                      {formatCurrency(monthlySummary.income)}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-income/10">
                    <TrendingUp className="h-6 w-6 text-income" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-elevated border-expense/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Pengeluaran</p>
                    <p className="text-2xl font-bold text-expense">
                      {formatCurrency(monthlySummary.expense)}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-expense/10">
                    <TrendingDown className="h-6 w-6 text-expense" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-elevated">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Saldo Akhir</p>
                    <p className={`text-2xl font-bold ${
                      monthlySummary.balance >= 0 ? 'text-income' : 'text-expense'
                    }`}>
                      {formatCurrency(monthlySummary.balance)}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${
                    monthlySummary.balance >= 0 ? 'bg-income/10' : 'bg-expense/10'
                  }`}>
                    {monthlySummary.balance >= 0 ? (
                      <TrendingUp className={`h-6 w-6 ${monthlySummary.balance >= 0 ? 'text-income' : 'text-expense'}`} />
                    ) : (
                      <TrendingDown className={`h-6 w-6 ${monthlySummary.balance >= 0 ? 'text-income' : 'text-expense'}`} />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown */}
          {Object.keys(monthlySummary.categoryExpenses).length > 0 && (
            <Card className="bg-gradient-card shadow-elevated">
              <CardHeader>
                <CardTitle>Pengeluaran per Kategori</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Object.entries(monthlySummary.categoryExpenses)
                    .sort(([,a], [,b]) => b - a)
                    .map(([category, amount]) => (
                      <div key={category} className="text-center p-4 rounded-lg bg-muted/50">
                        <p className="font-medium text-sm text-muted-foreground mb-1">{category}</p>
                        <p className="font-bold text-expense">{formatCurrency(amount)}</p>
                        <p className="text-xs text-muted-foreground">
                          {((amount / monthlySummary.expense) * 100).toFixed(1)}%
                        </p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Transactions Table */}
          <Card className="bg-gradient-card shadow-elevated">
            <CardHeader>
              <CardTitle>Detail Transaksi - {selectedMonth}</CardTitle>
            </CardHeader>
            <CardContent>
              {monthlyTransactions.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Judul</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Tipe</TableHead>
                        <TableHead className="text-right">Jumlah</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {monthlyTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">
                            {new Date(transaction.date).toLocaleDateString('id-ID')}
                          </TableCell>
                          <TableCell>{transaction.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{transaction.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={transaction.type === 'income' ? 'default' : 'destructive'}
                              className={
                                transaction.type === 'income' 
                                  ? 'bg-income/10 text-income border-income/20 hover:bg-income/20' 
                                  : 'bg-expense/10 text-expense border-expense/20 hover:bg-expense/20'
                              }
                            >
                              {transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                            </Badge>
                          </TableCell>
                          <TableCell className={`text-right font-medium ${
                            transaction.type === 'income' ? 'text-income' : 'text-expense'
                          }`}>
                            {formatCurrency(transaction.amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Tidak ada transaksi pada bulan ini</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};