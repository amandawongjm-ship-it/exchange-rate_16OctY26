import type { Request, Response } from 'express';

export interface HealthResponse {
  status: 'ok' | 'degraded';
  service: string;
  timestamp: string;
  uptimeSeconds: number;
  masApiKeyConfigured: boolean;
  environment: string;
}

/**
 * Serverless /api/health endpoint
 * Compatible with Vercel/Netlify functions and Express server
 */
export default async function handler(req: Request, res: Response) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key, x-mas-api-key');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const hasApiKey = Boolean(process.env.MAS_API_KEY && process.env.MAS_API_KEY.trim().length > 0);

  const payload: HealthResponse = {
    status: 'ok',
    service: 'SingaFX MAS Exchange Rate Serverless Service',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    masApiKeyConfigured: hasApiKey,
    environment: process.env.NODE_ENV || 'development',
  };

  return res.status(200).json(payload);
}
