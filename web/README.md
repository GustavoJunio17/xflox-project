# Web Dashboard for XFlow

This folder holds a minimal Next.js dashboard implementation for the XFlow project.

Pages added:
- `/admin/dashboard` — Administrative dashboard with cashflow chart and tasks summary.
- `/colaborador/dashboard` — Collaborator dashboard with goals and ranking.

API stubs:
- `/api/admin/dashboard` — returns synthetic cashflow and task summary for UI development.

Install and run:
```bash
cd web
npm install
npm run dev
```

Integrations:
- Frontend fetches real data from backend endpoints under `/api/v1/*`. You may proxy or adapt the calls in the components to hit `http://localhost:3001` when running locally.
- Rodar `npm install` para instalar dependências.
