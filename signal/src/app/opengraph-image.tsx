import { ImageResponse } from 'next/og';

export const alt = 'Manifest Signal — Know what AI says about you';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 72, background: 'linear-gradient(135deg, #0b1020 0%, #18215a 100%)', color: '#fff', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: '#4353c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="40" height="40" viewBox="0 0 32 32">
              <circle cx="10" cy="22" r="2.6" fill="#fff" />
              <path d="M10 15.2a6.8 6.8 0 0 1 6.8 6.8" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M10 9.4A12.6 12.6 0 0 1 22.6 22" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" opacity=".72" />
              <path d="M10 3.8A18.2 18.2 0 0 1 28.2 22" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" opacity=".42" />
            </svg>
          </div>
          <div style={{ fontSize: 30, fontWeight: 600, display: 'flex', gap: 10 }}><span style={{ color: '#9aa4b5' }}>Manifest</span>Signal</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05 }}>Know what AI says about you.</div>
          <div style={{ fontSize: 30, color: '#c9d0db', marginTop: 24, lineHeight: 1.4 }}>Visibility, citations, and accuracy across ChatGPT, Perplexity, Gemini, and Claude, with a confidence interval on every number.</div>
        </div>
        <div style={{ fontSize: 22, color: '#9aa4b5' }}>A product by Manifest FTS</div>
      </div>
    ),
    size,
  );
}
