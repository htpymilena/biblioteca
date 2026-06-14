import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: '180px' }}>
      <div style={{
        width: '40%',
        height: '16px',
        backgroundColor: 'var(--gray-100)',
        borderRadius: '4px',
        animation: 'pulse 1.5s infinite ease-in-out'
      }} />
      <div style={{
        width: '85%',
        height: '24px',
        backgroundColor: 'var(--gray-100)',
        borderRadius: '4px',
        animation: 'pulse 1.5s infinite ease-in-out'
      }} />
      <div style={{
        width: '60%',
        height: '16px',
        backgroundColor: 'var(--gray-100)',
        borderRadius: '4px',
        animation: 'pulse 1.5s infinite ease-in-out',
        marginBottom: 'auto'
      }} />
      <div style={{
        width: '100%',
        height: '36px',
        backgroundColor: 'var(--gray-100)',
        borderRadius: '6px',
        animation: 'pulse 1.5s infinite ease-in-out'
      }} />
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default SkeletonCard;
