import { Transaction } from '@/types/transaction';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ChartsProps {
  transactions: Transaction[];
}

const COLORS = [
  'hsl(142.1 76.2% 36.3%)', // income
  'hsl(0 72.2% 50.6%)',     // expense  
  'hsl(217.2 91.2% 59.8%)', 
  'hsl(47.9 95.8% 53.1%)',  
  'hsl(262.1 83.3% 57.8%)', 
  'hsl(173.4 58.9% 39.4%)', 
  'hsl(24.6 95% 53.1%)',    
  'hsl(346.8 77.2% 49.8%)', 
  'hsl(120 100% 25%)',      
  'hsl(339.6 82.2% 51.6%)', 
];

export const Charts = ({ transactions }: ChartsProps) => {
  // Data pie chart 
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieChartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  // Data bar chart 
  const monthlyData = transactions.reduce((acc, transaction) => {
    const monthYear = new Date(transaction.date).toLocaleDateString('id-ID', { 
      month: 'short', 
      year: 'numeric' 
    });
    
    if (!acc[monthYear]) {
      acc[monthYear] = { month: monthYear, income: 0, expense: 0 };
    }
    
    if (transaction.type === 'income') {
      acc[monthYear].income += transaction.amount;
    } else {
      acc[monthYear].expense += transaction.amount;
    }
    
    return acc;
  }, {} as Record<string, { month: string; income: number; expense: number }>);

  const barChartData = Object.values(monthlyData).sort((a, b) => {
    const dateA = new Date(a.month + ' 01');
    const dateB = new Date(b.month + ' 01');
    return dateA.getTime() - dateB.getTime();
  });

  const formatCurrency = (value: number) => {
    return `Rp${(value / 1000000).toFixed(1)}M`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    
      <Card className="bg-gradient-card shadow-elevated">
        <CardHeader>
          <CardTitle>Distribusi Pengeluaran per Kategori</CardTitle>
        </CardHeader>
        <CardContent>
          {pieChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Belum ada data pengeluaran
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bar Chart - Pemasukan vs Pengeluaran Bulanan */}
      <Card className="bg-gradient-card shadow-elevated">
        <CardHeader>
          <CardTitle>Pemasukan vs Pengeluaran Bulanan</CardTitle>
        </CardHeader>
        <CardContent>
          {barChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  tickFormatter={formatCurrency}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey="income" 
                  fill="hsl(var(--income))" 
                  name="Pemasukan"
                  radius={[2, 2, 0, 0]}
                />
                <Bar 
                  dataKey="expense" 
                  fill="hsl(var(--expense))" 
                  name="Pengeluaran"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Belum ada data transaksi
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};