import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Search, Home, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 space-y-8">
      <div className="relative">
         <h1 className="text-[180px] font-black font-heading text-primary/5 leading-none">404</h1>
         <div className="absolute inset-0 flex items-center justify-center">
            <Search className="h-24 w-24 text-secondary animate-pulse" />
         </div>
      </div>
      
      <div className="space-y-4 max-w-lg">
        <h2 className="text-3xl font-black font-heading text-primary uppercase">عذراً، الصفحة غير موجودة PAGE NOT FOUND</h2>
        <p className="text-muted-foreground leading-relaxed">
           يبدو أنك سلكت طريقاً خاطئاً. الصفحة التي تبحث عنها ربما تم نقلها أو حذفها أو لم تكن موجودة من الأساس.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild className="rounded-full h-12 px-8 gap-2 font-bold shadow-lg shadow-primary/20">
          <Link to="/"><Home className="h-4 w-4" /> العودة للرئيسية</Link>
        </Button>
        <Button variant="outline" asChild className="rounded-full h-12 px-8 gap-2 font-bold">
          <Link to="/search"><Search className="h-4 w-4" /> استكشف المنتجات</Link>
        </Button>
      </div>
      
      <button onClick={() => window.history.back()} className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" /> العودة للصفحة السابقة
      </button>
    </div>
  );
}
