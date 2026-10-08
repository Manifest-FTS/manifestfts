import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { site } from '@/lib/site';
import { THEME_SCRIPT } from '@/components/ui/theme-toggle';
import { Analytics } from '@/components/analytics';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.company, url: site.companyUrl }],
  creator: site.company,
  publisher: site.company,
  category: 'technology',
  openGraph: { siteName: site.name, type: 'website', locale: 'en_US' },
  twitter: { card: 'summary_large_image' },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0d14' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-dvh">
        <a href="#main" className="sr-only-focusable fixed left-4 top-3 z-[100] rounded-lg bg-panel px-4 py-2.5 text-sm font-semibold text-fg shadow-raised">
          Skip to content
        </a>
        {children}
        <Toaster position="bottom-right" toastOptions={{ className: 'font-sans' }} closeButton />
        <Analytics />
      </body>
    </html>
  );
}
