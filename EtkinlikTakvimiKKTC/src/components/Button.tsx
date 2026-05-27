import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/eventUtils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-sunset-cta text-white shadow-neon hover:-translate-y-0.5 hover:shadow-festival",
  secondary:
    "bg-white/78 text-ink ring-1 ring-white/80 hover:-translate-y-0.5 hover:ring-neon-pink/40 hover:shadow-festival",
  ghost: "text-ink hover:bg-white/70 hover:text-electric-purple",
  outline:
    "bg-white/50 text-ink ring-1 ring-slate-200 hover:-translate-y-0.5 hover:ring-cyan-blue/40 hover:bg-white",
  danger:
    "bg-rose-500 text-white shadow-lg shadow-rose-500/20 hover:-translate-y-0.5 hover:bg-rose-600"
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base"
};

export function buttonClasses({
  className,
  size = "md",
  variant = "primary"
}: {
  className?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
}) {
  return cn(
    "focus-ring inline-flex items-center justify-center gap-2 rounded-full font-bold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60",
    variantClasses[variant],
    sizeClasses[size],
    className
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  className,
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonClasses({ className, size, variant })}
      type={type}
      {...props}
    />
  );
}
