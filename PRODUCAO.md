# Checklist de Produção — RH Litoral

> O que separa o ambiente atual (**teste/revisão** com dados fictícios) de um
> ambiente de **produção** com dados reais de funcionários. Atualizado em 03/07/2026.
>
> Legenda: 🔴 **crítico** (bloqueia produção) · 🟡 **importante** (fazer logo após) ·
> 🟢 **recomendado** (melhoria contínua) · ✅ já resolvido

---

## 1. Segurança e acesso

| # | Item | Prioridade | Status |
|---|------|-----------|--------|
| 1.1 | **Repositório privado.** Hoje o repo está **PÚBLICO** na conta `Neidenoya`. Pedir à Neide para transferir de volta a `fleandro1234-netizen` (ou promover a admin) e tornar **privado**. Sistema de RH com código aberto expõe estrutura e credenciais de teste | 🔴 | Pendente (depende da Neide) |
| 1.2 | **Trocar as senhas padrão** (`litoral123` está no código-fonte). Criar usuários reais com senhas fortes e **remover/desativar os 5 usuários de teste** | 🔴 | Pendente |
| 1.3 | **Desativar o seed em produção**: env `SEED_ON_BOOT=false` após a primeira carga (evita qualquer repopulação acidental) | 🔴 | Pendente (1 env var) |
| 1.4 | **Cifragem do CPF em repouso** (AES-256-GCM com `FIELD_ENCRYPTION_KEY`). O campo existe no schema; a rotina de cifrar/decifrar ainda não foi implementada | 🔴 | Pendente (código) |
| 1.5 | **Gestão de usuários pela interface** (criar/desativar usuário, trocar senha, vincular colaborador) — hoje só via banco | 🟡 | Pendente (tela Fase 2) |
| 1.6 | **Rate limiting no login** (`@nestjs/throttler`) contra força bruta | 🟡 | Pendente |
| 1.7 | **Refresh token + expiração de sessão configurável** (hoje: JWT único de 8h) | 🟡 | Pendente |
| 1.8 | **Headers de segurança** (`helmet`) e CORS restrito ao domínio final | 🟡 | Pendente |
| 1.9 | **MFA para perfis Diretoria e RH** (exigência da spec, Seção 8.3) | 🟡 | Pendente |
| 1.10 | RBAC por perfil (6 perfis) com mascaramento de salário/CPF na API | — | ✅ Implementado |
| 1.11 | Log de auditoria de campos sensíveis (salário, gestor, desligamento) | — | ✅ Implementado |

## 2. Dados e banco

| # | Item | Prioridade | Status |
|---|------|-----------|--------|
| 2.1 | **Banco definitivo.** Neon Free serve para teste; para produção: plano pago do Neon, Postgres pago do Render **ou Postgres interno na rede Peralta** (ver README) | 🔴 | Pendente (decisão) |
| 2.2 | **Backup automático + teste de restauração** (`pg_dump` diário agendado; guardar cópias fora do servidor) | 🔴 | Pendente |
| 2.3 | **LGPD**: política de retenção de dados de candidatos/ex-colaboradores, consentimento documentado, processo de exclusão (definir com o Jurídico) | 🟡 | Pendente (processo) |
| 2.4 | Migrações versionadas do Prisma (`0_init` + próximas via `migrate deploy`) | — | ✅ Implementado |
| 2.5 | Seed idempotente (não sobrescreve base existente) | — | ✅ Implementado |

## 3. Funcionalidades (completar a Fase 2)

| # | Item | Prioridade | Status |
|---|------|-----------|--------|
| 3.1 | Telas **Vagas/R&S** (funil completo), **Férias**, **Treinamentos**, **Documentos**, **Avaliações**, **Relatórios** — hoje são placeholders "Em breve" | 🔴 | Pendente |
| 3.2 | **Upload de documentos** → object storage (S3/Azure Blob ou pasta de rede no cenário on-premise) | 🟡 | Pendente |
| 3.3 | **Jobs de alertas automáticos** (cron 06:00): experiência a vencer, férias, treinamentos/ASO, vagas +30 dias, aniversariantes | 🟡 | Pendente |
| 3.4 | **Edição de colaborador pela interface** (a API já valida ciclo hierárquico e audita; falta o formulário) | 🟡 | Pendente |
| 3.5 | Exportação Excel/PDF dos relatórios | 🟢 | Pendente |
| 3.6 | Dashboard, Organograma (CTE recursiva), Colaboradores com busca | — | ✅ Implementado |

## 4. Operação e qualidade

| # | Item | Prioridade | Status |
|---|------|-----------|--------|
| 4.1 | **Infra sem hibernação**: Render pago (o Free dorme e demora ~30-50s) **ou** servidor interno da rede Peralta | 🟡 | Pendente (decisão) |
| 4.2 | **Monitoramento de erros** (Sentry) + logs estruturados | 🟡 | Pendente |
| 4.3 | **Testes automatizados** dos pontos críticos: anti-ciclo do organograma, RBAC/mascaramento, login | 🟡 | Pendente |
| 4.4 | **Domínio próprio + HTTPS** (ex.: `rh.grupoperalta.com.br`) em vez de `*.onrender.com` | 🟢 | Pendente |
| 4.5 | Health check (`/api/v1/health`) para monitor/uptime | — | ✅ Implementado |
| 4.6 | Deploy automático a cada push na `main` (Blueprint Render) | — | ✅ Implementado |

---

## Ordem sugerida de execução

1. **Agora (antes de dados reais):** 1.1 repo privado → 1.2 senhas → 1.3 `SEED_ON_BOOT=false` → 2.1 banco definitivo → 2.2 backup.
2. **Curto prazo:** 1.4 cifragem CPF → 3.1 telas restantes → 3.4 edição → 1.5 gestão de usuários → 3.3 alertas.
3. **Consolidação:** 1.6–1.9 (hardening) → 4.2 monitoramento → 4.3 testes → 4.4 domínio.

> **Resumo executivo:** o sistema está pronto para **demonstração e revisão**. Para
> produção com dados reais, os bloqueadores são: privacidade do repositório, senhas,
> banco definitivo com backup, cifragem do CPF e as telas operacionais da Fase 2.
