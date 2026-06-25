import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import type { DashboardIndicadores, HeadcountItem } from '../../types';

function BarList({ itens }: { itens: HeadcountItem[] }) {
  const max = Math.max(...itens.map((i) => i.valor), 1);
  return (
    <div>
      {itens.map((i) => (
        <div className="bar-row" key={i.nome}>
          <span className="bar-label" title={i.nome}>
            {i.nome}
          </span>
          <span className="bar-track">
            <span className="bar-fill" style={{ width: `${(i.valor / max) * 100}%` }} />
          </span>
          <span className="bar-value">{i.valor}</span>
        </div>
      ))}
    </div>
  );
}

function Kpi({ label, valor }: { label: string; valor: number | string }) {
  return (
    <div className="kpi-card">
      <span className="kpi-label">{label}</span>
      <span className="kpi-value">{valor}</span>
    </div>
  );
}

export function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['indicadores', 'dashboard'],
    queryFn: () => api<DashboardIndicadores>('/indicadores/dashboard'),
  });

  if (isLoading) return <p className="content-sub">Carregando indicadores…</p>;
  if (error) return <p className="error-msg">Erro ao carregar: {(error as Error).message}</p>;
  if (!data) return null;

  return (
    <div>
      <h1 className="content-h1">Dashboard Executivo</h1>
      <p className="content-sub">Visão consolidada do quadro de pessoas da rede.</p>

      <div className="kpi-grid">
        <Kpi label="Colaboradores ativos" valor={data.totalColaboradores} />
        <Kpi label="Vagas abertas" valor={data.vagasAbertas} />
        <Kpi label="Admissões no mês" valor={data.admissoesMes} />
        <Kpi label="Desligamentos no mês" valor={data.desligamentosMes} />
        <Kpi label="Experiência vencendo" valor={data.experienciaVencendo.length} />
        <Kpi label="Aniversariantes do mês" valor={data.aniversariantesMes.length} />
      </div>

      <div className="grid-2col">
        <section className="panel">
          <div className="panel-title">Headcount por departamento</div>
          <BarList itens={data.headcountDepartamento} />
        </section>
        <section className="panel">
          <div className="panel-title">Headcount por shopping</div>
          <BarList itens={data.headcountShopping} />
        </section>
      </div>

      <section className="panel" style={{ marginTop: 18 }}>
        <div className="panel-title">Contratos de experiência a vencer (30 dias)</div>
        {data.experienciaVencendo.length === 0 ? (
          <p className="content-sub">Nenhum contrato de experiência a vencer.</p>
        ) : (
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5 }}>
            {data.experienciaVencendo.map((c) => (
              <li key={c.id} style={{ marginBottom: 6 }}>
                <strong>{c.nomeCompleto}</strong> —{' '}
                {new Date(c.fimExperiencia).toLocaleDateString('pt-BR')}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
