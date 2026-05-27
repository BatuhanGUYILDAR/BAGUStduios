import { CalendarX2 } from "lucide-react";
import { Button } from "./Button";

type EmptyStateProps = {
  title?: string;
  description?: string;
  onReset?: () => void;
};

export function EmptyState({
  title = "Bu filtrelere uygun etkinlik bulunamadı.",
  description = "Aramayı genişletmeyi veya filtreleri temizlemeyi deneyebilirsin.",
  onReset
}: EmptyStateProps) {
  return (
    <section className="glass-panel rounded-[2rem] px-6 py-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-neon-pink/15 to-cyan-blue/20 text-electric-purple">
        <CalendarX2 aria-hidden="true" size={30} />
      </div>
      <h2 className="mt-5 text-2xl font-black text-ink">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slatecopy">{description}</p>
      {onReset ? (
        <Button className="mt-6" onClick={onReset} variant="secondary">
          Filtreleri Temizle
        </Button>
      ) : null}
    </section>
  );
}
