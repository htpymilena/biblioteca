import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, type UserRole } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRole }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Carregando...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role !== allowedRole) {
    // Redireciona o usuário para sua respectiva dashboard padrão se tentar acessar rota de outro
    if (role === 'USER') return <Navigate to="/user/catalog" replace />;
    if (role === 'LIBRARIAN') return <Navigate to="/librarian/books" replace />;
    if (role === 'ADMIN') return <Navigate to="/admin/users" replace />;
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
