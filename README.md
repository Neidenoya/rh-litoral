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
| **Fase 2 — Scaffold + Deploy** | App NestJS+Prisma+React (Dashboard, Organograma, Colaboradores, Login/RBAC) + base de deploy Render/Neon | ✅ Pronto p/ revisão (`DEPLOY.md`) |
| Fase 2 — Consolidação de RH | Vagas, Recrutamento, Férias, Treinamentos, Documentos, Avaliações, Relatórios + SSO/RBAC | ⏳ Em andamento |
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
├── DEPLOY.md                                  # Deploy na nuvem (Render + Neon) p/ revisão
├── PRODUCAO.md                                # Checklist completo para ir a produção
├── STATUS.md                                  # Estado atual e decisões
├── render.yaml                                # Blueprint do Render (deploy automático)
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

## 🚦 Caminho para produção

O sistema hoje está pronto para **demonstração e revisão** (dados fictícios). O
checklist completo, com prioridades e status de cada item, está em
[`PRODUCAO.md`](PRODUCAO.md). Os **bloqueadores críticos** antes de dados reais:

1. 🔴 **Repositório privado** — hoje está público na conta `Neidenoya`; transferir de
   volta e fechar a visibilidade.
2. 🔴 **Trocar as senhas padrão** (`litoral123`) e desativar os usuários de teste.
3. 🔴 **Desativar o seed** em produção (`SEED_ON_BOOT=false`).
4. 🔴 **Banco definitivo com backup diário** (Neon pago, Render pago ou Postgres
   interno — ver seção abaixo).
5. 🔴 **Cifragem do CPF em repouso** (AES-256-GCM) — campo previsto, rotina pendente.
6. 🔴 **Telas operacionais da Fase 2** (Vagas/R&S, Férias, Treinamentos, Documentos,
   Avaliações, Relatórios) — hoje são prévias.

Itens importantes na sequência: gestão de usuários pela interface, rate limiting,
refresh token, MFA (Diretoria/RH), monitoramento (Sentry), testes automatizados e
domínio próprio. Detalhes e ordem sugerida em [`PRODUCAO.md`](PRODUCAO.md).

---

## 🏢 Implantação na rede do Grupo Peralta (passo a passo)

Para rodar o RH Litoral **dentro da rede interna** (dados não saem da empresa),
basta um computador Windows ligado à rede que fique **sempre ligado** — um servidor
ou um desktop dedicado (4 GB+ de RAM). Todos os colegas acessam pelo navegador.

### Passo 1 — Instalar os programas no servidor (uma única vez)

1. **Node.js 20 LTS** — https://nodejs.org (instalador Windows, next-next-finish).
2. **PostgreSQL 16** — https://www.postgresql.org/download/windows/ (instalador EDB).
   Durante a instalação, **anote a senha** do usuário `postgres` e mantenha a porta `5432`.
3. **Git** — https://git-scm.com (padrões do instalador).

### Passo 2 — Criar o banco de dados

Abra o **pgAdmin** (instalado junto com o PostgreSQL) → conecte no servidor local →
botão direito em *Databases* → **Create → Database** → nome `rh_litoral` → Save.

*(Ou pelo terminal `SQL Shell (psql)`: `CREATE DATABASE rh_litoral;`)*

### Passo 3 — Baixar o projeto

Abra o **PowerShell** e rode:

```powershell
git clone https://github.com/Neidenoya/rh-litoral.git C:\apps\rh-litoral
```

### Passo 4 — Configurar a conexão

```powershell
copy C:\apps\rh-litoral\app\backend\.env.example C:\apps\rh-litoral\app\backend\.env
notepad C:\apps\rh-litoral\app\backend\.env
```

No arquivo que abrir, ajuste (trocando `SUA_SENHA` pela senha do passo 1):

```
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/rh_litoral?schema=public"
JWT_SECRET="troque-por-uma-frase-longa-e-aleatoria"
PORT=3333
```

