import type { Request, Response } from 'express';

const MAS_BASE_URL =
  'https://eservices.mas.gov.sg/apimg-gw/server/monthly_statistical_bulletin_non610ora/exchange_rates_end_of_period_daily/views/exchange_rates_end_of_period_daily';

/**
 * Serverless /api/exchangerates endpoint
 * Fetches Monetary Authority of Singapore (MAS) exchange rate data
 * Note: No API keys are hardcoded. Keys are read dynamically from environment variables,
 * request headers, or query parameters.
 */
export default async function handler(req: Request, res: Response) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key, x-mas-api-key, apikey');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method Not Allowed',
      message: 'Only GET requests are supported.',
    });
  }

  // Extract API key dynamically from environment or request without hardcoding
  const headerKey =
    (req.headers['x-mas-api-key'] as string) ||
    (req.headers['apikey'] as string) ||
    (req.headers['x-api-key'] as string) ||
    (req.headers['authorization']?.replace(/^Bearer\s+/i, '') as string) ||
    '';

  const queryKey = typeof req.query.api_key === 'string' ? req.query.api_key : '';
  const resolvedApiKey = (process.env.MAS_API_KEY || headerKey || queryKey).trim();

  // Allow dynamic end_of_day query parameter, defaulting to the requested 2026-10-14
  const endOfDay = (typeof req.query.end_of_day === 'string' && req.query.end_of_day) || '2026-10-14';
  const limit = req.query.limit || req.query.rows || '10';

  const masTargetUrl = new URL(MAS_BASE_URL);
  masTargetUrl.searchParams.set('end_of_day', endOfDay);
  if (limit) {
    masTargetUrl.searchParams.set('rows', String(limit));
  }

  // Prepare outgoing headers for MAS API Gateway
  const outgoingHeaders: Record<string, string> = {
    Accept: 'application/json, text/plain, */*',
    'User-Agent': 'SingaFX-MAS-Client/1.0',
  };

  if (resolvedApiKey) {
    // Send API key in common MAS API gateway formats
    outgoingHeaders['X-Mas-Api-Key'] = resolvedApiKey;
    outgoingHeaders['apikey'] = resolvedApiKey;
    outgoingHeaders['Authorization'] = `Bearer ${resolvedApiKey}`;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const masResponse = await fetch(masTargetUrl.toString(), {
      method: 'GET',
      headers: outgoingHeaders,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const contentType = masResponse.headers.get('content-type') || '';
    const rawText = await masResponse.text();

    let data: any = null;
    if (contentType.includes('application/json')) {
      try {
        data = JSON.parse(rawText);
      } catch {
        data = { raw: rawText };
      }
    } else {
      // Could be XML SOAP fault from MAS Vordel API Gateway when key is missing or invalid
      try {
        data = JSON.parse(rawText);
      } catch {
        data = {
          raw: rawText,
          isXmlOrHtml: true,
        };
      }
    }

    if (!masResponse.ok) {
      return res.status(masResponse.status).json({
        success: false,
        statusCode: masResponse.status,
        message: 'MAS API gateway returned an error response.',
        keyConfigured: Boolean(resolvedApiKey),
        hint: resolvedApiKey
          ? 'Verify that your MAS API key is valid and subscribed to the Monthly Statistical Bulletin non610ora API.'
          : 'MAS API gateway requires an API key. Please configure MAS_API_KEY in your environment or pass via x-mas-api-key header.',
        details: data,
        endpointCalled: masTargetUrl.toString(),
      });
    }

    return res.status(200).json({
      success: true,
      source: 'Monetary Authority of Singapore (MAS)',
      endpoint: masTargetUrl.toString(),
      end_of_day: endOfDay,
      keyConfigured: Boolean(resolvedApiKey),
      data: data,
    });
  } catch (err: any) {
    return res.status(502).json({
      success: false,
      error: 'Bad Gateway',
      message: 'Failed to connect to MAS API gateway.',
      details: err?.message || String(err),
      endpointCalled: masTargetUrl.toString(),
      keyConfigured: Boolean(resolvedApiKey),
    });
  }
}
