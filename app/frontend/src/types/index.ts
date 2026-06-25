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
