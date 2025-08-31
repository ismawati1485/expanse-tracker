import { Transaction } from '@/types/transaction';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

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

    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Pie Chart - Distribusi Pengeluaran */}
      <Card className="bg-gradient-chart shadow-chart hover:shadow-glow transition-all duration-300 border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold bg-gradient-primary bg-clip-text text-transparent">
            Distribusi Pengeluaran per Kategori
          </CardTitle>

        </CardHeader>
        <CardContent>
          {pieChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => percent > 5 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                  outerRadius={100}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  strokeWidth={2}
                  stroke="hsl(var(--background))"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      className="hover:opacity-80 transition-opacity duration-200"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  wrapperStyle={{ paddingTop: '20px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[350px] flex flex-col items-center justify-center text-muted-foreground">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <TrendingDown className="h-8 w-8" />
              </div>
              <p className="text-center">Belum ada data pengeluaran</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bar Chart - Pemasukan vs Pengeluaran Bulanan */}
      <Card className="bg-gradient-chart shadow-chart hover:shadow-glow transition-all duration-300 border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold bg-gradient-primary bg-clip-text text-transparent">
            Pemasukan vs Pengeluaran Bulanan
          </CardTitle>
        </CardHeader>
        <CardContent>
          {barChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart 
                data={barChartData} 
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                barCategoryGap="20%"
              >
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--income))" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="hsl(var(--income))" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--expense))" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="hsl(var(--expense))" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="hsl(var(--border))" 
                  strokeOpacity={0.3}
                />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  fontWeight={500}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tickFormatter={formatCurrency}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  fontWeight={500}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                />
                <Bar 
                  dataKey="income" 
                  fill="url(#incomeGradient)"
                  name="Pemasukan"
                  radius={[4, 4, 0, 0]}
                  className="hover:opacity-80 transition-opacity duration-200"
                />
                <Bar 
                  dataKey="expense" 
                  fill="url(#expenseGradient)"
                  name="Pengeluaran"
                  radius={[4, 4, 0, 0]}
                  className="hover:opacity-80 transition-opacity duration-200"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[350px] flex flex-col items-center justify-center text-muted-foreground">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8" />
              </div>
              <p className="text-center">Belum ada data transaksi</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};