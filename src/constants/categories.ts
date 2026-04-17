export interface SubCategory {
  id: string;
  name_ar: string;
  name_fr: string;
}

export interface Category {
  id: string;
  name_ar: string;
  name_fr: string;
  icon: string;
  subcategories: SubCategory[];
}

export const CATEGORIES: Category[] = [
  {
    id: 'industrial',
    name_ar: 'المعدات الصناعية',
    name_fr: 'Équipement Industriel',
    icon: 'Boxes',
    subcategories: [
      { id: 'cnc', name_ar: 'آلات CNC', name_fr: 'Machines CNC' },
      { id: 'milling', name_ar: 'آلات الطحن', name_fr: 'Fraiseuses' },
      { id: 'packaging', name_ar: 'آلات التغليف', name_fr: 'Machines d\'emballage' },
    ]
  },
  {
    id: 'construction',
    name_ar: 'البناء والتعمير',
    name_fr: 'Construction & Bâtiment',
    icon: 'HardHat',
    subcategories: [
      { id: 'cement', name_ar: 'الإسمنت والمواد', name_fr: 'Ciment & Matériaux' },
      { id: 'heavy', name_ar: 'آلات ثقيلة', name_fr: 'Engins Lourds' },
      { id: 'tools', name_ar: 'أدوات يدوية', name_fr: 'Outillage à main' },
    ]
  },
  {
    id: 'energy',
    name_ar: 'الطاقة والكهرباء',
    name_fr: 'Énergie & Électricité',
    icon: 'Zap',
    subcategories: [
      { id: 'solar', name_ar: 'طاقة شمسية', name_fr: 'Énergie Solaire' },
      { id: 'generators', name_ar: 'مولدات كهربائية', name_fr: 'Générateurs' },
      { id: 'cables', name_ar: 'كابلات وتوصيلات', name_fr: 'Câbles & Connexions' },
    ]
  },
  {
    id: 'agriculture',
    name_ar: 'الزراعة والفلاحة',
    name_fr: 'Agriculture',
    icon: 'Sprout',
    subcategories: [
      { id: 'tractors', name_ar: 'جرارات زراعية', name_fr: 'Tracteurs' },
      { id: 'irrigation', name_ar: 'أنظمة الري', name_fr: 'Systèmes d\'irrigation' },
      { id: 'seeds', name_ar: 'بذور وأسمدة', name_fr: 'Semences & Engrais' },
    ]
  },
  {
    id: 'electronics',
    name_ar: 'الإلكترونيات والتقنية',
    name_fr: 'Électronique & Tech',
    icon: 'Cpu',
    subcategories: [
      { id: 'components', name_ar: 'قطع غيار إلكترونية', name_fr: 'Composants' },
      { id: 'computing', name_ar: 'أجهزة حاسوب', name_fr: 'Informatique' },
      { id: 'security', name_ar: 'أنظمة أمنية', name_fr: 'Systèmes de sécurité' },
    ]
  },
  {
    id: 'textile',
    name_ar: 'المنسوجات والأقمشة',
    name_fr: 'Textile & Tissus',
    icon: 'Scissors',
    subcategories: [
      { id: 'fabrics', name_ar: 'أقمشة صناعية', name_fr: 'Tissus industriels' },
      { id: 'machines', name_ar: 'آلات خياطة', name_fr: 'Machines à coudre' },
      { id: 'threads', name_ar: 'خيوط وألياف', name_fr: 'Fils & Fibres' },
    ]
  },
  {
    id: 'food',
    name_ar: 'الصناعات الغذائية',
    name_fr: 'Industrie Agro-alimentaire',
    icon: 'Utensils',
    subcategories: [
      { id: 'processing', name_ar: 'آلات معالجة الغذاء', name_fr: 'Traitement alimentaire' },
      { id: 'cold_storage', name_ar: 'غرف تبريد', name_fr: 'Chambres froides' },
      { id: 'ingredients', name_ar: 'مواد أولية', name_fr: 'Matières premières' },
    ]
  },
  {
    id: 'automotive',
    name_ar: 'قطع غيار السيارات',
    name_fr: 'Pièces Automobiles',
    icon: 'Car',
    subcategories: [
      { id: 'engines', name_ar: 'محركات', name_fr: 'Moteurs' },
      { id: 'batteries', name_ar: 'بطاريات', name_fr: 'Batteries' },
      { id: 'tires', name_ar: 'إطارات', name_fr: 'Pneus' },
    ]
  },
  {
    id: 'health',
    name_ar: 'المعدات الطبية',
    name_fr: 'Équipement Médical',
    icon: 'Stethoscope',
    subcategories: [
      { id: 'diagnostic', name_ar: 'أجهزة تشخيص', name_fr: 'Diagnostic' },
      { id: 'surgical', name_ar: 'أدوات جراحية', name_fr: 'Chirurgical' },
      { id: 'furniture', name_ar: 'أثاث طبي', name_fr: 'Mobilier médical' },
    ]
  },
  {
    id: 'office',
    name_ar: 'معدات المكاتب',
    name_fr: 'Équipement de Bureau',
    icon: 'Briefcase',
    subcategories: [
      { id: 'furniture', name_ar: 'أثاث مكتبي', name_fr: 'Mobilier' },
      { id: 'printers', name_ar: 'طابعات وماكينات تصوير', name_fr: 'Imprimantes' },
      { id: 'stationery', name_ar: 'قرطاسية بالجملة', name_fr: 'Papeterie' },
    ]
  },
  {
    id: 'chemicals',
    name_ar: 'المواد الكيميائية',
    name_fr: 'Produits Chimiques',
    icon: 'TestTube2',
    subcategories: [
      { id: 'industrial', name_ar: 'منظفات صناعية', name_fr: 'Détergents industriels' },
      { id: 'paints', name_ar: 'دهانات وطلاء', name_fr: 'Peintures' },
      { id: 'plastics', name_ar: 'بلاستيك خام', name_fr: 'Plastique brut' },
    ]
  }
];
