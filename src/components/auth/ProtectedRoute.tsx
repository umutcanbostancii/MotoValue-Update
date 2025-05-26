import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { loading } = useAuth();

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  // Geçici olarak authentication kontrolünü bypass ediyoruz
  return <>{children}</>;
}; 