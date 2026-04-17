import React from 'react';
import { Search, Globe, ChevronDown, User, ShoppingBag, Menu, X, Bell, LogOut, LayoutDashboard, Settings } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { translations } from '@/lib/translations';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link, useNavigate } from 'react-router-dom';
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

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // منطق تحديد المسار الصحيح بناءً على الرتبة لتجنب 404
  const getDashboardPath = () => {
    if (!profile?.role) return '/auth';
    if (profile.role === 'admin') return '/admin';
    return `/dashboard/${profile.role}`;
  };

  return (
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
                  <Link to="/" className="text-lg font-medium">{t.common.home}</Link>
                  <Link to="/search" className="text-lg font-medium">{t.common.categories}</Link>
                </nav>
              </SheetContent>
            </Sheet>
            <Link to="/" className="flex items-center gap-2">
              <span className={cn(
                "font-heading text-2xl font-black tracking-tighter italic uppercase",
                isScrolled ? "text-primary" : "text-white"
              )}>BUSINFO</span>
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
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
            </div>

            {/* Auth/User */}
            <div className="flex items-center gap-2">
              {!user ? (
                <Button asChild variant={isScrolled ? "default" : "secondary"} size="sm" className="rounded-full font-black px-6">
                  <Link to="/auth">{t.common.login}</Link>
                </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                      <Avatar className="h-10 w-10 border-2 border-secondary shadow-sm">
                        <AvatarImage src={profile?.photo_url || undefined} />
                        <AvatarFallback className="bg-primary text-white font-black">
                          {profile?.display_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 rounded-2xl border-2 shadow-xl p-2 mt-2">
                    <DropdownMenuLabel className="font-black p-4">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm leading-none">{profile?.display_name || user.email}</p>
                        <p className="text-[10px] leading-none text-muted-foreground uppercase mt-1">{profile?.role}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="rounded-lg font-bold p-3">
                      <Link to={getDashboardPath()} className="flex items-center gap-2 w-full">
                        <LayoutDashboard className="h-4 w-4" />
                        {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="rounded-lg font-bold text-destructive p-3">
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
