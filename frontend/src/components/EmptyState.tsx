import React from 'react';

interface EmptyStateProps {
  message: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, ctaText, onCtaClick }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 2rem',
      backgroundColor: 'var(--white-card)',
      border: '1px dashed var(--blue-300)',
      borderRadius: '12px',
      textAlign: 'center',
      margin: '2rem 0'
    }}>
      <svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--blue-300)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ marginBottom: '1.5rem' }}
      >
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
        <path d="M6 6h10" />
        <path d="M6 10h10" />
        <path d="M13 18l-3-3H6" />
      </svg>
      <p style={{ color: 'var(--blue-950)', fontWeight: 500, fontSize: '1.1rem', marginBottom: ctaText ? '1.25rem' : '0' }}>
        {message}
      </p>
      {ctaText && onCtaClick && (
        <button className="btn btn-primary" onClick={onCtaClick}>
          {ctaText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
