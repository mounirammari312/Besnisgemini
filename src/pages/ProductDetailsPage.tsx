import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { translations } from '@/lib/translations';
import { formatCurrency, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, ShieldCheck, Mail, MessageSquare, Share2, Heart, Award, Truck, Info, ChevronRight, ChevronLeft, Building2, Loader2 } from 'lucide-react';
import { BadgeIcon } from '@/components/features/ProductCard';
import { motion } from 'framer-motion';
import { useSupabaseQuery } from '@/hooks/useSupabase';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

export function ProductDetailsPage() {
  const { id } = useParams();
  const { language } = useAppStore();
  const { profile, session } = useAuth();
  const t = translations[language];
  
  const { data: products, loading } = useSupabaseQuery<any>('products', (q) => q.eq('id', id).single(), [id]);
  const product = products?.[0];

  const [activeImg, setActiveImg] = React.useState(0);
  const [isQuoting, setIsQuoting] = React.useState(false);
  const [quoteQty, setQuoteQty] = React.useState(1);
  const [quoteMsg, setQuoteMsg] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleRequestQuote = async () => {
    if (!session) {
      toast.error(language === 'ar' ? 'يرجى تسجيل الدخول أولاً' : 'Veuillez vous connecter d\'abord');
      return;
    }

    setIsQuoting(true);
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          product_id: product.id,
          supplier_id: product.supplier_id,
          quantity: quoteQty,
          message: quoteMsg,
        }),
      });

      if (!response.ok) throw new Error('Failed to send quote');

      toast.success(language === 'ar' ? 'تم إرسال طلب عرض السعر بنجاح!' : 'Devis envoyé avec succès !');
      setIsModalOpen(false);
    } catch (error) {
      toast.error(language === 'ar' ? 'حدث خطأ أثناء إرسال الطلب' : 'Erreur lors de l\'envoi');
    } finally {
      setIsQuoting(false);
    }
  };

  if (loading) return <PageSkeleton />;
  if (!product) return <div className="container mx-auto px-4 py-20 text-center">Product not found</div>;

  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.main_image];

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-white rounded-3xl overflow-hidden border shadow-sm relative cursor-zoom-in group">
             <motion.img 
              whileHover={{ scale: 1.5 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              src={images[activeImg]} 
              className="w-full h-full object-contain origin-center" 
             />
             <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveImg(i)}
                    className={cn(
                      "w-3 h-3 rounded-full transition-all",
                      activeImg === i ? "bg-primary w-8" : "bg-primary/20"
                    )}
                  />
                ))}
             </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
             {images.map((img, i) => (
               <button 
                key={i} 
                onClick={() => setActiveImg(i)}
                className={cn(
                  "aspect-square rounded-xl overflow-hidden border-2 transition-all",
                  activeImg === i ? "border-secondary" : "border-transparent opacity-60"
                )}
               >
                 <img src={img} className="w-full h-full object-cover" />
               </button>
             ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-600 border-0">متوفر في المخزون</Badge>
              <Badge variant="outline">{language === 'ar' ? 'أقل طلبية: ' : 'Min. commande: '}{product.min_order}</Badge>
            </div>
            <h1 className="font-heading text-4xl font-black text-primary leading-tight uppercase tracking-tight">
              {language === 'ar' ? product.name_ar : product.name_fr}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="flex text-yellow-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn("h-4 w-4 fill-current", i >= Math.floor(product.rating) && "text-gray-300 fill-none")} />
                  ))}
                </div>
                <span className="font-bold">{product.rating}</span>
                <span className="text-muted-foreground">({product.reviews_count} {language === 'ar' ? 'تقييم' : 'avis'})</span>
              </div>
              <div className="h-4 w-[1px] bg-border" />
              <button className="flex items-center gap-1 text-sm font-medium hover:text-secondary transition-colors">
                <Share2 className="h-4 w-4" /> {language === 'ar' ? 'مشاركة' : 'Partager'}
              </button>
            </div>
          </div>

          <div className="p-6 bg-muted/50 rounded-2xl border flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{language === 'ar' ? 'السعر التقديري' : 'Prix estimé'}</p>
              <p className="font-heading text-4xl font-black text-primary">{formatCurrency(product.price)}</p>
            </div>
            <Button size="icon" variant="outline" className="rounded-full h-12 w-12 border-primary/20">
              <Heart className="h-6 w-6" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="h-14 font-bold text-lg rounded-xl flex-1 gap-2">
                    <MessageSquare className="h-5 w-5" />
                    {language === 'ar' ? 'طلب عرض سعر' : 'Demander un devis'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-3xl max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-black font-heading text-primary">
                      {language === 'ar' ? 'طلب عرض سعر جديد' : 'Nouveau devis'}
                    </DialogTitle>
                    <DialogDescription className="font-medium text-muted-foreground">
                      {language === 'ar' ? 'أرسل طلباً مباشراً للمورد للحصول على أفضل سعر.' : 'Envoyez une demande directe au fournisseur.'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">{language === 'ar' ? 'الكمية المطلوبة' : 'Quantité souhaitée'}</label>
                      <Input 
                        type="number" 
                        min={product.min_order || 1} 
                        value={quoteQty} 
                        onChange={(e) => setQuoteQty(parseInt(e.target.value))}
                        className="h-12 rounded-xl border-2 font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">{language === 'ar' ? 'ملاحظات إضافية' : 'Notes supplémentaires'}</label>
                      <Textarea 
                        placeholder={language === 'ar' ? 'اكتب تفاصيل إضافية هنا...' : 'Écrivez des détails ici...'}
                        value={quoteMsg}
                        onChange={(e) => setQuoteMsg(e.target.value)}
                        className="min-h-[120px] rounded-xl border-2 font-medium"
                      />
                    </div>
                  </div>
                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12 font-bold px-8">
                       {language === 'ar' ? 'إلغاء' : 'Annuler'}
                    </Button>
                    <Button onClick={handleRequestQuote} disabled={isQuoting} className="rounded-xl h-12 font-black px-12 gap-2">
                       {isQuoting && <Loader2 className="h-4 w-4 animate-spin" />}
                       {language === 'ar' ? 'إرسال الطلب' : 'Envoyer la demande'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
             </Dialog>

             <Button size="lg" variant="secondary" className="h-14 font-bold text-lg rounded-xl flex-1 gap-2">
               <Mail className="h-5 w-5" />
               {language === 'ar' ? 'تواصل مع المورد' : 'Contacter le fournisseur'}
             </Button>
          </div>

          {/* Supplier Mini Card */}
          <div className="p-6 rounded-2xl border border-secondary/20 bg-secondary/5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                {language === 'ar' ? 'معلومات المورد' : 'Infos Fournisseur'}
              </h3>
              <a href="/supplier/s1" className="text-sm font-bold text-primary hover:underline">زيارة المتجر</a>
            </div>
            <div className="flex items-center gap-4">
               <div className="h-16 w-16 rounded-xl bg-white border flex items-center justify-center p-2">
                  <img src="https://picsum.photos/seed/logo/100/100" className="max-w-full max-h-full object-contain" />
               </div>
               <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold">{product.supplier.name}</p>
                    <BadgeIcon type="verified" className="scale-75" />
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Award className="h-3 w-3" /> موثوق منذ {product.supplier.joined}</span>
                    <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> {product.supplier.location}</span>
                  </div>
               </div>
            </div>
            <div className="flex gap-2">
               {product.supplier.badges.map(b => <BadgeIcon key={b} type={b} className="scale-75" />)}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs / Detailed Info */}
      <div className="bg-white rounded-3xl border shadow-sm mt-12 overflow-hidden">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="flex w-full justify-start h-16 bg-muted/30 border-b rounded-none px-6 gap-8">
            <TabsTrigger value="details" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0 font-bold">
              {language === 'ar' ? 'تفاصيل المنتج' : 'Détails du produit'}
            </TabsTrigger>
            <TabsTrigger value="specs" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0 font-bold">
              {language === 'ar' ? 'المواصفات الفنية' : 'Spécifications'}
            </TabsTrigger>
            <TabsTrigger value="shipping" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0 font-bold">
              {language === 'ar' ? 'الشحن والتسليم' : 'Livraison'}
            </TabsTrigger>
          </TabsList>
          <div className="p-8">
            <TabsContent value="details" className="mt-0">
               <p className="text-muted-foreground leading-loose text-lg">
                  {language === 'ar' ? product.description_ar : product.description_fr}
               </p>
            </TabsContent>
            <TabsContent value="specs" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.specs.map((spec, i) => (
                  <div key={i} className="flex justify-between p-4 border-b last:border-0">
                    <span className="text-muted-foreground font-medium">{language === 'ar' ? spec.key_ar : spec.key_fr}</span>
                    <span className="font-bold">{spec.value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="shipping" className="mt-0">
               <div className="flex items-start gap-4 p-6 bg-blue-50 rounded-2xl">
                  <Truck className="h-6 w-6 text-primary shrink-0" />
                  <div className="space-y-1">
                    <p className="font-bold">{language === 'ar' ? 'معلومات الشحن' : 'Informations de livraison'}</p>
                    <p className="text-sm text-muted-foreground">التسليم متاح لجميع الولايات الجزائرية خلال 3-5 أيام عمل. يتم تحديد تكلفة الشحن بناءً على الموقع والكمية.</p>
                  </div>
               </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
