import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { translations } from '@/lib/translations';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Boxes, 
  ShoppingCart, 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Star, 
  Award, 
  Megaphone,
  LayoutDashboard,
  FileText,
  Search,
  Bell,
  ChevronRight,
  Menu,
  X,
  CreditCard
} from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'buyer' | 'supplier' | 'admin';
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const { language } = useAppStore();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const getNavItems = (): NavItem[] => {
    switch (role) {
      case 'admin':
        return [
          { label: 'نظرة عامة', href: '/admin', icon: <LayoutDashboard /> },
          { label: 'المستخدمون', href: '/admin/users', icon: <Users /> },
          { label: 'الموردون', href: '/admin/suppliers', icon: <Award /> },
          { label: 'المنتجات', href: '/admin/products', icon: <Boxes /> },
          { label: 'الشارات', href: '/admin/badges', icon: <Star /> },
          { label: 'الإعلانات', href: '/admin/ads', icon: <Megaphone /> },
          { label: 'التقارير', href: '/admin/reports', icon: <BarChart3 /> },
          { label: 'الإعدادات', href: '/admin/settings', icon: <Settings /> },
        ];
      case 'supplier':
        return [
          { label: 'نظرة عامة', href: '/dashboard/supplier', icon: <LayoutDashboard /> },
          { label: 'المنتجات', href: '/dashboard/supplier/products', icon: <Boxes /> },
          { label: 'الطلبات', href: '/dashboard/supplier/orders', icon: <ShoppingCart /> },
          { label: 'العروض', href: '/dashboard/supplier/quotes', icon: <FileText /> },
          { label: 'التقييمات', href: '/dashboard/supplier/reviews', icon: <Star /> },
          { label: 'الشارات', href: '/dashboard/supplier/badges', icon: <Award /> },
          { label: 'الإعلانات', href: '/dashboard/supplier/ads', icon: <Megaphone /> },
          { label: 'الرسائل', href: '/dashboard/supplier/messages', icon: <MessageSquare /> },
          { label: 'الإعدادات', href: '/dashboard/supplier/settings', icon: <Settings /> },
        ];
      case 'buyer':
      default:
        return [
          { label: 'نظرة عامة', href: '/dashboard/buyer', icon: <LayoutDashboard /> },
          { label: 'طلباتي', href: '/dashboard/buyer/orders', icon: <ShoppingCart /> },
          { label: 'عروض الأسعار', href: '/dashboard/buyer/quotes', icon: <FileText /> },
          { label: 'المفضلة', href: '/dashboard/buyer/favorites', icon: <Star /> },
          { label: 'الرسائل', href: '/dashboard/buyer/messages', icon: <MessageSquare /> },
          { label: 'المقارنات', href: '/dashboard/buyer/compare', icon: <CreditCard /> },
          { label: 'الإعدادات', href: '/dashboard/buyer/settings', icon: <Settings /> },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className={cn(
        "bg-primary text-white transition-all duration-300 fixed md:relative z-50 h-screen overflow-y-auto",
        isSidebarOpen ? "w-72" : "w-20",
        !isSidebarOpen && "md:block hidden"
      )}>
        <div className="p-6 flex items-center justify-between">
          <Link to="/" className={cn("font-heading text-2xl font-black tracking-tighter truncate", !isSidebarOpen && "hidden")}>
            BUSINFO
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="text-white hover:bg-white/10"
          >
            {isSidebarOpen ? <X className="md:hidden" /> : <Menu />}
          </Button>
        </div>

        <nav className="px-3 pt-6 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl transition-all group",
                  isActive ? "bg-white/10 text-secondary" : "hover:bg-white/5 text-white/70 hover:text-white"
                )}
              >
                <div className={cn("shrink-0", isActive ? "text-secondary" : "text-white/40 group-hover:text-white")}>
                  {React.cloneElement(item.icon as React.ReactElement, { className: "h-5 w-5" })}
                </div>
                {isSidebarOpen && <span className="font-bold text-sm">{item.label}</span>}
                {isActive && isSidebarOpen && <ChevronRight className={cn("h-4 w-4 ml-auto", language === 'ar' ? "rotate-180" : "")} />}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-3 right-3 px-3">
           <Button variant="ghost" className="w-full justify-start gap-4 text-white/50 hover:text-red-400 hover:bg-red-400/10 rounded-xl px-4 py-6">
              <LogOut className="h-5 w-5" />
              {isSidebarOpen && <span className="font-bold">تسجيل الخروج</span>}
           </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white border-b h-16 flex items-center justify-between px-8 sticky top-0 z-40">
           <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
              <h2 className="font-bold text-primary truncate">
                {navItems.find(i => i.href === location.pathname)?.label || 'لوحة التحكم'}
              </h2>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="relative hidden sm:block">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <input type="text" placeholder="بحث سريع..." className="bg-muted/50 border-none rounded-full h-9 pl-10 pr-4 text-sm w-64 focus:ring-1 ring-primary/20" />
              </div>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
              </Button>
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs uppercase">
                JD
              </div>
           </div>
        </header>

        <main className="p-8">
           {children}
        </main>
      </div>
    </div>
  );
}
