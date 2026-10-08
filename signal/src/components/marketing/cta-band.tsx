import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { buttonClass } from '@/components/ui/button';
import { TrackLink } from '@/components/track-link';

export function CtaBand({ title = 'Find out what AI says about you this week.', body = 'Start with sample data in minutes, invite your team, and switch to live observations when you are ready.' }: { title?: string; body?: string }) {
  return (
    <section aria-labelledby="cta-title" className="px-4 pb-20 sm:pb-24">
      <div className="relative mx-auto max-w-[1136px] overflow-hidden rounded-3xl bg-[#0b1020] px-6 py-14 text-center sm:px-12 sm:py-20">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_0%,rgb(67_83_199/0.45),transparent_70%)]" />
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-[0.07] [mask-image:radial-gradient(70%_60%_at_50%_40%,#000,transparent)]" />
        <div className="relative">
          <h2 id="cta-title" className="mx-auto max-w-2xl text-[30px] font-semibold leading-[1.12] tracking-[-0.035em] text-white sm:text-[42px]">{title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-[16.5px] leading-relaxed text-[#c9d0db]">{body}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <TrackLink href="/signup" label="cta_band_trial" className={buttonClass({ size: 'lg', className: 'bg-white text-[#0b1020] hover:bg-white/90 dark:text-[#0b1020]' })}>
              Start your free trial <ArrowRight aria-hidden />
            </TrackLink>
            <Link href="/contact" className={buttonClass({ size: 'lg', variant: 'ghost', className: 'text-white hover:bg-white/10 hover:text-white' })}>Talk to Manifest FTS</Link>
          </div>
          <p className="mt-5 text-[13px] text-[#9aa4b5]">14-day trial · No card required · Cancel anytime</p>
        </div>
      </div>
    </section>
  );
}
