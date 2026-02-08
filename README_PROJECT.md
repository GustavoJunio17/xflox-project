# XFlow Project

Plataforma de gestão (backend + frontend) — API em Node/TypeScript e frontend em Next.js.

## Estrutura

- `api/` — backend Node + TypeScript (Express, Prisma)
- `web/` — frontend Next.js + Tailwind

## Status

Fase 1 (Base e Segurança) implementada localmente: autenticação JWT, bcrypt, CRUD de setores e AuditLog.

## Requisitos

- Node.js >= 18
- PostgreSQL disponível para a API

## Setup — API

1. Entre na pasta da API:

```bash
cd api
```

2. Instale dependências:

```bash
npm install
```

3. Configure variáveis de ambiente (arquivo `api/.env`):

```env
DATABASE_URL=postgresql://user:password@localhost:5432/xflow_db?schema=public
PORT=3001
JWT_SECRET=uma_chave_secreta
```

4. Aplique migrations e gere o client Prisma:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

5. Inicie em modo desenvolvimento:

```bash
npm run dev
```

## Endpoints principais (API)

- `POST /api/v1/users` — criar usuário (registro público)
- `POST /api/v1/auth/login` — login (retorna JWT)
- `PUT /api/v1/users/:id/role` — alterar role (somente `ADMIN`)
- `GET /api/v1/users` — listar usuários
- `POST /api/v1/sectors` — criar setor (somente `ADMIN`)
- `GET /api/v1/sectors` — listar setores

Use o header `Authorization: Bearer <token>` para rotas protegidas.

## Scripts úteis (pasta `api/scripts`)

- `promote.js <email>` — promove um usuário para `ADMIN` diretamente via Prisma.
- `flow.js` — fluxo automatizado: criar usuário → promover → login → criar setor.

Exemplo de uso:

```bash
# Iniciar API (em outra janela)
cd api && npm run dev

# Rodar fluxo de teste
node api/scripts/flow.js
```

## Testes

Na pasta `api`:

```bash
npm test
```

## Notas de segurança

- Altere `JWT_SECRET` em produção e mantenha a variável fora do repositório.
- Garanta políticas adequadas de senha e expiração de tokens.
- Logs de auditoria gravam ações importantes no banco via tabela `AuditLog`.

## Próximos passos recomendados

- Criar políticas mais granulares de permissão além do enum `Role`.
- Adicionar testes de integração para fluxos críticos (auth, sectors).
- Provisionar ambiente de staging e CI para migrations automáticas.

---

Se quiser, eu posso ajustar esse README com informações adicionais (ex.: diagramas, exemplos curl detalhados, ou instruções de deploy).
