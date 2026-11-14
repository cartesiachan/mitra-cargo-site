import type { APIRoute } from 'astro';
import { clearSessionCookie, json } from '../../../lib/admin';

export const prerender = false;

export const POST: APIRoute = async () => {
  return json({ ok: true }, 200, { 'Set-Cookie': clearSessionCookie() });
};
