import React, { useState, useEffect } from 'react';
import userApi from '../../services/userApi';
import BookCard from '../../components/BookCard';
import SkeletonCard from '../../components/SkeletonCard';
import EmptyState from '../../components/EmptyState';

interface Book {
  id: number;
  title: string;
  author: string;
  availableCopies: number;
}

const CatalogPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userApi.get('/api/users/catalog');
      setBooks(response.data);
    } catch (err: any) {
      console.error(err);
      setError('Falha ao carregar o catálogo de livros.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(search.toLowerCase()) || 
    book.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Catálogo de Obras</h1>
          <p className="subtitle">Encontre livros e realize empréstimos de forma simples.</p>
        </div>
        
        <div style={{ width: '100%', maxWidth: '350px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Buscar por título ou autor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
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
          <button className="btn btn-secondary" onClick={fetchCatalog} style={{ padding: '0.4rem 0.8rem' }}>
            Tentar Novamente
          </button>
        </div>
      )}

      {loading ? (
        <div className="grid-catalog">
          {Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : filteredBooks.length > 0 ? (
        <div className="grid-catalog">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              availableCopies={book.availableCopies}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          message={search ? "Nenhum livro corresponde à sua busca." : "Nenhum livro cadastrado no acervo."}
          ctaText={search ? "Limpar Busca" : undefined}
          onCtaClick={search ? () => setSearch('') : undefined}
        />
      )}
    </div>
  );
};

export default CatalogPage;
