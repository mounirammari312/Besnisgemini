import { supabase } from '@/lib/supabase';

const SAMPLE_PRODUCTS = [
  {
    name_ar: 'آلة طحن صناعية عالية الدقة',
    name_fr: 'Fraiseuse industrielle haute précision',
    price: 450000,
    main_image: 'https://picsum.photos/seed/tool/400/400',
    rating: 4.5,
    reviews_count: 24,
    category_id: 'industrial',
  },
  {
    name_ar: 'زيت زيتون بكر ممتاز 5 لتر',
    name_fr: 'Huile d\'olive vierge extra 5L',
    price: 6500,
    main_image: 'https://picsum.photos/seed/olive/400/400',
    rating: 4.8,
    reviews_count: 156,
    category_id: 'food',
  },
  {
    name_ar: 'ألواح شمسية 450 واط',
    name_fr: 'Panneaux solaires 450W',
    price: 28000,
    main_image: 'https://picsum.photos/seed/solar/400/400',
    rating: 4.9,
    reviews_count: 89,
    category_id: 'energy',
  }
];

export async function seedInitialData() {
  console.log('Seed started...');
  
  // Seed Categories First
  const categories = [
    { id: 'industrial', name_ar: 'معدات صناعية', name_fr: 'Équipement Industriel', icon: 'Boxes' },
    { id: 'food', name_ar: 'مواد غذائية', name_fr: 'Produits Alimentaires', icon: 'Salad' },
    { id: 'energy', name_ar: 'طاقة', name_fr: 'Énergie', icon: 'Zap' },
  ];

  await supabase.from('categories').upsert(categories);

  // Seed Products
  const { error: pError } = await supabase.from('products').insert(SAMPLE_PRODUCTS);
  if (pError) console.error('Error seeding products:', pError);

  console.log('Seed completed successfully!');
}
