import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import type { Opcoes } from '../../types';

const PRIORIDADES = ['BAIXA', 'MEDIA', 'ALTA', 'URGENTE'];

export function VagaForm({ opcoes, onSaved }: { opcoes: Opcoes; onSaved: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    cargoId: '',
    departamentoId: '',
    shoppingId: '',
    gestorSolicitanteId: '',
    prioridade: 'MEDIA',
  });

  const set =
    (campo: keyof typeof form) => (e: ChangeEvent<HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [campo]: e.target.value }));

  const salvar = useMutation({
    mutationFn: () => api('/vagas', { method: 'POST', body: JSON.stringify(form) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['vagas'] });
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
          <span className="field-label">Cargo *</span>
          <select className="input" required value={form.cargoId} onChange={set('cargoId')}>
            <option value="">Selecione…</option>
            {opcoes.cargos.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="field-label">Departamento *</span>
          <select className="input" required value={form.departamentoId} onChange={set('departamentoId')}>
            <option value="">Selecione…</option>
            {opcoes.departamentos.map((d) => (
              <option key={d.id} value={d.id}>{d.nome}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="field-label">Shopping *</span>
          <select className="input" required value={form.shoppingId} onChange={set('shoppingId')}>
            <option value="">Selecione…</option>
            {opcoes.shoppings.map((s) => (
              <option key={s.id} value={s.id}>{s.nome}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="field-label">Gestor solicitante *</span>
          <select className="input" required value={form.gestorSolicitanteId} onChange={set('gestorSolicitanteId')}>
            <option value="">Selecione…</option>
            {opcoes.colaboradores.map((c) => (
              <option key={c.id} value={c.id}>{c.nomeCompleto}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="field-label">Prioridade</span>
          <select className="input" value={form.prioridade} onChange={set('prioridade')}>
            {PRIORIDADES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </label>
      </div>

      {salvar.error && (
        <p className="error-msg" style={{ marginTop: 12 }}>
          {(salvar.error as Error).message}
        </p>
      )}

      <button
        className="btn btn-primary"
        type="submit"
        style={{ marginTop: 8 }}
        disabled={salvar.isPending}
      >
        {salvar.isPending ? 'Abrindo…' : 'Abrir vaga'}
      </button>
    </form>
  );
}
