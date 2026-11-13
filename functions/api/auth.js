// Decap CMS GitHub OAuth — langkah 1: arahkan editor ke GitHub.
// Env yang dipakai: GITHUB_OAUTH_ID (Client ID dari GitHub OAuth App).
// Secret TIDAK pernah keluar dari server — hanya dipakai di /api/callback.
export async function onRequest(context) {
  const { env } = context;
  const host = new URL(context.request.url).origin;
  const redirectUri = host + '/api/callback';
  const state = crypto.randomUUID();
  const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
  authorizeUrl.searchParams.set('client_id', env.GITHUB_OAUTH_ID);
  authorizeUrl.searchParams.set('redirect_uri', redirectUri);
  authorizeUrl.searchParams.set('scope', 'repo');
  authorizeUrl.searchParams.set('state', state);
  const headers = new Headers({ Location: authorizeUrl.toString() });
  headers.append('Set-Cookie', 'decap_oauth_state=' + state + '; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600');
  return new Response(null, { status: 302, headers });
}
