import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './app/auth';
import { AppShell } from './components/layout/AppShell';
import { LoginPage } from './features/auth/LoginPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { OrganogramaPage } from './features/organograma/OrganogramaPage';
import { ColaboradoresPage } from './features/colaboradores/ColaboradoresPage';
import { EmBreve } from './components/EmBreve';

export function App() {
  const { usuario } = useAuth();

  if (!usuario) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/organograma" element={<OrganogramaPage />} />
        <Route path="/colaboradores" element={<ColaboradoresPage />} />
        <Route path="/vagas" element={<EmBreve titulo="Vagas" />} />
        <Route path="/ferias" element={<EmBreve titulo="Férias" />} />
        <Route path="/treinamentos" element={<EmBreve titulo="Treinamentos" />} />
        <Route path="/documentos" element={<EmBreve titulo="Documentos" />} />
        <Route path="/avaliacoes" element={<EmBreve titulo="Avaliações" />} />
        <Route path="/relatorios" element={<EmBreve titulo="Relatórios" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
