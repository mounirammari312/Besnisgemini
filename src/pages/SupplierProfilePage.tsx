import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { translations } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard, BadgeIcon } from '@/components/features/ProductCard';
import { MessageSquare, MapPin, Globe, Calendar, Users, Award, Star, Mail, Phone, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

export function SupplierProfilePage() {
  const { id } = useParams();
  const { language } = useAppStore();
  const t = translations[language];

  // Mock data
  const supplier = {
    id: id,
    name: 'شركة الجزائر للمعدات الثقيلة',
    description_ar: 'نحن شركة رائدة في استيراد وتوزيع المعدات الصناعية الثقيلة في الجزائر منذ عام 2010. نوفر حلولاً شاملة للمصانع وشركات البناء.',
    description_fr: 'Nous sommes un leader de l\'importation et de la distribution d\'équipements industriels lourds en Algérie depuis 2010. Nous fournissons des solutions complètes.',
    logo: 'https://picsum.photos/seed/logo/200/200',
    cover: 'https://picsum.photos/seed/cover/1200/400',
    location: 'الجزائر العاصمة، المنطقة الصناعية رويبة',
    rating: 4.8,
    reviews: 128,
    joined: '2021',
    employees: '50-100',
    active_products: 45,
    badges: ['verified', 'premium', 'quality', 'top_seller'],
    gallery: [
      'https://picsum.photos/seed/fac1/400/300',
      'https://picsum.photos/seed/fac2/400/300',
      'https://picsum.photos/seed/fac3/400/300',
    ]
  };

  const SEED_PRODUCTS = [
    { id: '1', name_ar: 'طاحونة صناعية', name_fr: 'Fraiseuse', price: 450000, image: 'https://picsum.photos/seed/tool1/400/400', rating: 4, reviews_count: 24, supplier_id: 's1', is_verified: true },
    { id: '2', name_ar: 'مثقاب صناعي', name_fr: 'Perceuse industrielle', price: 35000, image: 'https://picsum.photos/seed/tool2/400/400', rating: 5, reviews_count: 42, supplier_id: 's1', is_verified: true },
  ];

  return (
    <div className="pb-20">
      {/* Cover */}
      <div className="h-[300px] md:h-[400px] relative overflow-hidden bg-muted">
        <img src={supplier.cover} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Header Info */}
      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl p-8 border">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="h-40 w-40 rounded-3xl bg-white border p-4 shadow-sm shrink-0 flex items-center justify-center">
               <img src={supplier.logo} className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex-1 space-y-4">
               <div className="flex flex-wrap items-center gap-3">
                 <h1 className="font-heading text-3xl font-black text-primary uppercase">{supplier.name}</h1>
                 <div className="flex gap-1">
                    {supplier.badges.map(b => <BadgeIcon key={b} type={b} className="scale-75" />)}
                 </div>
               </div>
               <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {supplier.location}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> عضو منذ {supplier.joined}</span>
                  <span className="flex items-center gap-1 text-yellow-500 font-bold"><Star className="h-4 w-4 fill-current" /> {supplier.rating} ({supplier.reviews} تقييم)</span>
               </div>
               <div className="flex flex-wrap gap-4 pt-2">
                 <Button className="font-bold rounded-xl gap-2">
                   <MessageSquare className="h-4 w-4" />
                   {language === 'ar' ? 'مراسلة المورد' : 'Contacter'}
                 </Button>
                 <Button variant="outline" className="font-bold rounded-xl gap-2">
                   <Phone className="h-4 w-4" />
                   {language === 'ar' ? 'عرض الهاتف' : 'Voir téléphone'}
                 </Button>
               </div>
            </div>
            <div className="hidden lg:grid grid-cols-3 gap-8 text-center border-l pl-8">
               <div>
                 <p className="text-2xl font-black font-heading text-primary">{supplier.active_products}</p>
                 <p className="text-xs text-muted-foreground uppercase font-bold">منتج متاح</p>
               </div>
               <div>
                 <p className="text-2xl font-black font-heading text-primary">{supplier.employees}</p>
                 <p className="text-xs text-muted-foreground uppercase font-bold">موظف</p>
               </div>
               <div>
                 <p className="text-2xl font-black font-heading text-primary">98%</p>
                 <p className="text-xs text-muted-foreground uppercase font-bold">معدل الرد</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* About */}
        <div className="lg:col-span-1 space-y-8">
           <div className="bg-white p-8 rounded-2xl border shadow-sm space-y-6">
              <h3 className="font-heading text-xl font-bold border-b pb-4">من نحن</h3>
              <p className="text-muted-foreground leading-relaxed">
                {language === 'ar' ? supplier.description_ar : supplier.description_fr}
              </p>
              <div className="space-y-4 pt-4">
                 <div className="flex items-center gap-3 text-sm">
                   <Globe className="h-4 w-4 text-primary" />
                   <a href="#" className="hover:underline text-primary font-medium flex items-center">www.dz-heavy-equip.com <ExternalLink className="h-3 w-3 inline ml-1" /></a>
                 </div>
                 <div className="flex items-center gap-3 text-sm">
                   <Users className="h-4 w-4 text-primary" />
                   <span className="font-medium">نوع النشاط: مستورد، موزع</span>
                 </div>
              </div>
           </div>

           <div className="bg-white p-8 rounded-2xl border shadow-sm space-y-4">
              <h3 className="font-heading text-xl font-bold border-b pb-4">صور المصنع/المستودع</h3>
              <div className="grid grid-cols-2 gap-2">
                 {supplier.gallery.map((img, i) => (
                   <img key={i} src={img} className="rounded-lg aspect-video object-cover cursor-pointer hover:opacity-80" />
                 ))}
              </div>
           </div>
        </div>

        {/* Products */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-2xl font-black text-primary">جميع المنتجات</h2>
            <div className="flex gap-2">
               <Input placeholder="بحث في متجر المورد..." className="w-64 rounded-full" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             {SEED_PRODUCTS.map(p => <ProductCard key={p.id} product={p} language={language} />)}
             {/* Fake Pagination */}
             <div className="col-span-full pt-8 flex justify-center">
                <Button variant="outline" className="rounded-full">تحميل المزيد من المنتجات</Button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
