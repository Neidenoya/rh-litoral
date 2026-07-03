-- CreateEnum
CREATE TYPE "TipoContrato" AS ENUM ('CLT', 'EXPERIENCIA', 'ESTAGIO', 'PJ', 'TEMPORARIO');

-- CreateEnum
CREATE TYPE "StatusColaborador" AS ENUM ('ATIVO', 'EXPERIENCIA', 'AFASTADO', 'DESLIGADO');

-- CreateEnum
CREATE TYPE "EstadoCivil" AS ENUM ('SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO', 'UNIAO_ESTAVEL');

-- CreateEnum
CREATE TYPE "StatusVaga" AS ENUM ('ABERTA', 'TRIAGEM', 'ENTREVISTA_RH', 'ENTREVISTA_GESTOR', 'APROVADO', 'CONTRATADO', 'CANCELADA');

-- CreateEnum
CREATE TYPE "PrioridadeVaga" AS ENUM ('BAIXA', 'MEDIA', 'ALTA', 'URGENTE');

-- CreateEnum
CREATE TYPE "StatusFerias" AS ENUM ('PROGRAMADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'VENCIDA');

-- CreateEnum
CREATE TYPE "TipoTreinamento" AS ENUM ('OBRIGATORIO', 'OPCIONAL');

-- CreateEnum
CREATE TYPE "StatusTreinamento" AS ENUM ('VALIDO', 'VENCIDO', 'PENDENTE');

-- CreateEnum
CREATE TYPE "TipoDocumento" AS ENUM ('CONTRATO', 'RG', 'CPF', 'CNH', 'ASO', 'EXAME', 'ADVERTENCIA', 'OUTRO');

-- CreateEnum
CREATE TYPE "Perfil" AS ENUM ('DIRETORIA', 'RH', 'FINANCEIRO', 'JURIDICO', 'GESTOR', 'COLABORADOR');

-- CreateTable
CREATE TABLE "empresa" (
    "id" TEXT NOT NULL,
    "razao_social" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,

    CONSTRAINT "empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "endereco" TEXT,
    "cidade" TEXT,
    "estado" TEXT,

    CONSTRAINT "shopping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departamento" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,

    CONSTRAINT "departamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cargo" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "nivel_hierarquico" INTEGER NOT NULL DEFAULT 0,
    "faixa_salarial_min" DECIMAL(12,2),
    "faixa_salarial_max" DECIMAL(12,2),

    CONSTRAINT "cargo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "centro_custo" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT,
    "departamento_id" TEXT,

    CONSTRAINT "centro_custo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "colaborador" (
    "id" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "nome_completo" TEXT NOT NULL,
    "cpf" TEXT,
    "rg" TEXT,
    "foto_url" TEXT,
    "cargo_id" TEXT NOT NULL,
    "departamento_id" TEXT NOT NULL,
    "shopping_id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "centro_custo_id" TEXT,
    "gestor_imediato_id" TEXT,
    "data_admissao" DATE NOT NULL,
    "data_desligamento" DATE,
    "motivo_desligamento" TEXT,
    "fim_experiencia" DATE,
    "tipo_contrato" "TipoContrato" NOT NULL,
    "salario" DECIMAL(12,2) NOT NULL,
    "carga_horaria" TEXT,
    "escala" TEXT,
    "horario_entrada" TEXT,
    "horario_saida" TEXT,
    "telefone" TEXT,
    "celular" TEXT,
    "email" TEXT,
    "endereco" TEXT,
    "estado_civil" "EstadoCivil",
    "escolaridade" TEXT,
    "cursos" TEXT[],
    "status" "StatusColaborador" NOT NULL DEFAULT 'EXPERIENCIA',
    "data_aniversario" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "colaborador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vaga" (
    "id" TEXT NOT NULL,
    "cargo_id" TEXT NOT NULL,
    "departamento_id" TEXT NOT NULL,
    "shopping_id" TEXT NOT NULL,
    "gestor_solicitante_id" TEXT NOT NULL,
    "status" "StatusVaga" NOT NULL DEFAULT 'ABERTA',
    "prioridade" "PrioridadeVaga" NOT NULL DEFAULT 'MEDIA',
    "data_abertura" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "candidato_aprovado_id" TEXT,

    CONSTRAINT "vaga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidato" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT,
    "telefone" TEXT,
    "curriculo_url" TEXT,
    "vaga_id" TEXT NOT NULL,
    "etapa_atual" TEXT,
    "data_inscricao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "avaliacao_rh" INTEGER,
    "avaliacao_gestor" INTEGER,

    CONSTRAINT "candidato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ferias" (
    "id" TEXT NOT NULL,
    "colaborador_id" TEXT NOT NULL,
    "periodo_aquisitivo_inicio" DATE NOT NULL,
    "periodo_aquisitivo_fim" DATE NOT NULL,
    "data_inicio_gozo" DATE,
    "data_fim_gozo" DATE,
    "dias_utilizados" INTEGER NOT NULL DEFAULT 0,
    "saldo_dias" INTEGER NOT NULL DEFAULT 30,
    "status" "StatusFerias" NOT NULL DEFAULT 'PROGRAMADA',

    CONSTRAINT "ferias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "treinamento" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" "TipoTreinamento" NOT NULL DEFAULT 'OPCIONAL',
    "carga_horaria" INTEGER,
    "validade_meses" INTEGER,

    CONSTRAINT "treinamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "colaborador_treinamento" (
    "id" TEXT NOT NULL,
    "colaborador_id" TEXT NOT NULL,
    "treinamento_id" TEXT NOT NULL,
    "data_realizacao" DATE,
    "data_vencimento" DATE,
    "status" "StatusTreinamento" NOT NULL DEFAULT 'PENDENTE',
    "certificado_url" TEXT,

    CONSTRAINT "colaborador_treinamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documento" (
    "id" TEXT NOT NULL,
    "colaborador_id" TEXT NOT NULL,
    "tipo" "TipoDocumento" NOT NULL DEFAULT 'OUTRO',
    "arquivo_url" TEXT NOT NULL,
    "data_upload" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuario_upload_id" TEXT,

    CONSTRAINT "documento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "avaliacao_desempenho" (
    "id" TEXT NOT NULL,
    "colaborador_id" TEXT NOT NULL,
    "ciclo" TEXT,
    "periodo" TEXT,
    "nota_gestor" DECIMAL(4,2),
    "nota_autoavaliacao" DECIMAL(4,2),
    "metas" JSONB,
    "pdi_url" TEXT,

    CONSTRAINT "avaliacao_desempenho_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "perfil" "Perfil" NOT NULL DEFAULT 'COLABORADOR',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "colaborador_id" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "log_auditoria" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT,
    "entidade" TEXT NOT NULL,
    "entidade_id" TEXT NOT NULL,
    "campo_alterado" TEXT NOT NULL,
    "valor_anterior" TEXT,
    "valor_novo" TEXT,
    "data_hora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "log_auditoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "empresa_cnpj_key" ON "empresa"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "centro_custo_codigo_key" ON "centro_custo"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "colaborador_matricula_key" ON "colaborador"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "colaborador_email_key" ON "colaborador"("email");

-- CreateIndex
CREATE INDEX "colaborador_shopping_id_departamento_id_status_idx" ON "colaborador"("shopping_id", "departamento_id", "status");

-- CreateIndex
CREATE INDEX "colaborador_gestor_imediato_id_idx" ON "colaborador"("gestor_imediato_id");

-- CreateIndex
CREATE UNIQUE INDEX "vaga_candidato_aprovado_id_key" ON "vaga"("candidato_aprovado_id");

-- CreateIndex
CREATE INDEX "vaga_status_prioridade_idx" ON "vaga"("status", "prioridade");

-- CreateIndex
CREATE INDEX "ferias_colaborador_id_idx" ON "ferias"("colaborador_id");

-- CreateIndex
CREATE UNIQUE INDEX "colaborador_treinamento_colaborador_id_treinamento_id_key" ON "colaborador_treinamento"("colaborador_id", "treinamento_id");

-- CreateIndex
CREATE INDEX "documento_colaborador_id_idx" ON "documento"("colaborador_id");

-- CreateIndex
CREATE INDEX "avaliacao_desempenho_colaborador_id_idx" ON "avaliacao_desempenho"("colaborador_id");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_colaborador_id_key" ON "usuario"("colaborador_id");

-- CreateIndex
CREATE INDEX "log_auditoria_entidade_entidade_id_idx" ON "log_auditoria"("entidade", "entidade_id");

-- AddForeignKey
ALTER TABLE "centro_custo" ADD CONSTRAINT "centro_custo_departamento_id_fkey" FOREIGN KEY ("departamento_id") REFERENCES "departamento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "colaborador" ADD CONSTRAINT "colaborador_cargo_id_fkey" FOREIGN KEY ("cargo_id") REFERENCES "cargo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "colaborador" ADD CONSTRAINT "colaborador_departamento_id_fkey" FOREIGN KEY ("departamento_id") REFERENCES "departamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "colaborador" ADD CONSTRAINT "colaborador_shopping_id_fkey" FOREIGN KEY ("shopping_id") REFERENCES "shopping"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "colaborador" ADD CONSTRAINT "colaborador_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "colaborador" ADD CONSTRAINT "colaborador_centro_custo_id_fkey" FOREIGN KEY ("centro_custo_id") REFERENCES "centro_custo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "colaborador" ADD CONSTRAINT "colaborador_gestor_imediato_id_fkey" FOREIGN KEY ("gestor_imediato_id") REFERENCES "colaborador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vaga" ADD CONSTRAINT "vaga_cargo_id_fkey" FOREIGN KEY ("cargo_id") REFERENCES "cargo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vaga" ADD CONSTRAINT "vaga_departamento_id_fkey" FOREIGN KEY ("departamento_id") REFERENCES "departamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vaga" ADD CONSTRAINT "vaga_shopping_id_fkey" FOREIGN KEY ("shopping_id") REFERENCES "shopping"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vaga" ADD CONSTRAINT "vaga_gestor_solicitante_id_fkey" FOREIGN KEY ("gestor_solicitante_id") REFERENCES "colaborador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vaga" ADD CONSTRAINT "vaga_candidato_aprovado_id_fkey" FOREIGN KEY ("candidato_aprovado_id") REFERENCES "candidato"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidato" ADD CONSTRAINT "candidato_vaga_id_fkey" FOREIGN KEY ("vaga_id") REFERENCES "vaga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ferias" ADD CONSTRAINT "ferias_colaborador_id_fkey" FOREIGN KEY ("colaborador_id") REFERENCES "colaborador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "colaborador_treinamento" ADD CONSTRAINT "colaborador_treinamento_colaborador_id_fkey" FOREIGN KEY ("colaborador_id") REFERENCES "colaborador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "colaborador_treinamento" ADD CONSTRAINT "colaborador_treinamento_treinamento_id_fkey" FOREIGN KEY ("treinamento_id") REFERENCES "treinamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documento" ADD CONSTRAINT "documento_colaborador_id_fkey" FOREIGN KEY ("colaborador_id") REFERENCES "colaborador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documento" ADD CONSTRAINT "documento_usuario_upload_id_fkey" FOREIGN KEY ("usuario_upload_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacao_desempenho" ADD CONSTRAINT "avaliacao_desempenho_colaborador_id_fkey" FOREIGN KEY ("colaborador_id") REFERENCES "colaborador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_colaborador_id_fkey" FOREIGN KEY ("colaborador_id") REFERENCES "colaborador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

