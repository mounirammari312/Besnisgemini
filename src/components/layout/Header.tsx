import React from 'react';
import { Search, Globe, ChevronDown, User, ShoppingBag, Menu, X, Bell, LogOut, LayoutDashboard, Settings } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { translations } from '@/lib/translations';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link, useNavigate } from 'react-router-dom'; // أضف Link و useNavigate
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const { language, currency, setLanguage, setCurrency } = useAppStore();
  const t = translations[language];
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = React.useState(false);

  // منطق تحديد رابط لوحة التحكم بناءً على الدور (Role)
  const getDashboardLink = () => {
    if (!user) return '/auth';
    if (profile?.role === 'admin') return '/admin';
    if (profile?.role === 'supplier') return '/dashboard/supplier';
    return '/dashboard/buyer';
  };

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ... باقي الكود في قسم الـ JSX ...
  // تأكد من استخدام <Link to={getDashboardLink()}> عند أيقونة الحساب
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "bg-white/95 backdrop-blur-md shadow-md py-2" : "bg-primary py-4"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={cn("lg:hidden", isScrolled ? "text-primary" : "text-white")}>
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side={language === 'ar' ? 'right' : 'left'}>
                <nav className="flex flex-col gap-4 mt-8">
                  <a href="/" className="text-lg font-medium">{t.common.home}</a>
                  <a href="/categories" className="text-lg font-medium">{t.common.categories}</a>
                  <a href="/suppliers" className="text-lg font-medium">{t.common.suppliers}</a>
                  <a href="/about" className="text-lg font-medium">{t.common.about}</a>
                </nav>
              </SheetContent>
            </Sheet>
            <a href="/" className="flex items-center gap-2">
              <span className={cn(
                "font-heading text-2xl font-black tracking-tighter italic uppercase",
                isScrolled ? "text-primary" : "text-white"
              )}>BUSINFO</span>
            </a>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl relative">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground mr-3" />
              <input
                type="text"
                placeholder={t.common.search}
                className={cn(
                  "w-full pl-10 pr-4 py-2 rounded-full border border-transparent transition-all font-bold text-sm",
                  isScrolled 
                    ? "bg-muted/50 text-primary placeholder:text-muted-foreground focus:bg-white focus:border-secondary" 
                    : "bg-white/10 text-white placeholder:text-white/60 focus:bg-white focus:text-primary"
                )}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Lang/Currency - Desktop */}
            <div className="hidden lg:flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className={cn("gap-1 font-black", isScrolled ? "text-primary" : "text-white")}>
                    <Globe className="h-4 w-4" />
                    <span>{language.toUpperCase()}</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl border-2">
                  <DropdownMenuItem className="font-bold" onClick={() => setLanguage('ar')}>العربية (AR)</DropdownMenuItem>
                  <DropdownMenuItem className="font-bold" onClick={() => setLanguage('fr')}>Français (FR)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className={cn("gap-1 font-black", isScrolled ? "text-primary" : "text-white")}>
                    <span>{currency}</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl border-2">
                  <DropdownMenuItem className="font-bold" onClick={() => setCurrency('DZD')}>DZD (د.ج)</DropdownMenuItem>
                  <DropdownMenuItem className="font-bold" onClick={() => setCurrency('EUR')}>EUR (€)</DropdownMenuItem>
                  <DropdownMenuItem className="font-bold" onClick={() => setCurrency('USD')}>USD ($)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Auth/User */}
            <div className="flex items-center gap-2">
               <Button variant="ghost" size="icon" className={cn("hidden sm:flex", isScrolled ? "text-primary" : "text-white")}>
                <Bell className="h-5 w-5" />
              </Button>
              
              {!user ? (
                <>
                  <Button asChild variant={isScrolled ? "default" : "secondary"} size="sm" className="hidden sm:flex rounded-full font-black px-6">
                    <a href="/login">{t.common.login}</a>
                  </Button>
                  <Button variant="ghost" size="icon" asChild className={cn(isScrolled ? "text-primary" : "text-white")}>
                    <a href="/login"><User className="h-6 w-6" /></a>
                  </Button>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                      <Avatar className="h-10 w-10 border-2 border-secondary shadow-sm">
                        <AvatarImage src={profile?.photo_url || undefined} />
                        <AvatarFallback className="bg-primary text-white font-black">{profile?.display_name?.charAt(0) || user.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-2xl border-2 shadow-xl p-2 mt-2">
                    <DropdownMenuLabel className="font-black">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm leading-none">{profile?.display_name || user.email}</p>
                        <p className="text-xs leading-none text-muted-foreground">{profile?.role?.toUpperCase()}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="rounded-lg font-bold">
                      <a href={`/dashboard/${profile?.role}`} className="flex items-center">
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg font-bold">
                      <Settings className="h-4 w-4 mr-2" />
                      {language === 'ar' ? 'الإعدادات' : 'Paramètres'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="rounded-lg font-bold text-destructive focus:text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      {language === 'ar' ? 'تسجيل الخروج' : 'Déconnexion'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
