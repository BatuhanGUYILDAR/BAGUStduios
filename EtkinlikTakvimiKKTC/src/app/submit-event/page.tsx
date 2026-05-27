import type { Metadata } from "next";
import { ClipboardPlus } from "lucide-react";
import { SubmitEventForm } from "@/components/SubmitEventForm";

export const metadata: Metadata = {
  title: "Etkinlik Ekle",
  description:
    "KKTC Events için frontend-only etkinlik gönderim formu önizlemesi. Gönderiler admin onayı sonrası yayınlanır."
};

type SubmitEventPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SubmitEventPage({ searchParams }: SubmitEventPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const submitted = firstParam(resolvedSearchParams?.submitted) === "1";

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
      <SubmitEventForm submitted={submitted} />
    </div>
  );
}
