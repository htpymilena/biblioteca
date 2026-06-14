import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import librarianApi from '../../services/librarianApi';

const BookFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [totalCopies, setTotalCopies] = useState(1);
  const [availableCopies, setAvailableCopies] = useState(1);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (isEditMode) {
      const fetchBook = async () => {
        try {
          setLoading(true);
          const response = await librarianApi.get(`/api/librarian/books/${id}`);
          setTitle(response.data.title);
          setAuthor(response.data.author);
          setIsbn(response.data.isbn);
          setTotalCopies(response.data.totalCopies);
          setAvailableCopies(response.data.availableCopies);
        } catch (err: any) {
          console.error(err);
          setError('Falha ao carregar os dados do livro.');
        } finally {
          setLoading(false);
        }
      };
      fetchBook();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const bookData = {
      title,
      author,
      isbn,
      totalCopies: Number(totalCopies),
      availableCopies: Number(availableCopies),
    };

    try {
      if (isEditMode) {
        await librarianApi.put(`/api/librarian/books/${id}`, bookData);
      } else {
        await librarianApi.post('/api/librarian/books', bookData);
      }
      navigate('/librarian/books');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Falha ao salvar as informações do livro. Verifique os campos preenchidos.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Carregando dados do livro...</div>;
  }

  return (
    <div style={{ maxWidth: '600px' }}>
      <button className="btn btn-ghost" onClick={() => navigate('/librarian/books')} style={{ marginBottom: '1.5rem' }}>
        ← Voltar
      </button>

      <div style={{ marginBottom: '1.5rem' }}>
        <h1>{isEditMode ? 'Editar Livro' : 'Adicionar Novo Livro'}</h1>
        <p className="subtitle">Preencha os dados cadastrais da obra literária.</p>
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
            <label className="form-label">Título da Obra</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: O Senhor dos Anéis"
              required
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Autor</label>
            <input
              type="text"
              className="form-control"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Ex: J.R.R. Tolkien"
              required
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label className="form-label">ISBN</label>
            <input
              type="text"
              className="form-control"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              placeholder="Ex: 9788533613379"
              required
              disabled={submitting}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            <div className="form-group">
              <label className="form-label">Exemplares Totais</label>
              <input
                type="number"
                min="0"
                className="form-control"
                value={totalCopies}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setTotalCopies(val);
                  if (!isEditMode) setAvailableCopies(val); // na criação, o disponível inicia igual ao total
                }}
                required
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Exemplares Disponíveis</label>
              <input
                type="number"
                min="0"
                max={totalCopies}
                className="form-control"
                value={availableCopies}
                onChange={(e) => setAvailableCopies(Number(e.target.value))}
                required
                disabled={submitting || !isEditMode} // na criação, o disponível deve ser igual ao total
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Salvando...' : 'Salvar Livro'}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate('/librarian/books')}
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

export default BookFormPage;
