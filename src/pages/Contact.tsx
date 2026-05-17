import { ValidationError, useForm } from '@formspree/react';
import { ExternalLink, Mail, Send } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const FORMSPREE_FORM_ID = 'mvzypdrw';

function Contact() {
  const { t } = useLanguage();
  const [state, handleSubmit] = useForm(FORMSPREE_FORM_ID);

  return (
    <section className="page-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="section-kicker">{t.contact.kicker}</p>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h1 className="section-title">{t.contact.title}</h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              {t.contact.intro}
            </p>
            <div className="mt-8 grid gap-4">
              {t.contact.cards.map((card) => (
                <a
                  key={card.label}
                  href={card.href}
                  target={card.href.startsWith('http') ? '_blank' : undefined}
                  rel={card.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-panel p-5 transition hover:border-neon-blue/60 hover:bg-white/5"
                >
                  <span>
                    <span className="block text-sm font-semibold uppercase tracking-[0.2em] text-neon-blue">{card.label}</span>
                    <span className="mt-2 block break-all text-slate-200">{card.value}</span>
                  </span>
                  {card.href.startsWith('mailto') ? <Mail size={20} aria-hidden="true" /> : <ExternalLink size={20} aria-hidden="true" />}
                </a>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-lg border border-white/10 bg-panel p-6 shadow-2xl shadow-black/30"
          >
            <div className="grid gap-5">
              <input type="hidden" name="subject" value={t.contact.emailSubject} />
              <label className="grid gap-2 text-sm font-semibold text-slate-200">
                {t.contact.nameLabel}
                <input
                  name="name"
                  required
                  className="h-12 rounded-md border border-white/10 bg-black/35 px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-neon-blue"
                  placeholder={t.contact.namePlaceholder}
                />
                <ValidationError field="name" errors={state.errors} className="text-sm font-semibold text-red-200" />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-200">
                {t.contact.emailLabel}
                <input
                  name="email"
                  type="email"
                  required
                  className="h-12 rounded-md border border-white/10 bg-black/35 px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-neon-blue"
                  placeholder={t.contact.emailPlaceholder}
                />
                <ValidationError field="email" errors={state.errors} className="text-sm font-semibold text-red-200" />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-200">
                {t.contact.messageLabel}
                <textarea
                  name="message"
                  required
                  rows={6}
                  className="rounded-md border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-neon-blue"
                  placeholder={t.contact.messagePlaceholder}
                />
                <ValidationError field="message" errors={state.errors} className="text-sm font-semibold text-red-200" />
              </label>
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-neon-blue px-6 font-bold text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                disabled={state.submitting}
              >
                {state.submitting ? t.contact.sending : t.contact.sendMessage} <Send size={18} aria-hidden="true" />
              </button>
              {state.succeeded && (
                <p className="rounded-md border border-neon-green/30 bg-neon-green/10 p-4 text-sm font-semibold text-neon-green" role="status">
                  {t.contact.success}
                </p>
              )}
              {state.errors && state.errors.getFormErrors().length > 0 && (
                <p className="rounded-md border border-red-400/30 bg-red-400/10 p-4 text-sm font-semibold text-red-200" role="alert">
                  {t.contact.error}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
