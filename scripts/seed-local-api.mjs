const API_URL = process.env.API_URL ?? 'http://localhost:8787';
const SEED_SECRET = process.env.SEED_SECRET;

const headers: Record<string, string> = {};
if (SEED_SECRET) {
  headers['X-Seed-Secret'] = SEED_SECRET;
}

const res = await fetch(`${API_URL}/admin/seed`, { method: 'POST', headers });
const body = await res.text();

if (!res.ok) {
  console.error(`Seed failed (${res.status}): ${body}`);
  process.exit(1);
}

console.log(body);
