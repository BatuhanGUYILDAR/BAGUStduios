import { ExternalLink, Mail, Send } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mvzypdrw';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';
type FieldErrors = Partial<Record<'name' | 'email' | 'message', string>>;

function Contact() {
  const { t } = useLanguage();
  const [status, setStatus] = useState<FormStatus>('idle');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    if (formData.get('_gotcha')) {
      return;
    }

    setStatus('submitting');
    setFieldErrors({});

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          errors?: Array<{ field?: string; message?: string }>;
        } | null;
        const nextErrors: FieldErrors = {};

        payload?.errors?.forEach((error) => {
          if (error.field === 'name' || error.field === 'email' || error.field === 'message') {
            nextErrors[error.field] = error.message;
          }
        });

        setFieldErrors(nextErrors);
        setStatus('error');
        return;
      }

      form.reset();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

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
              <input
                className="hidden"
                type="text"
                name="_gotcha"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              <label className="grid gap-2 text-sm font-semibold text-slate-200">
                {t.contact.nameLabel}
                <input
                  name="name"
                  required
                  className="h-12 rounded-md border border-white/10 bg-black/35 px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-neon-blue"
                  placeholder={t.contact.namePlaceholder}
                />
                {fieldErrors.name && <span className="text-sm font-semibold text-red-200">{fieldErrors.name}</span>}
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
                {fieldErrors.email && <span className="text-sm font-semibold text-red-200">{fieldErrors.email}</span>}
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
                {fieldErrors.message && <span className="text-sm font-semibold text-red-200">{fieldErrors.message}</span>}
              </label>
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-neon-blue px-6 font-bold text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? t.contact.sending : t.contact.sendMessage} <Send size={18} aria-hidden="true" />
              </button>
              {status === 'success' && (
                <p className="rounded-md border border-neon-green/30 bg-neon-green/10 p-4 text-sm font-semibold text-neon-green" role="status">
                  {t.contact.success}
                </p>
              )}
              {status === 'error' && (
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
