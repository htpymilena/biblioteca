import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import userApi from '../../services/userApi';
import StatusBadge from '../../components/StatusBadge';

interface BookDetail {
  id: number;
  title: string;
  author: string;
  isbn: string;
  totalCopies: number;
  availableCopies: number;
  publicationYear?: number;
  publisher?: string;
  genre?: string;
  pageCount?: number;
  synopsis?: string;
}

const GENRE_LABELS: Record<string, string> = {
  FICCAO: 'Ficção',
  ROMANCE: 'Romance',
  FANTASIA: 'Fantasia',
  CIENCIA: 'Ciência',
  HISTORIA: 'História',
  BIOGRAFIA: 'Biografia',
  DRAMA: 'Drama',
  POESIA: 'Poesia',
  SUSPENSE: 'Suspense',
  OUTRO: 'Outro'
};

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hasRequestedNotification, setHasRequestedNotification] = useState(false);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userApi.get(`/api/users/catalog/${id}`);
      setBook(response.data);

      if (response.data && response.data.availableCopies <= 0) {
        try {
          const checkResp = await userApi.get(`/api/users/notifications/check/${id}`);
          setHasRequestedNotification(!!checkResp.data.requested);
        } catch (checkErr) {
          console.error('Erro ao verificar status da notificação:', checkErr);
        }
      }
    } catch (err: any) {
      console.error(err);
      setError('Falha ao carregar os detalhes do livro.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const handleLoan = async () => {
    if (!book) return;
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      await userApi.post('/api/users/loans', { bookId: book.id });
      setSuccess('Empréstimo realizado com sucesso! Você tem 14 dias para devolver.');
      setBook(prev => prev ? { ...prev, availableCopies: prev.availableCopies - 1 } : null);
      setTimeout(() => {
        navigate('/user/loans');
      }, 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Erro ao processar o empréstimo. Certifique-se de que não atingiu o limite de 3 livros.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNotificationRequest = async () => {
    if (!book) return;
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      await userApi.post('/api/users/notifications/request', { bookId: book.id });
      setSuccess('Você receberá um e-mail assim que este livro estiver disponível novamente!');
      setHasRequestedNotification(true);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Falha ao solicitar notificação.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Carregando detalhes do livro...</div>;
  }

  if (error && !book) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: 'var(--red-500)', marginBottom: '1.5rem', fontWeight: 500 }}>{error}</p>
        <button className="btn btn-primary" onClick={() => navigate('/user/catalog')}>
          Voltar ao Catálogo
        </button>
      </div>
    );
  }

  if (!book) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem' }}>Livro não encontrado.</p>
        <button className="btn btn-primary" onClick={() => navigate('/user/catalog')}>
          Voltar ao Catálogo
        </button>
      </div>
    );
  }

  const isAvailable = book.availableCopies > 0;

  return (
    <div>
      <button className="btn btn-ghost" onClick={() => navigate('/user/catalog')} style={{ marginBottom: '1.5rem' }}>
        ← Voltar ao Catálogo
      </button>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2.5rem' }}>
        {success && (
          <div style={{
            backgroundColor: 'var(--emerald-500)',
            color: 'var(--white-pure)',
            padding: '1rem',
            borderRadius: '8px',
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
            textAlign: 'center',
            fontWeight: 500
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              ISBN: {book.isbn}
            </span>
            <h1 style={{ marginTop: '0.5rem', marginBottom: '0.5rem', fontSize: '2.25rem' }}>{book.title}</h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--gray-500)' }}>
              Escrito por <strong style={{ color: 'var(--blue-950)' }}>{book.author}</strong>
            </p>
          </div>

          <StatusBadge status={isAvailable ? 'DISPONIVEL' : 'INDISPONIVEL'} />
        </div>

        <hr style={{ border: 0, borderTop: '1px solid var(--white-muted)' }} />

        {/* Informações detalhadas da obra */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--white-soft)', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>Gênero</span>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--blue-950)', marginTop: '0.25rem' }}>
              {GENRE_LABELS[book.genre || ''] || 'Não especificado'}
            </p>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--white-soft)', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>Editora</span>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--blue-950)', marginTop: '0.25rem' }}>
              {book.publisher || 'Não especificada'}
            </p>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--white-soft)', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>Ano Publicação</span>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--blue-950)', marginTop: '0.25rem' }}>
              {book.publicationYear || 'N/A'}
            </p>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--white-soft)', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>Páginas</span>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--blue-950)', marginTop: '0.25rem' }}>
              {book.pageCount || 'N/A'}
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--white-soft)', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>Total de Exemplares</span>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--blue-950)' }}>{book.totalCopies}</p>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--white-soft)', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>Exemplares Disponíveis</span>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: isAvailable ? 'var(--emerald-500)' : 'var(--red-500)' }}>
              {book.availableCopies}
            </p>
          </div>
        </div>

        {/* Sinopse */}
        <div>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--blue-950)' }}>Sinopse</h2>
          <p style={{
            lineHeight: '1.6',
            color: 'var(--blue-950)',
            whiteSpace: 'pre-wrap',
            padding: '1rem',
            backgroundColor: 'var(--white-soft)',
            borderRadius: '8px',
            fontSize: '0.95rem'
          }}>
            {book.synopsis || 'Nenhuma sinopse disponível para esta obra.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          {isAvailable ? (
            <button
              className="btn btn-primary"
              style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}
              onClick={handleLoan}
              disabled={submitting}
            >
              {submitting ? 'Processando Empréstimo...' : 'Solicitar Empréstimo'}
            </button>
          ) : (
            <button
              className="btn btn-secondary"
              style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}
              onClick={handleNotificationRequest}
              disabled={submitting || hasRequestedNotification}
            >
              {submitting ? 'Aguarde...' : hasRequestedNotification ? 'Notificação Ativada' : 'Avise-me quando estiver disponível'}
            </button>
          )}
          
          <button
            className="btn btn-ghost"
            style={{ padding: '0.875rem 1.5rem', fontSize: '1rem' }}
            onClick={() => navigate('/user/catalog')}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
