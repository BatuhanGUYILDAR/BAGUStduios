import type { Metadata } from "next";
import { ClipboardPlus } from "lucide-react";
import { SubmitEventForm } from "@/components/SubmitEventForm";

export const metadata: Metadata = {
  title: "Etkinlik Ekle",
  description:
    "KKTC Events için frontend-only etkinlik gönderim formu önizlemesi. Gönderiler admin onayı sonrası yayınlanır."
};

export default function SubmitEventPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-10 pt-12 sm:px-6 lg:px-8">
      <section className="mb-8">
        <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-neon-pink">
          <ClipboardPlus aria-hidden="true" size={17} />
          Event submission
        </p>
        <h1 className="mt-3 text-4xl font-black leading-tight text-ink sm:text-5xl">
          Etkinlik gönder
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slatecopy">
          Bu form sadece frontend önizlemesidir. Gerçek kayıt, görsel yükleme veya onay akışı
          backend bağlandığında aktif edilebilir.
        </p>
      </section>
      <SubmitEventForm />
    </div>
  );
}
