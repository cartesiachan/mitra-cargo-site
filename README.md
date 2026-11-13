# mitra-cargo-site

Astro rebuild of the Mitra Perkasa Cargo company site (cargo expedition,
Jakarta — sea, land, air). Staging: https://mitra-perkasa-cargo.pages.dev/

The live staging copy is currently branded **Gagian Cargo** (rename test);
the underlying content, tariff data and contact details are Mitra Perkasa
Cargo's, transcribed from their published price pages. Staging only — the
real domain (mitraperkasacargo.com) is untouched.

## Run

```sh
npm install
bash scripts/download-photos.sh   # restores the 12 photos (not stored in git)
npm run build                     # output in dist/
```

## Deploy (staging, Cloudflare Pages)

```sh
npx wrangler pages deploy dist --project-name mitra-perkasa-cargo --branch main
```

## Structure

- `src/pages/index.astro` — home (Cek Ongkir + Lacak Resi widget)
- `src/pages/daftar-harga.astro` — full tariff table (71 rows)
- `src/data/tarif.json` — tariff dataset (transcribed from Mitra's price pages)
- `src/data/kontak.json` — contact numbers, email, address
- `src/components/CekOngkir.astro` — the quote/tracking widget (island)
- `src/layouts/Base.astro` — header, footer, global styles

Photos in `public/images/` are intentionally not committed (binary). Three
are Mitra's own photos (collage-*), the rest are Wikimedia Commons images.
