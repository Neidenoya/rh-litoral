import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import type { RelatorioQuadro, HeadcountItem } from '../../types';

function BarList({ itens, moeda = false }: { itens: HeadcountItem[]; moeda?: boolean }) {
  const max = Math.max(...itens.map((i) => i.valor), 1);
  const fmt = (v: number) =>
    moeda
      ? v.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          maximumFractionDigits: 0,
        })
      : String(v);
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
          <span className="bar-value" style={{ width: moeda ? 92 : 38 }}>
            {fmt(i.valor)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function RelatoriosPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['relatorios', 'quadro'],
    queryFn: () => api<RelatorioQuadro>('/relatorios/quadro'),
  });

  if (isLoading) return <p className="content-sub">Gerando relatórios…</p>;
  if (error) return <p className="error-msg">Erro: {(error as Error).message}</p>;
  if (!data) return null;

  return (
    <div>
      <h1 className="content-h1">Relatórios</h1>
      <p className="content-sub">
        Quadro de pessoas consolidado. Custo de folha visível apenas para Diretoria, RH e Financeiro.
      </p>

      <div className="grid-2col" style={{ marginTop: 22 }}>
        <section className="panel">
          <div className="panel-title">Headcount por departamento</div>
          <BarList itens={data.headcountDepartamento} />
        </section>
        <section className="panel">
          <div className="panel-title">Headcount por shopping</div>
          <BarList itens={data.headcountShopping} />
        </section>
      </div>

      <div className="grid-2col" style={{ marginTop: 18 }}>
        <section className="panel">
          <div className="panel-title">Distribuição por tipo de contrato</div>
          <BarList itens={data.porContrato} />
        </section>
        <section className="panel">
          <div className="panel-title">Distribuição por status</div>
          <BarList itens={data.porStatus} />
        </section>
      </div>

      <section className="panel" style={{ marginTop: 18 }}>
        <div className="panel-title">Custo de folha por departamento (mensal)</div>
        {data.custoFolhaDepartamento ? (
          <BarList itens={data.custoFolhaDepartamento} moeda />
        ) : (
          <p className="content-sub">
            🔒 Indisponível para o seu perfil (restrito a Diretoria, RH e Financeiro).
          </p>
        )}
      </section>
    </div>
  );
}
