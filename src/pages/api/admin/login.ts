import type { APIRoute } from 'astro';
import { adminPassword, checkPassword, sessionToken, sessionCookie, json } from '../../../lib/admin';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Body tidak valid' }, 400);
  }
  if (typeof body.password !== 'string' || !(await checkPassword(body.password))) {
    return json({ error: 'Password salah' }, 401);
  }
  const pw = adminPassword()!;
  const token = await sessionToken(pw);
  return json({ ok: true }, 200, { 'Set-Cookie': sessionCookie(token) });
};
