import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import DocumentHub from './pages/DocumentHub/DocumentHub';
import DocumentDetail from './pages/DocumentDetail/DocumentDetail';
import Certificates from './pages/Certificates/Certificates';
import Alerts from './pages/Alerts/Alerts';
import Login from './pages/Auth/Login';
import ProtectedRoute from './components/shared/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="documents" element={<DocumentHub />} />
            <Route path="documents/:id" element={<DocumentDetail />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="alerts" element={<Alerts />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </AuthProvider>
  );
}

export default App;
