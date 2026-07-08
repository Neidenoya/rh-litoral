import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Badge } from '../../components/Badge';
import type { DocumentoLista } from '../../types';

const TIPOS = ['CONTRATO', 'RG', 'CPF', 'CNH', 'ASO', 'EXAME', 'ADVERTENCIA', 'OUTRO'];
const dt = (s: string) => new Date(s).toLocaleDateString('pt-BR');

export function DocumentosPage() {
  const [tipo, setTipo] = useState('');
  const { data, isLoading, error } = useQuery({
    queryKey: ['documentos', tipo],
    queryFn: () =>
      api<DocumentoLista[]>(`/documentos${tipo ? `?tipo=${tipo}` : ''}`),
  });

  return (
    <div>
      <h1 className="content-h1">Documentos</h1>
      <p className="content-sub">
        Documentos digitalizados por colaborador (contratos, RG, ASO, exames…).
      </p>

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
    </div>
  );
}
