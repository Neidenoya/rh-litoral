# RH Litoral — Aplicação (Fase 2)

Monorepo da plataforma: **`backend/`** (NestJS + Prisma + PostgreSQL) e
**`frontend/`** (React + Vite + TypeScript). Scaffold inicial da Fase 2 — núcleo do
modelo de dados, organograma recursivo, RBAC e telas Dashboard / Organograma /
Colaboradores já funcionais.

```
app/
├── backend/    # API REST (NestJS) — porta 3333
│   ├── prisma/schema.prisma   # modelo de dados completo (Colaborador + organograma recursivo)
│   ├── prisma/seed.ts         # 15 colaboradores do protótipo + usuários por perfil
│   └── src/
│       ├── auth/              # JWT + RBAC (perfis Diretoria/RH/Financeiro/Jurídico/Gestor/Colaborador)
│       ├── colaboradores/     # CRUD + mascaramento por RBAC + auditoria
│       ├── organograma/       # CTE recursiva (árvore, subordinados, anti-ciclo)
│       └── indicadores/       # KPIs do dashboard
└── frontend/   # SPA (Vite) — porta 5173, proxy /api → 3333
    └── src/
        ├── features/          # auth, dashboard, organograma, colaboradores
        ├── components/layout/ # AppShell (sidebar + topbar)
        └── styles/tokens.css  # design tokens do protótipo
```

## Pré-requisitos

- **Node.js 20+**
- **PostgreSQL 14+** rodando localmente (ou via Docker)

> Início rápido do banco com Docker:
> `docker run --name rh-litoral-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=rh_litoral -p 5432:5432 -d postgres:16`

## Backend

```bash
cd backend
npm install
cp .env.example .env            # ajuste DATABASE_URL se necessário
npm run prisma:generate         # gera o Prisma Client
npm run prisma:migrate          # cria as tabelas (migration inicial)
npm run seed                    # popula com os dados do protótipo
npm run start:dev               # API em http://localhost:3333/api/v1
```

### Usuários do seed (senha `litoral123`)

| E-mail | Perfil |
|--------|--------|
| diretoria@rhlitoral.com.br | DIRETORIA |
| rh@rhlitoral.com.br | RH |
| financeiro@rhlitoral.com.br | FINANCEIRO |
| gestor@rhlitoral.com.br | GESTOR |
| juridico@rhlitoral.com.br | JURIDICO |

### Endpoints principais

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/v1/auth/login` | Login → JWT |
| GET | `/api/v1/indicadores/dashboard` | KPIs do dashboard |
| GET | `/api/v1/organograma` | Árvore hierárquica (raiz → filhos) |
| GET | `/api/v1/organograma/:id/subordinados` | Subordinados diretos+indiretos (CTE recursiva) |
| GET | `/api/v1/colaboradores` | Lista (filtros: shoppingId, departamentoId, status, busca) |
| GET | `/api/v1/colaboradores/:id` | Ficha completa |
| POST | `/api/v1/colaboradores` | Criar (RH) |
| PATCH | `/api/v1/colaboradores/:id` | Atualizar (RH) — valida ciclo ao trocar gestor + auditoria |

## Frontend

```bash
cd frontend
npm install
npm run dev                     # http://localhost:5173 (proxy /api → backend)
```

## Notas de arquitetura

- **Organograma é projeção:** a árvore vem de `Colaborador.gestorImediatoId`
  (auto-relacionamento). `OrganogramaService` resolve via **CTE recursiva**
  (`WITH RECURSIVE`) — subordinados e validação anti-ciclo na troca de gestor.
- **RBAC:** `@Roles()` + `RolesGuard`. Salário e CPF são mascarados na serialização
  para perfis sem permissão.
- **Auditoria:** alterações de salário, gestor e desligamento gravam `LogAuditoria`.
- **CPF criptografado em repouso:** previsto no schema (campo `cpf`) — a rotina de
  cifragem AES-256-GCM entra junto da camada de persistência (TODO da Fase 2).

> ⚠️ Pastas `node_modules/` e builds **não** são versionadas (ver `.gitignore` na raiz).
> Como o projeto está no OneDrive, evite rodar dois `npm run dev` simultâneos durante
> sincronização para não disputar lock de arquivos de build.
