import { FormEvent, useState } from 'react';
import { useAuth } from '../../app/auth';

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('rh@rhlitoral.com.br');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      await login(email, senha);
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Falha no login');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={onSubmit}>
        <div className="sidebar-brand-mark" style={{ marginBottom: 16 }}>
          RH
        </div>
        <h1>RH Litoral</h1>
        <p className="sub">Gestão Estratégica de Pessoas</p>

        {erro && <div className="error-msg">{erro}</div>}

        <label className="field-label">E-mail</label>
        <input
          className="input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="field-label">Senha</label>
        <input
          className="input"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <button className="btn btn-primary" disabled={carregando}>
          {carregando ? 'Entrando…' : 'Entrar'}
        </button>

        <p style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 16 }}>
          Ambiente de desenvolvimento — usuários do seed (senha <code>litoral123</code>):
          diretoria@ · rh@ · financeiro@ · gestor@ · juridico@ rhlitoral.com.br
        </p>
      </form>
    </div>
  );
}
