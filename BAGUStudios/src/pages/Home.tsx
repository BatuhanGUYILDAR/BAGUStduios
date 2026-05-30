import { ArrowRight, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import SkillBadge from '../components/SkillBadge';
import { useLanguage } from '../i18n/LanguageContext';
import { getProducts } from '../services/productService';
import type { Product } from '../types/Product';

const moduleFloatDelayClasses = [
  '[animation-delay:0s]',
  '[animation-delay:0.4s]',
  '[animation-delay:0.8s]',
  '[animation-delay:1.2s]',
];

function Home() {
  const { t } = useLanguage();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then((items) => setFeaturedProducts(items.filter((item) => item.featured)));
  }, []);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.22),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(139,92,246,0.18),transparent_28%),linear-gradient(180deg,#050608_0%,#0b0f18_100%)]" />
        <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-neon-blue">{t.home.brand}</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight text-white sm:text-6xl lg:text-7xl">
              {t.home.title}
            </h1>
            <p className="mt-5 text-xl font-semibold text-slate-100 sm:text-2xl">
              {t.home.role}
            </p>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              {t.home.intro}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/projects"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-neon-blue px-6 font-bold text-slate-950 transition hover:bg-white"
              >
                {t.home.viewProjects} <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/15 px-6 font-bold text-white transition hover:border-neon-violet hover:bg-white/10"
              >
                {t.home.contactMe} <Mail size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute -inset-4 rounded-full bg-neon-blue/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-lg border border-white/10 bg-white/5 p-6 shadow-neon backdrop-blur">
              <div className="grid grid-cols-2 gap-4">
                {t.home.modules.map((module, index) => (
                  <div
                    key={module.label}
                    className={`rounded-lg border border-white/10 bg-black/35 p-5 animate-float ${
                      moduleFloatDelayClasses[index % moduleFloatDelayClasses.length]
                    }`}
                  >
                    <div className="h-2 w-16 rounded-full bg-neon-green" />
                    <p className="mt-8 text-sm font-bold text-white">{module.label}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-400">{module.description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-lg border border-neon-blue/30 bg-neon-blue/10 p-5">
                <p className="text-sm font-semibold text-neon-blue">{t.home.marketplacePipelineTitle}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{t.home.marketplacePipelineBody}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#080b11] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="section-kicker">{t.home.featuredKicker}</p>
              <h2 className="section-title">{t.home.featuredTitle}</h2>
            </div>
            <Link to="/projects" className="font-semibold text-neon-blue hover:text-white">
              {t.home.viewAllProjects}
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {featuredProducts.map((product) => (
              <ProjectCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="section-kicker">{t.home.coreSkillsKicker}</p>
          <h2 className="section-title">{t.home.coreSkillsTitle}</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            {t.home.skills.map((skill) => (
              <SkillBadge key={skill} label={skill} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
