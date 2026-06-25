import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../app/auth';

const NAV = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/organograma', label: 'Organograma' },
  { to: '/colaboradores', label: 'Colaboradores' },
  { to: '/vagas', label: 'Vagas' },
  { to: '/ferias', label: 'Férias' },
  { to: '/treinamentos', label: 'Treinamentos' },
  { to: '/documentos', label: 'Documentos' },
  { to: '/avaliacoes', label: 'Avaliações' },
  { to: '/relatorios', label: 'Relatórios' },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { usuario, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-mark">RH</div>
          <div>
            <div className="sidebar-brand-text">RH Litoral</div>
            <div className="sidebar-brand-sub">Gestão de Pessoas</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `nav-item${isActive ? ' active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="topbar-title">RH Litoral</div>
          <div className="topbar-spacer" />
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {usuario?.email} · <strong>{usuario?.perfil}</strong>
          </span>
          <button
            className="btn"
            style={{ width: 'auto', padding: '8px 14px' }}
            onClick={logout}
          >
            Sair
          </button>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
