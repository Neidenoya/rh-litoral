export type Perfil =
  | 'DIRETORIA'
  | 'RH'
  | 'FINANCEIRO'
  | 'JURIDICO'
  | 'GESTOR'
  | 'COLABORADOR';

export interface UsuarioSessao {
  id: string;
  email: string;
  perfil: Perfil;
}

export interface OrgNode {
  id: string;
  nome: string;
  cargo: string;
  departamento: string;
  shopping: string;
  gestorImediatoId: string | null;
  subordinadosDiretos: number;
  subordinadosTotais: number;
  filhos: OrgNode[];
}

export interface HeadcountItem {
  nome: string;
  valor: number;
}

export interface DashboardIndicadores {
  totalColaboradores: number;
  vagasAbertas: number;
  admissoesMes: number;
  desligamentosMes: number;
  experienciaVencendo: { id: string; nomeCompleto: string; fimExperiencia: string }[];
  aniversariantesMes: { id: string; nomeCompleto: string; dataAniversario: string }[];
  headcountEmpresa: HeadcountItem[];
  headcountShopping: HeadcountItem[];
  headcountDepartamento: HeadcountItem[];
}

// ── Fase 2 ──

export interface VagaLista {
  id: string;
  status: string;
  prioridade: string;
  dataAbertura: string;
  cargo: { nome: string };
  departamento: { nome: string };
  shopping: { nome: string };
  gestorSolicitante: { id: string; nomeCompleto: string };
  _count: { candidatos: number };
}

export interface FeriasLista {
  id: string;
  periodoAquisitivoInicio: string;
  periodoAquisitivoFim: string;
  dataInicioGozo: string | null;
  dataFimGozo: string | null;
  diasUtilizados: number;
  saldoDias: number;
  status: string;
  colaborador: {
    id: string;
    nomeCompleto: string;
    matricula: string;
    departamento: { nome: string };
  };
}

export interface TreinamentoCatalogo {
  id: string;
  nome: string;
  tipo: string;
  cargaHoraria: number | null;
  validadeMeses: number | null;
  _count: { colaboradores: number };
}

export interface MatriculaTreinamento {
  id: string;
  status: string;
  dataRealizacao: string | null;
  dataVencimento: string | null;
  treinamento: { nome: string; tipo: string };
  colaborador: { id: string; nomeCompleto: string; matricula: string };
}

export interface DocumentoLista {
  id: string;
  tipo: string;
  arquivoUrl: string;
  dataUpload: string;
  colaborador: { id: string; nomeCompleto: string; matricula: string };
}

export interface AvaliacaoLista {
  id: string;
  ciclo: string | null;
  periodo: string | null;
  notaGestor: number | null;
  notaAutoavaliacao: number | null;
  colaborador: {
    id: string;
    nomeCompleto: string;
    matricula: string;
    cargo: { nome: string };
  };
}

export interface RelatorioQuadro {
  headcountDepartamento: HeadcountItem[];
  headcountShopping: HeadcountItem[];
  porContrato: HeadcountItem[];
  porStatus: HeadcountItem[];
  custoFolhaDepartamento: HeadcountItem[] | null;
}

export interface Opcoes {
  empresas: { id: string; razaoSocial: string }[];
  shoppings: { id: string; nome: string }[];
  departamentos: { id: string; nome: string }[];
  cargos: { id: string; nome: string }[];
  centrosCusto: { id: string; codigo: string }[];
  colaboradores: { id: string; nomeCompleto: string }[];
}
