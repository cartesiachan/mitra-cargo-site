// Data layer for the SSR PoC: reads from D1 at request time; falls back to
// the bundled JSON files when no D1 binding is attached (PoC preview before
// the remote database exists). The X-Data-Source response header shows
// which source served the page, so the fallback can never silently pose
// as the live database.
//
// Bindings come from `cloudflare:workers` (Astro.locals.runtime was removed
// in Astro v6).
import { env } from 'cloudflare:workers';
import kontenJson from '../data/konten.json';
import kontakJson from '../data/kontak.json';
import seoJson from '../data/seo.json';
import tarifJson from '../data/tarif.json';

export interface SiteData {
  konten: any;
  kontak: any;
  seo: any;
  tarif: any[];
  source: 'd1' | 'json-fallback';
}

function rowsToObject(rows: Array<{ key: string; value: string }>): any {
  const out: any = {};
  for (const r of rows) {
    try {
      out[r.key] = JSON.parse(r.value);
    } catch {
      out[r.key] = r.value;
    }
  }
  return out;
}

export async function loadSiteData(): Promise<SiteData> {
  const db = (env as any)?.DB;
  if (!db) {
    return {
      konten: kontenJson,
      kontak: kontakJson,
      seo: seoJson,
      tarif: tarifJson.rows,
      source: 'json-fallback',
    };
  }
  const [kontenRes, kontakRes, seoRes, tarifRes] = await Promise.all([
    db.prepare('SELECT key, value FROM konten').all(),
    db.prepare('SELECT key, value FROM kontak').all(),
    db.prepare('SELECT key, value FROM seo').all(),
    db.prepare('SELECT c, r, s, min, price, eta, note FROM tarif').all(),
  ]);
  return {
    konten: rowsToObject(kontenRes.results ?? []),
    kontak: rowsToObject(kontakRes.results ?? []),
    seo: rowsToObject(seoRes.results ?? []),
    tarif: tarifRes.results ?? [],
    source: 'd1',
  };
}
