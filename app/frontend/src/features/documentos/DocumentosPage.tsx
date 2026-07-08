import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { useAuth } from '../../app/auth';
import { Badge } from '../../components/Badge';
import { Modal } from '../../components/Modal';
import { DocumentoForm } from './DocumentoForm';
import type { DocumentoLista, Opcoes } from '../../types';

const TIPOS = ['CONTRATO', 'RG', 'CPF', 'CNH', 'ASO', 'EXAME', 'ADVERTENCIA', 'OUTRO'];
const dt = (s: string) => new Date(s).toLocaleDateString('pt-BR');

export function DocumentosPage() {
  const { usuario } = useAuth();
  const podeRegistrar = usuario?.perfil === 'RH';
  const [tipo, setTipo] = useState('');
  const [registrar, setRegistrar] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['documentos', tipo],
    queryFn: () =>
      api<DocumentoLista[]>(`/documentos${tipo ? `?tipo=${tipo}` : ''}`),
  });

  const opcoes = useQuery({
    queryKey: ['opcoes'],
    queryFn: () => api<Opcoes>('/opcoes'),
    enabled: podeRegistrar,
  });

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
          <h1 className="content-h1">Documentos</h1>
          <p className="content-sub">
            Documentos digitalizados por colaborador (contratos, RG, ASO, exames…).
          </p>
        </div>
        {podeRegistrar && (
          <button
            className="btn btn-primary"
            style={{ width: 'auto', flexShrink: 0 }}
            onClick={() => setRegistrar(true)}
          >
            + Registrar documento
          </button>
        )}
      </div>

      <select
        className="input"
        style={{ maxWidth: 240, marginTop: 18 }}
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
      >
        <option value="">Todos os tipos</option>
        {TIPOS.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      {isLoading && <p className="content-sub">Carregando…</p>}
      {error && <p className="error-msg">Erro: {(error as Error).message}</p>}

      {data && (
        <div className="panel" style={{ padding: 0, overflow: 'hidden', marginTop: 16 }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Colaborador</th>
                <th>Tipo</th>
                <th>Upload</th>
                <th>Arquivo</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.id}>
                  <td style={{ fontWeight: 600 }}>{d.colaborador.nomeCompleto}</td>
                  <td>
                    <Badge tone="info">{d.tipo}</Badge>
                  </td>
                  <td>{dt(d.dataUpload)}</td>
                  <td>
                    <a
                      href={d.arquivoUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: 'var(--c-primary-600)', fontWeight: 600 }}
                    >
                      Abrir
                    </a>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>
                    Nenhum documento.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {registrar && (
        <Modal titulo="Registrar documento" onClose={() => setRegistrar(false)}>
          {opcoes.isLoading && <p className="content-sub">Carregando opções…</p>}
          {opcoes.error && (
            <p className="error-msg">
              Erro ao carregar opções: {(opcoes.error as Error).message}
            </p>
          )}
          {opcoes.data && (
            <DocumentoForm opcoes={opcoes.data} onSaved={() => setRegistrar(false)} />
          )}
        </Modal>
      )}
    </div>
  );
}
