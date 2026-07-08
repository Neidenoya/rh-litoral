import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { useAuth } from '../../app/auth';
import { Modal } from '../../components/Modal';
import { ColaboradorForm } from './ColaboradorForm';
import type { ColaboradorFormData } from './ColaboradorForm';
import type { Opcoes } from '../../types';

interface ColaboradorLista {
  id: string;
  matricula: string;
  nomeCompleto: string;
  cargo: { nome: string };
  departamento: { nome: string };
  shopping: { nome: string };
  status: string;
  salario: number | null;
  // escalares para prefill de edição (a API retorna todos os campos)
  cargoId: string;
  departamentoId: string;
  shoppingId: string;
  empresaId: string;
  centroCustoId: string | null;
  gestorImediatoId: string | null;
  dataAdmissao: string;
  tipoContrato: string;
  email: string | null;
  celular: string | null;
  cargaHoraria: string | null;
  escala: string | null;
}

function paraFormulario(c: ColaboradorLista): ColaboradorFormData {
  return {
    id: c.id,
    matricula: c.matricula,
    nomeCompleto: c.nomeCompleto,
    cargoId: c.cargoId,
    departamentoId: c.departamentoId,
    shoppingId: c.shoppingId,
    empresaId: c.empresaId,
    centroCustoId: c.centroCustoId ?? '',
    gestorImediatoId: c.gestorImediatoId ?? '',
    dataAdmissao: c.dataAdmissao ? c.dataAdmissao.slice(0, 10) : '',
    tipoContrato: c.tipoContrato,
    salario: c.salario != null ? String(c.salario) : '',
    email: c.email ?? '',
    celular: c.celular ?? '',
    cargaHoraria: c.cargaHoraria ?? '',
    escala: c.escala ?? '',
    status: c.status,
  };
}

export function ColaboradoresPage() {
  const { usuario } = useAuth();
  const podeEditar = usuario?.perfil === 'RH';
  const [busca, setBusca] = useState('');
  const [editar, setEditar] = useState<ColaboradorFormData | null>(null);
  const [novo, setNovo] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['colaboradores', busca],
    queryFn: () =>
      api<ColaboradorLista[]>(
        `/colaboradores${busca ? `?busca=${encodeURIComponent(busca)}` : ''}`,
      ),
  });

  const opcoes = useQuery({
    queryKey: ['opcoes'],
    queryFn: () => api<Opcoes>('/opcoes'),
    enabled: podeEditar,
  });

  const modalAberto = novo || editar != null;
  const fechar = () => {
    setNovo(false);
    setEditar(null);
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <div>
          <h1 className="content-h1">Colaboradores</h1>
          <p className="content-sub">
            Salário visível apenas para Diretoria, RH e Financeiro (mascarado por RBAC).
          </p>
        </div>
        {podeEditar && (
          <button
            className="btn btn-primary"
            style={{ width: 'auto', flexShrink: 0 }}
            onClick={() => setNovo(true)}
          >
            + Novo colaborador
          </button>
        )}
      </div>

      <input
        className="input"
        style={{ maxWidth: 360, marginTop: 18 }}
        placeholder="Buscar por nome, matrícula ou cargo…"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      {isLoading && <p className="content-sub">Carregando…</p>}
      {error && <p className="error-msg">Erro: {(error as Error).message}</p>}

      {data && (
        <div className="panel" style={{ padding: 0, overflow: 'hidden', marginTop: 8 }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Matrícula</th>
                <th>Nome</th>
                <th>Cargo</th>
                <th>Departamento</th>
                <th>Shopping</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Salário</th>
                {podeEditar && <th />}
              </tr>
            </thead>
            <tbody>
              {data.map((c) => (
                <tr key={c.id}>
                  <td>{c.matricula}</td>
                  <td style={{ fontWeight: 600 }}>{c.nomeCompleto}</td>
                  <td>{c.cargo.nome}</td>
                  <td>{c.departamento.nome}</td>
                  <td>{c.shopping.nome}</td>
                  <td>{c.status}</td>
                  <td style={{ textAlign: 'right' }}>
                    {c.salario != null
                      ? c.salario.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                          maximumFractionDigits: 0,
                        })
                      : '—'}
                  </td>
                  {podeEditar && (
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn-mini" onClick={() => setEditar(paraFormulario(c))}>
                        Editar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalAberto && (
        <Modal titulo={editar ? 'Editar colaborador' : 'Novo colaborador'} onClose={fechar}>
          {opcoes.isLoading && <p className="content-sub">Carregando opções…</p>}
          {opcoes.error && (
            <p className="error-msg">
              Erro ao carregar opções: {(opcoes.error as Error).message}
            </p>
          )}
          {opcoes.data && (
            <ColaboradorForm
              opcoes={opcoes.data}
              inicial={editar ?? undefined}
              onSaved={fechar}
            />
          )}
        </Modal>
      )}
    </div>
  );
}
