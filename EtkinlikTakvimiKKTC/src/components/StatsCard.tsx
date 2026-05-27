import type { LucideIcon } from "lucide-react";

type StatsCardProps = {
  label: string;
  value: string;
  icon: LucideIcon;
};

export function StatsCard({ label, value, icon: Icon }: StatsCardProps) {
  return (
    <article className="glass-panel festival-ring rounded-3xl p-5 transition duration-200 hover:-translate-y-1">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-pink/15 to-cyan-blue/20 text-electric-purple">
          <Icon aria-hidden="true" size={22} />
        </div>
        <div>
          <p className="text-2xl font-black text-ink">{value}</p>
          <p className="mt-1 text-sm font-semibold text-slatecopy">{label}</p>
        </div>
      </div>
    </article>
  );
}
