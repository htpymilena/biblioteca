import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { role, email, logout } = useAuth();

  const getLinks = () => {
    if (role === 'USER') {
      return [
        { path: '/user/catalog', label: 'Catálogo de Livros' },
        { path: '/user/loans', label: 'Meus Empréstimos' },
        { path: '/user/payments', label: 'Pagamentos / Taxas' },
        { path: '/user/profile', label: 'Meu Perfil' },
      ];
    }
    if (role === 'LIBRARIAN') {
      return [
        { path: '/librarian/books', label: 'Gestão de Acervo' },
        { path: '/librarian/loans-history', label: 'Histórico de Empréstimos' },
        { path: '/librarian/profile', label: 'Meu Perfil' },
      ];
    }
    if (role === 'ADMIN') {
      return [
        { path: '/admin/users', label: 'Gestão de Usuários' },
        { path: '/admin/parameters', label: 'Parâmetros do Sistema' },
        { path: '/admin/audit-logs', label: 'Trilha de Auditoria' },
      ];
    }
    return [];
  };

  const links = getLinks();

  return (
    <div style={{
      width: '260px',
      backgroundColor: 'var(--blue-950)',
      color: 'var(--white-pure)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 1rem',
      height: '100vh',
      position: 'sticky',
      top: 0
    }}>
      <div style={{ marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
        <h2 style={{ color: 'var(--white-pure)', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>📚 Biblioteca</h2>
        <span style={{ fontSize: '0.75rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px' }}>
          Painel do {role === 'ADMIN' ? 'Administrador' : role === 'LIBRARIAN' ? 'Bibliotecário' : 'Leitor'}
        </span>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            style={({ isActive }) => ({
              display: 'block',
              padding: '0.75rem 1rem',
              color: 'var(--white-pure)',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: 500,
              fontSize: '0.9rem',
              backgroundColor: isActive ? 'var(--blue-700)' : 'transparent',
              transition: 'var(--transition-all)',
            })}
            className={({ isActive }) => isActive ? 'sidebar-link-active' : ''}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div style={{
        marginTop: 'auto',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        paddingTop: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.8rem', opacity: 0.8 }}>
          👤 {email}
        </div>
        <button
          onClick={logout}
          className="btn btn-danger"
          style={{ width: '100%', padding: '0.6rem' }}
        >
          Sair
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
