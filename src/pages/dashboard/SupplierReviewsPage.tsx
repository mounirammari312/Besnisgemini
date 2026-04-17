import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, MessageSquare, CornerDownRight, Loader2 } from 'lucide-react';
import { useSupabaseQuery } from '@/hooks/useSupabase';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function SupplierReviewsPage() {
  const { language } = useAppStore();
  const { session, user } = useAuth();
  
  const { data: reviews, loading, refresh } = useSupabaseQuery<any>(
    'reviews',
    (q) => q.select('*, products!inner(*), profiles:buyer_id(*)').eq('products.supplier_id', user?.id),
    [user?.id]
  );

  const [respondingTo, setRespondingTo] = React.useState<string | null>(null);
  const [response, setResponse] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleRespond = async (reviewId: string) => {
    if (!response.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/reviews/${reviewId}/response`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ response }),
      });

      if (!res.ok) throw new Error('Failed to respond');

      toast.success(language === 'ar' ? 'تم إرسال الرد بنجاح' : 'Réponse envoyée avec succès');
      setRespondingTo(null);
      setResponse('');
      refresh();
    } catch (error) {
      toast.error(language === 'ar' ? 'حدث خطأ أثناء إرسال الرد' : 'Erreur lors de l\'envoi');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-black text-primary uppercase">
          {language === 'ar' ? 'إدارة التقييمات REVIEWS' : 'GESTION DES AVIS'}
        </h1>
        <p className="text-muted-foreground text-sm">
          {language === 'ar' 
            ? 'تابع أراء العملاء ورد على استفساراتهم لبناء الثقة.' 
            : 'Suivez les avis des clients et répondez à leurs questions for build trust.'}
        </p>
      </div>

      <div className="grid gap-6">
        {reviews?.map((r) => (
          <Card key={r.id} className="overflow-hidden border-none shadow-lg shadow-primary/5 rounded-3xl">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                 {/* Product Info */}
                 <div className="w-full md:w-64 shrink-0 space-y-4">
                    <div className="aspect-square rounded-2xl overflow-hidden border">
                       <img src={r.products.main_image} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1">
                       <p className="font-bold text-sm line-clamp-1">{language === 'ar' ? r.products.name_ar : r.products.name_fr}</p>
                       <p className="text-xs text-muted-foreground uppercase font-black tracking-tighter">ID: {r.products.id.slice(0, 8)}</p>
                    </div>
                 </div>

                 {/* Review Content */}
                 <div className="flex-1 space-y-6">
                    <div className="flex justify-between items-start">
                       <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center font-bold text-primary">
                             {r.profiles?.display_name?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div>
                             <p className="font-bold">{r.profiles?.display_name || 'Anonymous'}</p>
                             <div className="flex text-yellow-400">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star key={i} className={cn("h-4 w-4 fill-current", i >= r.rating && "text-gray-200 fill-none")} />
                                ))}
                             </div>
                          </div>
                       </div>
                       <span className="text-xs font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full">
                          {new Date(r.created_at).toLocaleDateString()}
                       </span>
                    </div>

                    <div className="bg-muted/30 p-6 rounded-2xl italic text-primary/80 font-medium">
                       "{r.comment}"
                    </div>

                    {r.supplier_response ? (
                      <div className="flex gap-4 p-6 bg-secondary/5 border border-secondary/20 rounded-2xl">
                         <CornerDownRight className="h-5 w-5 text-secondary shrink-0" />
                         <div className="space-y-2">
                            <p className="text-xs font-black uppercase text-secondary">ردك YOUR RESPONSE</p>
                            <p className="font-medium text-primary/90">{r.supplier_response}</p>
                         </div>
                      </div>
                    ) : respondingTo === r.id ? (
                      <div className="space-y-4">
                         <Textarea 
                          placeholder={language === 'ar' ? 'اكتب ردك هنا...' : 'Écrivez votre réponse...'}
                          value={response}
                          onChange={(e) => setResponse(e.target.value)}
                          className="rounded-2xl border-2 min-h-[100px] font-medium"
                         />
                         <div className="flex gap-2">
                           <Button 
                            onClick={() => handleRespond(r.id)} 
                            disabled={isSubmitting}
                            className="rounded-xl h-11 px-8 font-black uppercase"
                           >
                             {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                             {language === 'ar' ? 'إرسال الرد' : 'Envoyer la réponse'}
                           </Button>
                           <Button variant="ghost" onClick={() => setRespondingTo(null)} className="rounded-xl font-bold">
                             {language === 'ar' ? 'إلغاء' : 'Annuler'}
                           </Button>
                         </div>
                      </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        onClick={() => setRespondingTo(r.id)}
                        className="rounded-xl font-bold gap-2"
                      >
                         <MessageSquare className="h-4 w-4" />
                         {language === 'ar' ? 'الرد على التقييم' : 'Répondre à l\'avis'}
                      </Button>
                    )}
                 </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!reviews || reviews.length === 0) && (
          <Card className="border-dashed border-2 bg-transparent rounded-3xl p-20 text-center">
             <div className="space-y-4">
                <div className="bg-muted h-16 w-16 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                   <Star className="h-8 w-8" />
                </div>
                <p className="text-muted-foreground font-bold italic">
                   {language === 'ar' ? 'لا توجد تقييمات لمنتجاتك حالياً' : 'Aucun avis pour vos produits pour le moment'}
                </p>
             </div>
          </Card>
        )}
      </div>
    </div>
  );
}
