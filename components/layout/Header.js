import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from '../manifest-site';
import Image from 'next/image';

const NAV_ITEMS = [
  { href: '/services', label: 'Services' },
  { href: '/work', label: 'Work' },
  { href: '/insights', label: 'Insights' },
  { href: '/about', label: 'About' },
];

export default function Header() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const currentPath = (router.asPath || '/').split(/[?#]/)[0];
  const isActive = (href) => currentPath === href || (href !== '/' && currentPath.startsWith(`${href}/`));

  return <div className="mfts-site"><header className="mfts-v2-header">
    <div className="mf-container mfts-v2-header__inner">
      <Link href="/" legacyBehavior><a className="mfts-v2-header__brand" aria-label="Manifest FTS home"><Image src="/assets/imgs/logo.svg" alt="Manifest FTS — Forward Thinking Solutions" width={190} height={34} priority /></a></Link>
      <nav className="mfts-v2-header__nav" aria-label="Primary navigation">
        {NAV_ITEMS.map((item) => <Link href={item.href} key={item.href} legacyBehavior><a aria-current={isActive(item.href) ? 'page' : undefined}>{item.label}</a></Link>)}
      </nav>
      <div className="mfts-v2-header__actions">
        <Button href="/contact" variant="quiet">Talk through a project</Button>
        <Button href="/contact"><span className="mf-header-full">Start a conversation</span><span className="mf-header-short">Start project</span><span aria-hidden="true">↗</span></Button>
        <button type="button" className="mfts-v2-header__menu" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} aria-controls="mfts-mobile-navigation" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? '×' : '☰'}</button>
      </div>
    </div>
    <nav id="mfts-mobile-navigation" className={`mfts-v2-header__drawer ${menuOpen ? 'is-open' : ''}`} aria-label="Mobile navigation" aria-hidden={!menuOpen}>
      {NAV_ITEMS.map((item) => <Link href={item.href} key={item.href} legacyBehavior><a tabIndex={menuOpen ? 0 : -1} aria-current={isActive(item.href) ? 'page' : undefined} onClick={() => setMenuOpen(false)}>{item.label}</a></Link>)}
      <Link href="/contact" legacyBehavior><a tabIndex={menuOpen ? 0 : -1} onClick={() => setMenuOpen(false)}>Start a conversation ↗</a></Link>
    </nav>
  </header></div>;
}
