import React, { useState, useEffect } from 'react';
import librarianApi from '../../services/librarianApi';
import DataTable from '../../components/DataTable';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Book {
  id: number;
  title: string;
  author: string;
}

interface Loan {
  id: number;
  user: User;
  book: Book;
  loanDate: string;
  dueDate: string;
  returnDate: string | null;
  status: string;
}

const LoansHistoryPage: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await librarianApi.get('/api/librarian/loans/history');
      setLoans(response.data);
    } catch (err: any) {
      console.error(err);
      setError('Falha ao carregar o histórico global de empréstimos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const tableHeaders = ['Leitor (E-mail)', 'Livro', 'Data Empréstimo', 'Data Limite', 'Devolvido em', 'Status'];

  const renderRow = (loan: Loan) => (
    <tr key={loan.id}>
      <td>
        <strong style={{ display: 'block' }}>{loan.user?.name || 'Sistema'}</strong>
        <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{loan.user?.email || 'N/A'}</span>
      </td>
      <td>
        <strong style={{ display: 'block' }}>{loan.book?.title}</strong>
        <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>por {loan.book?.author}</span>
      </td>
      <td>{new Date(loan.loanDate).toLocaleDateString('pt-BR')}</td>
      <td>{new Date(loan.dueDate).toLocaleDateString('pt-BR')}</td>
      <td>{loan.returnDate ? new Date(loan.returnDate).toLocaleDateString('pt-BR') : '-'}</td>
      <td>
        <StatusBadge status={loan.status} />
      </td>
    </tr>
  );

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Carregando histórico...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1>Histórico Global de Empréstimos</h1>
        <p className="subtitle">Consulte todas as operações de empréstimos e devoluções registradas no sistema.</p>
      </div>

      {error && (
        <div style={{
          backgroundColor: 'var(--red-500)',
          color: 'var(--white-pure)',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{error}</span>
          <button className="btn btn-secondary" onClick={fetchHistory} style={{ padding: '0.4rem 0.8rem' }}>
            Recarregar
          </button>
        </div>
      )}

      {loans.length > 0 ? (
        <DataTable
          headers={tableHeaders}
          data={loans}
          renderRow={renderRow}
        />
      ) : (
        <EmptyState
          message="Nenhum empréstimo registrado no sistema."
        />
      )}
    </div>
  );
};

export default LoansHistoryPage;
