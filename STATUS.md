# Status do projeto — RH Litoral

> Última atualização: **25/06/2026**

## Onde estamos

| Fase | Entrega | Situação |
|------|---------|----------|
| **1 — Fundação** | Documentação técnica (`docs/`) + protótipo (`prototipo/index.html`) | ✅ Concluído |
| **2 — Scaffold da aplicação** | Monorepo `app/` (backend NestJS+Prisma + frontend React/Vite) | ✅ Scaffold pronto e compilando |
| 2 — Consolidação de RH | Telas restantes + cifragem CPF + jobs de alerta | ⏳ Próximo |
| 3–6 — Integrações | Financeiro · Jurídico · Facilities · Portal Único | ⏳ Planejado |

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

## Próximos passos

1. Subir PostgreSQL e validar o backend (migrate + seed + endpoints/organograma).
2. Construir as telas restantes da Fase 2: Vagas/R&S, Férias, Treinamentos,
   Documentos, Avaliações, Relatórios.
3. Implementar cifragem AES-256-GCM do CPF em repouso (TODO no schema).
4. Job scheduler (cron) para alertas automáticos (experiência, férias, treinamentos,
   ASO, vagas antigas, aniversariantes).
