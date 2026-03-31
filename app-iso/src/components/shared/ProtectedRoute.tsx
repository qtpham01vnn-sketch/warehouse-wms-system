import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles }) => {
  const { user, profile, loading } = useAuth();

  if (loading) return <div className="loading-state">Authenticating...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && profile) {
    if (profile.role !== 'Admin' && !requiredRoles.includes(profile.role)) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
