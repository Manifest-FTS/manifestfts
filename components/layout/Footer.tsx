import Image from "next/image";
import Link from "next/link";

const Footer = () => <footer className="mfts-site mf-footer">
  <div className="mf-container">
    <div className="mf-footer__top">
      <div className="mf-footer__brand">
        <Image src="/assets/imgs/manifest-logo-mark-fts.svg" alt="" width={46} height={46} />
        <div><strong>Manifest FTS</strong><span>Trusted technology. Built to last.</span></div>
      </div>
      <div className="mf-footer__links">
        <div><h2>Explore</h2><Link href="/services">Services</Link><Link href="/work">Client stories</Link><Link href="/insights">Insights</Link><Link href="/about">About</Link></div>
        <div><h2>Get in touch</h2><Link href="/contact">Start a project</Link><a href="mailto:hello@manifestfts.com">hello@manifestfts.com</a><Link href="/privacy-policy">Privacy</Link><Link href="/terms">Terms</Link></div>
      </div>
    </div>
    <div className="mf-footer__bottom"><span>© {new Date().getFullYear()} Manifest FTS. All rights reserved.</span><span>Forward Thinking Solutions · Engineering-led digital partnership</span></div>
  </div>
</footer>;

export default Footer;
