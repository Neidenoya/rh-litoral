import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

interface ColaboradorLista {
  id: string;
  matricula: string;
  nomeCompleto: string;
  cargo: { nome: string };
  departamento: { nome: string };
  shopping: { nome: string };
  status: string;
  salario: number | null;
}

export function ColaboradoresPage() {
  const [busca, setBusca] = useState('');
  const { data, isLoading, error } = useQuery({
    queryKey: ['colaboradores', busca],
    queryFn: () =>
      api<ColaboradorLista[]>(
        `/colaboradores${busca ? `?busca=${encodeURIComponent(busca)}` : ''}`,
      ),
  });

  return (
    <div>
      <h1 className="content-h1">Colaboradores</h1>
      <p className="content-sub">
        Salário visível apenas para Diretoria, RH e Financeiro (mascarado por RBAC).
      </p>

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
        <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--text-tertiary)' }}>
                <th style={th}>Matrícula</th>
                <th style={th}>Nome</th>
                <th style={th}>Cargo</th>
                <th style={th}>Departamento</th>
                <th style={th}>Shopping</th>
                <th style={th}>Status</th>
                <th style={{ ...th, textAlign: 'right' }}>Salário</th>
              </tr>
            </thead>
            <tbody>
              {data.map((c) => (
                <tr key={c.id} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <td style={td}>{c.matricula}</td>
                  <td style={{ ...td, fontWeight: 600 }}>{c.nomeCompleto}</td>
                  <td style={td}>{c.cargo.nome}</td>
                  <td style={td}>{c.departamento.nome}</td>
                  <td style={td}>{c.shopping.nome}</td>
                  <td style={td}>{c.status}</td>
                  <td style={{ ...td, textAlign: 'right' }}>
                    {c.salario != null
                      ? c.salario.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                          maximumFractionDigits: 0,
                        })
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const th: React.CSSProperties = {
  padding: '12px 14px',
  fontSize: 11,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.4px',
};
const td: React.CSSProperties = { padding: '11px 14px' };
