import * as React from 'react';
import { Eye, Heart, ShoppingCart, Star, ShieldCheck, Trophy, Truck, BadgeCheck } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export interface Product {
  id: string;
  name_ar: string;
  name_fr: string;
  price: number;
  image: string;
  rating: number;
  reviews_count: number;
  supplier_id: string;
  is_verified?: boolean;
}

interface ProductCardProps {
  product: Product;
  language: 'ar' | 'fr';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, language }) => {
  const name = language === 'ar' ? product.name_ar : product.name_fr;

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-xl transition-all group"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img 
          src={product.image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="icon" variant="secondary" className="rounded-full shadow-lg">
            <Heart className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="secondary" className="rounded-full shadow-lg">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
        {product.is_verified && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-primary text-white border-0 gap-1 rounded-sm">
              <ShieldCheck className="h-3 w-3" />
              <span>{language === 'ar' ? 'موثوق' : 'Vérifié'}</span>
            </Badge>
          </div>
        )}
      </div>
      
      <div className="p-4 space-y-2">
        <h3 className="font-heading font-bold text-sm line-clamp-2 min-h-[2.5rem] tracking-tight hover:text-secondary cursor-pointer transition-colors">
          {name}
        </h3>
        
        <div className="flex items-center gap-1">
          <div className="flex text-yellow-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={cn("h-3 w-3 fill-current", i >= product.rating && "text-gray-300 fill-none")} />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({product.reviews_count})</span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="font-heading font-black text-lg text-primary">
            {formatCurrency(product.price)}
          </span>
          <Button size="icon" variant="default" className="rounded-lg h-8 w-8">
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export const BadgeIcon: React.FC<{ type: string; className?: string }> = ({ type, className }) => {
  switch (type) {
    case 'verified':
      return <div className={cn("inline-flex items-center justify-center p-1 bg-green-100 text-green-600 rounded-full", className)} title="مورد موثوق"><BadgeCheck className="h-5 w-5" /></div>;
    case 'premium':
      return <div className={cn("inline-flex items-center justify-center p-1 bg-amber-100 text-amber-500 rounded-full", className)} title="مورد مميز"><Star className="h-5 w-5 fill-current" /></div>;
    case 'top_seller':
      return <div className={cn("inline-flex items-center justify-center p-1 bg-blue-100 text-blue-600 rounded-full", className)} title="أفضل بائع"><Trophy className="h-5 w-5" /></div>;
    case 'free_shipping':
      return <div className={cn("inline-flex items-center justify-center p-1 bg-purple-100 text-purple-600 rounded-full", className)} title="شحن مجاني"><Truck className="h-5 w-5" /></div>;
    case 'quality':
      return <div className={cn("inline-flex items-center justify-center p-1 bg-blue-900 text-blue-100 rounded-full", className)} title="ضمان الجودة"><ShieldCheck className="h-5 w-5" /></div>;
    default:
      return null;
  }
}
