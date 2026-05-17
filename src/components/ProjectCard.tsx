import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { localizeProduct, useLanguage } from '../i18n/LanguageContext';
import type { Product } from '../types/Product';

type ProjectCardProps = {
  product: Product;
};

function ProjectCard({ product }: ProjectCardProps) {
  const { t } = useLanguage();
  const localizedProduct = localizeProduct(product, t.products);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-panel/80 shadow-2xl shadow-black/30 transition duration-300 hover:-translate-y-1 hover:border-neon-blue/50 hover:shadow-neon">
      <div className="relative min-h-56 overflow-hidden bg-gradient-to-br from-cyan-400/30 via-violet-500/25 to-emerald-400/20">
        <img
          src={localizedProduct.image}
          alt={`${localizedProduct.title} ${t.common.previewAlt}`}
          className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        <div className="absolute bottom-5 left-5 right-5 rounded-md border border-white/15 bg-black/35 p-4 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-blue">
            {localizedProduct.category}
          </p>
          <p className="mt-2 text-lg font-bold text-white">{localizedProduct.title}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-bold text-white">{localizedProduct.title}</h3>
        <p className="mt-3 flex-1 text-sm leading-6 text-slate-300">{localizedProduct.shortDescription}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {localizedProduct.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/10 pt-5">
          <span className="text-sm font-semibold text-neon-green">{localizedProduct.price}</span>
          <div className="flex items-center gap-2">
            <Link
              to={`/projects/${localizedProduct.id}`}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-white/10 px-3 text-sm font-semibold text-white transition hover:border-neon-blue hover:bg-neon-blue/10"
            >
              {t.common.details} <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <a
              href={localizedProduct.marketplaceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-white px-3 text-sm font-semibold text-slate-950 transition hover:bg-neon-blue"
            >
              {t.common.marketplace} <ExternalLink size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ProjectCard;
