import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { useAuth } from '../../app/auth';
import { Badge } from '../../components/Badge';
import type { Tone } from '../../components/Badge';
import { Modal } from '../../components/Modal';
import { VagaForm } from './VagaForm';
import type { VagaLista, Opcoes } from '../../types';

const COLUNAS: { status: string; label: string }[] = [
  { status: 'ABERTA', label: 'Aberta' },
  { status: 'TRIAGEM', label: 'Triagem' },
  { status: 'ENTREVISTA_RH', label: 'Entrevista RH' },
  { status: 'ENTREVISTA_GESTOR', label: 'Entrevista Gestor' },
  { status: 'APROVADO', label: 'Aprovado' },
  { status: 'CONTRATADO', label: 'Contratado' },
];

const prioridadeTone: Record<string, Tone> = {
  URGENTE: 'danger',
  ALTA: 'warning',
  MEDIA: 'info',
  BAIXA: 'neutral',
};

export function VagasPage() {
  const qc = useQueryClient();
  const { usuario } = useAuth();
  const podeMover = usuario?.perfil === 'RH';
  const podeAbrir = usuario?.perfil === 'RH' || usuario?.perfil === 'GESTOR';
  const [abrir, setAbrir] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['vagas'],
    queryFn: () => api<VagaLista[]>('/vagas'),
  });

  const opcoes = useQuery({
    queryKey: ['opcoes'],
    queryFn: () => api<Opcoes>('/opcoes'),
    enabled: podeAbrir,
  });

  const avancar = useMutation({
    mutationFn: (id: string) => api(`/vagas/${id}/avancar`, { method: 'PATCH' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vagas'] }),
  });
  const cancelar = useMutation({
    mutationFn: (id: string) => api(`/vagas/${id}/cancelar`, { method: 'PATCH' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vagas'] }),
  });

  if (isLoading) return <p className="content-sub">Carregando vagas…</p>;
  if (error) return <p className="error-msg">Erro: {(error as Error).message}</p>;

  const vagas = data ?? [];
  const canceladas = vagas.filter((v) => v.status === 'CANCELADA');

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
          <h1 className="content-h1">Vagas &amp; Recrutamento</h1>
          <p className="content-sub">
            Funil de R&amp;S — da abertura à contratação.{' '}
            {podeMover
              ? 'Avance ou cancele cada vaga.'
              : 'Somente o perfil RH pode movimentar as vagas.'}
          </p>
        </div>
        {podeAbrir && (
          <button
            className="btn btn-primary"
            style={{ width: 'auto', flexShrink: 0 }}
            onClick={() => setAbrir(true)}
          >
            + Abrir vaga
          </button>
        )}
      </div>

      <div className="funnel" style={{ marginTop: 22 }}>
        {COLUNAS.map((col, i) => {
          const itens = vagas.filter((v) => v.status === col.status);
          return (
            <div className="funnel-col" key={col.status}>
              <div className="funnel-col-head">
                <span>{col.label}</span>
                <span className="funnel-count">{itens.length}</span>
              </div>
              {itens.map((v) => (
                <div className="funnel-card" key={v.id}>
                  <div className="funnel-card-cargo">{v.cargo.nome}</div>
                  <div className="funnel-card-meta">
                    {v.departamento.nome} · {v.shopping.nome}
                  </div>
                  <div style={{ margin: '8px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Badge tone={prioridadeTone[v.prioridade] ?? 'neutral'}>
                      {v.prioridade}
                    </Badge>
                    <span className="funnel-card-cand">
                      {v._count.candidatos} cand.
                    </span>
                  </div>
                  {podeMover && (
                    <div className="funnel-card-actions">
                      {i < COLUNAS.length - 1 && (
                        <button
                          className="btn-mini"
                          disabled={avancar.isPending}
                          onClick={() => avancar.mutate(v.id)}
                        >
                          Avançar →
                        </button>
                      )}
                      <button
                        className="btn-mini btn-mini-danger"
                        disabled={cancelar.isPending}
                        onClick={() => cancelar.mutate(v.id)}
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {itens.length === 0 && <div className="funnel-empty">—</div>}
            </div>
          );
        })}
      </div>

      {canceladas.length > 0 && (
        <p className="content-sub" style={{ marginTop: 16 }}>
          {canceladas.length} vaga(s) cancelada(s) fora do funil.
        </p>
      )}

      {abrir && (
        <Modal titulo="Abrir nova vaga" onClose={() => setAbrir(false)}>
          {opcoes.isLoading && <p className="content-sub">Carregando opções…</p>}
          {opcoes.error && (
            <p className="error-msg">
              Erro ao carregar opções: {(opcoes.error as Error).message}
            </p>
          )}
          {opcoes.data && (
            <VagaForm opcoes={opcoes.data} onSaved={() => setAbrir(false)} />
          )}
        </Modal>
      )}
    </div>
  );
}
