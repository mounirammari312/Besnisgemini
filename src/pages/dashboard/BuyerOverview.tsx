import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Heart, MessageSquare, Clock, ArrowRight, Package, CreditCard, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/features/ProductCard';
import { useAppStore } from '@/store/useAppStore';

export function BuyerOverview() {
  const { language } = useAppStore();
  
  return (
    <div className="space-y-12">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashCard title="طلباتي" value="12" icon={<Package />} sub="3 في الطريق" />
        <DashCard title="عروض الأسعار" value="5" icon={<MessageSquare />} sub="2 ردود جديدة" />
        <DashCard title="المفضلة" value="48" icon={<Heart />} sub="زادت بـ 5 هذا الشهر" />
        <DashCard title="الميزانية والمصروفات" value="250k" icon={<CreditCard />} sub="د.ج" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Recent Orders */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl font-black text-primary uppercase tracking-tight">آخر الطلبات RECENT ORDERS</h2>
              <Button variant="ghost" className="gap-2">كل الطلبات <ArrowRight className="h-4 w-4" /></Button>
           </div>
           
           <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-6 group hover:shadow-md transition-all">
                   <div className="h-20 w-20 rounded-xl bg-muted overflow-hidden">
                      <img src={`https://picsum.photos/seed/tool${i}/100/100`} className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-1 space-y-1">
                      <p className="font-bold text-lg group-hover:text-primary transition-colors">آلة طحن صناعية X200</p>
                      <p className="text-sm text-muted-foreground">مورد: شركة الجزائر للمعدات</p>
                      <div className="flex items-center gap-4 pt-2">
                         <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded uppercase">Processing</span>
                         <span className="text-xs text-muted-foreground">15 مارس 2026</span>
                      </div>
                   </div>
                   <div className="text-left">
                      <p className="font-black text-primary text-xl">120,000 د.ج</p>
                      <Button variant="outline" size="sm" className="mt-2 text-xs">التفاصيل</Button>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Recommended for you */}
        <aside className="space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl font-black text-primary uppercase tracking-tight">ربما يعجبك RECOMMENDED</h2>
           </div>
           
           <div className="space-y-4">
              {[3, 4].map(i => (
                <div key={i} className="bg-white p-4 rounded-2xl border flex items-center gap-4 hover:border-secondary transition-all">
                   <img src={`https://picsum.photos/seed/item${i}/60/60`} className="h-16 w-16 rounded-lg object-cover" />
                   <div className="flex-1">
                      <p className="font-bold text-sm line-clamp-1">لوحة تحكم إلكترونية عالية الجودة</p>
                      <p className="text-primary font-black">15,000 د.ج</p>
                   </div>
                </div>
              ))}
           </div>

           <Card className="bg-primary text-white p-6 rounded-3xl overflow-hidden relative">
              <Star className="absolute -bottom-4 -right-4 h-24 w-24 text-white/10 rotate-12" />
              <div className="relative z-10 space-y-4 text-center">
                 <p className="text-xs uppercase tracking-widest font-bold opacity-70">عروض خاصة</p>
                 <h3 className="text-2xl font-black font-heading leading-tight">وفر حتى 20% على أول طلب عروض أسعار اليوم!</h3>
                 <Button className="w-full bg-secondary text-primary font-bold hover:bg-white transition-colors">استكشف الآن</Button>
              </div>
           </Card>
        </aside>
      </div>
    </div>
  );
}

function DashCard({ title, value, icon, sub }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4 hover:shadow-lg hover:-translate-y-1 transition-all group">
       <div className="h-12 w-12 rounded-xl bg-muted group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center text-primary">
          {React.cloneElement(icon, { className: "h-6 w-6" })}
       </div>
       <div>
          <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{title}</p>
          <p className="text-3xl font-black font-heading text-primary mt-1">{value}</p>
          <p className="text-xs text-secondary font-bold mt-1">{sub}</p>
       </div>
    </div>
  );
}
