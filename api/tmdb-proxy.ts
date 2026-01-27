import type { VercelRequest, VercelResponse } from '@vercel/node';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Allowed endpoints to prevent abuse
const ALLOWED_ENDPOINTS = [
  /^\/trending\/(movie|tv|all)\/(day|week)$/,
  /^\/movie\/(popular|top_rated|now_playing)$/,
  /^\/tv\/(popular|top_rated)$/,
  /^\/movie\/\d+$/,
  /^\/tv\/\d+$/,
  /^\/tv\/\d+\/season\/\d+$/,
  /^\/search\/(multi|movie|tv)$/,
  /^\/movie\/\d+\/recommendations$/,
  /^\/tv\/\d+\/recommendations$/,
  /^\/movie\/\d+\/similar$/,
  /^\/tv\/\d+\/similar$/,
  /^\/movie\/\d+\/images$/,
  /^\/tv\/\d+\/images$/,
  /^\/movie\/\d+\/videos$/,
  /^\/tv\/\d+\/videos$/,
  /^\/movie\/\d+\/reviews$/,
  /^\/tv\/\d+\/reviews$/,
  /^\/collection\/\d+$/,
];

function isAllowedEndpoint(endpoint: string): boolean {
  return ALLOWED_ENDPOINTS.some(pattern => pattern.test(endpoint));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check API key
  if (!TMDB_API_KEY) {
    console.error('TMDB_API_KEY is not configured');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const { endpoint, params = {} } = req.body;

    if (!endpoint || typeof endpoint !== 'string') {
      return res.status(400).json({ error: 'Missing endpoint parameter' });
    }

    // Validate endpoint
    if (!isAllowedEndpoint(endpoint)) {
      return res.status(403).json({ error: 'Endpoint not allowed' });
    }

    // Build URL with params
    const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
    url.searchParams.set('api_key', TMDB_API_KEY);
    
    // Add additional params
    Object.entries(params).forEach(([key, value]) => {
      if (typeof value === 'string') {
        url.searchParams.set(key, value);
      }
    });

    // Fetch from TMDB
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('TMDB API error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: `TMDB API error: ${response.status}` 
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('TMDB proxy error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
