import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#4353c7', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="120" height="120" viewBox="0 0 32 32">
          <circle cx="10" cy="22" r="2.6" fill="#fff" />
          <path d="M10 15.2a6.8 6.8 0 0 1 6.8 6.8" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M10 9.4A12.6 12.6 0 0 1 22.6 22" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" opacity=".72" />
          <path d="M10 3.8A18.2 18.2 0 0 1 28.2 22" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" opacity=".42" />
        </svg>
      </div>
    ),
    size,
  );
}
