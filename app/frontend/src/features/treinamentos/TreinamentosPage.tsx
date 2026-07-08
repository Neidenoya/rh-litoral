import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Badge } from '../../components/Badge';
import type { Tone } from '../../components/Badge';
import type { TreinamentoCatalogo, MatriculaTreinamento } from '../../types';

const tone: Record<string, Tone> = {
  VALIDO: 'success',
  VENCIDO: 'danger',
  PENDENTE: 'warning',
};
const rotulo: Record<string, string> = {
  VALIDO: 'Válido',
  VENCIDO: 'Vencido',
  PENDENTE: 'Pendente',
};
const dt = (s: string | null) =>
  s ? new Date(s).toLocaleDateString('pt-BR') : '—';

export function TreinamentosPage() {
  const catalogo = useQuery({
    queryKey: ['treinamentos', 'catalogo'],
    queryFn: () => api<TreinamentoCatalogo[]>('/treinamentos'),
  });
  const matriculas = useQuery({
    queryKey: ['treinamentos', 'matriculas'],
    queryFn: () => api<MatriculaTreinamento[]>('/treinamentos/colaboradores'),
  });

  return (
    <div>
      <h1 className="content-h1">Treinamentos</h1>
      <p className="content-sub">
        Catálogo de treinamentos e situação (válido / vencido / pendente) por colaborador.
      </p>

      <section className="panel" style={{ marginTop: 18 }}>
        <div className="panel-title">Catálogo</div>
        {catalogo.isLoading && <p className="content-sub">Carregando…</p>}
        {catalogo.error && (
          <p className="error-msg">Erro: {(catalogo.error as Error).message}</p>
        )}
        {catalogo.data && (
          <table className="tbl">
            <thead>
              <tr>
                <th>Treinamento</th>
                <th>Tipo</th>
                <th style={{ textAlign: 'right' }}>Carga</th>
                <th style={{ textAlign: 'right' }}>Validade</th>
                <th style={{ textAlign: 'right' }}>Inscritos</th>
              </tr>
            </thead>
            <tbody>
              {catalogo.data.map((t) => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 600 }}>{t.nome}</td>
                  <td>
                    <Badge tone={t.tipo === 'OBRIGATORIO' ? 'info' : 'neutral'}>
                      {t.tipo === 'OBRIGATORIO' ? 'Obrigatório' : 'Opcional'}
                    </Badge>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {t.cargaHoraria != null ? `${t.cargaHoraria}h` : '—'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {t.validadeMeses != null ? `${t.validadeMeses} m` : '—'}
                  </td>
                  <td style={{ textAlign: 'right' }}>{t._count.colaboradores}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="panel" style={{ marginTop: 18 }}>
        <div className="panel-title">Situação por colaborador</div>
        {matriculas.isLoading && <p className="content-sub">Carregando…</p>}
        {matriculas.error && (
          <p className="error-msg">Erro: {(matriculas.error as Error).message}</p>
        )}
        {matriculas.data && (
          <table className="tbl">
            <thead>
              <tr>
                <th>Colaborador</th>
                <th>Treinamento</th>
                <th>Realização</th>
                <th>Vencimento</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {matriculas.data.map((m) => (
                <tr key={m.id}>
                  <td style={{ fontWeight: 600 }}>{m.colaborador.nomeCompleto}</td>
                  <td>{m.treinamento.nome}</td>
                  <td>{dt(m.dataRealizacao)}</td>
                  <td>{dt(m.dataVencimento)}</td>
                  <td>
                    <Badge tone={tone[m.status] ?? 'neutral'}>
                      {rotulo[m.status] ?? m.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
