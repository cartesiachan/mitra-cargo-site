// Theme values from D1 (konten.tema / konten.heroOverlay / konten.pengumuman).
// Read at request time by Base.astro (layout) and index.astro (hero/process).
// Every value falls back to the current live value, so the site looks
// identical until Sen changes something in /admin-d1.

export interface Tema {
  brand: string;
  aksen: string;
  navy: string;
  hijau: string;
}

export interface HeroOverlay {
  left: number;
  right: number;
}

export interface Pengumuman {
  aktif: boolean;
  teks: string;
}

export const TEMA_DEFAULT: Tema = {
  brand: '#970A0A',
  aksen: '#FFCD06',
  navy: '#0f172a',
  hijau: '#16a34a',
};

export const OVERLAY_DEFAULT: HeroOverlay = { left: 0.82, right: 0.4 };

function hexOk(v: any): v is string {
  return typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v);
}

export function resolveTema(raw: any): Tema {
  const t = (raw && typeof raw === 'object' ? raw : {}) as any;
  return {
    brand: hexOk(t.brand) ? t.brand : TEMA_DEFAULT.brand,
    aksen: hexOk(t.aksen) ? t.aksen : TEMA_DEFAULT.aksen,
    navy: hexOk(t.navy) ? t.navy : TEMA_DEFAULT.navy,
    hijau: hexOk(t.hijau) ? t.hijau : TEMA_DEFAULT.hijau,
  };
}

export function resolveOverlay(raw: any): HeroOverlay {
  const o = (raw && typeof raw === 'object' ? raw : {}) as any;
  const num = (v: any, dflt: number) => {
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 && n <= 1 ? n : dflt;
  };
  return { left: num(o.left, OVERLAY_DEFAULT.left), right: num(o.right, OVERLAY_DEFAULT.right) };
}

export function resolvePengumuman(raw: any): Pengumuman {
  const p = (raw && typeof raw === 'object' ? raw : {}) as any;
  return {
    aktif: p.aktif === true,
    teks: typeof p.teks === 'string' ? p.teks : '',
  };
}

export function hexToRgbTriplet(hex: string): string {
  const h = hex.replace('#', '');
  const n = parseInt(h, 16);
  if (Number.isNaN(n)) return '15, 23, 42';
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(', ');
}

/** Inline CSS variables for <body style="..."> — inherited by the whole page. */
export function temaBodyStyle(tema: Tema): string {
  return (
    `--brand:${tema.brand};--aksen:${tema.aksen};` +
    `--navy:${tema.navy};--hijau:${tema.hijau};` +
    `--navy-rgb:${hexToRgbTriplet(tema.navy)}`
  );
}

/** Hero background-image (gradient overlay from D1 + hero photo). */
export function heroBackground(tema: Tema, ov: HeroOverlay): string {
  const rgb = hexToRgbTriplet(tema.navy);
  return `linear-gradient(90deg, rgba(${rgb}, ${ov.left}), rgba(${rgb}, ${ov.right})), url("/images/hero-koper.jpg")`;
}

/** Process section background-image (same navy, fixed 0.85 overlay). */
export function processBackground(tema: Tema): string {
  const rgb = hexToRgbTriplet(tema.navy);
  return `linear-gradient(rgba(${rgb}, .85), rgba(${rgb}, .85)), url("/images/terminal-bremerhaven.jpg")`;
}
