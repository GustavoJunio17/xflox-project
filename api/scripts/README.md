Usage
-----

These scripts help you test the user -> promote -> login -> create sector flow locally.

Prerequisites
- Start the API in the `api` folder (`npm run dev`).
- Ensure your `.env` database is reachable and migrations applied.

Scripts
- `scripts/promote.js <email>`: promotes an existing user to `ADMIN` using Prisma directly.
- `scripts/flow.js [baseUrl]`: runs the full flow against the given base URL (default `http://localhost:3001`).

Examples

Start the API (in `api`):

```bash
npm run dev
```

Run the flow (from the `api` folder):

```bash
node scripts/flow.js
```

Or pass a custom base URL and env overrides:

```bash
FLOW_EMAIL=admin@example.com FLOW_PASSWORD=senha123 FLOW_NAME=Admin FLOW_SECTOR=Financeiro node scripts/flow.js http://localhost:3001
```

Notes
- `scripts/promote.js` uses Prisma directly and requires DB access (same as the API). It will fail if the user does not exist.
- `scripts/flow.js` expects the API to be running and will print responses for each step.
