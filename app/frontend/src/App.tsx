import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './app/auth';
import { AppShell } from './components/layout/AppShell';
import { LoginPage } from './features/auth/LoginPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { OrganogramaPage } from './features/organograma/OrganogramaPage';
import { ColaboradoresPage } from './features/colaboradores/ColaboradoresPage';
import { VagasPage } from './features/vagas/VagasPage';
import { FeriasPage } from './features/ferias/FeriasPage';
import { TreinamentosPage } from './features/treinamentos/TreinamentosPage';
import { DocumentosPage } from './features/documentos/DocumentosPage';
import { AvaliacoesPage } from './features/avaliacoes/AvaliacoesPage';
import { RelatoriosPage } from './features/relatorios/RelatoriosPage';

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
        <Route path="/vagas" element={<VagasPage />} />
        <Route path="/ferias" element={<FeriasPage />} />
        <Route path="/treinamentos" element={<TreinamentosPage />} />
        <Route path="/documentos" element={<DocumentosPage />} />
        <Route path="/avaliacoes" element={<AvaliacoesPage />} />
        <Route path="/relatorios" element={<RelatoriosPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
