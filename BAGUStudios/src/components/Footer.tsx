import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 text-sm text-slate-400 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <p className="font-bold text-white">BAGU Studio</p>
          <p className="mt-1">{t.footer.tagline}</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link to="/projects" className="hover:text-white">{t.footer.links.projects}</Link>
          <Link to="/education" className="hover:text-white">{t.footer.links.education}</Link>
          <Link to="/contact" className="hover:text-white">{t.footer.links.contact}</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
