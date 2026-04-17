import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { translations } from '@/lib/translations';
import { formatCurrency, cn } from '@/lib/utils';
import { ProductCard } from '@/components/features/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider'; // I'll need to add this
import { Checkbox } from '@/components/ui/checkbox'; // I'll need to add this
import { Filter, Search, Grid, List as ListIcon, X } from 'lucide-react';

export function SearchPage() {
  const { language } = useAppStore();
  const t = translations[language];
  const [view, setView] = React.useState<'grid' | 'list'>('grid');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-black text-primary uppercase">الفلاتر FILTERS</h2>
            <Button variant="ghost" size="sm" className="text-xs">مسح الكل</Button>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-sm uppercase">التصنيفات</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-secondary">
                <input type="checkbox" className="rounded border-border" />
                <span>معدات صناعية</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-secondary">
                <input type="checkbox" className="rounded border-border" />
                <span>مواد غذائية</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-secondary">
                <input type="checkbox" className="rounded border-border" />
                <span>إلكترونيات</span>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-sm uppercase">نطاق السعر</h3>
            <div className="px-2">
              <input type="range" className="w-full accent-secondary" />
              <div className="flex justify-between text-xs mt-2 text-muted-foreground">
                <span>0 د.ج</span>
                <span>1,000,000+ د.ج</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-sm uppercase">الشارات والتوثيق</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-secondary">
                <input type="checkbox" className="rounded border-border" />
                <span>مورد موثوق</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-secondary">
                <input type="checkbox" className="rounded border-border" />
                <span>مورد مميز</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">عرض <span className="font-bold text-primary">24</span> من <span className="font-bold text-primary">156</span> نتيجة</p>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <select className="bg-transparent border-none text-sm font-bold focus:ring-0">
                <option>الأحدث أولاً</option>
                <option>السعر: من الأقل للأعلى</option>
                <option>السعر: من الأعلى للأقل</option>
                <option>الأعلى تقييماً</option>
              </select>
              <div className="flex border rounded-lg overflow-hidden">
                <Button 
                  variant={view === 'grid' ? 'secondary' : 'ghost'} 
                  size="icon" 
                  className="rounded-none h-9 w-9"
                  onClick={() => setView('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button 
                  variant={view === 'list' ? 'secondary' : 'ghost'} 
                  size="icon" 
                  className="rounded-none h-9 w-9"
                  onClick={() => setView('list')}
                >
                  <ListIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="gap-1 pr-1">
              إلكترونيات
              <X className="h-3 w-3 cursor-pointer" />
            </Badge>
            <Badge variant="secondary" className="gap-1 pr-1">
              مورد موثوق
              <X className="h-3 w-3 cursor-pointer" />
            </Badge>
          </div>

          {/* Grid */}
          <div className={cn(
            "grid gap-6",
            view === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
          )}>
            {/* Using SEED_PRODUCTS here too for preview */}
            {/* Map products... */}
          </div>
        </div>
      </div>
    </div>
  );
}
