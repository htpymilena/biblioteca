import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import userApi from '../../services/userApi';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await userApi.post('/api/auth/register', { name, email, password });
      setSuccess('Conta criada com sucesso! Redirecionando para o login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 409) {
        setError('Este e-mail já está cadastrado no sistema.');
      } else {
        setError(err.response?.data?.message || 'Falha ao conectar ao servidor de cadastro.');
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
          <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>Cadastre-se para começar a ler</p>
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

        {success && (
          <div style={{
            backgroundColor: 'var(--emerald-500)',
            color: 'var(--white-pure)',
            padding: '0.75rem',
            borderRadius: '6px',
            fontSize: '0.875rem',
            marginBottom: '1.25rem',
            textAlign: 'center'
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nome Completo</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Maria Silva"
              required
              disabled={loading || !!success}
            />
          </div>

          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mariasilva@exemplo.com"
              required
              disabled={loading || !!success}
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
              disabled={loading || !!success}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}
            disabled={loading || !!success}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
          <span style={{ color: 'var(--gray-500)' }}>Já possui uma conta? </span>
          <Link to="/login" style={{ color: 'var(--blue-700)', fontWeight: 600, textDecoration: 'none' }}>
            Faça Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
