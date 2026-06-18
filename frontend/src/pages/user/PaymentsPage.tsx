import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userApi from '../../services/userApi';
import EmptyState from '../../components/EmptyState';
import PaymentModal from '../../components/PaymentModal';

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

const PaymentsPage: React.FC = () => {
  const [overdueLoans, setOverdueLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<any | null>(null);

  const navigate = useNavigate();

  const fetchOverdueLoans = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userApi.get('/api/users/loans');
      const allLoans: Loan[] = response.data;
      
      // Filtra apenas os empréstimos em atraso (OVERDUE)
      const filtered = allLoans.filter(loan => loan.status === 'OVERDUE').map(loan => {
        // Calcula a quantidade de dias de atraso entre a data de vencimento e a de devolução
        const dueDate = new Date(loan.dueDate);
        const returnDate = loan.returnDate ? new Date(loan.returnDate) : new Date();
        
        // Zera as horas para cálculo exato de dias
        dueDate.setHours(0, 0, 0, 0);
        returnDate.setHours(0, 0, 0, 0);
        
        const diffTime = returnDate.getTime() - dueDate.getTime();
        const daysLate = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        const amount = daysLate * 5.00; // Taxa de R$ 5,00 por dia
        
        return {
          ...loan,
          daysLate,
          amount
        };
      });
      
      setOverdueLoans(filtered);
    } catch (err: any) {
      console.error(err);
      setError('Falha ao carregar suas taxas pendentes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverdueLoans();
  }, []);

  const handleOpenPaymentModal = (loan: any) => {
    setSelectedLoan(loan);
    setIsModalOpen(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedLoan) return;
    setError(null);
    setSuccess(null);
    setSubmitting(selectedLoan.id);

    try {
      await userApi.post('/api/users/payments/simulate', {
        loanId: selectedLoan.id,
        amount: selectedLoan.amount
      });
      setSuccess('Pagamento simulado com sucesso! A multa foi quitada.');
      setIsModalOpen(false);
      setSelectedLoan(null);
      fetchOverdueLoans();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Falha ao processar o pagamento.');
    } finally {
      setSubmitting(null);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Carregando taxas...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1>Pagamentos / Taxas</h1>
        <p className="subtitle">Consulte multas de devolução atrasada (Valor base: R$ 5,00 por dia).</p>
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

      {overdueLoans.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {overdueLoans.map((loan) => (
            <div key={loan.id} className="card" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              borderLeft: '4px solid var(--red-500)'
            }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--blue-950)', marginBottom: '0.25rem' }}>
                  {loan.book.title}
                </h3>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                  por {loan.book.author}
                </p>
                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                  <span>Vencimento: <strong>{new Date(loan.dueDate).toLocaleDateString('pt-BR')}</strong></span>
                  <span>Devolução: <strong>{loan.returnDate ? new Date(loan.returnDate).toLocaleDateString('pt-BR') : 'Hoje'}</strong></span>
                  <span>Atraso: <strong style={{ color: 'var(--red-500)' }}>{loan.daysLate} {loan.daysLate === 1 ? 'dia' : 'dias'}</strong></span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase', display: 'block' }}>Multa a Pagar</span>
                  <strong style={{ fontSize: '1.5rem', color: 'var(--red-500)' }}>
                    R$ {loan.amount.toFixed(2).replace('.', ',')}
                  </strong>
                </div>
                
                <button
                  className="btn btn-danger"
                  style={{ padding: '0.75rem 1.25rem' }}
                  onClick={() => handleOpenPaymentModal(loan)}
                  disabled={submitting !== null}
                >
                  {submitting === loan.id ? 'Processando...' : 'Pagar Multa'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          message="Tudo certo! Você não possui nenhuma taxa pendente de pagamento."
          ctaText="Ver Meus Empréstimos"
          onCtaClick={() => navigate('/user/loans')}
        />
      )}

      {selectedLoan && (
        <PaymentModal
          isOpen={isModalOpen}
          amount={selectedLoan.amount}
          loanTitle={selectedLoan.book.title}
          onConfirm={handleConfirmPayment}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedLoan(null);
          }}
          submitting={submitting === selectedLoan.id}
        />
      )}
    </div>
  );
};

export default PaymentsPage;
