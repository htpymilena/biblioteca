import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import userApi from '../../services/userApi';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await userApi.post('/api/auth/login', { email, password });
      const { token } = response.data;
      
      login(token);

      // O login decodifica o JWT no AuthContext. 
      // Vamos buscar o JWT decodificado no localStorage para saber a role e redirecionar
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = JSON.parse(window.atob(base64));
      const role = decoded.role;

      if (role === 'USER') {
        navigate('/user/catalog');
      } else if (role === 'LIBRARIAN') {
        navigate('/librarian/books');
      } else if (role === 'ADMIN') {
        navigate('/admin/users');
      } else {
        navigate('/login');
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401) {
        setError('Credenciais inválidas. Verifique seu e-mail e senha.');
      } else {
        setError(err.response?.data?.message || 'Falha de conexão com o servidor de autenticação.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: 'var(--blue-50)',
      padding: '1rem'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>📚 Biblioteca</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>Entre na sua conta para continuar</p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'var(--red-500)',
            color: 'var(--white-pure)',
            padding: '0.75rem',
            borderRadius: '6px',
            fontSize: '0.875rem',
            marginBottom: '1.25rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Senha</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
          <span style={{ color: 'var(--gray-500)' }}>Não possui uma conta? </span>
          <Link to="/cadastro" style={{ color: 'var(--blue-700)', fontWeight: 600, textDecoration: 'none' }}>
            Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
