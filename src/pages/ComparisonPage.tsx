import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Check, ArrowRight, Minus, Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { BadgeIcon } from '@/components/features/ProductCard';

export function ComparisonPage() {
  const { language } = useAppStore();

  const products = [
    { 
      id: '1', 
      name: 'آلة طحن X200', 
      price: 450000, 
      supplier: 'شركة الجزائر للمعدات',
      rating: 4.8,
      min_order: 1,
      delivery: '3-5 أيام',
      badges: ['verified', 'premium'],
      specs: { power: '2500W', weight: '120kg', warranty: 'سنتين' }
    },
    { 
      id: '2', 
      name: 'طاحونة بروسيف 5', 
      price: 380000, 
      supplier: 'الأمل للصناعة',
      rating: 4.5,
      min_order: 2,
      delivery: '5-7 أيام',
      badges: ['verified'],
      specs: { power: '2200W', weight: '110kg', warranty: 'سنة واحدة' }
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-heading text-4xl font-black text-primary mb-12 uppercase">مقارنة المنتجات PRODUCT COMPARISON</h1>

      <div className="bg-white rounded-3xl border shadow-xl overflow-x-auto">
        <table className="w-full min-w-[800px]">
           <thead>
              <tr>
                 <th className="p-8 border-b bg-muted/30 text-right w-1/4">المواصفات</th>
                 {products.map(p => (
                   <th key={p.id} className="p-8 border-b border-r bg-white w-1/4 text-center">
                      <div className="relative inline-block group">
                        <img src={`https://picsum.photos/seed/${p.id}/200/200`} className="h-40 w-40 rounded-2xl mx-auto mb-4 border" />
                        <button className="absolute -top-2 -right-2 bg-red-100 text-red-500 rounded-full h-8 w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border border-red-200">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <h3 className="font-bold text-lg mb-1">{p.name}</h3>
                      <p className="text-primary font-black text-xl">{formatCurrency(p.price)}</p>
                      <Button size="sm" className="mt-4 rounded-full w-full">طلب سعر</Button>
                   </th>
                 ))}
                 <th className="p-8 border-b border-r bg-muted/10 w-1/4">
                    <div className="h-40 w-40 rounded-2xl border-2 border-dashed mx-auto flex flex-col items-center justify-center text-muted-foreground gap-2">
                       <Plus className="h-8 w-8" />
                       <span className="text-xs font-bold">إضافة للمقارنة</span>
                    </div>
                 </th>
              </tr>
           </thead>
           <tbody>
              <CompRow label="المورد" values={products.map((p, idx) => (
                <div key={idx} className="space-y-1">
                   <p className="font-bold">{p.supplier}</p>
                   <div className="flex justify-center gap-1">
                      {p.badges.map((b, bIdx) => <BadgeIcon key={bIdx} type={b} className="scale-50" />)}
                   </div>
                </div>
              ))} />
              <CompRow label="التقييم" values={products.map(p => <span className="font-bold text-yellow-500">{p.rating}/5</span>)} />
              <CompRow label="أقل كمية طلب" values={products.map(p => <span className="font-bold">{p.min_order} وحدة</span>)} />
              <CompRow label="وقت التوصيل" values={products.map(p => <span className="text-muted-foreground font-medium">{p.delivery}</span>)} />
              <CompRow label="القوة (W)" values={products.map(p => <span className="font-mono font-bold">{p.specs.power}</span>)} />
              <CompRow label="الوزن" values={products.map(p => <span className="font-medium">{p.specs.weight}</span>)} />
              <CompRow label="الضمان" values={products.map(p => <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-0">{p.specs.warranty}</Badge>)} />
           </tbody>
        </table>
      </div>
    </div>
  );
}

function CompRow({ label, values }: { label: string, values: React.ReactNode[] }) {
  return (
    <tr className="hover:bg-muted/5 transition-colors">
       <td className="p-6 border-b font-bold text-muted-foreground bg-muted/10">{label}</td>
       {values.map((v, i) => (
         <td key={i} className="p-6 border-b border-r text-center">{v}</td>
       ))}
       <td className="p-6 border-b border-r bg-muted/5" />
    </tr>
  );
}
