import SkillBadge from '../components/SkillBadge';
import { useLanguage } from '../i18n/LanguageContext';

function About() {
  const { t } = useLanguage();

  return (
    <section className="page-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="section-kicker">{t.about.kicker}</p>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h1 className="section-title">{t.about.title}</h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              {t.about.intro}
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-panel p-6 shadow-2xl shadow-black/30">
            <p className="leading-8 text-slate-300">
              {t.about.firstBody}
            </p>
            <p className="mt-5 leading-8 text-slate-300">
              {t.about.secondBody}
            </p>
          </div>
        </div>

        <div className="mt-14">
          <h2 className="text-2xl font-black text-white">{t.about.skillsTitle}</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {t.about.skills.map((skill) => (
              <SkillBadge key={skill} label={skill} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
