import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';

interface BookCardProps {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  availableCopies: number;
}

const BookCard: React.FC<BookCardProps> = ({ id, title, author, availableCopies }) => {
  const navigate = useNavigate();
  const isAvailable = availableCopies > 0;

  return (
    <div className="card" style={{
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: isAvailable ? 'var(--blue-50)' : 'var(--white-pure)',
      border: isAvailable ? '1px solid var(--blue-300)' : '1px solid var(--white-muted)',
      minHeight: '220px',
      justifyContent: 'space-between'
    }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-500)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Livro
          </span>
          <StatusBadge status={isAvailable ? 'DISPONIVEL' : 'INDISPONIVEL'} />
        </div>
        <h3 style={{
          fontSize: '1.15rem',
          fontWeight: 600,
          color: 'var(--blue-950)',
          lineHeight: '1.3',
          marginBottom: '0.375rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {title}
        </h3>
        <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          por <strong>{author}</strong>
        </p>
      </div>

      <div>
        <div style={{ fontSize: '0.8rem', color: 'var(--blue-950)', marginBottom: '0.75rem' }}>
          Estoque: <strong>{availableCopies} {availableCopies === 1 ? 'cópia' : 'cópias'}</strong>
        </div>
        <button
          className="btn btn-primary"
          style={{ width: '100%' }}
          onClick={() => navigate(`/user/catalog/${id}`)}
        >
          Ver Detalhes
        </button>
      </div>
    </div>
  );
};

export default BookCard;
