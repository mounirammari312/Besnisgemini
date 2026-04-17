import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Users, UserCheck, AlertTriangle, CreditCard, ShoppingCart, Award, Megaphone, Activity, Star, Database, CheckCircle2, Loader2, RefreshCcw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { seedInitialData } from '@/services/seedData';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const userStats = [
  { name: 'Active', value: 450 },
  { name: 'Inactive', value: 30 },
  { name: 'Pending', value: 20 },
];

const COLORS = ['#1B3A5C', '#E8A838', '#94a3b8'];

export function AdminOverview() {
  const [isSeeding, setIsSeeding] = React.useState(false);
  const { session } = useAuth();
  const [stats, setStats] = React.useState<any>(null);
  const [pendingRequests, setPendingRequests] = React.useState<any[]>([]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      });
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.error('Error fetching stats');
    }
  };

  const fetchPending = async () => {
    try {
       // Combine badges and ads for the overview
       const [badges, ads] = await Promise.all([
         supabase.from('badge_requests').select('*, suppliers(*)').eq('status', 'pending'),
         supabase.from('ad_requests').select('*, suppliers(*)').eq('status', 'pending'),
       ]);
       setPendingRequests([...(badges.data || []), ...(ads.data || [])]);
    } catch (e) {
      console.error('Error fetching pending');
    }
  };

  React.useEffect(() => {
    if (session) {
      fetchStats();
      fetchPending();
    }
  }, [session]);

  const handleAction = async (id: string, type: 'badge' | 'ad', status: 'approved' | 'rejected') => {
    try {
      const endpoint = type === 'badge' ? `/api/admin/badges/requests/${id}` : `/api/admin/ads/requests/${id}`;
      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success(status === 'approved' ? 'تم القبول' : 'تم الرفض');
        fetchPending();
        fetchStats();
      }
    } catch (e) {
      toast.error('Error processing request');
    }
  };

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await seedInitialData();
      toast.success('تم تهيئة البيانات بنجاح! Success!');
    } catch (error) {
      toast.error('حدث خطأ أثناء التهيئة Error seeding data');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Maintenance / Setup Card */}
      <Card className="rounded-2xl border-none shadow-md bg-primary text-white overflow-hidden">
        <div className="h-1 bg-secondary w-full" />
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3">
               <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Database className="h-6 w-6 text-secondary" />
                  </div>
                  <h2 className="text-2xl font-black font-heading uppercase italic tracking-tighter">
                    Platform Initialization & Setup
                  </h2>
               </div>
               <p className="text-white/60 max-w-xl font-medium">
                  Use the tools below to initialize your B2B marketplace with professional sample categories, 
                  verified suppliers, and industrial products. Recommended for first-time deployments.
               </p>
            </div>
            <Button 
              size="lg" 
              className="bg-secondary text-primary hover:bg-white h-16 font-black rounded-2xl px-10 gap-3 text-lg transition-all"
              onClick={handleSeed}
              disabled={isSeeding}
            >
              {isSeeding ? <Loader2 className="h-5 w-5 animate-spin" /> : <RefreshCcw className="h-5 w-5" />}
              {isSeeding ? 'جاري التهيئة...' : 'تهيئة بيانات المنصة SEED DATA'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="إجمالي المستخدمين" value={stats?.totalUsers || "..."} icon={<Users />} color="bg-blue-500" />
        <MetricCard title="الموردون النشطون" value={stats?.totalSuppliers || "..."} icon={<Award />} color="bg-secondary" />
        <MetricCard title="المنتجات" value={stats?.totalProducts || "..."} icon={<Database className="h-5 w-5" />} color="bg-amber-500" />
        <MetricCard title="طلبات الأسعار" value={stats?.totalQuotes || "..."} icon={<ShoppingCart />} color="bg-primary shadow-primary/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Global Config Panel */}
         <Card className="rounded-2xl border-none shadow-sm h-full">
            <CardHeader>
               <CardTitle className="font-heading font-bold flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  أسعار الصرف EXCHANGE RATES
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border">
                  <span className="font-bold text-sm">1 DZD = ? EUR</span>
                  <Input 
                    type="number" 
                    step="0.0001"
                    className="w-24 h-9 font-bold" 
                    defaultValue="0.0068" 
                    onChange={e => useAppStore.getState().setExchangeRate('EUR', parseFloat(e.target.value))}
                  />
               </div>
               <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border">
                  <span className="font-bold text-sm">1 DZD = ? USD</span>
                  <Input 
                    type="number" 
                    step="0.0001"
                    className="w-24 h-9 font-bold" 
                    defaultValue="0.0074" 
                    onChange={e => useAppStore.getState().setExchangeRate('USD', parseFloat(e.target.value))}
                  />
               </div>
               <p className="text-[10px] text-muted-foreground italic">* يتم تحديث هذه الأسعار لحظياً لكافة مستخدمي المنصة.</p>
            </CardContent>
         </Card>

         {/* Main Growth Chart */}
         <Card className="lg:col-span-2 rounded-2xl border-none shadow-sm">
           <CardHeader>
             <CardTitle className="font-heading font-bold flex items-center gap-2">
               <Activity className="h-5 w-5 text-primary" />
               نمو المنصة (شهرياً)
             </CardTitle>
           </CardHeader>
           <CardContent className="h-[350px]">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={stats?.growthChart || []}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                 <XAxis dataKey="month" axisLine={false} tickLine={false} />
                 <YAxis axisLine={false} tickLine={false} />
                 <Tooltip />
                 <Line type="monotone" dataKey="users" stroke="#1B3A5C" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                 <Line type="monotone" dataKey="suppliers" stroke="#E8A838" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
               </LineChart>
             </ResponsiveContainer>
           </CardContent>
         </Card>

         {/* Distribution */}
         <Card className="rounded-2xl border-none shadow-sm">
           <CardHeader>
             <CardTitle className="font-heading font-bold">توزع المستخدمين</CardTitle>
           </CardHeader>
           <CardContent className="h-[350px] flex flex-col items-center justify-center">
             <ResponsiveContainer width="100%" height="250px">
               <PieChart>
                 <Pie
                   data={userStats}
                   innerRadius={60}
                   outerRadius={80}
                   paddingAngle={5}
                   dataKey="value"
                 >
                   {userStats.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <Tooltip />
               </PieChart>
             </ResponsiveContainer>
             <div className="w-full space-y-2 mt-4">
                {userStats.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-bold">{item.value}</span>
                  </div>
                ))}
             </div>
           </CardContent>
         </Card>
      </div>

      {/* Pending Requests Table */}
      <Card className="rounded-2xl border-none shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading font-bold">طلبات شارات وإعلانات معلقة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
             {pendingRequests.length === 0 && (
               <div className="text-center py-8 text-muted-foreground italic">لا توجد طلبات معلقة حالياً No pending requests.</div>
             )}
             {pendingRequests.map(req => (
               <div key={req.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-transparent hover:border-primary/10 transition-all">
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center border">
                        {req.badge_type_id ? <Award className="h-6 w-6 text-amber-500" /> : <Megaphone className="h-6 w-6 text-primary" />}
                     </div>
                     <div>
                        <p className="font-bold">
                          {req.badge_type_id ? `طلب شارة "${req.badge_type_id}"` : `طلب إعلان "${req.ad_type_id}"`}
                        </p>
                        <p className="text-xs text-muted-foreground">من: {req.suppliers?.company_name || req.suppliers?.name}</p>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-green-600 border-green-200 bg-green-50 hover:bg-green-100"
                      onClick={() => handleAction(req.id, req.badge_type_id ? 'badge' : 'ad', 'approved')}
                     >
                       قبول Approve
                     </Button>
                     <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 border-red-200 bg-red-50 hover:bg-red-100"
                      onClick={() => handleAction(req.id, req.badge_type_id ? 'badge' : 'ad', 'rejected')}
                     >
                       رفض Reject
                     </Button>
                  </div>
               </div>
             ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ title, value, icon, color }: any) {
  return (
    <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
           <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium">{title}</p>
              <p className="text-3xl font-black font-heading text-primary">{value}</p>
           </div>
           <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-lg", color)}>
              {React.cloneElement(icon as React.ReactElement, { className: "h-6 w-6" })}
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
