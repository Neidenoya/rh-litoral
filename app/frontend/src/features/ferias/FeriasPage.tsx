import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Badge } from '../../components/Badge';
import type { Tone } from '../../components/Badge';
import type { FeriasLista } from '../../types';

const tone: Record<string, Tone> = {
  CONCLUIDA: 'success',
  EM_ANDAMENTO: 'info',
  PROGRAMADA: 'neutral',
  VENCIDA: 'danger',
};
const rotulo: Record<string, string> = {
  CONCLUIDA: 'Concluída',
  EM_ANDAMENTO: 'Em andamento',
  PROGRAMADA: 'Programada',
  VENCIDA: 'Vencida',
};
const dt = (s: string | null) =>
  s ? new Date(s).toLocaleDateString('pt-BR') : '—';

export function FeriasPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['ferias'],
    queryFn: () => api<FeriasLista[]>('/ferias'),
  });

  if (isLoading) return <p className="content-sub">Carregando férias…</p>;
  if (error) return <p className="error-msg">Erro: {(error as Error).message}</p>;

  const lista = data ?? [];
  const vencidas = lista.filter((f) => f.status === 'VENCIDA').length;

  return (
    <div>
      <h1 className="content-h1">Férias</h1>
      <p className="content-sub">
        Períodos aquisitivos, saldo de dias e situação de cada colaborador.
      </p>

      {vencidas > 0 && (
        <div
          className="panel"
          style={{
            marginTop: 16,
            borderColor: 'var(--c-danger)',
            background: 'var(--c-danger-bg)',
          }}
        >
          <strong style={{ color: 'var(--c-danger)' }}>
            ⚠ {vencidas} período(s) de férias vencido(s)
          </strong>{' '}
          — programar o quanto antes para evitar pagamento em dobro.
        </div>
      )}

      <div className="panel" style={{ padding: 0, overflow: 'hidden', marginTop: 18 }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Colaborador</th>
              <th>Departamento</th>
              <th>Período aquisitivo</th>
              <th>Gozo</th>
              <th style={{ textAlign: 'right' }}>Saldo</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((f) => (
              <tr key={f.id}>
                <td style={{ fontWeight: 600 }}>{f.colaborador.nomeCompleto}</td>
                <td>{f.colaborador.departamento.nome}</td>
                <td>
                  {dt(f.periodoAquisitivoInicio)} — {dt(f.periodoAquisitivoFim)}
                </td>
                <td>
                  {f.dataInicioGozo
                    ? `${dt(f.dataInicioGozo)} — ${dt(f.dataFimGozo)}`
                    : '—'}
                </td>
                <td style={{ textAlign: 'right' }}>{f.saldoDias} d</td>
                <td>
                  <Badge tone={tone[f.status] ?? 'neutral'}>
                    {rotulo[f.status] ?? f.status}
                  </Badge>
                </td>
              </tr>
            ))}
            {lista.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>
                  Nenhum registro de férias.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
