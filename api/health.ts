import type { Request, Response } from 'express';

export default function handler(req: Request, res: Response) {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'AI Engineer System Portfolio API',
    geminiConnected: Boolean(process.env.GEMINI_API_KEY),
  });
}
