import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { isAuthed, json } from '../../../lib/admin';

export const prerender = false;

const KV_TABLES = ['konten', 'kontak', 'seo'] as const;
const REGIONS = ['Sulawesi', 'Maluku', 'Papua'];
const SERVICES = ['PELNI', 'RORO', 'Reguler'];

export const POST: APIRoute = async ({ request }) => {
  if (!(await isAuthed(request))) {
    return json({ error: 'Unauthorized' }, 401);
  }
  const db = (env as any)?.DB;
  if (!db) {
    return json({ error: 'Database tidak tersedia' }, 503);
  }
  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Body JSON tidak valid' }, 400);
  }
  try {
    if (body.table === 'tarif') {
      const rows = body.rows;
      if (!Array.isArray(rows) || rows.length === 0) {
        return json({ error: 'rows harus array tidak kosong' }, 400);
      }
      for (const r of rows) {
        if (typeof r.c !== 'string' || !r.c.trim()) {
          return json({ error: 'kota (c) wajib diisi' }, 400);
        }
        if (!REGIONS.includes(r.r)) {
          return json({ error: `region tidak valid: ${r.r}` }, 400);
        }
        if (!SERVICES.includes(r.s)) {
          return json({ error: `layanan tidak valid: ${r.s}` }, 400);
        }
        if (!Number.isInteger(r.min) || r.min < 0 || !Number.isInteger(r.price) || r.price < 0) {
          return json({ error: 'min/price harus bilangan bulat >= 0' }, 400);
        }
        if (typeof r.eta !== 'string' || typeof r.note !== 'string') {
          return json({ error: 'eta/note harus teks' }, 400);
        }
      }
      const stmts = [db.prepare('DELETE FROM tarif')];
      for (const r of rows) {
        stmts.push(
          db
            .prepare('INSERT INTO tarif (c, r, s, min, price, eta, note) VALUES (?, ?, ?, ?, ?, ?, ?)')
            .bind(r.c.trim(), r.r, r.s, r.min, r.price, r.eta, r.note),
        );
      }
      await db.batch(stmts);
      return json({ ok: true, rows: rows.length });
    }
    if ((KV_TABLES as readonly string[]).includes(body.table)) {
      const { table, key, value } = body;
      if (typeof key !== 'string' || !key) {
        return json({ error: 'key wajib diisi' }, 400);
      }
      const stored = JSON.stringify(value);
      if (stored === undefined) {
        return json({ error: 'value tidak valid' }, 400);
      }
      const existing = await db
        .prepare(`SELECT key FROM ${table} WHERE key = ?`)
        .bind(key)
        .first();
      if (!existing) {
        return json({ error: `key tidak dikenal di ${table}: ${key}` }, 400);
      }
      await db
        .prepare(`UPDATE ${table} SET value = ? WHERE key = ?`)
        .bind(stored, key)
        .run();
      return json({ ok: true });
    }
    return json({ error: 'table tidak dikenal' }, 400);
  } catch (e: any) {
    return json({ error: 'Gagal menyimpan: ' + (e?.message || String(e)) }, 500);
  }
};
