import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Megaphone, CheckCircle2, Loader2, Sparkles, TrendingUp, Clock, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

import { supabase } from '@/lib/supabase';

export function SupplierGrowthPage() {
  const { session, user } = useAuth();
  const { language } = useAppStore();
  const [isSubmitting, setIsSubmitting] = React.useState<string | null>(null);

  const handleRequestBadge = async (type: string) => {
    if (!user?.id) return;
    setIsSubmitting(type);
    try {
      const { error } = await supabase.from('badge_requests').insert([{
        supplier_id: user.id,
        badge_type_id: type,
        status: 'pending'
      }]);

      if (error) throw error;
      toast.success(language === 'ar' ? 'تم تقديم طلب الشارة بنجاح' : 'Demande de badge envoyée !');
    } catch (e) {
      console.error('Error submitting badge request:', e);
      toast.error('Error submitting request');
    } finally {
      setIsSubmitting(null);
    }
  };

  const handleRequestAd = async (type: string) => {
    if (!user?.id) return;
    setIsSubmitting(type);
    try {
      const { error } = await supabase.from('ad_requests').insert([{
        supplier_id: user.id,
        ad_type_id: type,
        status: 'pending',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }]);

      if (error) throw error;
      toast.success(language === 'ar' ? 'تم تقديم طلب الإعلان بنجاح' : 'Demande d\'annonce envoyée !');
    } catch (e) {
      console.error('Error submitting ad request:', e);
      toast.error('Error submitting request');
    } finally {
      setIsSubmitting(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-black text-primary uppercase">نمو المتجر GROWTH & VISIBILITY</h1>
        <p className="text-muted-foreground text-sm">عزز مبيعاتك من خلال الشارات الاحترافية والإعلانات الموجهة.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Badges System */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Award className="h-6 w-6 text-amber-500" />
            <h2 className="font-heading text-xl font-bold">شارات التميز BADGES</h2>
          </div>
          <div className="grid gap-4">
            <BadgeCard 
              title="مورد موثوق" 
              subtitle="Verified Supplier"
              desc="شارة تمنح للموردين الذين أكملوا عملية التحقق من الوثائق الرسمية."
              price="5,000 د.ج / سنوي"
              icon={<ShieldCheck className="h-8 w-8 text-blue-500" />}
              onAction={() => handleRequestBadge('verified')}
              loading={isSubmitting === 'verified'}
            />
            <BadgeCard 
              title="مورد النخبة" 
              subtitle="Elite Supplier"
              desc="الأولوية في نتائج البحث وشارة ذهبية تظهر بجانب اسم شركتك."
              price="15,000 د.ج / سنوي"
              icon={<Sparkles className="h-8 w-8 text-amber-500" />}
              onAction={() => handleRequestBadge('elite')}
              loading={isSubmitting === 'elite'}
            />
          </div>
        </section>

        {/* Ads System */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Megaphone className="h-6 w-6 text-primary" />
            <h2 className="font-heading text-xl font-bold">الحملات الإعلانية ADS</h2>
          </div>
          <div className="grid gap-4">
            <AdCard 
              title="إعلان الصفحة الرئيسية" 
              desc="ظهور منتجك في السلايدر الرئيسي للمنصة لزيادة المشاهدات بنسبة 300%."
              period="30 يوم"
              icon={<TrendingUp className="h-8 w-8 text-green-500" />}
              onAction={() => handleRequestAd('home_slider')}
              loading={isSubmitting === 'home_slider'}
            />
             <AdCard 
              title="إعلان التصنيفات" 
              desc="ظهور منتجك كأول نتيجة في تصنيفك الخاص لضمان استهداف المشترين المهتمين."
              period="15 يوم"
              icon={<Clock className="h-8 w-8 text-primary" />}
              onAction={() => handleRequestAd('category_top')}
              loading={isSubmitting === 'category_top'}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function BadgeCard({ title, subtitle, desc, price, icon, onAction, loading }: any) {
  return (
    <Card className="rounded-2xl border-none shadow-sm hover:shadow-md transition-all overflow-hidden">
      <CardContent className="p-6 flex items-start gap-4">
        <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg">{title}</h3>
              <p className="text-[10px] uppercase font-black text-muted-foreground tracking-tighter">{subtitle}</p>
            </div>
            <Badge variant="outline" className="font-bold text-primary border-primary/20">{price}</Badge>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
          <Button 
            onClick={onAction} 
            disabled={loading}
            className="w-full mt-4 rounded-xl font-bold gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            طلب تفعيل الشارة REQUEST
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AdCard({ title, desc, period, icon, onAction, loading }: any) {
  return (
    <Card className="rounded-2xl border-none shadow-sm hover:shadow-md transition-all overflow-hidden border-r-4 border-r-primary">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="text-xs text-muted-foreground font-medium">المدة: {period}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">{desc}</p>
        <Button 
          variant="secondary" 
          onClick={onAction} 
          disabled={loading}
          className="w-full rounded-xl font-black gap-2 h-11"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <TrendingUp className="h-4 w-4" />}
          تفعيل الحملة ACTIVATE AD
        </Button>
      </CardContent>
    </Card>
  );
}
