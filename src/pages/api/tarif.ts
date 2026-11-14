import type { APIRoute } from 'astro';
import { loadSiteData } from '../../lib/db';

export const prerender = false;

export const GET: APIRoute = async () => {
  const data = await loadSiteData();
  return new Response(JSON.stringify({ rows: data.tarif, source: data.source }), {
    headers: {
      'Content-Type': 'application/json',
      'X-Data-Source': data.source,
    },
  });
};
