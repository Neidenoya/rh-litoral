# Deploy no Render — RH Litoral

O repositório já traz um **Blueprint** (`render.yaml` na raiz) que provisiona tudo:
**1 Web Service** (NestJS servindo a API `/api/v1` **e** o frontend estático) +
**1 PostgreSQL**. Não há passos manuais de infraestrutura.

## Passo a passo (uma vez)

1. Acesse o painel do Render → **New +** → **Blueprint**.
2. Conecte a conta do GitHub e selecione o repositório **`fleandro1234-netizen/rh-litoral`**
   (repo privado — autorize o acesso do Render se pedir).
3. O Render lê o `render.yaml`, mostra os recursos (`rh-litoral` + `rh-litoral-db`) e
   pede **Apply**. Confirme.
4. Aguarde o primeiro deploy (~3–5 min): build do frontend + backend, migração do
   banco e seed automático.

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
- **Env vars:** `DATABASE_URL` (injetada do Postgres) e `JWT_SECRET` (gerada pelo Render).

## Observações

- **Plano Free:** o serviço **hiberna após inatividade**; a primeira requisição depois
  disso leva ~30–50s para "acordar". O Postgres Free do Render tem limite de retenção —
  para uso prolongado, migrar para um plano pago.
- **Trocar a senha de teste / desativar o seed:** defina a env `SEED_ON_BOOT=false` no
  serviço para não repopular, e gerencie os usuários pelo banco. Antes de um uso real,
  troque as senhas padrão (`litoral123`).
- **Redeploy:** cada push na branch `main` dispara um novo deploy automaticamente.
