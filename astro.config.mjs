import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://www.mitraperkasacargo.com/',
  output: 'server',
  adapter: cloudflare(),
  integrations: [sitemap()],
});
