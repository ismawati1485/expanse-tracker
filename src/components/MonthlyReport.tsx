import { Transaction } from '@/types/transaction';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Calendar, Search } from 'lucide-react';

interface MonthlyReportProps {
  transactions: Transaction[];
}

export const MonthlyReport = ({ transactions }: MonthlyReportProps) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  // --- Ambil daftar bulan dari transaksi ---
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

  // --- Set default bulan ke bulan terbaru ---
  useMemo(() => {
    if (availableMonths.length > 0 && !selectedMonth) {
      setSelectedMonth(availableMonths[0]);
    }
  }, [availableMonths, selectedMonth]);

  // --- Filter transaksi sesuai bulan, tipe, dan pencarian ---
  const monthlyTransactions = useMemo(() => {
    let filtered = transactions.filter(transaction => {
      const transactionMonth = new Date(transaction.date).toLocaleDateString('id-ID', { 
        month: 'long', 
        year: 'numeric' 
      });
      return transactionMonth === selectedMonth;
    });

    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, selectedMonth, filterType, searchTerm]);

  // --- Format ke Rupiah ---
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
          <p className="text-muted-foreground">
            Belum ada data transaksi untuk laporan bulanan
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selector Bulan */}
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

      {/* Detail Transaksi */}
      <Card className="bg-gradient-card shadow-elevated">
        <CardHeader>
          <CardTitle>Detail Transaksi - {selectedMonth}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search dan Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari transaksi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={(value: 'all' | 'income' | 'expense') => setFilterType(value)}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="income">Pemasukan</SelectItem>
                <SelectItem value="expense">Pengeluaran</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabel Transaksi */}
          {monthlyTransactions.length > 0 ? (
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
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Tidak ada transaksi pada bulan ini</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
