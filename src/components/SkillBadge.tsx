type SkillBadgeProps = {
  label: string;
};

function SkillBadge({ label }: SkillBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 shadow-sm shadow-black/20 transition hover:border-neon-blue/50 hover:text-white">
      {label}
    </span>
  );
}

export default SkillBadge;
