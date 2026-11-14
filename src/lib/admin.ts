// Admin auth for /admin-d1: password gate (env ADMIN_PASSWORD) + stateless
// HMAC session cookie. No server-side session store: Workers are stateless
// across isolates, so the session token is HMAC-SHA256(password, constant),
// hex-encoded. Knowing the token does not reveal the password.
// If ADMIN_PASSWORD is unset, everything is denied (fail closed).
import { env } from 'cloudflare:workers';

const COOKIE_NAME = 'admin_d1_session';
const SESSION_LABEL = 'gagian-admin-d1-v1';
const MAX_AGE = 604800; // 7 days

export function adminPassword(): string | null {
  const pw = (env as any)?.ADMIN_PASSWORD;
  return typeof pw === 'string' && pw.length > 0 ? pw : null;
}

export async function sessionToken(password: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(SESSION_LABEL),
  );
  return [...new Uint8Array(sig)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function ctEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function sha256hex(s: string): Promise<string> {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(d)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function checkPassword(input: string): Promise<boolean> {
  const pw = adminPassword();
  if (!pw || typeof input !== 'string') return false;
  return ctEqual(await sha256hex(input), await sha256hex(pw));
}

export async function isAuthed(request: Request): Promise<boolean> {
  const pw = adminPassword();
  if (!pw) return false;
  const cookie = request.headers.get('Cookie') || '';
  const m = cookie.match(
    new RegExp('(?:^|;\\s*)' + COOKIE_NAME + '=([0-9a-f]{64})(?:;|$)'),
  );
  if (!m) return false;
  return ctEqual(m[1], await sessionToken(pw));
}

export function sessionCookie(token: string): string {
  return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${MAX_AGE}`;
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}

export function json(
  data: unknown,
  status = 200,
  headers: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}
