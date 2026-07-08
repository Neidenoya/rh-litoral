import {
  PrismaClient,
  TipoContrato,
  StatusColaborador,
  EstadoCivil,
  Perfil,
  StatusVaga,
  PrioridadeVaga,
  StatusFerias,
  TipoTreinamento,
  StatusTreinamento,
  TipoDocumento,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';

// ── Dados do protótipo (15 colaboradores) ──
interface SeedColab {
  ord: number;
  nome: string;
  matricula: string;
  cargo: string;
  departamento: string;
  shopping: string;
  empresa: 0 | 1;
  gestor: number | null;
  cc: string;
  admissao: string;
  contrato: TipoContrato;
  salario: number;
  escala: string;
  entrada: string;
  saida: string;
  estadoCivil: EstadoCivil;
  escolaridade: string;
  cursos: string[];
  status: StatusColaborador;
  aniversario: string;
  fimExperiencia?: string;
}

const COLABS: SeedColab[] = [
  { ord: 1, nome: 'Marcelo Andrade Souza', matricula: '00001', cargo: 'Diretor Geral', departamento: 'Diretoria', shopping: 'Shopping Vitória Plaza', empresa: 0, gestor: null, cc: 'CC-001', admissao: '2014-03-10', contrato: 'CLT', salario: 38500, escala: '5x2', entrada: '08:00', saida: '18:00', estadoCivil: 'CASADO', escolaridade: 'MBA em Gestão Empresarial', cursos: ['MBA Gestão Estratégica - FGV', 'Liderança de Alta Performance'], status: 'ATIVO', aniversario: '07-15' },
  { ord: 2, nome: 'Renata Carvalho Lima', matricula: '00002', cargo: 'Diretora de RH', departamento: 'RH', shopping: 'Shopping Vitória Plaza', empresa: 0, gestor: 1, cc: 'CC-002', admissao: '2015-06-01', contrato: 'CLT', salario: 22000, escala: '5x2', entrada: '08:00', saida: '18:00', estadoCivil: 'SOLTEIRO', escolaridade: 'Pós-graduação em Gestão de Pessoas', cursos: ['Pós em Psicologia Organizacional', 'Certificação SHRM-CP'], status: 'ATIVO', aniversario: '06-25' },
  { ord: 3, nome: 'Fábio Henrique Martins', matricula: '00003', cargo: 'Diretor Financeiro', departamento: 'Financeiro', shopping: 'Shopping Vitória Plaza', empresa: 0, gestor: 1, cc: 'CC-003', admissao: '2016-02-15', contrato: 'CLT', salario: 25000, escala: '5x2', entrada: '08:00', saida: '18:00', estadoCivil: 'CASADO', escolaridade: 'Ciências Contábeis', cursos: ['CFO Executive Program'], status: 'ATIVO', aniversario: '11-02' },
  { ord: 4, nome: 'Camila Rodrigues Pires', matricula: '00004', cargo: 'Gerente de Operações', departamento: 'Operações', shopping: 'Shopping Vitória Plaza', empresa: 0, gestor: 1, cc: 'CC-004', admissao: '2017-08-20', contrato: 'CLT', salario: 14500, escala: '5x2', entrada: '09:00', saida: '19:00', estadoCivil: 'DIVORCIADO', escolaridade: 'Administração de Empresas', cursos: ['Gestão de Facilities'], status: 'ATIVO', aniversario: '03-30' },
  { ord: 5, nome: 'Juliana Pereira Santos', matricula: '00005', cargo: 'Analista de RH Sênior', departamento: 'RH', shopping: 'Shopping Vitória Plaza', empresa: 0, gestor: 2, cc: 'CC-002', admissao: '2019-01-10', contrato: 'CLT', salario: 7200, escala: '5x2', entrada: '08:00', saida: '18:00', estadoCivil: 'SOLTEIRO', escolaridade: 'Psicologia', cursos: ['Recrutamento e Seleção Avançado', 'DHO na Prática'], status: 'ATIVO', aniversario: '09-12' },
  { ord: 6, nome: 'Bruno Costa Oliveira', matricula: '00006', cargo: 'Analista de RH Pleno', departamento: 'RH', shopping: 'Shopping Costa Norte', empresa: 1, gestor: 2, cc: 'CC-012', admissao: '2020-05-18', contrato: 'CLT', salario: 5400, escala: '5x2', entrada: '08:00', saida: '18:00', estadoCivil: 'CASADO', escolaridade: 'Gestão de RH', cursos: ['Folha de Pagamento Avançado'], status: 'ATIVO', aniversario: '01-05' },
  { ord: 7, nome: 'Patrícia Gomes Almeida', matricula: '00007', cargo: 'Analista Financeiro Sênior', departamento: 'Financeiro', shopping: 'Shopping Vitória Plaza', empresa: 0, gestor: 3, cc: 'CC-003', admissao: '2018-11-05', contrato: 'CLT', salario: 8900, escala: '5x2', entrada: '08:00', saida: '18:00', estadoCivil: 'CASADO', escolaridade: 'Ciências Contábeis', cursos: [], status: 'ATIVO', aniversario: '06-22' },
  { ord: 8, nome: 'Diego Fernandes Rocha', matricula: '00008', cargo: 'Coordenador Jurídico', departamento: 'Jurídico', shopping: 'Shopping Vitória Plaza', empresa: 0, gestor: 1, cc: 'CC-005', admissao: '2016-09-01', contrato: 'CLT', salario: 16800, escala: '5x2', entrada: '09:00', saida: '19:00', estadoCivil: 'SOLTEIRO', escolaridade: 'Direito', cursos: ['Direito Imobiliário e Locações'], status: 'ATIVO', aniversario: '12-18' },
  { ord: 9, nome: 'Larissa Tavares Nunes', matricula: '00009', cargo: 'Coordenadora de Marketing', departamento: 'Marketing', shopping: 'Shopping Costa Norte', empresa: 1, gestor: 1, cc: 'CC-006', admissao: '2019-04-22', contrato: 'CLT', salario: 12500, escala: '5x2', entrada: '09:00', saida: '19:00', estadoCivil: 'CASADO', escolaridade: 'Publicidade e Propaganda', cursos: ['Marketing Digital para Varejo'], status: 'ATIVO', aniversario: '08-09' },
  { ord: 10, nome: 'Eduardo Lima Barros', matricula: '00010', cargo: 'Supervisor de Segurança', departamento: 'Segurança', shopping: 'Shopping Vitória Plaza', empresa: 0, gestor: 4, cc: 'CC-007', admissao: '2017-03-12', contrato: 'CLT', salario: 6200, escala: '12x36', entrada: '06:00', saida: '18:00', estadoCivil: 'CASADO', escolaridade: 'Ensino Médio Completo', cursos: ['NR-23 Brigada de Incêndio', 'Gestão de Equipes de Segurança'], status: 'ATIVO', aniversario: '04-14' },
  { ord: 11, nome: 'Vanessa Souza Ribeiro', matricula: '00011', cargo: 'Supervisora de Manutenção', departamento: 'Manutenção', shopping: 'Shopping Vitória Plaza', empresa: 0, gestor: 4, cc: 'CC-008', admissao: '2018-07-30', contrato: 'CLT', salario: 6800, escala: '5x2', entrada: '07:00', saida: '17:00', estadoCivil: 'SOLTEIRO', escolaridade: 'Engenharia Civil', cursos: ['NR-10', 'Gestão de Manutenção Predial'], status: 'ATIVO', aniversario: '10-27' },
  { ord: 12, nome: 'Rodrigo Almeida Castro', matricula: '00012', cargo: 'Analista de Recrutamento', departamento: 'RH', shopping: 'Shopping Vitória Plaza', empresa: 0, gestor: 5, cc: 'CC-002', admissao: '2021-02-08', contrato: 'CLT', salario: 4800, escala: '5x2', entrada: '08:00', saida: '18:00', estadoCivil: 'SOLTEIRO', escolaridade: 'Gestão de RH', cursos: ['Recrutamento por Competências'], status: 'ATIVO', aniversario: '02-19' },
  { ord: 13, nome: 'Beatriz Nogueira Ferreira', matricula: '00013', cargo: 'Estagiária de RH', departamento: 'RH', shopping: 'Shopping Vitória Plaza', empresa: 0, gestor: 5, cc: 'CC-002', admissao: '2025-09-01', contrato: 'ESTAGIO', salario: 1800, escala: '5x2', entrada: '13:00', saida: '19:00', estadoCivil: 'SOLTEIRO', escolaridade: 'Cursando Administração', cursos: [], status: 'EXPERIENCIA', aniversario: '07-03', fimExperiencia: '2026-07-01' },
  { ord: 14, nome: 'Thiago Souza Mendes', matricula: '00014', cargo: 'Analista Jurídico', departamento: 'Jurídico', shopping: 'Shopping Vitória Plaza', empresa: 0, gestor: 8, cc: 'CC-005', admissao: '2022-10-15', contrato: 'CLT', salario: 7800, escala: '5x2', entrada: '09:00', saida: '19:00', estadoCivil: 'CASADO', escolaridade: 'Direito', cursos: ['Contratos Comerciais'], status: 'ATIVO', aniversario: '05-21' },
  { ord: 15, nome: 'Carla Daniela Souza', matricula: '00015', cargo: 'Assistente Financeiro', departamento: 'Financeiro', shopping: 'Shopping Costa Norte', empresa: 1, gestor: 7, cc: 'CC-012', admissao: '2026-04-01', contrato: 'EXPERIENCIA', salario: 3600, escala: '5x2', entrada: '08:00', saida: '18:00', estadoCivil: 'SOLTEIRO', escolaridade: 'Ciências Contábeis (cursando)', cursos: [], status: 'EXPERIENCIA', aniversario: '06-30', fimExperiencia: '2026-07-10' },
];

const EMPRESAS = [
  { razaoSocial: 'Plaza Empreendimentos S.A.', cnpj: '11.111.111/0001-11' },
  { razaoSocial: 'Costa Norte Administradora Ltda.', cnpj: '22.222.222/0001-22' },
];
const SHOPPINGS = ['Shopping Vitória Plaza', 'Shopping Costa Norte', 'Shopping Bela Vista'];
const DEPARTAMENTOS = ['Diretoria', 'RH', 'Financeiro', 'Jurídico', 'Operações', 'Marketing', 'Segurança', 'Manutenção', 'Comercial', 'TI'];
const CENTROS: Record<string, string> = {
  'CC-001': 'Diretoria', 'CC-002': 'RH', 'CC-003': 'Financeiro', 'CC-004': 'Operações',
  'CC-005': 'Jurídico', 'CC-006': 'Marketing', 'CC-007': 'Segurança', 'CC-008': 'Manutenção',
  'CC-012': 'Financeiro',
};

async function limpar(prisma: PrismaClient) {
  await prisma.logAuditoria.deleteMany();
  await prisma.documento.deleteMany();
  await prisma.colaboradorTreinamento.deleteMany();
  await prisma.treinamento.deleteMany();
  await prisma.avaliacaoDesempenho.deleteMany();
  await prisma.ferias.deleteMany();
  await prisma.candidato.deleteMany();
  await prisma.vaga.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.colaborador.deleteMany();
  await prisma.centroCusto.deleteMany();
  await prisma.cargo.deleteMany();
  await prisma.departamento.deleteMany();
  await prisma.shopping.deleteMany();
  await prisma.empresa.deleteMany();
}

export interface PopularOpts {
  // force=true limpa e recria (uso local/dev). force=false só popula se vazio (Render).
  force?: boolean;
}

export interface PopularResultado {
  populou: boolean;
  colaboradores: number;
  usuarios: number;
}

export async function popularBase(
  prisma: PrismaClient,
  opts: PopularOpts = {},
): Promise<PopularResultado> {
  const jaExiste = await prisma.colaborador.count();
  if (jaExiste > 0 && !opts.force) {
    return { populou: false, colaboradores: jaExiste, usuarios: 0 };
  }
  if (opts.force) await limpar(prisma);

  const empresas = await Promise.all(
    EMPRESAS.map((e) => prisma.empresa.create({ data: e })),
  );
  const shoppings: Record<string, string> = {};
  for (const nome of SHOPPINGS) {
    const s = await prisma.shopping.create({ data: { nome } });
    shoppings[nome] = s.id;
  }
  const departamentos: Record<string, string> = {};
  for (const nome of DEPARTAMENTOS) {
    const d = await prisma.departamento.create({ data: { nome } });
    departamentos[nome] = d.id;
  }
  const centros: Record<string, string> = {};
  for (const [codigo, depNome] of Object.entries(CENTROS)) {
    const cc = await prisma.centroCusto.create({
      data: { codigo, departamentoId: departamentos[depNome] },
    });
    centros[codigo] = cc.id;
  }
  const cargos: Record<string, string> = {};
  for (const nomeCargo of [...new Set(COLABS.map((c) => c.cargo))]) {
    const cg = await prisma.cargo.create({ data: { nome: nomeCargo } });
    cargos[nomeCargo] = cg.id;
  }

  // colaboradores em ordem (gestor sempre tem ord menor → já inserido)
  const idPorOrd: Record<number, string> = {};
  for (const c of COLABS) {
    const criado = await prisma.colaborador.create({
      data: {
        matricula: c.matricula,
        nomeCompleto: c.nome,
        cargoId: cargos[c.cargo],
        departamentoId: departamentos[c.departamento],
        shoppingId: shoppings[c.shopping],
        empresaId: empresas[c.empresa].id,
        centroCustoId: centros[c.cc],
        gestorImediatoId: c.gestor ? idPorOrd[c.gestor] : null,
        dataAdmissao: new Date(c.admissao),
        fimExperiencia: c.fimExperiencia ? new Date(c.fimExperiencia) : null,
        tipoContrato: c.contrato,
        salario: c.salario,
        cargaHoraria: c.contrato === 'ESTAGIO' ? '30h semanais' : '44h semanais',
        escala: c.escala,
        horarioEntrada: c.entrada,
        horarioSaida: c.saida,
        estadoCivil: c.estadoCivil,
        escolaridade: c.escolaridade,
        cursos: c.cursos,
        status: c.status,
        dataAniversario: c.aniversario,
        email: `${c.matricula}@rhlitoral.com.br`,
      },
    });
    idPorOrd[c.ord] = criado.id;
  }

  // usuários (1 por perfil) — senha dev: litoral123
  const senhaHash = bcrypt.hashSync('litoral123', 10);
  const usuarios: { email: string; perfil: Perfil; ord: number }[] = [
    { email: 'diretoria@rhlitoral.com.br', perfil: 'DIRETORIA', ord: 1 },
    { email: 'rh@rhlitoral.com.br', perfil: 'RH', ord: 2 },
    { email: 'financeiro@rhlitoral.com.br', perfil: 'FINANCEIRO', ord: 3 },
    { email: 'gestor@rhlitoral.com.br', perfil: 'GESTOR', ord: 4 },
    { email: 'juridico@rhlitoral.com.br', perfil: 'JURIDICO', ord: 8 },
  ];
  for (const u of usuarios) {
    await prisma.usuario.create({
      data: { email: u.email, senhaHash, perfil: u.perfil, colaboradorId: idPorOrd[u.ord] },
    });
  }

  // ── Vagas (funil de R&S) ──
  const VAGAS: {
    cargo: string; departamento: string; shopping: string; gestorOrd: number;
    status: StatusVaga; prioridade: PrioridadeVaga; abertura: string;
    candidatos: { nome: string; etapa: string }[];
  }[] = [
    { cargo: 'Assistente Financeiro', departamento: 'Financeiro', shopping: 'Shopping Vitória Plaza', gestorOrd: 3, status: 'ABERTA', prioridade: 'MEDIA', abertura: '2026-06-20', candidatos: [] },
    { cargo: 'Analista de RH Pleno', departamento: 'RH', shopping: 'Shopping Costa Norte', gestorOrd: 2, status: 'TRIAGEM', prioridade: 'ALTA', abertura: '2026-06-05', candidatos: [{ nome: 'Marina Alves Correia', etapa: 'Triagem' }, { nome: 'Paulo Reis Damasceno', etapa: 'Triagem' }] },
    { cargo: 'Supervisor de Segurança', departamento: 'Segurança', shopping: 'Shopping Costa Norte', gestorOrd: 4, status: 'ENTREVISTA_RH', prioridade: 'URGENTE', abertura: '2026-05-15', candidatos: [{ nome: 'Anderson Melo Prado', etapa: 'Entrevista RH' }] },
    { cargo: 'Coordenadora de Marketing', departamento: 'Marketing', shopping: 'Shopping Bela Vista', gestorOrd: 1, status: 'ENTREVISTA_GESTOR', prioridade: 'ALTA', abertura: '2026-05-02', candidatos: [{ nome: 'Fernanda Dias Moura', etapa: 'Entrevista Gestor' }] },
    { cargo: 'Analista Jurídico', departamento: 'Jurídico', shopping: 'Shopping Vitória Plaza', gestorOrd: 8, status: 'APROVADO', prioridade: 'BAIXA', abertura: '2026-04-18', candidatos: [{ nome: 'Rafael Nunes Teixeira', etapa: 'Aprovado' }] },
  ];
  for (const v of VAGAS) {
    await prisma.vaga.create({
      data: {
        cargoId: cargos[v.cargo],
        departamentoId: departamentos[v.departamento],
        shoppingId: shoppings[v.shopping],
        gestorSolicitanteId: idPorOrd[v.gestorOrd],
        status: v.status,
        prioridade: v.prioridade,
        dataAbertura: new Date(v.abertura),
        candidatos: v.candidatos.length
          ? { create: v.candidatos.map((c) => ({ nome: c.nome, etapaAtual: c.etapa })) }
          : undefined,
      },
    });
  }

  // ── Férias ──
  const FERIAS: {
    ord: number; aqInicio: string; aqFim: string; inicioGozo?: string; fimGozo?: string;
    dias: number; saldo: number; status: StatusFerias;
  }[] = [
    { ord: 1, aqInicio: '2024-03-10', aqFim: '2025-03-09', inicioGozo: '2025-07-01', fimGozo: '2025-07-30', dias: 30, saldo: 0, status: 'CONCLUIDA' },
    { ord: 2, aqInicio: '2025-06-01', aqFim: '2026-05-31', dias: 0, saldo: 30, status: 'PROGRAMADA' },
    { ord: 4, aqInicio: '2025-08-20', aqFim: '2026-08-19', inicioGozo: '2026-07-06', fimGozo: '2026-07-20', dias: 15, saldo: 15, status: 'EM_ANDAMENTO' },
    { ord: 5, aqInicio: '2025-01-10', aqFim: '2026-01-09', dias: 10, saldo: 20, status: 'PROGRAMADA' },
    { ord: 7, aqInicio: '2023-11-05', aqFim: '2024-11-04', dias: 0, saldo: 30, status: 'VENCIDA' },
    { ord: 10, aqInicio: '2024-03-12', aqFim: '2025-03-11', dias: 0, saldo: 30, status: 'VENCIDA' },
  ];
  for (const f of FERIAS) {
    await prisma.ferias.create({
      data: {
        colaboradorId: idPorOrd[f.ord],
        periodoAquisitivoInicio: new Date(f.aqInicio),
        periodoAquisitivoFim: new Date(f.aqFim),
        dataInicioGozo: f.inicioGozo ? new Date(f.inicioGozo) : null,
        dataFimGozo: f.fimGozo ? new Date(f.fimGozo) : null,
        diasUtilizados: f.dias,
        saldoDias: f.saldo,
        status: f.status,
      },
    });
  }

  // ── Treinamentos (catálogo + situação por colaborador) ──
  const TREINOS: {
    nome: string; tipo: TipoTreinamento; carga: number; validade: number | null;
    turmas: { ord: number; status: StatusTreinamento; realizacao?: string; vencimento?: string }[];
  }[] = [
    { nome: 'NR-23 — Prevenção e Combate a Incêndio', tipo: 'OBRIGATORIO', carga: 8, validade: 12, turmas: [
      { ord: 10, status: 'VALIDO', realizacao: '2025-09-01', vencimento: '2026-09-01' },
      { ord: 11, status: 'VENCIDO', realizacao: '2024-05-01', vencimento: '2025-05-01' },
    ] },
    { nome: 'LGPD para Colaboradores', tipo: 'OBRIGATORIO', carga: 4, validade: 24, turmas: [
      { ord: 2, status: 'VALIDO', realizacao: '2025-03-10', vencimento: '2027-03-10' },
      { ord: 5, status: 'VALIDO', realizacao: '2025-03-10', vencimento: '2027-03-10' },
      { ord: 12, status: 'PENDENTE' },
    ] },
    { nome: 'Atendimento e Experiência do Cliente', tipo: 'OPCIONAL', carga: 6, validade: null, turmas: [
      { ord: 4, status: 'VALIDO', realizacao: '2025-02-20' },
    ] },
    { nome: 'Liderança e Gestão de Equipes', tipo: 'OPCIONAL', carga: 16, validade: null, turmas: [
      { ord: 4, status: 'PENDENTE' },
      { ord: 8, status: 'PENDENTE' },
    ] },
  ];
  for (const t of TREINOS) {
    const treino = await prisma.treinamento.create({
      data: { nome: t.nome, tipo: t.tipo, cargaHoraria: t.carga, validadeMeses: t.validade },
    });
    for (const tm of t.turmas) {
      await prisma.colaboradorTreinamento.create({
        data: {
          treinamentoId: treino.id,
          colaboradorId: idPorOrd[tm.ord],
          status: tm.status,
          dataRealizacao: tm.realizacao ? new Date(tm.realizacao) : null,
          dataVencimento: tm.vencimento ? new Date(tm.vencimento) : null,
        },
      });
    }
  }

  // ── Documentos ──
  const DOCS: { ord: number; tipo: TipoDocumento; nome: string }[] = [
    { ord: 1, tipo: 'CONTRATO', nome: 'contrato-trabalho' },
    { ord: 1, tipo: 'RG', nome: 'rg' },
    { ord: 2, tipo: 'CONTRATO', nome: 'contrato-trabalho' },
    { ord: 5, tipo: 'ASO', nome: 'aso-admissional' },
    { ord: 10, tipo: 'ASO', nome: 'aso-periodico' },
    { ord: 13, tipo: 'CONTRATO', nome: 'contrato-estagio' },
    { ord: 15, tipo: 'CONTRATO', nome: 'contrato-experiencia' },
    { ord: 15, tipo: 'EXAME', nome: 'exame-admissional' },
  ];
  for (const d of DOCS) {
    await prisma.documento.create({
      data: {
        colaboradorId: idPorOrd[d.ord],
        tipo: d.tipo,
        arquivoUrl: `/uploads/${idPorOrd[d.ord]}/${d.nome}.pdf`,
      },
    });
  }

  // ── Avaliações de desempenho (ciclo 2025) ──
  const AVALS: { ord: number; ciclo: string; periodo: string; gestor: number; auto: number }[] = [
    { ord: 4, ciclo: '2025', periodo: 'Anual 2025', gestor: 8.5, auto: 8.0 },
    { ord: 5, ciclo: '2025', periodo: 'Anual 2025', gestor: 9.0, auto: 8.5 },
    { ord: 6, ciclo: '2025', periodo: 'Anual 2025', gestor: 7.8, auto: 8.2 },
    { ord: 7, ciclo: '2025', periodo: 'Anual 2025', gestor: 7.5, auto: 8.0 },
    { ord: 10, ciclo: '2025', periodo: 'Anual 2025', gestor: 8.0, auto: 7.5 },
    { ord: 11, ciclo: '2025', periodo: 'Anual 2025', gestor: 8.8, auto: 9.0 },
  ];
  for (const a of AVALS) {
    await prisma.avaliacaoDesempenho.create({
      data: {
        colaboradorId: idPorOrd[a.ord],
        ciclo: a.ciclo,
        periodo: a.periodo,
        notaGestor: a.gestor,
        notaAutoavaliacao: a.auto,
      },
    });
  }

  return { populou: true, colaboradores: COLABS.length, usuarios: usuarios.length };
}
