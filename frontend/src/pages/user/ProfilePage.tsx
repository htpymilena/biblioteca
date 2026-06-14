import React, { useState, useEffect } from 'react';
import userApi from '../../services/userApi';

const ProfilePage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userApi.get('/api/auth/profile');
      setName(response.data.name);
      setEmail(response.data.email);
    } catch (err: any) {
      console.error(err);
      setError('Falha ao carregar os dados do perfil.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      await userApi.put('/api/auth/profile', {
        name,
        email,
        password: password || undefined // Envia apenas se alterado
      });
      setSuccess('Perfil atualizado com sucesso!');
      setPassword(''); // limpa o campo de senha
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Falha ao atualizar o perfil.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Carregando perfil...</div>;
  }

  return (
    <div style={{ maxWidth: '600px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1>Meu Perfil</h1>
        <p className="subtitle">Gerencie suas informações pessoais e credenciais de acesso.</p>
      </div>

      <div className="card">
        {success && (
          <div style={{
            backgroundColor: 'var(--emerald-500)',
            color: 'var(--white-pure)',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            textAlign: 'center',
            fontWeight: 500
          }}>
            {success}
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: 'var(--red-500)',
            color: 'var(--white-pure)',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            textAlign: 'center',
            fontWeight: 500
          }}>
            {error}
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
              required
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Endereço de E-mail</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={submitting}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Nova Senha (deixe em branco para manter a atual)</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={submitting}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={fetchProfile}
              disabled={submitting}
            >
              Descartar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
