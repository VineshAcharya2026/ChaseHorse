#!/usr/bin/env tsx
/**
 * Extracts content and images from chasehorse.odoo.com
 * Run: pnpm extract:odoo
 */
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as cheerio from 'cheerio';

const BASE = 'https://chasehorse.odoo.com';
const OUT_DIR = path.join(__dirname, '../apps/marketing');
const CONTENT_DIR = path.join(OUT_DIR, 'content');
const ASSETS_DIR = path.join(OUT_DIR, 'public/assets/odoo');

const PAGES = [
  '/',
  '/contactus',
  '/jobs',
  '/tier1',
  '/tier2',
  '/tier-3',
  '/8d-customer-complaints',
  '/merchandise-ppes',
  '/returns-management',
  '/digital-advancement',
  '/optimization-tools',
  '/deploy-cdx-pro',
  '/fleet-driver-management',
  '/esg-sustainability',
  '/customer-xperience-management',
  '/it-advanced-technologies',
  '/fleet-operations',
  '/scm-process',
  '/shop',
  '/shop/ch-ghost-1',
  '/shop/instinct-25',
  '/shop/chasehorse-logo-28',
  '/shop/dragon-29',
  '/slides',
  '/slides/warehouse-basics-training-1',
];

async function downloadImage(url: string): Promise<string | null> {
  try {
    const fullUrl = url.startsWith('http') ? url : `${BASE}${url}`;
    const res = await fetch(fullUrl);
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    const ext = path.extname(new URL(fullUrl).pathname) || '.jpg';
    const hash = crypto.createHash('md5').update(fullUrl).digest('hex').slice(0, 12);
    const filename = `${hash}${ext}`;
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
    fs.writeFileSync(path.join(ASSETS_DIR, filename), buf);
    return `/assets/odoo/${filename}`;
  } catch {
    return null;
  }
}

function slugFromPath(p: string): string {
  if (p === '/') return 'home';
  return p.replace(/^\//, '').replace(/\//g, '-');
}

async function extractPage(urlPath: string) {
  const res = await fetch(`${BASE}${urlPath}`);
  if (!res.ok) {
    console.warn(`SKIP ${urlPath} (${res.status})`);
    return null;
  }
  const html = await res.text();
  const $ = cheerio.load(html);
  const title = $('h1').first().text().trim() || $('title').text().trim();
  const paragraphs: string[] = [];
  $('main p, .oe_structure p, article p').each((_, el) => {
    const t = $(el).text().trim();
    if (t.length > 20) paragraphs.push(t);
  });
  const headings: string[] = [];
  $('h2, h3').each((_, el) => {
    const t = $(el).text().trim();
    if (t) headings.push(t);
  });
  const images: string[] = [];
  $('img[src]').each((_, el) => {
    const src = $(el).attr('src');
    if (src && !src.includes('logo') && !src.includes('icon')) images.push(src);
  });
  const localImages: string[] = [];
  for (const img of images.slice(0, 5)) {
    const local = await downloadImage(img);
    if (local) localImages.push(local);
  }
  return {
    slug: slugFromPath(urlPath),
    path: urlPath,
    title,
    paragraphs: [...new Set(paragraphs)].slice(0, 20),
    headings: [...new Set(headings)].slice(0, 15),
    images: localImages,
  };
}

async function main() {
  console.log('Extracting from', BASE);
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
  const results: Record<string, unknown> = {};
  for (const p of PAGES) {
    console.log('Fetching', p);
    const data = await extractPage(p);
    if (data) results[data.slug] = data;
    await new Promise((r) => setTimeout(r, 500));
  }
  fs.writeFileSync(
    path.join(CONTENT_DIR, 'odoo-raw.json'),
    JSON.stringify(results, null, 2),
  );
  console.log(`Done. Wrote ${Object.keys(results).length} pages to content/odoo-raw.json`);
  console.log(`Images saved to public/assets/odoo/`);
}

main().catch(console.error);
