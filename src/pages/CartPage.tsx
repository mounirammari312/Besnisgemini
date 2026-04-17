import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { translations } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Trash2, ArrowRight, Minus, Plus, CreditCard } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Link } from 'react-router-dom';

export function CartPage() {
  const { language } = useAppStore();
  const t = translations[language];

  // Mock items
  const [items, setItems] = React.useState([
    { id: '1', name: 'آلة طحن صناعية X200', price: 450000, quantity: 1, image: 'https://picsum.photos/seed/tool1/200/200' },
    { id: '2', name: 'مثقاب صناعي بوش', price: 35000, quantity: 2, image: 'https://picsum.photos/seed/tool2/200/200' },
  ]);

  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-heading text-4xl font-black text-primary mb-12 uppercase">سلة المشتريات SHOPPING CART</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-6">
           {items.length > 0 ? (
             items.map(item => (
               <div key={item.id} className="bg-white p-6 rounded-3xl border shadow-sm flex flex-col sm:flex-row items-center gap-6">
                  <img src={item.image} className="h-24 w-24 rounded-2xl object-cover border" />
                  <div className="flex-1 text-center sm:text-right">
                     <h3 className="font-bold text-lg">{item.name}</h3>
                     <p className="text-secondary font-black">{formatCurrency(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-4 bg-muted/50 rounded-full px-4 py-2">
                     <button className="text-primary hover:text-secondary disabled:opacity-20" disabled={item.quantity <= 1}>
                        <Minus className="h-4 w-4" />
                     </button>
                     <span className="font-bold w-4 text-center">{item.quantity}</span>
                     <button className="text-primary hover:text-secondary">
                        <Plus className="h-4 w-4" />
                     </button>
                  </div>
                  <div className="text-center sm:text-left min-w-[120px]">
                     <p className="font-black text-primary text-xl">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 hover:bg-red-50">
                    <Trash2 className="h-5 w-5" />
                  </Button>
               </div>
             ))
           ) : (
             <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground font-bold">السلة فارغة حالياً</p>
                <Link to="/search">
                  <Button className="mt-4 rounded-full px-8">ابدأ التسوق</Button>
                </Link>
             </div>
           )}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
           <div className="bg-primary text-white p-8 rounded-3xl shadow-xl space-y-8 sticky top-32">
              <h2 className="font-heading text-2xl font-black border-b border-white/10 pb-4">ملخص الطلب</h2>
              <div className="space-y-4">
                 <div className="flex justify-between items-center opacity-70">
                    <span>المجموع الفرعي</span>
                    <span className="font-bold">{formatCurrency(total)}</span>
                 </div>
                 <div className="flex justify-between items-center opacity-70">
                    <span>الضريبة (تقديرية)</span>
                    <span className="font-bold">0 د.ج</span>
                 </div>
                 <div className="h-[1px] bg-white/10" />
                 <div className="flex justify-between items-center text-xl font-black">
                    <span>الإجمالي</span>
                    <span className="text-secondary">{formatCurrency(total)}</span>
                 </div>
              </div>
              <Button className="w-full h-14 bg-secondary text-primary font-black text-lg hover:bg-white transition-all rounded-xl gap-2 shadow-lg shadow-black/20">
                <CreditCard className="h-5 w-5" />
                إتمام الطلب CHECKOUT
              </Button>
              <p className="text-[10px] text-center opacity-50 font-bold uppercase tracking-widest">جميع الأسعار تشمل رسوم المنصة</p>
           </div>
        </div>
      </div>
    </div>
  );
}
