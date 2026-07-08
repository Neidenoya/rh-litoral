# Status do projeto — RH Litoral

> Última atualização: **08/07/2026**

## Onde estamos

| Fase | Entrega | Situação |
|------|---------|----------|
| **1 — Fundação** | Documentação técnica (`docs/`) + protótipo (`prototipo/index.html`) | ✅ Concluído |
| **2 — Scaffold da aplicação** | Monorepo `app/` (backend NestJS+Prisma + frontend React/Vite) | ✅ Scaffold pronto e compilando |
| **2 — Base de deploy (Render)** | `render.yaml` (Web Service; Postgres externo/Neon via `DATABASE_URL`), migração `0_init`, seed no boot, serve estático + health check | ✅ Pronto para publicar (ver `DEPLOY.md`) |
| **Docs de produção** | `PRODUCAO.md` (checklist priorizado) + guia de implantação na rede do Grupo Peralta (README) | ✅ Publicado 03/07 |
| **2 — Telas de RH (leitura)** | Vagas/R&S (funil), Férias, Treinamentos, Documentos, Avaliações, Relatórios — endpoints + páginas + seed de exemplo | ✅ Implementado e **buildando** 08/07 |
| **2 — Escrita nas telas** | Cadastro/edição de colaborador (anti-ciclo + auditoria), abrir vaga, registrar documento (link) + endpoint `/opcoes` p/ os selects | ✅ Implementado e buildando 08/07 |
| 2 — Consolidação de RH | Upload binário de documento (storage), cifragem CPF, jobs de alerta | ⏳ Próximo |
| 3–6 — Integrações | Financeiro · Jurídico · Facilities · Portal Único | ⏳ Planejado |

## Deploy no Render

Blueprint pronto na raiz (`render.yaml`): **1 Web Service** (NestJS serve a API `/api/v1`
+ o frontend estático) + **1 PostgreSQL**. Passo a passo e credenciais de teste em
[`DEPLOY.md`](DEPLOY.md). Migração inicial em `app/backend/prisma/migrations/0_init/`;
seed idempotente no boot (`SeedService`). URL prevista: **https://rh-litoral.onrender.com**.

## Decisões de arquitetura (Fase 2)

- **Backend:** NestJS + Prisma + **PostgreSQL** (TypeScript ponta a ponta).
- **Frontend:** React + Vite + TypeScript, design tokens herdados do protótipo.
- **Organograma é projeção** de `Colaborador.gestorImediatoId` (auto-relacionamento),
  resolvido por **CTE recursiva** (`WITH RECURSIVE`): árvore, subordinados
  diretos+indiretos e validação anti-ciclo na troca de gestor.
- **RBAC** (Diretoria/RH/Financeiro/Jurídico/Gestor/Colaborador) com mascaramento de
  salário/CPF na serialização + **auditoria** de campos sensíveis.

## O que já foi validado (25/06)

- `npm install` nos dois projetos (backend 631 pacotes, frontend 111).
- **Backend `nest build` → sem erros** (Prisma Client gerado).
- **Frontend `tsc && vite build` → sem erros** (89 módulos, bundle ~215 KB).
- **Frontend renderiza no navegador** (Vite dev :5173): tela de login OK, zero erros
  de console.

## O que falta para rodar de ponta a ponta

Apenas um **PostgreSQL** disponível. Com o banco no ar:

```bash
cd app/backend
npm run prisma:migrate   # cria as tabelas
npm run seed             # popula com os 15 colaboradores do protótipo
npm run start:dev        # API em http://localhost:3333/api/v1

cd ../frontend
npm run dev              # http://localhost:5173 (login rh@rhlitoral.com.br / litoral123)
```

Detalhes de setup e endpoints em [`app/README.md`](app/README.md).

## Telas da Fase 2 (implementadas 08/07)

Endpoints + páginas construídos seguindo os padrões existentes (NestJS service/controller/module;
React + React Query + tabelas/painéis). Módulos backend novos: `vagas`, `ferias`,
`treinamentos`, `documentos`, `avaliacoes`, `relatorios`; páginas correspondentes no frontend;
seed estendido com dados de exemplo (vagas em vários estágios do funil, férias incl. vencidas,
treinamentos válido/vencido/pendente, documentos e avaliações). Destaques:

- **Vagas** = board do funil de R&S (Aberta→Contratado) com **Avançar/Cancelar** (RBAC: só RH) e
  **Abrir vaga** (RH ou Gestor).
- **Relatórios** = headcount por depto/shopping, distribuição por contrato/status e **custo de
  folha por departamento** (mascarado — só Diretoria/RH/Financeiro).
- **Escrita (08/07):** endpoint `/opcoes` (listas p/ selects); **cadastro/edição de colaborador**
  (modal, anti-ciclo + auditoria no backend), **abrir vaga**, **registrar documento** (por link).
- Sem mudança de schema → **nenhuma migração nova**; roda sobre a `0_init`.

**Validado (08/07):** `nest build` → sem erros (Prisma Client gerado). `tsc && vite build` → sem
erros (99 módulos, bundle ~243 KB / gzip 74 KB). Falta apenas o teste **end-to-end** com um
PostgreSQL no ar (migrate + seed + leitura + escrita).

## Próximos passos

1. Smoke test end-to-end com Postgres (migrate + seed + leitura + escrita).
2. Upload binário de documento (multer → storage S3/Azure/pasta de rede) — hoje é registro por link.
3. Implementar cifragem AES-256-GCM do CPF em repouso (TODO no schema).
4. Job scheduler (cron) para alertas automáticos (experiência, férias, treinamentos,
   ASO, vagas antigas, aniversariantes).
