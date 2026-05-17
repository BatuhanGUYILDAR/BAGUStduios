import { useLanguage } from '../i18n/LanguageContext';

function Education() {
  const { t } = useLanguage();

  return (
    <section className="page-section">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <p className="section-kicker">{t.education.kicker}</p>
        <h1 className="section-title">{t.education.title}</h1>

        <div className="mt-12 border-l border-neon-blue/40 pl-6">
          <article className="relative rounded-lg border border-white/10 bg-panel p-6 shadow-2xl shadow-black/30">
            <span className="absolute -left-[34px] top-8 h-4 w-4 rounded-full border-4 border-ink bg-neon-blue shadow-neon" />
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-neon-blue">{t.education.label}</p>
            <h2 className="mt-3 text-2xl font-black text-white">{t.education.school}</h2>
            <p className="mt-3 text-lg text-slate-200">{t.education.department}</p>
            <p className="mt-5 leading-8 text-slate-300">
              {t.education.body}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {t.education.focusAreas.map((area) => (
                <div key={area} className="rounded-md border border-white/10 bg-white/5 p-4 text-sm font-semibold text-slate-200">
                  {area}
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default Education;
