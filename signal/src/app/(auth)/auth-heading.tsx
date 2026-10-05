export function AuthHeading({ title, subtitle }: { title: string; subtitle?: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h1 className="text-[28px] font-semibold tracking-[-0.035em] text-fg">{title}</h1>
      {subtitle && <p className="mt-2 text-[15px] text-fg-muted">{subtitle}</p>}
    </div>
  );
}
