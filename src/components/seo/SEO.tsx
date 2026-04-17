import { Helmet } from 'react-helmet-async';
import { useAppStore } from '@/store/useAppStore';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export function SEO({ 
  title, 
  description, 
  keywords, 
  image = 'https://picsum.photos/seed/businfo/1200/630', 
  url = window.location.href,
  type = 'website'
}: SEOProps) {
  const { language } = useAppStore();
  const siteName = 'Businfo - المنصة الأولى لربط الموردين والشركات بالجزائر';
  const fullTitle = title ? `${title} | Businfo` : siteName;
  const defaultDesc = 'Businfo هي منصة B2B احترافية في الجزائر تهدف إلى ربط الموردين بالشركات لتسهيل عمليات البيع والشراء بالجملة وطلب عروض الأسعار.';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      <meta name="keywords" content={keywords || 'B2B Algeria, Businfo, Suppliers, Wholesale, Industrial Equipment, Algeria Marketplace'} />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Businfo" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDesc} />
      <meta name="twitter:image" content={image} />

      {/* Schema.org for Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Businfo",
          "url": "https://businfo.dz",
          "logo": "https://businfo.dz/logo.png",
          "sameAs": [
            "https://facebook.com/businfo",
            "https://linkedin.com/company/businfo"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+213-XX-XX-XX-XX",
            "contactType": "customer service",
            "areaServed": "DZ",
            "availableLanguage": ["Arabic", "French"]
          }
        })}
      </script>
    </Helmet>
  );
}
