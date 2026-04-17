import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';
import { formatCurrency, cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowRight, ArrowLeft, Send, Package, Store, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RequestQuotePage() {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const { language } = useAppStore();
  const [product, setProduct] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [quantity, setQuantity] = React.useState(1);
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*, suppliers(*)').eq('id', productId).single();
        if (error) throw error;
        setProduct(data);
      } catch (e) {
        toast.error('Error loading product');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    if (productId) fetchProduct();
  }, [productId, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) { navigate('/auth'); return; }
    setSubmitting(true);
    try {
      const { error } = await supabase.from('quotes').insert([{
        buyer_id: user?.id,
        supplier_id: product.supplier_id,
        product_id: product.id,
        quantity,
        message,
        status: 'pending'
      }]);
      if (error) throw error;
      setIsSuccess(true);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (isSuccess) return (
    <div className="max-w-md mx-auto py-20 text-center space-y-6">
      <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto" />
      <h1 className="text-2xl font-black uppercase">تم الإرسال بنجاح SENT!</h1>
      <Button className="w-full bg-primary" onClick={() => navigate('/')}>العودة للرئيسية</Button>
    </div>
  );

  return (
    <div className={cn("max-w-4xl mx-auto py-8 px-4", language === 'ar' ? "text-right" : "text-left")}>
      <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate(-1)}>
        {language === 'ar' ? <ArrowRight /> : <ArrowLeft />} العودة
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="rounded-2xl overflow-hidden border-none shadow-sm">
          <img src={product.main_image} className="w-full aspect-square object-cover" />
          <CardContent className="p-6">
            <h2 className="text-xl font-bold">{language === 'ar' ? product.name_ar : product.name_fr}</h2>
            <p className="text-2xl font-black text-secondary mt-2">{formatCurrency(product.price)}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl p-8 border-none shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-primary/60">الكمية QUANTITY</label>
              <Input type="number" min="1" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} className="h-12 rounded-xl border-2" required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-primary/60">التفاصيل MESSAGE</label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-[150px] rounded-xl border-2" required />
            </div>
            <Button type="submit" className="w-full h-14 bg-primary text-white font-black text-lg" disabled={submitting}>
              {submitting ? <Loader2 className="animate-spin" /> : <Send className="mr-2 h-5 w-5" />} إرسال الطلب
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
