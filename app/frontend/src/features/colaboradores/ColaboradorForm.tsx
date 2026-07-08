import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import type { Opcoes } from '../../types';

export interface ColaboradorFormData {
  id?: string;
  matricula: string;
  nomeCompleto: string;
  cargoId: string;
  departamentoId: string;
  shoppingId: string;
  empresaId: string;
  centroCustoId: string;
  gestorImediatoId: string;
  dataAdmissao: string;
  tipoContrato: string;
  salario: string;
  email: string;
  celular: string;
  cargaHoraria: string;
  escala: string;
  status: string;
}

const VAZIO: ColaboradorFormData = {
  matricula: '',
  nomeCompleto: '',
  cargoId: '',
  departamentoId: '',
  shoppingId: '',
  empresaId: '',
  centroCustoId: '',
  gestorImediatoId: '',
  dataAdmissao: '',
  tipoContrato: 'CLT',
  salario: '',
  email: '',
  celular: '',
  cargaHoraria: '',
  escala: '',
  status: 'EXPERIENCIA',
};

const CONTRATOS = ['CLT', 'EXPERIENCIA', 'ESTAGIO', 'PJ', 'TEMPORARIO'];
const STATUS = ['ATIVO', 'EXPERIENCIA', 'AFASTADO', 'DESLIGADO'];

export function ColaboradorForm({
  opcoes,
  inicial,
  onSaved,
}: {
  opcoes: Opcoes;
  inicial?: ColaboradorFormData;
  onSaved: () => void;
}) {
  const qc = useQueryClient();
  const [form, setForm] = useState<ColaboradorFormData>(inicial ?? VAZIO);
  const editando = Boolean(form.id);

  const set =
    (campo: keyof ColaboradorFormData) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [campo]: e.target.value }));

  const salvar = useMutation({
    mutationFn: () => {
      const payload: Record<string, unknown> = {
        matricula: form.matricula,
        nomeCompleto: form.nomeCompleto,
        cargoId: form.cargoId,
        departamentoId: form.departamentoId,
        shoppingId: form.shoppingId,
        empresaId: form.empresaId,
        dataAdmissao: form.dataAdmissao,
        tipoContrato: form.tipoContrato,
        salario: Number(form.salario),
        status: form.status,
      };
      if (form.centroCustoId) payload.centroCustoId = form.centroCustoId;
      if (form.gestorImediatoId) payload.gestorImediatoId = form.gestorImediatoId;
      if (form.email) payload.email = form.email;
      if (form.celular) payload.celular = form.celular;
      if (form.cargaHoraria) payload.cargaHoraria = form.cargaHoraria;
      if (form.escala) payload.escala = form.escala;

      return editando
        ? api(`/colaboradores/${form.id}`, {
            method: 'PATCH',
            body: JSON.stringify(payload),
          })
        : api('/colaboradores', {
            method: 'POST',
            body: JSON.stringify(payload),
          });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['colaboradores'] });
      qc.invalidateQueries({ queryKey: ['organograma'] });
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
          <span className="field-label">Matrícula *</span>
          <input className="input" required value={form.matricula} onChange={set('matricula')} />
        </label>
        <label>
          <span className="field-label">Nome completo *</span>
          <input className="input" required value={form.nomeCompleto} onChange={set('nomeCompleto')} />
        </label>

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
          <span className="field-label">Empresa *</span>
          <select className="input" required value={form.empresaId} onChange={set('empresaId')}>
            <option value="">Selecione…</option>
            {opcoes.empresas.map((e) => (
              <option key={e.id} value={e.id}>{e.razaoSocial}</option>
            ))}
          </select>
        </label>

        <label>
          <span className="field-label">Centro de custo</span>
          <select className="input" value={form.centroCustoId} onChange={set('centroCustoId')}>
            <option value="">—</option>
            {opcoes.centrosCusto.map((cc) => (
              <option key={cc.id} value={cc.id}>{cc.codigo}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="field-label">Gestor imediato</span>
          <select className="input" value={form.gestorImediatoId} onChange={set('gestorImediatoId')}>
            <option value="">— (sem gestor / raiz)</option>
            {opcoes.colaboradores
              .filter((c) => c.id !== form.id)
              .map((c) => (
                <option key={c.id} value={c.id}>{c.nomeCompleto}</option>
              ))}
          </select>
        </label>

        <label>
          <span className="field-label">Admissão *</span>
          <input className="input" type="date" required value={form.dataAdmissao} onChange={set('dataAdmissao')} />
        </label>
        <label>
          <span className="field-label">Tipo de contrato *</span>
          <select className="input" required value={form.tipoContrato} onChange={set('tipoContrato')}>
            {CONTRATOS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label>
          <span className="field-label">Salário (R$) *</span>
          <input className="input" type="number" min="0" step="0.01" required value={form.salario} onChange={set('salario')} />
        </label>
        <label>
          <span className="field-label">Status *</span>
          <select className="input" required value={form.status} onChange={set('status')}>
            {STATUS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>

        <label>
          <span className="field-label">E-mail</span>
          <input className="input" type="email" value={form.email} onChange={set('email')} />
        </label>
        <label>
          <span className="field-label">Celular</span>
          <input className="input" value={form.celular} onChange={set('celular')} />
        </label>

        <label>
          <span className="field-label">Carga horária</span>
          <input className="input" placeholder="44h semanais" value={form.cargaHoraria} onChange={set('cargaHoraria')} />
        </label>
        <label>
          <span className="field-label">Escala</span>
          <input className="input" placeholder="5x2" value={form.escala} onChange={set('escala')} />
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
        {salvar.isPending ? 'Salvando…' : editando ? 'Salvar alterações' : 'Cadastrar colaborador'}
      </button>
    </form>
  );
}
