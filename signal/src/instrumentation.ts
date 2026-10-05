export async function register() {
  // Connect and apply pending migrations at boot so the first request is fast and schema errors surface early.
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { getDb } = await import('@/lib/db');
    await getDb().catch((error) => console.error('[startup] database unavailable:', error instanceof Error ? error.message : error));
  }
}
