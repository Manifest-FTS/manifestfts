'use client';

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', display: 'grid', placeItems: 'center', minHeight: '100vh', margin: 0, color: '#101828' }}>
        <main style={{ textAlign: 'center', maxWidth: 420, padding: 16 }}>
          <h1 style={{ fontSize: 24 }}>Manifest Signal is temporarily unavailable</h1>
          <p style={{ color: '#475467' }}>Please try again in a moment.</p>
          <button onClick={reset} style={{ marginTop: 16, padding: '10px 16px', borderRadius: 8, border: 0, background: '#4353c7', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Try again</button>
        </main>
      </body>
    </html>
  );
}
