// Decap CMS GitHub OAuth — langkah 2: tukar code jadi token, kirim ke popup Decap.
// Env yang dipakai: GITHUB_OAUTH_ID + GITHUB_OAUTH_SECRET (keduanya di Pages env).
// Token hanya transit di halaman ini — tidak disimpan di mana pun.
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookie = request.headers.get('Cookie') || '';
  const saved = (cookie.match(/(?:^|;\s*)decap_oauth_state=([^;]+)/) || [])[1];

  let message;
  if (!code || !state || state !== saved) {
    message = 'authorization:github:error:' + JSON.stringify({ error: 'Invalid OAuth state. Coba login ulang.' });
  } else {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: env.GITHUB_OAUTH_ID,
        client_secret: env.GITHUB_OAUTH_SECRET,
        code: code,
        redirect_uri: url.origin + '/api/callback',
      }),
    });
    const data = await res.json();
    if (data.access_token) {
      message = 'authorization:github:success:' + JSON.stringify({ token: data.access_token, provider: 'github' });
    } else {
      message = 'authorization:github:error:' + JSON.stringify({ error: data.error_description || data.error || 'Token exchange failed' });
    }
  }

  const html = '<!doctype html><html><head><meta charset="utf-8"></head><body><script>'
    + 'window.opener.postMessage(' + JSON.stringify(message) + ', "*");'
    + 'window.close();'
    + '</scr' + 'ipt></body></html>';

  return new Response(html, { headers: { 'Content-Type': 'text/html' } });
}
