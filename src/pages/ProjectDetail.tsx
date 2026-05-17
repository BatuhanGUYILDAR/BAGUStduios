import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SkillBadge from '../components/SkillBadge';
import { localizeProduct, useLanguage } from '../i18n/LanguageContext';
import { getProductById } from '../services/productService';
import type { Product } from '../types/Product';

function ProjectDetail() {
  const { t } = useLanguage();
  const { id } = useParams();
  const [product, setProduct] = useState<Product | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    getProductById(id).then((item) => {
      setProduct(item);
      setIsLoading(false);
    });
  }, [id]);

  if (isLoading) {
    return <section className="page-section text-center text-slate-300">{t.projectDetail.loading}</section>;
  }

  if (!product) {
    return (
      <section className="page-section">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-black text-white">{t.projectDetail.notFound}</h1>
          <Link to="/projects" className="mt-6 inline-flex items-center gap-2 text-neon-blue hover:text-white">
            <ArrowLeft size={18} aria-hidden="true" /> {t.projectDetail.backToProjects}
          </Link>
        </div>
      </section>
    );
  }

  const localizedProduct = localizeProduct(product, t.products);

  return (
    <section className="page-section">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-neon-blue hover:text-white">
          <ArrowLeft size={18} aria-hidden="true" /> {t.projectDetail.backToProjects}
        </Link>
        <div className="mt-8 grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative min-h-96 overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-neon-blue/25 via-neon-violet/20 to-neon-green/15 p-6 shadow-neon">
            <img src={localizedProduct.image} alt={`${localizedProduct.title} ${t.common.previewAlt}`} className="absolute inset-0 h-full w-full object-cover opacity-75" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            <div className="relative flex h-full min-h-80 flex-col justify-end rounded-md border border-white/15 bg-black/30 p-6 backdrop-blur">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-neon-blue">{localizedProduct.category}</p>
              <h1 className="mt-4 text-4xl font-black text-white">{localizedProduct.title}</h1>
            </div>
          </div>
          <div>
            <p className="section-kicker">{t.projectDetail.kicker}</p>
            <h2 className="text-3xl font-black text-white sm:text-5xl">{localizedProduct.title}</h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">{localizedProduct.longDescription}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {localizedProduct.tags.map((tag) => (
                <SkillBadge key={tag} label={tag} />
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={localizedProduct.marketplaceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-white px-6 font-bold text-slate-950 transition hover:bg-neon-blue"
              >
                {t.projectDetail.openMarketplace} <ExternalLink size={18} aria-hidden="true" />
              </a>
              <span className="inline-flex h-12 items-center rounded-md border border-white/10 px-6 font-bold text-neon-green">
                {localizedProduct.price}
              </span>
            </div>
          </div>
        </div>
        {localizedProduct.youtubeVideoId && (
          <div className="mt-12">
            <p className="section-kicker">{t.projectDetail.videoKicker}</p>
            <div className="mt-5 overflow-hidden rounded-lg border border-white/10 bg-black shadow-2xl shadow-black/40">
              <iframe
                className="aspect-video w-full"
                src={`https://www.youtube.com/embed/${localizedProduct.youtubeVideoId}`}
                title={`${localizedProduct.title} demo video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProjectDetail;
