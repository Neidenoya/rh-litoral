import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import type { OrgNode } from '../../types';

const CORES = ['#2563EB', '#7C3AED', '#0D9488', '#D97706', '#DC2626', '#0EA5E9', '#65A30D', '#9333EA'];

function iniciais(nome: string) {
  return nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

function cor(nome: string) {
  const soma = nome.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return CORES[soma % CORES.length];
}

function NodeView({ node, root = false }: { node: OrgNode; root?: boolean }) {
  return (
    <div className="org-node">
      <div className={`org-card${root ? ' root' : ''}`}>
        <span className="org-avatar" style={{ background: cor(node.nome) }}>
          {iniciais(node.nome)}
        </span>
        <div>
          <div className="org-card-name">{node.nome}</div>
          <div className="org-card-role">{node.cargo}</div>
        </div>
        {node.subordinadosTotais > 0 && (
          <span className="org-card-count" title="Subordinados (diretos + indiretos)">
            {node.subordinadosTotais}
          </span>
        )}
      </div>
      {node.filhos.length > 0 && (
        <div className="org-children">
          {node.filhos.map((f) => (
            <NodeView key={f.id} node={f} />
          ))}
        </div>
      )}
    </div>
  );
}

export function OrganogramaPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['organograma'],
    queryFn: () => api<OrgNode | OrgNode[]>('/organograma'),
  });

  if (isLoading) return <p className="content-sub">Montando organograma…</p>;
  if (error) return <p className="error-msg">Erro: {(error as Error).message}</p>;
  if (!data) return null;

  const raizes = Array.isArray(data) ? data : [data];

  return (
    <div>
      <h1 className="content-h1">Organograma</h1>
      <p className="content-sub">
        Hierarquia derivada automaticamente do gestor imediato de cada colaborador.
      </p>
      <div className="org-wrap" style={{ marginTop: 22 }}>
        <div className="org-tree">
          {raizes.map((r) => (
            <NodeView key={r.id} node={r} root />
          ))}
        </div>
      </div>
    </div>
  );
}
