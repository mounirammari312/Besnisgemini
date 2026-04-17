import { useAppStore } from '@/store/useAppStore';
import { translations } from '@/lib/translations';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export function Footer() {
  const { language } = useAppStore();
  const t = translations[language];

  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <h2 className="font-heading text-3xl font-black tracking-tighter">BUSINFO</h2>
            <p className="text-white/70 max-w-xs">{t.common.footer_desc}</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-secondary transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="hover:text-secondary transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="hover:text-secondary transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="hover:text-secondary transition-colors"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-6 text-secondary">{t.common.categories}</h3>
            <ul className="space-y-4 text-white/70">
              <li><a href="#" className="hover:text-white transition-colors">المعدات الصناعية</a></li>
              <li><a href="#" className="hover:text-white transition-colors">المواد الغذائية</a></li>
              <li><a href="#" className="hover:text-white transition-colors">الإلكترونيات</a></li>
              <li><a href="#" className="hover:text-white transition-colors">البناء والتشييد</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-6 text-secondary">{t.common.suppliers}</h3>
            <ul className="space-y-4 text-white/70">
              <li><a href="/register-supplier" className="hover:text-white transition-colors">انضم كمورد</a></li>
              <li><a href="#" className="hover:text-white transition-colors">دليل الموردين</a></li>
              <li><a href="#" className="hover:text-white transition-colors">الموردون الموثوقون</a></li>
              <li><a href="#" className="hover:text-white transition-colors">قصص النجاح</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-6 text-secondary">{t.common.contact}</h3>
            <ul className="space-y-4 text-white/70">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-secondary shrink-0" />
                <span>الجزائر العاصمة، حي الأعمال باب الزوار</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-secondary shrink-0" />
                <span dir="ltr">+213 (0) 23 45 67 89</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-secondary shrink-0" />
                <span>contact@businfo.dz</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-white/50 text-sm">
          <p>{t.common.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
