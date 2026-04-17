import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppStore } from '@/store/useAppStore';
import { translations } from '@/lib/translations';
import { ArrowLeft, User, Briefcase, Building, Chrome } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function AuthPage() {
  const { language } = useAppStore();
  const t = translations[language];
  const [isRegister, setIsRegister] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<'buyer' | 'supplier'>('buyer');
  const [companyName, setCompanyName] = React.useState('');
  const [isPending, setIsPending] = React.useState(false);
  
  const { signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    setIsPending(true);
    try {
      if (isRegister && selectedRole === 'supplier' && !companyName) {
        toast.error(language === 'ar' ? 'يرجى إدخال اسم الشركة' : 'Veuillez entrer le nom de l\'entreprise');
        setIsPending(false);
        return;
      }
      await signInWithGoogle(selectedRole, companyName);
      toast.success(language === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Connexion réussie');
    } catch (error) {
      toast.error(language === 'ar' ? 'فشل تسجيل الدخول' : 'Échec de la connexion');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="absolute top-8 left-8 right-8 flex justify-between items-center">
         <Button variant="ghost" className="gap-2" onClick={() => navigate('/')}>
            <ArrowLeft className={language === 'ar' ? 'rotate-180' : ''} />
            {t.common.home}
         </Button>
         <h1 className="font-heading text-2xl font-black text-primary">BUSINFO</h1>
      </div>

      <div className="w-full max-w-lg">
        <Tabs value={selectedRole} onValueChange={(v) => setSelectedRole(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
            <TabsTrigger value="buyer" className="gap-2">
              <User className="h-4 w-4" />
              {t.common.buyer}
            </TabsTrigger>
            <TabsTrigger value="supplier" className="gap-2">
              <Briefcase className="h-4 w-4" />
              {t.common.supplier}
            </TabsTrigger>
          </TabsList>

          <Card className="border-none shadow-2xl overflow-hidden">
            <div className="h-2 bg-secondary w-full" />
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-3xl font-black font-heading text-primary uppercase">
                {isRegister ? t.auth.create_account : t.auth.welcome_back}
              </CardTitle>
              <CardDescription className="font-medium">
                {isRegister ? 'سجل علامتك التجارية وابدأ البيع اليوم' : 'ادخل بياناتك للوصول إلى لوحة التحكم الخاصة بك'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="space-y-4">
                 {isRegister && selectedRole === 'supplier' && (
                    <div className="space-y-2">
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder={t.auth.company_name} 
                          className="pl-10 h-12 rounded-xl border-border/50 font-bold" 
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  <Button 
                    variant="outline" 
                    className="w-full h-14 text-lg font-bold rounded-2xl gap-3 border-2 hover:bg-muted transition-all"
                    onClick={handleGoogleLogin}
                    disabled={isPending}
                  >
                    <Chrome className="h-5 w-5" />
                    {isRegister ? 'إنشاء حساب عبر جوجل' : 'تسجيل الدخول عبر جوجل'}
                  </Button>

                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-muted-foreground font-bold italic">أו OR</span>
                    </div>
                  </div>

                  <p className="text-center text-sm text-muted-foreground italic font-medium">
                    {language === 'ar' ? 'تسجيل الدخول بالبريد سيتم تفعيله قريباً' : 'La connexion par e-mail sera bientôt disponible'}
                  </p>
               </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 border-t bg-muted/20 py-6">
               <div className="text-sm text-center font-bold">
                  {isRegister ? 'لديك حساب بالفعل؟' : 'ليس لديك حساب؟'}
                  <Button variant="link" onClick={() => setIsRegister(!isRegister)} className="font-black text-primary hover:text-secondary p-1">
                    {isRegister ? t.common.login : t.common.register}
                  </Button>
               </div>
            </CardFooter>
          </Card>
        </Tabs>
      </div>
    </div>
  );
}
