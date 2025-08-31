import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Transaction } from "@/types/transaction";
import * as XLSX from 'xlsx';
import { useToast } from "@/hooks/use-toast";

interface ExportButtonProps {
  transactions: Transaction[];
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
}

export const ExportButton = ({ transactions, variant = "outline", size = "default" }: ExportButtonProps) => {
  const { toast } = useToast();

  const exportToExcel = () => {
    try {
      // Prepare data for Excel
      const excelData = transactions.map(transaction => ({
        'Tanggal': new Date(transaction.date).toLocaleDateString('id-ID'),
        'Judul': transaction.title,
        'Kategori': transaction.category,
        'Tipe': transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
        'Jumlah': transaction.amount,
        'Dibuat': new Date(transaction.createdAt).toLocaleDateString('id-ID')
      }));

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);
      
      // Set column widths
      const colWidths = [
        { wch: 12 }, // Tanggal
        { wch: 25 }, // Judul
        { wch: 20 }, // Kategori
        { wch: 15 }, // Tipe
        { wch: 15 }, // Jumlah
        { wch: 12 }  // Dibuat
      ];
      ws['!cols'] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Transaksi');
      
      // Generate filename with current date
      const filename = `expense-tracker-${new Date().toISOString().split('T')[0]}.xlsx`;
      
      // Save file
      XLSX.writeFile(wb, filename);
      
      toast({
        title: "Export Berhasil",
        description: `Data transaksi berhasil diekspor ke ${filename}`,
      });
    } catch (error) {
      toast({
        title: "Export Gagal",
        description: "Terjadi kesalahan saat mengekspor data",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={exportToExcel}
      variant={variant}
      size={size}
      className="gap-2"
      disabled={transactions.length === 0}
    >
      <Download className="h-4 w-4" />
      Export Excel
    </Button>
  );
};