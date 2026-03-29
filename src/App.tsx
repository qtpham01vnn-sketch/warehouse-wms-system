import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';


import Dashboard from './pages/Dashboard/Dashboard';
import CompanyPlans from './pages/CompanyPlans/CompanyPlans';
import DepartmentPlans from './pages/DepartmentPlans/DepartmentPlans';
import Approvals from './pages/Approvals/Approvals';
import Progress from './pages/Progress/Progress';
import Reports from './pages/Reports/Reports';
import Documents from './pages/Documents/Documents';
import Settings from './pages/Settings/Settings';

import { AppProvider } from './contexts/AppContext';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';

function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="plans" element={<CompanyPlans />} />
                <Route path="department-plans" element={<DepartmentPlans />} />
                <Route path="approvals" element={<Approvals />} />
                <Route path="progress" element={<Progress />} />
                <Route path="reports" element={<Reports />} />
                <Route path="documents" element={<Documents />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </AppProvider>
  );
}

export default App;
