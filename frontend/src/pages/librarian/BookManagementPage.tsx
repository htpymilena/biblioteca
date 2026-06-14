import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import librarianApi from '../../services/librarianApi';
import DataTable from '../../components/DataTable';
import ConfirmModal from '../../components/ConfirmModal';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  totalCopies: number;
  availableCopies: number;
}

const BookManagementPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal delete states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await librarianApi.get('/api/librarian/books');
      setBooks(response.data);
    } catch (err: any) {
      console.error(err);
      setError('Falha ao carregar os livros do acervo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const openDeleteModal = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBook) return;
    setDeleting(true);
    setError(null);
    setSuccess(null);

    try {
      await librarianApi.delete(`/api/librarian/books/${selectedBook.id}`);
      setSuccess(`Livro "${selectedBook.title}" removido com sucesso!`);
      setIsModalOpen(false);
      setSelectedBook(null);
      fetchBooks();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Falha ao remover o livro. Certifique-se de que ele não possui empréstimos ativos.');
      setIsModalOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  const tableHeaders = ['Título', 'Autor', 'ISBN', 'Estoque Total', 'Disponível', 'Status', 'Ações'];

  const renderRow = (book: Book) => (
    <tr key={book.id}>
      <td style={{ fontWeight: 600 }}>{book.title}</td>
      <td>{book.author}</td>
      <td><code>{book.isbn}</code></td>
      <td>{book.totalCopies}</td>
      <td>
        <strong style={{ color: book.availableCopies > 0 ? 'var(--emerald-500)' : 'var(--red-500)' }}>
          {book.availableCopies}
        </strong>
      </td>
      <td>
        <StatusBadge status={book.availableCopies > 0 ? 'DISPONIVEL' : 'INDISPONIVEL'} />
      </td>
      <td>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="btn btn-ghost"
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
            onClick={() => navigate(`/librarian/books/${book.id}`)}
          >
            Editar
          </button>
          <button
            className="btn btn-ghost"
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', color: 'var(--red-500)' }}
            onClick={() => openDeleteModal(book)}
          >
            Remover
          </button>
        </div>
      </td>
    </tr>
  );

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Carregando acervo...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Gestão de Acervo</h1>
          <p className="subtitle">Adicione, edite ou remova obras da biblioteca.</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => navigate('/librarian/books/new')}
        >
          + Adicionar Livro
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

      {books.length > 0 ? (
        <DataTable
          headers={tableHeaders}
          data={books}
          renderRow={renderRow}
        />
      ) : (
        <EmptyState
          message="Nenhum livro cadastrado no acervo."
          ctaText="Cadastrar Primeiro Livro"
          onCtaClick={() => navigate('/librarian/books/new')}
        />
      )}

      <ConfirmModal
        isOpen={isModalOpen}
        title="Remover Obra"
        message={`Tem certeza que deseja remover o livro "${selectedBook?.title}" do acervo?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedBook(null);
        }}
        confirmText={deleting ? 'Removendo...' : 'Remover'}
        isDanger={true}
      />
    </div>
  );
};

export default BookManagementPage;
