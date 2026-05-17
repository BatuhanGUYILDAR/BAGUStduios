import { Check, Globe2, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage, type Language } from '../i18n/LanguageContext';

const links = [
  { key: 'home', path: '/' },
  { key: 'about', path: '/about' },
  { key: 'projects', path: '/projects' },
  { key: 'education', path: '/education' },
  { key: 'contact', path: '/contact' },
] as const;

const languageOptions: Array<{ code: Language; label: string }> = [
  { code: 'en', label: 'EN' },
  { code: 'tr', label: 'TR' },
];

function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLanguageMenuOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsLanguageMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsLanguageMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLanguageMenuOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-white/5 text-white transition duration-200 ease-out hover:border-neon-blue hover:bg-white/10"
        aria-label={`${t.nav.languageLabel}: ${t.nav.languageOptions[language]}`}
        aria-haspopup="menu"
        aria-expanded={isLanguageMenuOpen}
        onClick={() => setIsLanguageMenuOpen((current) => !current)}
      >
        <Globe2 size={20} aria-hidden="true" />
      </button>

      <div
        className={`absolute right-0 top-12 z-50 w-44 origin-top-right rounded-md border border-white/10 bg-panel p-2 shadow-2xl shadow-black/40 backdrop-blur-xl transition duration-200 ease-out ${
          isLanguageMenuOpen
            ? 'translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-2 scale-95 opacity-0'
        }`}
        role="menu"
        aria-hidden={!isLanguageMenuOpen}
      >
        {languageOptions.map((option) => {
          const isSelected = language === option.code;

          return (
            <button
              key={option.code}
              type="button"
              className={`flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm font-semibold transition duration-200 ease-out ${
                isSelected ? 'bg-white text-slate-950' : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
              role="menuitemradio"
              aria-checked={isSelected}
              tabIndex={isLanguageMenuOpen ? 0 : -1}
              onClick={() => {
                setLanguage(option.code);
                setIsLanguageMenuOpen(false);
              }}
            >
              <span>{t.nav.languageOptions[option.code]}</span>
              {isSelected && <Check size={16} aria-hidden="true" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Navbar() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setHasScrolled(window.scrollY > 8);
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-md px-3 py-2 text-sm font-semibold transition duration-200 ease-out ${
      isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
    }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-300 ease-out ${
        hasScrolled ? 'border-white/15 bg-ink/95 shadow-2xl shadow-black/30' : 'border-white/10 bg-ink/85'
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label={t.nav.ariaLabel}>
        <NavLink to="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
          <span className="grid h-11 w-11 place-items-center rounded-md bg-gradient-to-br from-neon-blue to-neon-violet text-lg font-black text-white shadow-neon">
            B
          </span>
          <span>
            <span className="block text-base font-black text-white">BAGU Studio</span>
            <span className="block text-xs uppercase tracking-[0.22em] text-slate-400">Game Dev</span>
          </span>
        </NavLink>

        <div className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <NavLink key={link.path} to={link.path} className={linkClass}>
              {t.nav.links[link.key]}
            </NavLink>
          ))}
          <LanguageToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageToggle />
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/10 text-white transition duration-200 ease-out hover:border-neon-blue hover:bg-white/5"
            aria-label={t.nav.toggleLabel}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((current) => !current)}
          >
            {isOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <div
        className={`grid border-t border-white/10 bg-ink/95 px-4 transition-[grid-template-rows,opacity,transform] duration-300 ease-out md:hidden ${
          isOpen ? 'grid-rows-[1fr] translate-y-0 opacity-100' : 'pointer-events-none grid-rows-[0fr] -translate-y-2 opacity-0'
        }`}
        aria-hidden={!isOpen}
      >
        <div className="overflow-hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 py-4">
            {links.map((link) => (
              <NavLink key={link.path} to={link.path} className={linkClass} tabIndex={isOpen ? 0 : -1} onClick={() => setIsOpen(false)}>
                {t.nav.links[link.key]}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
