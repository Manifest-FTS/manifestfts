import type { NextApiRequest, NextApiResponse } from 'next';
import { readFile } from 'fs/promises';
import path from 'path';

// Explicit allowlist: never turn a query parameter into a filesystem path.
const files: Record<string, { path: string; type: string }> = {
  'tokens.css': { path: path.join(process.cwd(), 'public/signal/tokens.css'), type: 'text/css' },
  'logo.svg': { path: path.join(process.cwd(), 'public/signal/logo.svg'), type: 'image/svg+xml' },
  'STYLE_GUIDE.md': { path: path.join(process.cwd(), 'docs/STYLE_GUIDE.md'), type: 'text/markdown' },
  'signal.tailwind.js': { path: path.join(process.cwd(), 'signal.tailwind.js'), type: 'text/javascript' },
  'newsreader.woff2': { path: path.join(process.cwd(), 'public/signal/newsreader.woff2'), type: 'font/woff2' },
  'jakarta.woff2': { path: path.join(process.cwd(), 'public/signal/jakarta.woff2'), type: 'font/woff2' },
  'newsreader-license.txt': { path: path.join(process.cwd(), 'public/signal/newsreader-license.txt'), type: 'text/plain' },
  'jakarta-license.txt': { path: path.join(process.cwd(), 'public/signal/jakarta-license.txt'), type: 'text/plain' },
};

export default async function assets(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const name = req.query.file;
  if (typeof name !== 'string' || !Object.prototype.hasOwnProperty.call(files, name)) {
    return res.status(404).json({ error: 'Unknown asset' });
  }
  try {
    const file = files[name];
    const data = await readFile(file.path);
    res.setHeader('Content-Type', file.type);
    res.setHeader('Content-Disposition', `attachment; filename="${name}"`);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Content-Length', data.length);
    return req.method === 'HEAD' ? res.status(200).end() : res.status(200).send(data);
  } catch {
    return res.status(500).json({ error: 'Asset unavailable' });
  }
}