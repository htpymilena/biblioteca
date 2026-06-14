import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userApi from '../../services/userApi';
import StatusBadge from '../../components/StatusBadge';
import ConfirmModal from '../../components/ConfirmModal';
import EmptyState from '../../components/EmptyState';

interface Book {
  id: number;
  title: string;
  author: string;
}

interface Loan {
  id: number;
  book: Book;
  loanDate: string;
  dueDate: string;
  returnDate: string | null;
  status: 'ACTIVE' | 'RETURNED' | 'OVERDUE';
}

const LoansPage: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [returning, setReturning] = useState(false);

  const navigate = useNavigate();

  const fetchLoans = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userApi.get('/api/users/loans');
      setLoans(response.data);
    } catch (err: any) {
      console.error(err);
      setError('Falha ao carregar seus empréstimos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const openReturnModal = (loan: Loan) => {
    setSelectedLoan(loan);
    setIsModalOpen(true);
  };

  const handleReturnConfirm = async () => {
    if (!selectedLoan) return;
    setReturning(true);
    setError(null);
    setSuccess(null);

    try {
      await userApi.post(`/api/users/loans/${selectedLoan.id}/return`);
      setSuccess(`Livro "${selectedLoan.book.title}" devolvido com sucesso!`);
      setIsModalOpen(false);
      setSelectedLoan(null);
      // Recarrega os empréstimos
      fetchLoans();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Falha ao registrar devolução.');
      setIsModalOpen(false);
    } finally {
      setReturning(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Carregando seus empréstimos...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1>Meus Empréstimos</h1>
        <p className="subtitle">Gerencie os livros emprestados e verifique os prazos de devolução.</p>
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

      {loans.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {loans.map((loan) => {
            const isOverdue = loan.status === 'OVERDUE';
            const isActive = loan.status === 'ACTIVE';
            
            return (
              <div key={loan.id} className="card" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                borderLeft: isOverdue ? '4px solid var(--red-500)' : isActive ? '4px solid var(--blue-500)' : '1px solid var(--white-muted)'
              }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--blue-950)', marginBottom: '0.25rem' }}>
                    {loan.book.title}
                  </h3>
                  <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    por {loan.book.author}
                  </p>
                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                    <span>Empréstimo: <strong>{new Date(loan.loanDate).toLocaleDateString('pt-BR')}</strong></span>
                    <span>Prazo: <strong style={{ color: isOverdue ? 'var(--red-500)' : 'inherit' }}>
                      {new Date(loan.dueDate).toLocaleDateString('pt-BR')}
                    </strong></span>
                    {loan.returnDate && (
                      <span>Devolvido em: <strong>{new Date(loan.returnDate).toLocaleDateString('pt-BR')}</strong></span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <StatusBadge status={loan.status} />
                  
                  {isActive && (
                    <button
                      className="btn btn-secondary"
                      onClick={() => openReturnModal(loan)}
                    >
                      Devolver Livro
                    </button>
                  )}

                  {isOverdue && (
                    <button
                      className="btn btn-danger"
                      onClick={() => navigate('/user/payments')}
                    >
                      Pagar Multa
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          message="Você não possui nenhum empréstimo ativo ou histórico registrado."
          ctaText="Explorar Catálogo"
          onCtaClick={() => navigate('/user/catalog')}
        />
      )}

      <ConfirmModal
        isOpen={isModalOpen}
        title="Confirmar Devolução"
        message={`Deseja confirmar a devolução do livro "${selectedLoan?.book.title}"?`}
        onConfirm={handleReturnConfirm}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedLoan(null);
        }}
        confirmText={returning ? 'Devolvendo...' : 'Devolver'}
      />
    </div>
  );
};

export default LoansPage;
