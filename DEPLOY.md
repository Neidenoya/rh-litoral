# Deploy no Render — RH Litoral

O repositório traz um **Blueprint** (`render.yaml` na raiz) com **1 Web Service**
(NestJS servindo a API `/api/v1` **e** o frontend estático). O **PostgreSQL não é
criado pelo Blueprint** — o Render Free permite só 1 banco grátis por conta (já usado
por outro projeto). Use um **Postgres externo dedicado** e informe a `DATABASE_URL`.

## Passo 1 — Criar um PostgreSQL grátis (Neon)

1. Acesse **https://neon.tech** e entre com o GitHub.
2. **Create project** (região mais próxima). Ao final, copie a **connection string**
   (formato `postgresql://usuario:senha@host/dbname?sslmode=require`).
   - Use a conexão **direta** (sem `-pooler` no host) para o Prisma migrar sem erro.

> Alternativas equivalentes: Supabase, Railway ou ElephantSQL — qualquer Postgres com
> uma connection string pública serve.

## Passo 2 — Deploy no Render (Blueprint)

1. Painel do Render → **New +** → **Blueprint**.
2. Aponte para o repositório (campo **Public Git Repository**:
   `https://github.com/Neidenoya/rh-litoral`) → **main**.
3. O Render lê o `render.yaml` e mostra o serviço **`rh-litoral`**. Em
   **Environment / variables**, cole a **`DATABASE_URL`** do Passo 1.
4. **Apply**. Aguarde o primeiro deploy (~3–5 min): build do frontend + backend,
   migração `0_init` e seed automático.

> Se a sync do Blueprint não pedir a variável, defina-a depois em
> **serviço `rh-litoral` → Environment → `DATABASE_URL`** e clique em **Manual Deploy**.

## URL para enviar à revisão

Depois do deploy, a URL pública (HTTPS, certificado automático do Render) será:

> **https://rh-litoral.onrender.com**

Se o nome `rh-litoral` já estiver em uso na sua conta, o Render adiciona um sufixo —
confira a URL exata no topo da página do serviço.

### Acesso dos revisores (ambiente de teste)

| E-mail | Perfil | Senha |
|--------|--------|-------|
| diretoria@rhlitoral.com.br | Diretoria | `litoral123` |
| rh@rhlitoral.com.br | RH | `litoral123` |
| financeiro@rhlitoral.com.br | Financeiro | `litoral123` |
| gestor@rhlitoral.com.br | Gestor | `litoral123` |
| juridico@rhlitoral.com.br | Jurídico | `litoral123` |

> Esses usuários e os 15 colaboradores de exemplo são criados automaticamente no
> primeiro boot (dados do protótipo). Perfis diferentes mostram o RBAC em ação —
> ex.: **salário e CPF só aparecem** para Diretoria, RH e Financeiro.

## O que acontece automaticamente

- **Build:** `npm install` + build do frontend (Vite) e do backend (NestJS) +
  `prisma generate`.
- **Start:** `prisma migrate deploy` (cria as tabelas via a migração `0_init`) e sobe a API.
- **Seed idempotente no boot:** o `SeedService` popula a base **apenas se estiver vazia**
  (não sobrescreve dados em deploys seguintes).
- **Env vars:** `DATABASE_URL` (Postgres externo, definida por você) e `JWT_SECRET`
  (gerada pelo Render).

## Observações

- **Plano Free:** o serviço **hiberna após inatividade**; a primeira requisição depois
  disso leva ~30–50s para "acordar".
- **Trocar a senha de teste / desativar o seed:** defina a env `SEED_ON_BOOT=false` no
  serviço para não repopular, e gerencie os usuários pelo banco. Antes de um uso real,
  troque as senhas padrão (`litoral123`).
- **Redeploy:** cada push na branch `main` dispara um novo deploy automaticamente.
