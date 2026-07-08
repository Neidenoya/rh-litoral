import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import type { Opcoes } from '../../types';

const TIPOS = ['CONTRATO', 'RG', 'CPF', 'CNH', 'ASO', 'EXAME', 'ADVERTENCIA', 'OUTRO'];

export function DocumentoForm({ opcoes, onSaved }: { opcoes: Opcoes; onSaved: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ colaboradorId: '', tipo: 'CONTRATO', arquivoUrl: '' });

  const set =
    (campo: keyof typeof form) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [campo]: e.target.value }));

  const salvar = useMutation({
    mutationFn: () => api('/documentos', { method: 'POST', body: JSON.stringify(form) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['documentos'] });
      onSaved();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        salvar.mutate();
      }}
    >
      <div className="form-grid">
        <label>
          <span className="field-label">Colaborador *</span>
          <select className="input" required value={form.colaboradorId} onChange={set('colaboradorId')}>
            <option value="">Selecione…</option>
            {opcoes.colaboradores.map((c) => (
              <option key={c.id} value={c.id}>{c.nomeCompleto}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="field-label">Tipo *</span>
          <select className="input" required value={form.tipo} onChange={set('tipo')}>
            {TIPOS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>

      <label>
        <span className="field-label">URL / caminho do arquivo *</span>
        <input
          className="input"
          required
          placeholder="https://…  ou  /uploads/…"
          value={form.arquivoUrl}
          onChange={set('arquivoUrl')}
        />
      </label>
      <p className="content-sub" style={{ marginTop: -6, marginBottom: 10 }}>
        Registro por link. O upload de arquivo binário será habilitado quando o storage
        (S3 / Azure Blob / pasta de rede) for definido — ver PRODUCAO.md 3.2.
      </p>

      {salvar.error && <p className="error-msg">{(salvar.error as Error).message}</p>}

      <button className="btn btn-primary" type="submit" disabled={salvar.isPending}>
        {salvar.isPending ? 'Registrando…' : 'Registrar documento'}
      </button>
    </form>
  );
}
