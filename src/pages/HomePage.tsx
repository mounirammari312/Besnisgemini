import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { translations } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/features/ProductCard';
import { motion } from 'framer-motion';
import { ArrowRight, Boxes, Users, ShieldCheck, LucideIcon, HardHat, Zap, Sprout, Cpu, Scissors, Utensils, Car, Stethoscope, Briefcase, TestTube2, AlertCircle } from 'lucide-react';
import { SEO } from '@/components/seo/SEO';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { CATEGORIES, Category } from '@/constants/categories';
import { Product } from '@/components/features/ProductCard';
import { useFirestoreCollection } from '@/hooks/useFirestore';
import { PageSkeleton } from '@/components/ui/PageSkeleton';

const ICON_MAP: Record<string, LucideIcon> = {
  Boxes, HardHat, Zap, Sprout, Cpu, Scissors, Utensils, Car, Stethoscope, Briefcase, TestTube2
};

const SEED_PRODUCTS: Product[] = [
  { id: '1', name_ar: 'آلة طحن صناعية عالية الدقة', name_fr: 'Fraiseuse industrielle haute précision', price: 450000, image: 'https://picsum.photos/seed/tool/400/400', rating: 4, reviews_count: 24, supplier_id: 's1', is_verified: true },
  { id: '2', name_ar: 'زيت زيتون بكر ممتاز 5 لتر', name_fr: 'Huile d\'olive vierge extra 5L', price: 6500, image: 'https://picsum.photos/seed/olive/400/400', rating: 5, reviews_count: 156, supplier_id: 's2', is_verified: true },
  { id: '3', name_ar: 'ألواح شمسية 450 واط', name_fr: 'Panneaux solaires 450W', price: 28000, image: 'https://picsum.photos/seed/solar/400/400', rating: 5, reviews_count: 89, supplier_id: 's3', is_verified: false },
  { id: '4', name_ar: 'كراتين شحن مقواة (100 قطعة)', name_fr: 'Cartons d\'expédition renforcés (100 pcs)', price: 12000, image: 'https://picsum.photos/seed/box/400/400', rating: 3, reviews_count: 12, supplier_id: 's4', is_verified: false },
];

export function HomePage() {
  const { language } = useAppStore();
  const t = translations[language];
  const { data: dbProducts, loading } = useFirestoreCollection<Product>('products');

  const products = dbProducts.length > 0 ? dbProducts : SEED_PRODUCTS;

  if (loading && dbProducts.length === 0) return <PageSkeleton />;

  return (
    <div className="space-y-16 pb-20">
      <SEO />
      
      {/* Hero Section */}
      <section className="relative h-[650px] overflow-hidden bg-primary text-white flex items-center">
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src="https://picsum.photos/seed/business/1920/1080?blur=4" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl space-y-8"
          >
            <Badge className="bg-secondary text-primary font-black px-4 py-1 rounded-full uppercase tracking-widest text-[10px] animate-pulse">
                أكبر منصة B2B في الجزائر
             </Badge>
            <h1 className="font-heading text-6xl md:text-8xl font-black leading-tight tracking-tighter italic uppercase">
              {language === 'ar' ? 'نمي تجارتك' : 'BOOST YOUR'} <br/>
              <span className="text-secondary drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
                {language === 'ar' ? 'بذكاء واحترافية' : 'BUSINESS TODAY'}
              </span>
            </h1>
            <p className="text-xl text-white/80 max-w-xl leading-relaxed font-medium">
               ربط مباشر بين كبار الموردين والشركات لتعزيز نمو الاقتصاد الوطني وتسهيل حركة التجارة بالجملة.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" className="bg-secondary text-primary hover:bg-white text-xl px-10 h-16 rounded-2xl font-black shadow-xl shadow-black/20 transition-all">
                ابدأ رحلتك كمشترٍ
                <ArrowRight className={language === 'ar' ? 'mr-2 rotate-180' : 'ml-2'} />
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-xl px-10 h-16 rounded-2xl font-black">
                سجل كمورد
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Modern Grid */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-4">
           <h2 className="text-4xl font-heading font-black text-primary uppercase tracking-tighter italic">اكتشف حسب الأصناف EXPLORE</h2>
           <p className="text-muted-foreground font-medium">تصفح آلاف المنتجات الموزعة على أفضل التصنيفات الصناعية والتجارية</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11 gap-4">
           {CATEGORIES.map((cat) => {
             const Icon = ICON_MAP[cat.icon] || Boxes;
             return (
               <Link 
                key={cat.id} 
                to={`/search?category=${cat.id}`}
                className="group flex flex-col items-center p-6 rounded-3xl bg-white border border-transparent shadow-sm hover:border-secondary hover:shadow-xl hover:-translate-y-2 transition-all text-center"
               >
                  <div className="h-14 w-14 rounded-2xl bg-muted group-hover:bg-primary group-hover:text-white flex items-center justify-center text-primary transition-all mb-4 shadow-sm">
                     <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-tighter leading-tight group-hover:text-primary transition-colors">
                    {language === 'ar' ? cat.name_ar : cat.name_fr}
                  </span>
               </Link>
             );
           })}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 space-y-8">
        <div className="flex items-center justify-between border-b-4 border-primary/10 pb-4">
          <h2 className="font-heading text-3xl font-black text-primary uppercase tracking-tight">منتجات مختارة <span className="text-secondary">PRODUITS</span></h2>
          <Button variant="link" className="text-primary font-black">مشاهدة كل المنتجات <ArrowRight className={language === 'ar' ? 'rotate-180 mr-2' : 'ml-2'} /></Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} language={language} />
          ))}
        </div>
      </section>

      {/* Why Businfo */}
      <section className="bg-primary py-24 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-secondary" />
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            <div className="space-y-6">
              <div className="h-24 w-24 bg-white/5 rounded-3xl flex items-center justify-center text-secondary mx-auto border border-white/10 group hover:bg-secondary group-hover:text-primary transition-all rotate-3">
                <ShieldCheck className="h-12 w-12" />
              </div>
              <h3 className="text-2xl font-black font-heading tracking-tighter">أمان وثقة 100%</h3>
              <p className="text-white/60 text-sm leading-relaxed font-medium">نقوم بالتحقق من هوية ومصداقية كل مورد في المنصة لضمان بيئة تجارية آمنة لجميع الأطراف.</p>
            </div>
            <div className="space-y-6">
              <div className="h-24 w-24 bg-white/5 rounded-3xl flex items-center justify-center text-secondary mx-auto border border-white/10 group hover:bg-secondary group-hover:text-primary transition-all -rotate-3">
                <Boxes className="h-12 w-12" />
              </div>
              <h3 className="text-2xl font-black font-heading tracking-tighter">تنوع صناعي واسع</h3>
              <p className="text-white/60 text-sm leading-relaxed font-medium">أكثر من 11 تصنيفاً رئيسياً وأكثر من 33 تصنيفاً فرعياً تغطي كافة احتياجات السوق الجزائري.</p>
            </div>
            <div className="space-y-6">
              <div className="h-24 w-24 bg-white/5 rounded-3xl flex items-center justify-center text-secondary mx-auto border border-white/10 group hover:bg-secondary group-hover:text-primary transition-all rotate-6">
                <Users className="h-12 w-12" />
              </div>
              <h3 className="text-2xl font-black font-heading tracking-tighter">تواصل مباشر وسريع</h3>
              <p className="text-white/60 text-sm leading-relaxed font-medium">نظام مراسلة ذكي يربطك مباشرة بالمورد لطلب عروض الأسعار والتفاوض الفوري.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
