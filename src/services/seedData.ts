import { db } from '@/firebase';
import { collection, addDoc, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { CATEGORIES } from '@/constants/categories';

const SAMPLE_PRODUCTS = [
  {
    name_ar: 'آلة طحن صناعية عالية الدقة',
    name_fr: 'Fraiseuse industrielle haute précision',
    price: 450000,
    currency: 'DZD',
    image: 'https://picsum.photos/seed/tool/400/400',
    rating: 4.5,
    reviews_count: 24,
    supplierId: 'sample-supplier-1',
    categoryId: 'industrial',
    is_verified: true,
  },
  {
    name_ar: 'زيت زيتون بكر ممتاز 5 لتر',
    name_fr: 'Huile d\'olive vierge extra 5L',
    price: 6500,
    currency: 'DZD',
    image: 'https://picsum.photos/seed/olive/400/400',
    rating: 4.8,
    reviews_count: 156,
    supplierId: 'sample-supplier-2',
    categoryId: 'food',
    is_verified: true,
  },
  {
    name_ar: 'ألواح شمسية 450 واط',
    name_fr: 'Panneaux solaires 450W',
    price: 28000,
    currency: 'DZD',
    image: 'https://picsum.photos/seed/solar/400/400',
    rating: 4.9,
    reviews_count: 89,
    supplierId: 'sample-supplier-3',
    categoryId: 'energy',
    is_verified: true,
  }
];

export async function seedInitialData() {
  console.log('Seed started...');
  
  // Seed Products
  for (const product of SAMPLE_PRODUCTS) {
    try {
      await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.error('Error seeding products:', e);
    }
  }

  // Seed Sample Suppliers
  const sampleSuppliers = [
    { uid: 'sample-supplier-1', name: 'Al-Jazair Tech', location: 'Alger', joined: '2020' },
    { uid: 'sample-supplier-2', name: 'Zitouna Foods', location: 'Bejaia', joined: '2018' },
    { uid: 'sample-supplier-3', name: 'EcoEnergy DZ', location: 'Oran', joined: '2022' },
  ];

  for (const supplier of sampleSuppliers) {
    try {
      await setDoc(doc(db, 'suppliers', supplier.uid), {
        ...supplier,
        rating: 4.5 + Math.random() * 0.5,
        reviews_count: Math.floor(Math.random() * 200),
        badges: ['verified', 'fast-shipper'],
      });
    } catch (e) {
      console.error('Error seeding suppliers:', e);
    }
  }

  console.log('Seed completed successfully!');
}
