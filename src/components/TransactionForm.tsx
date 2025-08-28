import { useState } from 'react';
import { Transaction, categories } from '@/types/transaction';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TransactionFormProps {
  transaction?: Transaction;
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
}

export const TransactionForm = ({ transaction, onSubmit, onCancel }: TransactionFormProps) => {
  const [formData, setFormData] = useState({
    title: transaction?.title || '',
    amount: transaction?.amount.toString() || '',
    category: transaction?.category || '',
    type: transaction?.type || 'expense' as 'income' | 'expense',
    date: transaction?.date ? transaction.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || !formData.category) return;

    onSubmit({
      title: formData.title,
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type,
      date: new Date(formData.date),
      createdAt: transaction?.createdAt || new Date(),
    });
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle>
          {transaction ? 'Edit Transaksi' : 'Tambah Transaksi Baru'}
        </DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-6 mt-6">
        <div className="space-y-2">
          <Label htmlFor="title">Judul Transaksi</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Masukkan judul transaksi"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Nominal (IDR)</Label>
          <Input
            id="amount"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="0"
            min="0"
            step="1"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Tipe Transaksi</Label>
          <RadioGroup
            value={formData.type}
            onValueChange={(value: 'income' | 'expense') => setFormData({ ...formData, type: value })}
            className="flex space-x-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="income" id="income" />
              <Label htmlFor="income" className="text-income">Pemasukan</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="expense" id="expense" />
              <Label htmlFor="expense" className="text-expense">Pengeluaran</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Kategori</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Tanggal</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            type="submit" 
            className="flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-300"
          >
            {transaction ? 'Update' : 'Tambah'} Transaksi
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="flex-1"
          >
            Batal
          </Button>
        </div>
      </form>
    </div>
  );
};