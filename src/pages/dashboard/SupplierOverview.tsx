import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  AreaChart,
  Area
} from 'recharts';
import { Boxes, ShoppingCart, MessageSquare, Star, TrendingUp, TrendingDown, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';

const data = [
  { name: 'Jan', sales: 4000, quotes: 2400 },
  { name: 'Feb', sales: 3000, quotes: 1398 },
  { name: 'Mar', sales: 2000, quotes: 9800 },
  { name: 'Apr', sales: 2780, quotes: 3908 },
  { name: 'May', sales: 1890, quotes: 4800 },
  { name: 'Jun', sales: 2390, quotes: 3800 },
];

export function SupplierOverview() {
  const { session } = useAuth();
  const [stats, setStats] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/supplier/dashboard', {
          headers: { 'Authorization': `Bearer ${session?.access_token}` }
        });
        const data = await res.json();
        setStats(data);
      } catch (e) {
        console.error('Error fetching stats');
      }
    };
    if (session) fetchStats();
  }, [session]);

  const dashboardData = stats?.chartData || data;

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="إجمالي المبيعات" 
          value={formatCurrency(stats?.totalSales || 0)} 
          change="+12.5%" 
          trend="up" 
          icon={<ShoppingCart className="h-5 w-5" />} 
        />
        <StatsCard 
          title="عروض الأسعار" 
          value={stats?.quotesCount || "0"} 
          change="+0" 
          trend="up" 
          icon={<MessageSquare className="h-5 w-5" />} 
        />
        <StatsCard 
          title="المنتجات النشطة" 
          value={stats?.productsCount || "0"} 
          change="+0" 
          trend="up" 
          icon={<Boxes className="h-5 w-5" />} 
        />
        <StatsCard 
          title="تقييم المتجر" 
          value={`${stats?.avgRating || "0.0"}/5`} 
          change="مستقر" 
          trend="up" 
          icon={<Star className="h-5 w-5" />} 
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="rounded-2xl border-none shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading text-lg font-bold">إحصائيات المبيعات والطلبات</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1B3A5C" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1B3A5C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="sales" stroke="#1B3A5C" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading text-lg font-bold">عروض الأسعار المفعلة</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="quotes" fill="#E8A838" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table Sample */}
      <Card className="rounded-2xl border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-heading text-lg font-bold">آخر الطلبات</CardTitle>
          <Button variant="ghost" className="text-primary font-bold">عرض الكل</Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-right p-4 font-bold">رقم الطلب</th>
                  <th className="text-right p-4 font-bold">المنتج</th>
                  <th className="text-right p-4 font-bold">المشتري</th>
                  <th className="text-right p-4 font-bold">المبلغ</th>
                  <th className="text-right p-4 font-bold">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map(i => (
                  <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium">#ORD-2024-{i}</td>
                    <td className="p-4">آلة طحن صناعية...</td>
                    <td className="p-4">شركة الأمل للبناء</td>
                    <td className="p-4 font-bold">120,000 د.ج</td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold font-sans">DELIVERED</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatsCard({ title, value, change, trend, icon }: any) {
  return (
    <Card className="border-none shadow-sm rounded-2xl overflow-hidden hover:ring-1 ring-primary/10 transition-all">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-10 w-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
            {icon}
          </div>
          <div className={cn(
            "flex items-center gap-1 text-xs font-bold",
            trend === 'up' ? "text-green-600" : "text-red-500"
          )}>
            {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {change}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl font-black font-heading text-primary">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
