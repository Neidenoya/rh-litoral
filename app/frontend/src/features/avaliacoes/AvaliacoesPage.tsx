import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import type { AvaliacaoLista } from '../../types';

const nota = (n: number | null) => (n != null ? n.toFixed(1) : '—');

export function AvaliacoesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['avaliacoes'],
    queryFn: () => api<AvaliacaoLista[]>('/avaliacoes'),
  });

  if (isLoading) return <p className="content-sub">Carregando avaliações…</p>;
  if (error) return <p className="error-msg">Erro: {(error as Error).message}</p>;

  const lista = data ?? [];

  return (
    <div>
      <h1 className="content-h1">Avaliações de Desempenho</h1>
      <p className="content-sub">
        Ciclos de avaliação — nota do gestor e autoavaliação de cada colaborador.
      </p>

      <div className="panel" style={{ padding: 0, overflow: 'hidden', marginTop: 18 }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Colaborador</th>
              <th>Cargo</th>
              <th>Ciclo</th>
              <th>Período</th>
              <th style={{ textAlign: 'right' }}>Autoavaliação</th>
              <th style={{ textAlign: 'right' }}>Gestor</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((a) => (
              <tr key={a.id}>
                <td style={{ fontWeight: 600 }}>{a.colaborador.nomeCompleto}</td>
                <td>{a.colaborador.cargo.nome}</td>
                <td>{a.ciclo ?? '—'}</td>
                <td>{a.periodo ?? '—'}</td>
                <td style={{ textAlign: 'right' }}>{nota(a.notaAutoavaliacao)}</td>
                <td style={{ textAlign: 'right', fontWeight: 700 }}>
                  {nota(a.notaGestor)}
                </td>
              </tr>
            ))}
            {lista.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>
                  Nenhuma avaliação registrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
