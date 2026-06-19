const API_URL = process.env.API_URL ?? 'http://localhost:8787';

const res = await fetch(`${API_URL}/admin/seed`, { method: 'POST' });
const body = await res.text();

if (!res.ok) {
  console.error(`Seed failed (${res.status}): ${body}`);
  process.exit(1);
}

console.log(body);
