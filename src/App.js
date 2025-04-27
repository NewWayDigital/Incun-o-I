import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Landing from './components/Landing';
import MedicalDashboard from './components/dashboard/medical/MedicalDashboard';
import ParentDashboard from './components/dashboard/parent/ParentDashboard';
import AdminDashboard from './components/dashboard/admin/AdminDashboard';
import Patient from './components/dashboard/medical/Patient';
import Alertes from './components/dashboard/medical/Alertes';
import IncubatorsList from './components/dashboard/medical/IncubatorsList';
import OrdonnancesManager from './components/dashboard/medical/OrdonnancesManager';
import Messagerie from './components/dashboard/medical/Messagerie';
import Parametres from './components/dashboard/medical/Parametres';

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Routes du tableau de bord parent */}
        <Route path="/dashboard-parent" element={<ParentDashboard />} />

        {/* Routes du tableau de bord administrateur */}
        <Route path="/dashboard-admin" element={<AdminDashboard />} />
        
        {/* Routes du tableau de bord médical */}
        <Route path="/medical">
          {/* Redirection par défaut vers le dashboard */}
          <Route index element={<Navigate to="/medical/dashboard" replace />} />
          
          {/* Composants du tableau de bord médical */}
          <Route path="dashboard" element={<MedicalDashboard />} />
          <Route path="alertes" element={<Alertes />} />
          <Route path="incubateurs" element={<IncubatorsList />} />
          <Route path="patients" element={<Patient />} />
          <Route path="patient/:id" element={<Patient />} />
          <Route path="ordonnances" element={<OrdonnancesManager />} />
          <Route path="messagerie" element={<Messagerie />} />
          <Route path="parametres" element={<Parametres />} />
        </Route>

        {/* Redirection des routes inconnues vers la page d'accueil */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;