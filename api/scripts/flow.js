const { execFileSync } = require('child_process');
const path = require('path');

async function httpPost(url, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch (e) { json = { raw: text }; }
  return { status: res.status, body: json };
}

async function run() {
  const base = process.argv[2] || 'http://localhost:3001';
  const email = process.env.FLOW_EMAIL || 'admin@example.com';
  const password = process.env.FLOW_PASSWORD || 'senha123';
  const name = process.env.FLOW_NAME || 'Admin';
  const sectorName = process.env.FLOW_SECTOR || 'Financeiro';

  console.log('Using base URL:', base);

  console.log('1) Creating user', email);
  const create = await httpPost(`${base}/api/v1/users`, { email, password, name });
  console.log('Create response:', create.status, create.body);
  if (create.status >= 400 && create.status !== 400) {
    console.error('Create user failed - aborting');
    process.exit(1);
  }

  // Promote using scripts/promote.js
  try {
    console.log('2) Promoting user to ADMIN via scripts/promote.js');
    const promotePath = path.join(__dirname, 'promote.js');
    execFileSync(process.execPath, [promotePath, email], { stdio: 'inherit' });
  } catch (err) {
    console.error('Promote script failed:', err.message);
    process.exit(1);
  }

  console.log('3) Logging in');
  const login = await httpPost(`${base}/api/v1/auth/login`, { email, password });
  console.log('Login response:', login.status, login.body);
  if (login.status !== 200) {
    console.error('Login failed - aborting');
    process.exit(1);
  }

  const token = login.body.token;
  if (!token) {
    console.error('No token returned - aborting');
    process.exit(1);
  }

  console.log('4) Creating sector', sectorName);
  const createSector = await httpPost(`${base}/api/v1/sectors`, { name: sectorName }, token);
  console.log('Create sector response:', createSector.status, createSector.body);

  console.log('Flow finished.');
}

run().catch(err => { console.error(err); process.exit(1); });
