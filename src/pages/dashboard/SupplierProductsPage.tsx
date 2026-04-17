import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, MoreVertical, Edit, Trash2, Eye, Boxes, X, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from '@/context/AuthContext';
import { useAppStore } from '@/store/useAppStore';
import { useSupabaseQuery } from '@/hooks/useSupabase';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { Card } from '@/components/ui/card';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';

export function SupplierProductsPage() {
  const { language } = useAppStore();
  const { session, user } = useAuth();
  const { data: products, loading, refresh } = useSupabaseQuery<any>(
    'products', 
    (q) => q.eq('supplier_id', user?.id), 
    [user?.id]
  );

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Form State
  const [formData, setFormData] = React.useState({
    name_ar: '',
    name_fr: '',
    price: '',
    min_order: '',
    description_ar: '',
    description_fr: '',
    category_id: 'industrial',
  });
  const [variations, setVariations] = React.useState<any[]>([]);
  const [mainImage, setMainImage] = React.useState<File | null>(null);
  const [extraImages, setExtraImages] = React.useState<File[]>([]);

  const handleAddVariation = () => {
    setVariations([...variations, { name_ar: '', name_fr: '', price_adjustment: 0, stock: 0 }]);
  };

  const handleCreateProduct = async () => {
    if (!session || !mainImage || !user) {
      toast.error('Required fields missing');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload Main Image
      const mainExt = mainImage.name.split('.').pop();
      const mainFileName = `${Math.random()}.${mainExt}`;
      const { data: mainImgData, error: mainImgError } = await supabase.storage
        .from('products')
        .upload(mainFileName, mainImage);

      if (mainImgError) throw mainImgError;
      const { data: { publicUrl: mainPublicUrl } } = supabase.storage.from('products').getPublicUrl(mainImgData.path);

      // 2. Upload Extra Images
      const extraUrls: string[] = [];
      for (const file of extraImages) {
        const ext = file.name.split('.').pop();
        const fname = `${Math.random()}.${ext}`;
        const { data: uploadData } = await supabase.storage.from('products').upload(fname, file);
        if (uploadData) {
           const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(uploadData.path);
           extraUrls.push(publicUrl);
        }
      }

      // 3. Create Product directly via Supabase
      const { data: product, error: productError } = await supabase.from('products').insert([{
        supplier_id: user.id,
        name_ar: formData.name_ar,
        name_fr: formData.name_fr,
        price: parseFloat(formData.price),
        min_order: parseInt(formData.min_order),
        description_ar: formData.description_ar,
        description_fr: formData.description_fr,
        category_id: formData.category_id,
        main_image: mainPublicUrl,
        gallery: extraUrls,
      }]).select().single();

      if (productError) throw productError;

      // 4. Create Variations if any
      if (variations.length > 0) {
        await supabase.from('product_variations').insert(
          variations.map(v => ({ ...v, product_id: product.id }))
        );
      }

      toast.success(language === 'ar' ? 'تمت إضافة المنتج بنجاح' : 'Produit ajouté !');
      setIsModalOpen(false);
      refresh();
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast.error('Error creating product: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl font-black text-primary uppercase line-clamp-1">إدارة المنتجات PRODUCTS</h1>
          <p className="text-muted-foreground text-sm">أضف، عدل، أو احذف منتجاتك من المنصة.</p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="font-bold gap-2 rounded-xl h-12 px-8 shadow-xl shadow-primary/20 bg-primary hover:bg-secondary hover:text-primary transition-all uppercase">
              <Plus className="h-5 w-5" />
              إضافة منتج جديد ADD NEW
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl h-[90vh] overflow-y-auto rounded-3xl">
             <DialogHeader>
                <DialogTitle className="font-heading text-2xl font-black text-primary uppercase">إضافة منتج احترافي NEW PRODUCT</DialogTitle>
                <DialogDescription className="font-medium text-muted-foreground italic">املأ كافة التفاصيل لضمان ظهور منتجك في أفضل التصنيفات.</DialogDescription>
             </DialogHeader>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
                <div className="space-y-4">
                   <div className="space-y-1">
                      <label className="text-xs font-black uppercase tracking-widest text-primary/60">اسم المنتج (العربية)</label>
                      <Input value={formData.name_ar} onChange={e => setFormData({...formData, name_ar: e.target.value})} className="rounded-xl border-2 h-11 font-bold" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs font-black uppercase tracking-widest text-primary/60">Nom du Produit (Français)</label>
                      <Input value={formData.name_fr} onChange={e => setFormData({...formData, name_fr: e.target.value})} className="rounded-xl border-2 h-11 font-bold" />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <label className="text-xs font-black uppercase tracking-widest text-primary/60">السعر الأساسي</label>
                        <Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="rounded-xl border-2 h-11 font-bold" />
                     </div>
                     <div className="space-y-1">
                        <label className="text-xs font-black uppercase tracking-widest text-primary/60">أقل طلبية MOQ</label>
                        <Input type="number" value={formData.min_order} onChange={e => setFormData({...formData, min_order: e.target.value})} className="rounded-xl border-2 h-11 font-bold" />
                     </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="space-y-1">
                      <label className="text-xs font-black uppercase tracking-widest text-primary/60">التصنيف CATEGORY</label>
                      <select value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className="w-full rounded-xl border-2 h-11 px-4 font-bold bg-white text-sm">
                         <option value="industrial">معدات صناعية</option>
                         <option value="agriculture">منتجات زراعية</option>
                         <option value="construction">مواد بناء</option>
                      </select>
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs font-black uppercase tracking-widest text-primary/60">الصورة الرئيسية MAIN IMAGE</label>
                      <div className="border-2 border-dashed rounded-2xl p-4 text-center hover:bg-muted/50 transition-all cursor-pointer relative overflow-hidden h-32 flex flex-col items-center justify-center">
                         {mainImage ? (
                           <img src={URL.createObjectURL(mainImage)} className="absolute inset-0 object-cover w-full h-full opacity-30" />
                         ) : <Plus className="h-6 w-6 text-muted-foreground mb-2" />}
                         <p className="text-[10px] font-black uppercase text-muted-foreground z-10">{mainImage ? mainImage.name : 'اضغط للرفع UPLOAD'}</p>
                         <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setMainImage(e.target.files?.[0] || null)} />
                      </div>
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs font-black uppercase tracking-widest text-primary/60">صور إضافية GALLERY (اختياري)</label>
                      <div className="flex gap-2 flex-wrap">
                         {extraImages.map((f, i) => (
                           <div key={i} className="h-16 w-16 rounded-xl border relative overflow-hidden group">
                              <img src={URL.createObjectURL(f)} className="object-cover w-full h-full" />
                              <button 
                                onClick={() => setExtraImages(extraImages.filter((_, idx) => idx !== i))}
                                className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-4 w-4" />
                              </button>
                           </div>
                         ))}
                         <label className="h-16 w-16 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-all text-muted-foreground">
                            <Plus className="h-5 w-5" />
                            <input type="file" multiple className="hidden" onChange={e => {
                               const files = Array.from(e.target.files || []);
                               setExtraImages([...extraImages, ...files]);
                            }} />
                         </label>
                      </div>
                   </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                   <div className="space-y-1">
                      <label className="text-xs font-black uppercase tracking-widest text-primary/60">التنوعات VARIATIONS (اختياري)</label>
                      <div className="space-y-3">
                         {variations.map((v, i) => (
                           <div key={i} className="flex gap-2 items-center bg-muted/30 p-3 rounded-xl border">
                              <Input placeholder="الاسم" className="h-9 text-xs" onChange={e => {
                                const newV = [...variations];
                                newV[i].name_ar = e.target.value;
                                setVariations(newV);
                              }} />
                              <Input placeholder="فرنساوي" className="h-9 text-xs" onChange={e => {
                                const newV = [...variations];
                                newV[i].name_fr = e.target.value;
                                setVariations(newV);
                              }} />
                              <Input type="number" placeholder="Adjustment (+/-)" className="h-9 text-xs w-32" onChange={e => {
                                const newV = [...variations];
                                newV[i].price_adjustment = parseFloat(e.target.value);
                                setVariations(newV);
                              }} />
                              <Button variant="ghost" size="icon" onClick={() => setVariations(variations.filter((_, idx) => idx !== i))}>
                                <Trash2 className="h-4 w-4 text-red-400" />
                              </Button>
                           </div>
                         ))}
                         <Button variant="outline" size="sm" onClick={handleAddVariation} className="rounded-full gap-2 text-[10px] uppercase font-black">
                            <Plus className="h-3 w-3" /> إضافة تنوع VARIATION
                         </Button>
                      </div>
                   </div>

                   <div className="space-y-4 pt-4 border-t">
                      <div className="space-y-1">
                         <label className="text-xs font-black uppercase tracking-widest text-primary/60">وصف المنتج (العربية)</label>
                         <Textarea className="rounded-xl border-2 min-h-[100px] font-medium" value={formData.description_ar} onChange={e => setFormData({...formData, description_ar: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                         <label className="text-xs font-black uppercase tracking-widest text-primary/60">Description (Français)</label>
                         <Textarea className="rounded-xl border-2 min-h-[100px] font-medium" value={formData.description_fr} onChange={e => setFormData({...formData, description_fr: e.target.value})} />
                      </div>
                   </div>
                </div>
             </div>

             <DialogFooter className="border-t pt-6 gap-2">
                <Button variant="outline" className="rounded-xl h-12 px-8 font-bold" onClick={() => setIsModalOpen(false)}>إلغاء ANNULER</Button>
                <Button className="rounded-xl h-12 px-12 font-black shadow-lg shadow-primary/20 bg-primary gap-2" onClick={handleCreateProduct} disabled={isSubmitting}>
                   {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                   حفظ المنتج SAVE PRODUCT
                </Button>
             </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="rounded-3xl border-none shadow-xl shadow-primary/5 overflow-hidden">
        <div className="p-6 border-b flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="بحث برقم المنتج أو الاسم..." className="pl-10 rounded-full h-10 border-muted" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-full">تصدير CSV</Button>
            <Button variant="outline" size="sm" className="rounded-full">الفلاتر</Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>المنتج</TableHead>
              <TableHead>التصنيف</TableHead>
              <TableHead>السعر</TableHead>
              <TableHead>المخزون</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead className="text-left">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id} className="hover:bg-muted/10 transition-colors">
                <td className="p-4 font-mono text-xs text-muted-foreground">#PRD-{p.id.padStart(4, '0')}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden flex items-center justify-center p-1 border">
                        {p.main_image ? <img src={p.main_image} className="object-cover w-full h-full" /> : <Boxes className="h-5 w-5 text-primary/40" />}
                     </div>
                     <span className="font-bold">
                        {language === 'ar' ? p.name_ar : p.name_fr}
                     </span>
                  </div>
                </td>
                <td className="p-4 text-sm">{p.category_id}</td>
                <td className="p-4 font-bold">{formatCurrency(p.price)}</td>
                <td className="p-4">
                  <span className={(p.stock || 0) < 10 ? "text-red-500 font-bold" : ""}>{p.stock || 0} وحدة</span>
                </td>
                <td className="p-4">
                  <Badge variant={(p.stock || 0) > 0 ? 'secondary' : 'outline'} className={(p.stock || 0) > 0 ? "bg-green-100 text-green-700 hover:bg-green-200 border-0" : ""}>
                    {(p.stock || 0) > 0 ? 'نشط' : 'نفذ'}
                  </Badge>
                </td>
                <td className="p-4 text-left">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                       <DropdownMenuItem className="gap-2"><Eye className="h-4 w-4" /> عرض</DropdownMenuItem>
                       <DropdownMenuItem className="gap-2"><Edit className="h-4 w-4" /> تعديل</DropdownMenuItem>
                       <DropdownMenuItem className="gap-2 text-red-500"><Trash2 className="h-4 w-4" /> حذف</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

