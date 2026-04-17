import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { translations } from '@/lib/translations';
import { formatCurrency, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, ShieldCheck, Mail, MessageSquare, Share2, Heart, Award, Truck, Info, ChevronRight, ChevronLeft, Building2 } from 'lucide-react';
import { BadgeIcon } from '@/components/features/ProductCard';
import { motion } from 'framer-motion';

export function ProductDetailsPage() {
  const { id } = useParams();
  const { language } = useAppStore();
  const t = translations[language];
  
  // Mock data for now
  const product = {
    id,
    name_ar: 'آلة طحن صناعية عالية الدقة - موديل X200',
    name_fr: 'Fraiseuse industrielle haute précision - Modèle X200',
    description_ar: 'آلة طحن متطورة مخصصة لخطوط الإنتاج الكبيرة بمواصفات عالمية وضمان لمدة سنتين.',
    description_fr: 'Machine de fraisage avancée conçue pour les grandes lignes de production avec des spécifications internationales et une garantie de deux ans.',
    price: 450000,
    images: [
      'https://picsum.photos/seed/tool1/800/800',
      'https://picsum.photos/seed/tool2/800/800',
      'https://picsum.photos/seed/tool3/800/800'
    ],
    rating: 4.8,
    reviews_count: 56,
    stock: 12,
    min_order: 1,
    supplier: {
      id: 's1',
      name: 'شركة الجزائر للمعدات الثقيلة',
      rating: 4.9,
      is_verified: true,
      joined: '2021',
      location: 'الجزائر العاصمة',
      badges: ['verified', 'premium', 'quality']
    },
    specs: [
      { key_ar: 'القوة', key_fr: 'Puissance', value: '2500W' },
      { key_ar: 'الوزن', key_fr: 'Poids', value: '120kg' },
      { key_ar: 'الأبعاد', key_fr: 'Dimensions', value: '120x80x150cm' },
    ]
  };

  const [activeImg, setActiveImg] = React.useState(0);

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-white rounded-3xl overflow-hidden border shadow-sm relative">
             <img src={product.images[activeImg]} className="w-full h-full object-cover" />
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {product.images.map((_, i) => (
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
             {product.images.map((img, i) => (
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
             <Button size="lg" className="h-14 font-bold text-lg rounded-xl flex-1 gap-2">
               <MessageSquare className="h-5 w-5" />
               {language === 'ar' ? 'طلب عرض سعر' : 'Demander un devis'}
             </Button>
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
