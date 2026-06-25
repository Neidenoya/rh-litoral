# RH – LITORAL

**Sistema Estratégico de Gestão de Pessoas para Administração de Shopping Centers**

Plataforma de Gestão Estratégica de Pessoas voltada à administração de shopping
centers. Centraliza informações de colaboradores, automatiza o organograma
corporativo e fornece indicadores executivos em tempo real para **Diretoria, RH,
Financeiro e Jurídico**.

> Mais do que um cadastro de funcionários: uma plataforma analítica e operacional
> (dashboard executivo, alertas automáticos, controle de vagas, férias, treinamentos
> e documentos), arquitetada para evoluir para um **Portal Corporativo de Gestão
> Integrada** (RH + Financeiro + Jurídico + Facilities).

---

## Status do projeto

| Fase | Descrição | Situação |
|------|-----------|----------|
| **Fase 1 — Fundação** | Especificação técnica + protótipo (Dashboard, Organograma, Ficha do Colaborador) | ✅ Documentado / protótipo entregue |
| Fase 2 — Consolidação de RH | Vagas, Recrutamento, Férias, Treinamentos, Documentos, Avaliações, Relatórios + SSO/RBAC | ⏳ Planejado |
| Fase 3 — Integração Financeira | ERP, centro de custo, orçamento de headcount, folha | ⏳ Planejado |
| Fase 4 — Integração Jurídica | Contratos, processos, prazos | ⏳ Planejado |
| Fase 5 — Integração Facilities | Escalas, turnos, dimensionamento operacional | ⏳ Planejado |
| Fase 6 — Portal Corporativo Único | Autenticação, navegação e dashboard executivo consolidados | ⏳ Planejado |

---

## Conteúdo deste repositório

```
RH_Litoral/
├── docs/
│   └── RH-Litoral-Documentacao-Tecnica.docx   # Documento de arquitetura e especificação funcional
├── prototipo/
│   └── index.html                             # Protótipo de alta fidelidade (abre direto no navegador)
├── app/                                       # Aplicação (Fase 2) — ver app/README.md
│   ├── backend/                               # NestJS + Prisma + PostgreSQL (API REST)
│   └── frontend/                              # React + Vite + TypeScript (SPA)
├── ARQUITETURA.md                             # Versão navegável da especificação técnica
├── .gitignore
└── README.md
```

> **Fase 2 em andamento** — o scaffold da aplicação está em [`app/`](app/README.md):
> schema PostgreSQL completo, organograma via CTE recursiva, RBAC e as telas Dashboard /
> Organograma / Colaboradores consumindo a API. Setup e endpoints em [`app/README.md`](app/README.md).

### Protótipo

Abra `prototipo/index.html` diretamente no navegador — **sem instalação**. Cobre as
três telas mais estratégicas: **Dashboard Executivo**, **Organograma Interativo** e
**Ficha do Colaborador**. As demais telas (Vagas, Recrutamento, Férias, Treinamentos,
Documentos, Avaliações, Indicadores, Relatórios, Configurações) têm navegação e
identidade visual já implementadas como prévia.

---

## Stack recomendada (alvo)

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React + TypeScript, Tailwind CSS, React Query (TanStack) |
| Gráficos | Recharts |
| Backend | Node.js (NestJS) ou .NET (C#) — arquitetura modular por domínio |
| Banco | PostgreSQL (CTE recursiva para organograma, JSON, full-text search) |
| Cache | Redis (dashboard / indicadores) |
| Arquivos | S3 / Azure Blob (documentos digitalizados) |
| Auth | OAuth2 / JWT + RBAC |
| Jobs | BullMQ (Node) ou Hangfire (.NET) — alertas automáticos |

## Princípios de design

- **Organograma como projeção**, não entidade própria: a hierarquia é derivada
  automaticamente de `gestor_imediato_id` (auto-relacionamento), via CTE recursiva.
- **Auditável por padrão**: toda alteração em dado sensível (salário, desligamento,
  documentos) registra usuário, data/hora e valor anterior.
- **API-first** e **modularidade por domínio**, para evoluir ao Portal Integrado.
- **RBAC**: perfis Diretoria, RH, Financeiro, Jurídico, Gestor e Colaborador.

## Identidade visual

- Paleta: azul corporativo profundo `#0F2A4A` / `#2563EB`, branco e cinza-claro;
  tema escuro alternável.
- Tipografia: **Inter** (interface/dados) + **Manrope** (títulos).

---

> Repositório **privado**. Documentação técnica completa em
> [`docs/RH-Litoral-Documentacao-Tecnica.docx`](docs/RH-Litoral-Documentacao-Tecnica.docx)
> e [`ARQUITETURA.md`](ARQUITETURA.md).
