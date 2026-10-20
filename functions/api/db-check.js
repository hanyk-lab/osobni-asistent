// Cloudflare Pages Function: read-only diagnostic, no personal data.
export async function onRequestGet({ env }) {
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };
  if (!env.DB) return new Response(JSON.stringify({ ok: false, error: 'Chybí vazba databáze DB.' }), { status: 503, headers });
  try {
    const result = await env.DB.prepare('SELECT 1 AS ready').first();
    if (result?.ready !== 1) throw new Error('unexpected response');
    return new Response(JSON.stringify({ ok: true, database: 'connected' }), { status: 200, headers });
  } catch (_) {
    return new Response(JSON.stringify({ ok: false, error: 'Databáze neodpovídá.' }), { status: 503, headers });
  }
}
