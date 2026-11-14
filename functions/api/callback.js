// Decap CMS GitHub OAuth — langkah 2: tukar code jadi token, kirim ke Decap.
// Env yang dipakai: GITHUB_OAUTH_ID + GITHUB_OAUTH_SECRET (keduanya di Pages env).
// Token hanya transit di halaman ini — tidak disimpan di mana pun.
//
// ALUR WAJIB (Decap 3.x, terbukti dari bundle decap-cms.js):
// halaman ini TIDAK BOLEH langsung mengirim token. Urutannya:
//   1) kirim 'authorizing:github' ke opener (Decap),
//   2) Decap menggemakan pesan yang sama kembali ke popup,
//   3) baru kirim 'authorization:github:success:{...}' (atau ':error:').
// Tanpa handshake ini Decap mengabaikan pesan token dan tetap di layar login
// (gejala 2026-11-14: authorize di GitHub sukses tapi balik ke login lagi).
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
    + 'var msg = ' + JSON.stringify(message) + ';'
    + 'function onEcho(e){'
    + 'if(e.data === "authorizing:github" && e.origin === window.location.origin){'
    + 'window.removeEventListener("message", onEcho);'
    + 'window.opener.postMessage(msg, "*");'
    + 'setTimeout(function(){ window.close(); }, 100);'
    + '}'
    + '}'
    + 'window.addEventListener("message", onEcho);'
    + 'window.opener.postMessage("authorizing:github", "*");'
    + '</scr' + 'ipt></body></html>';

  return new Response(html, { headers: { 'Content-Type': 'text/html' } });
}
