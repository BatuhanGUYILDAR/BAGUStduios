import { useEffect, useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import { useLanguage } from '../i18n/LanguageContext';
import { getProducts } from '../services/productService';
import type { Product } from '../types/Product';

function Projects() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  return (
    <section className="page-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="section-kicker">{t.projects.kicker}</p>
        <div className="max-w-3xl">
          <h1 className="section-title">{t.projects.title}</h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            {t.projects.intro}
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {products.map((product) => (
            <ProjectCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
