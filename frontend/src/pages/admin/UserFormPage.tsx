import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import adminApi from '../../services/adminApi';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'LIBRARIAN' | 'ADMIN';
}

const UserFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'USER' | 'LIBRARIAN' | 'ADMIN'>('USER');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (isEditMode) {
      const fetchUser = async () => {
        try {
          setLoading(true);
          const response = await adminApi.get('/api/admin/users');
          const users: User[] = response.data;
          const found = users.find(u => u.id === Number(id));
          if (found) {
            setName(found.name);
            setEmail(found.email);
            setRole(found.role);
          } else {
            setError('Usuário não encontrado no sistema.');
          }
        } catch (err: any) {
          console.error(err);
          setError('Falha ao carregar dados do usuário.');
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const userData = {
      name,
      email,
      role,
      passwordHash: password || undefined, // a API espera passwordHash no JSON
    };

    try {
      if (isEditMode) {
        await adminApi.put(`/api/admin/users/${id}`, userData);
      } else {
        // Na criação do usuário, a senha é obrigatória
        if (!password) {
          setError('A senha é obrigatória para a criação de novas contas.');
          setSubmitting(false);
          return;
        }
        await adminApi.post('/api/admin/users', userData);
      }
      navigate('/admin/users');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Falha ao salvar o usuário. Verifique se o e-mail já está em uso.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Carregando dados do usuário...</div>;
  }

  return (
    <div style={{ maxWidth: '600px' }}>
      <button className="btn btn-ghost" onClick={() => navigate('/admin/users')} style={{ marginBottom: '1.5rem' }}>
        ← Voltar
      </button>

      <div style={{ marginBottom: '1.5rem' }}>
        <h1>{isEditMode ? 'Editar Conta de Usuário' : 'Criar Novo Usuário'}</h1>
        <p className="subtitle">Defina o nível de acesso e credenciais de acesso.</p>
      </div>

      <div className="card">
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
              placeholder="Ex: Gabriel Silva"
              required
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label className="form-label">E-mail (Login)</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex: gabriel@gmail.com"
              required
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Perfil de Acesso (Role)</label>
            <select
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              disabled={submitting}
              style={{ appearance: 'auto' }}
            >
              <option value="USER">Leitor / Usuário Comum</option>
              <option value="LIBRARIAN">Bibliotecário</option>
              <option value="ADMIN">Administrador do Sistema</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">
              {isEditMode ? 'Nova Senha (deixe em branco para manter a atual)' : 'Senha de Acesso'}
            </label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required={!isEditMode}
              disabled={submitting}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Salvando...' : 'Salvar Usuário'}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate('/admin/users')}
              disabled={submitting}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormPage;
