import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'AI Engineer System Portfolio API',
    geminiConnected: Boolean(process.env.GEMINI_API_KEY),
  });
}
