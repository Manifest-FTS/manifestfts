import Link from 'next/link';
import { CircleCheck } from 'lucide-react';
import { Wordmark } from '@/components/brand/logo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      <div className="flex flex-col px-4 py-6 sm:px-10">
        <Link href="/" className="self-start rounded-lg" aria-label="Manifest Signal home"><Wordmark /></Link>
        <main id="main" className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center py-12">{children}</main>
        <p className="text-center text-[12.5px] text-fg-faint lg:text-left">
          © {new Date().getFullYear()} Manifest FTS · <Link href="/privacy" className="hover:text-fg">Privacy</Link> · <Link href="/terms" className="hover:text-fg">Terms</Link>
        </p>
      </div>
      <aside className="relative hidden overflow-hidden bg-[#0b1020] p-12 text-white lg:flex lg:flex-col lg:justify-between" aria-label="About Manifest Signal">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_80%_10%,rgb(67_83_199/0.5),transparent_70%)]" />
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-[0.06]" />
        <div className="relative">
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.12em] text-[#8fd2c7]">Manifest Signal</p>
          <h2 className="mt-4 max-w-md text-[34px] font-semibold leading-[1.1] tracking-[-0.035em]">See what AI answer engines say about you, with the evidence to act on it.</h2>
          <ul className="mt-10 grid gap-4 text-[15px] text-[#c9d0db]">
            {['Mention, citation, and accuracy across ChatGPT, Perplexity, Gemini, and Claude', 'Confidence intervals and sample sizes on every number', 'Readiness audits and evidence-linked tasks', '14-day trial with Growth limits, no card required'].map((item) => (
              <li key={item} className="flex gap-3"><CircleCheck className="mt-0.5 size-4.5 shrink-0 text-[#6ee0b4]" aria-hidden />{item}</li>
            ))}
          </ul>
        </div>
        <figure className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
          <blockquote className="text-[15.5px] leading-relaxed text-[#e4e7ec]">
            “We built Signal for the conversation every client eventually has with us: what does AI say about us, and how sure are we? It answers both.”
          </blockquote>
          <figcaption className="mt-4 text-[13px] text-[#9aa4b5]">The Manifest FTS team</figcaption>
        </figure>
      </aside>
    </div>
  );
}
