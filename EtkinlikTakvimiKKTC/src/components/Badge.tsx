import type { ReactNode } from "react";
import type { EventCategory, EventStatus } from "@/types/event";
import { categoryBadgeClass, cn, statusBadgeClass } from "@/lib/eventUtils";

type BadgeTone =
  | "pink"
  | "purple"
  | "cyan"
  | "orange"
  | "lime"
  | "slate"
  | "verified";

const toneClasses: Record<BadgeTone, string> = {
  pink: "bg-fuchsia-100 text-fuchsia-700 ring-fuchsia-200",
  purple: "bg-violet-100 text-violet-700 ring-violet-200",
  cyan: "bg-cyan-100 text-cyan-700 ring-cyan-200",
  orange: "bg-orange-100 text-orange-700 ring-orange-200",
  lime: "bg-lime-100 text-lime-800 ring-lime-200",
  slate: "bg-slate-100 text-slate-700 ring-slate-200",
  verified: "bg-white text-electric-purple ring-electric-purple/25"
};

type BadgeProps = {
  children: ReactNode;
  className?: string;
  tone?: BadgeTone;
  category?: EventCategory;
  status?: EventStatus;
};

export function Badge({ children, className, tone = "slate", category, status }: BadgeProps) {
  const computedTone = category
    ? categoryBadgeClass(category)
    : status
      ? statusBadgeClass(status)
      : toneClasses[tone];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold ring-1",
        computedTone,
        className
      )}
    >
      {children}
    </span>
  );
}
