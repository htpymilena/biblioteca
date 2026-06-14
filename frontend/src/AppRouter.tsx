import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Components
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

// Public Pages
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// User Pages
import CatalogPage from './pages/user/CatalogPage';
import BookDetailPage from './pages/user/BookDetailPage';
import LoansPage from './pages/user/LoansPage';
import PaymentsPage from './pages/user/PaymentsPage';
import ProfilePage from './pages/user/ProfilePage';

// Librarian Pages
import BookManagementPage from './pages/librarian/BookManagementPage';
import BookFormPage from './pages/librarian/BookFormPage';
import LoansHistoryPage from './pages/librarian/LoansHistoryPage';
import LibrarianProfilePage from './pages/librarian/LibrarianProfilePage';

// Admin Pages
import UserManagementPage from './pages/admin/UserManagementPage';
import UserFormPage from './pages/admin/UserFormPage';
import ParametersPage from './pages/admin/ParametersPage';
import AuditLogsPage from './pages/admin/AuditLogsPage';

const RootRedirect: React.FC = () => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'USER') return <Navigate to="/user/catalog" replace />;
  if (role === 'LIBRARIAN') return <Navigate to="/librarian/books" replace />;
  if (role === 'ADMIN') return <Navigate to="/admin/users" replace />;

  return <Navigate to="/login" replace />;
};

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />

        {/* Rota Raiz (Redirecionamento Inteligente) */}
        <Route path="/" element={<RootRedirect />} />

        {/* Rotas Protegidas Leitor (USER) */}
        <Route path="/user" element={<PrivateRoute allowedRole="USER"><Layout /></PrivateRoute>}>
          <Route path="catalog" element={<CatalogPage />} />
          <Route path="catalog/:id" element={<BookDetailPage />} />
          <Route path="loans" element={<LoansPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Rotas Protegidas Bibliotecário (LIBRARIAN) */}
        <Route path="/librarian" element={<PrivateRoute allowedRole="LIBRARIAN"><Layout /></PrivateRoute>}>
          <Route path="books" element={<BookManagementPage />} />
          <Route path="books/new" element={<BookFormPage />} />
          <Route path="books/:id" element={<BookFormPage />} />
          <Route path="loans-history" element={<LoansHistoryPage />} />
          <Route path="profile" element={<LibrarianProfilePage />} />
        </Route>

        {/* Rotas Protegidas Administrador (ADMIN) */}
        <Route path="/admin" element={<PrivateRoute allowedRole="ADMIN"><Layout /></PrivateRoute>}>
          <Route path="users" element={<UserManagementPage />} />
          <Route path="users/new" element={<UserFormPage />} />
          <Route path="users/:id" element={<UserFormPage />} />
          <Route path="parameters" element={<ParametersPage />} />
          <Route path="audit-logs" element={<AuditLogsPage />} />
        </Route>

        {/* Qualquer outra rota redireciona para a raiz */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