### Passo 5 — Compilar (build)

```powershell
cd C:\apps\rh-litoral
npm install --prefix app\frontend
npm run build --prefix app\frontend
npm install --prefix app\backend
npm run prisma:generate --prefix app\backend
npm run build --prefix app\backend
```

### Passo 6 — Criar as tabelas e subir pela primeira vez

```powershell
npm run prisma:deploy --prefix app\backend
node C:\apps\rh-litoral\app\backend\dist\main.js
```

Abra `http://localhost:3333` no navegador do servidor — deve aparecer a tela de
login (o sistema popula os dados de exemplo sozinho no primeiro boot). Feche com
`Ctrl+C` e siga para o próximo passo.

### Passo 7 — Deixar rodando como serviço (liga sozinho com o Windows)

```powershell
npm install -g pm2 pm2-windows-startup
pm2-startup install
pm2 start C:\apps\rh-litoral\app\backend\dist\main.js --name rh-litoral
pm2 save
```

### Passo 8 — Liberar o acesso pela rede (firewall)

PowerShell **como Administrador**:

```powershell
New-NetFirewallRule -DisplayName "RH Litoral" -Direction Inbound -Protocol TCP -LocalPort 3333 -Action Allow -Profile Domain,Private
```

### Passo 9 — Divulgar o endereço para a equipe

1. Descubra o IP do servidor: `ipconfig` (ex.: `192.168.1.50`).
   > Peça à TI para **fixar esse IP** (reserva DHCP), senão ele pode mudar.
2. A equipe acessa pelo navegador: **`http://192.168.1.50:3333`**
3. *(Opcional, mais elegante)* Peça à TI para criar um nome DNS interno —
   ex.: **`http://rh.peralta.local:3333`** apontando para esse IP.

### Passo 10 — Backup diário automático

Crie `C:\apps\backup-rh.ps1` com:

```powershell
$data = Get-Date -Format "yyyy-MM-dd"
& "C:\Program Files\PostgreSQL\16\bin\pg_dump.exe" -U postgres -d rh_litoral -F c -f "C:\backups\rh_litoral_$data.backup"
```

Agende no **Agendador de Tarefas** do Windows (diário, 22h) e mantenha uma cópia da
pasta `C:\backups` fora do servidor (OneDrive/outra máquina).

### Passo 11 — Como atualizar o sistema (quando houver novidades)

```powershell
cd C:\apps\rh-litoral
git pull
npm install --prefix app\frontend  ; npm run build --prefix app\frontend
npm install --prefix app\backend   ; npm run prisma:generate --prefix app\backend
npm run build --prefix app\backend ; npm run prisma:deploy --prefix app\backend
pm2 restart rh-litoral
```

### Nuvem × rede interna — qual usar?

| | **Nuvem (Render + Neon)** | **Rede Peralta (este guia)** |
|---|---|---|
| Acesso | De qualquer lugar (HTTPS) | Só dentro da rede (ou via VPN) |
| Custo | Free p/ teste; pago p/ produção | Só a máquina que já existe |
| Dados | Fora da empresa (EUA) | **Dentro da empresa** |
| Manutenção | Deploy automático a cada push | `git pull` + rebuild (passo 11) |
| Indicado para | Revisão/demonstração | **Produção com dados reais** |

> Recomendação: manter a **nuvem para demonstração** e, aprovado o projeto, implantar
> na **rede interna para produção** — cumprindo LGPD e mantendo dados de RH em casa.

---

> ⚠️ Repositório atualmente **público** (conta `Neidenoya`) — antes de dados reais,
> tornar privado (item 1.1 do [`PRODUCAO.md`](PRODUCAO.md)). Documentação técnica em
> [`docs/RH-Litoral-Documentacao-Tecnica.docx`](docs/RH-Litoral-Documentacao-Tecnica.docx)
> e [`ARQUITETURA.md`](ARQUITETURA.md).
