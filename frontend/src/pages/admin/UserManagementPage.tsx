import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../services/adminApi';
import DataTable from '../../components/DataTable';
import ConfirmModal from '../../components/ConfirmModal';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal delete states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.get('/api/admin/users');
      setUsers(response.data);
    } catch (err: any) {
      console.error(err);
      setError('Falha ao carregar a lista de usuários.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    setDeleting(true);
    setError(null);
    setSuccess(null);

    try {
      await adminApi.delete(`/api/admin/users/${selectedUser.id}`);
      setSuccess(`Usuário "${selectedUser.name}" removido com sucesso!`);
      setIsModalOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Falha ao remover o usuário.');
      setIsModalOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  const tableHeaders = ['Nome', 'E-mail', 'Perfil (Role)', 'Data Cadastro', 'Ações'];

  const renderRow = (user: User) => (
    <tr key={user.id}>
      <td style={{ fontWeight: 600 }}>{user.name}</td>
      <td>{user.email}</td>
      <td>
        <StatusBadge status={user.role} />
      </td>
      <td>{new Date(user.createdAt).toLocaleDateString('pt-BR')}</td>
      <td>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="btn btn-ghost"
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
            onClick={() => navigate(`/admin/users/${user.id}`)}
          >
            Editar
          </button>
          <button
            className="btn btn-ghost"
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', color: 'var(--red-500)' }}
            onClick={() => openDeleteModal(user)}
          >
            Remover
          </button>
        </div>
      </td>
    </tr>
  );

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Carregando usuários...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Gestão de Usuários</h1>
          <p className="subtitle">Gerencie as contas de leitores, bibliotecários e administradores.</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => navigate('/admin/users/new')}
        >
          + Criar Usuário
        </button>
      </div>

      {success && (
        <div style={{
          backgroundColor: 'var(--emerald-500)',
          color: 'var(--white-pure)',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
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
          fontWeight: 500
        }}>
          {error}
        </div>
      )}

      {users.length > 0 ? (
        <DataTable
          headers={tableHeaders}
          data={users}
          renderRow={renderRow}
        />
      ) : (
        <EmptyState
          message="Nenhum usuário cadastrado no sistema."
          ctaText="Criar Novo Usuário"
          onCtaClick={() => navigate('/admin/users/new')}
        />
      )}

      <ConfirmModal
        isOpen={isModalOpen}
        title="Excluir Conta"
        message={`Deseja realmente excluir a conta do usuário "${selectedUser?.name}"? Esta ação não pode ser desfeita.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        confirmText={deleting ? 'Excluindo...' : 'Excluir'}
        isDanger={true}
      />
    </div>
  );
};

export default UserManagementPage;
