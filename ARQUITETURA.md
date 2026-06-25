# RH – LITORAL · Arquitetura Técnica e Especificação Funcional

> Versão navegável da especificação. Fonte oficial:
> [`docs/RH-Litoral-Documentacao-Tecnica.docx`](docs/RH-Litoral-Documentacao-Tecnica.docx) · Junho/2026.

## 1. Arquitetura em camadas (three-tier)

- **Apresentação (Frontend):** SPA React consumindo API REST/GraphQL; componentização
  por domínio; estado server-side via React Query + Zustand/Context para UI; tema
  claro/escuro via CSS Custom Properties.
- **Aplicação (Backend/API):** API REST/GraphQL por domínio; autenticação JWT/OAuth2;
  regras de negócio na *service layer*; job scheduler (cron) para alertas; RBAC.
- **Dados:** PostgreSQL (integridade referencial do organograma); object storage
  (S3/Azure Blob) para documentos digitalizados; Redis para cache de leitura.

## 2. Modelo de dados (entidades principais)

Entidade central: **Colaborador**, ligada a Cargo, Departamento, Shopping, Empresa e
Centro de Custo. O organograma é derivado do auto-relacionamento
`gestor_imediato_id` (raiz = `NULL`).

- **Colaborador** — id, matrícula, nome, cpf (criptografado), rg, foto_url, cargo_id,
  departamento_id, shopping_id, empresa_id, centro_custo_id, **gestor_imediato_id (self FK)**,
  data_admissao, data_desligamento, motivo_desligamento, tipo_contrato (CLT/Experiência/
  Estágio/PJ/Temporário), salário (restrito por RBAC), carga_horaria, escala, horários,
  contatos, endereço, estado_civil, escolaridade, status (Ativo/Experiência/Afastado/
  Desligado), data_aniversario.
- **Apoio:** Cargo, Departamento, Shopping, Empresa, Centro_Custo.
- **Vaga** — cargo, departamento, shopping, gestor_solicitante, status (Aberta→Triagem→
  Entrevista RH→Entrevista Gestor→Aprovado→Contratado/Cancelada), prioridade,
  data_abertura, candidato_aprovado.
- **Candidato**, **Ferias**, **Treinamento** + **Colaborador_Treinamento** (N:N),
  **Documento**, **Avaliacao_Desempenho**, **Log_Auditoria**.

### Índices-chave
- Composto `(shopping_id, departamento_id, status)` para filtros do Dashboard.
- `gestor_imediato_id` para a CTE recursiva (`WITH RECURSIVE`) do organograma.
- Full-text em `nome_completo`, `cargo`, `matricula` para a busca global.

## 3. Fluxos de funcionamento

- **Organograma automático:** editar gestor → backend valida (existe? cria ciclo?) →
  grava + audita → invalida cache → próxima consulta recalcula via CTE recursiva.
- **Funil de R&S:** Aberta → Triagem → Entrevista RH → Entrevista Gestor → Aprovado →
  Contratado (gera Colaborador). Cancelável em qualquer etapa.
- **Alertas automáticos (cron diário 06:00):** contratos de experiência (7/15 dias),
  férias vencidas/30 dias, treinamentos/certificações vencidos, ASO/exames pendentes,
  vagas abertas há +30 dias, aniversariantes.
- **Ciclo de vida:** Admissão → Experiência (avaliação 45/90 dias) → Ativo (ciclos de
  desempenho) → Desligado (motivo + data; histórico retido para auditoria).

## 4. Telas do protótipo

- **Dashboard Executivo** — KPIs (headcount, vagas, admissões/desligamentos, férias,
  aniversariantes, experiência vencendo, treinamentos pendentes, horas extras, banco de
  horas, turnover, absenteísmo, custo de folha); evolução mensal; headcount por shopping/
  departamento; vagas em acompanhamento; alertas. Componentes: `KpiCard`, `BarList`,
  `AlertItem`, gráficos Recharts.
- **Organograma Interativo** — árvore com nós expansíveis, avatar, cargo, contagem de
  subordinados; clique abre a ficha; zoom, filtro e exportação.
- **Ficha do Colaborador (drawer)** — dados pessoais, contato, profissionais (gestor,
  salário, contrato), cursos/treinamentos e documentos.

## 5. Segurança e RBAC

| Perfil | Leitura | Escrita |
|--------|---------|---------|
| Diretoria | Todos (inclui financeiro/salarial) | Consultivo |
| RH | Operacionais de pessoas | Colaboradores, Vagas, Férias, Treinamentos, Documentos, Avaliações |
| Financeiro | Custo, folha, headcount | Exporta relatórios (sem alterar RH) |
| Jurídico | Documentos, contratos, advertências | Upload jurídico / pareceres |
| Gestor | Equipe direta/indireta | Solicita vagas, aprova férias, avalia |
| Colaborador | Própria ficha, férias, treinamentos | Dados cadastrais básicos |

- Salário e CPF criptografados em repouso e mascarados na UI.
- Conformidade **LGPD** (consentimento, acesso, exclusão; retenção definida pelo Jurídico).
- Log de auditoria imutável; **MFA** obrigatório para Diretoria e RH.

## 6. Roadmap → Portal Corporativo de Gestão Integrada

Fase 1 Fundação (atual) · Fase 2 Consolidação de RH · Fase 3 Integração Financeira ·
Fase 4 Integração Jurídica · Fase 5 Integração Facilities · Fase 6 Portal Único
(dashboard executivo consolidado: pessoas + finanças + jurídico + operação física).
