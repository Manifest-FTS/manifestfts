import { Plus } from 'lucide-react';

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-border rounded-2xl border border-border bg-panel">
      {items.map((item) => (
        <details key={item.q} className="group px-5 sm:px-6 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-[15.5px] font-medium text-fg">
            <h3>{item.q}</h3>
            <Plus className="size-4 shrink-0 text-fg-faint transition-transform duration-200 group-open:rotate-45" aria-hidden />
          </summary>
          <p className="-mt-1 pb-5 pr-8 text-[15px] leading-relaxed text-fg-muted">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
