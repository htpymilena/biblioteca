import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDanger = false
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(23, 37, 84, 0.4)', // Fundo escuro transparente (--blue-950 com opacidade)
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '1rem'
    }}>
      <div className="card" style={{
        width: '100%',
        maxWidth: '450px',
        backgroundColor: 'var(--white-pure)',
        padding: '2rem',
        boxShadow: 'var(--shadow-lg)',
        animation: 'modalSlide 0.25s ease-out'
      }}>
        <h2 style={{ marginBottom: '0.75rem', color: isDanger ? 'var(--red-500)' : 'var(--blue-950)' }}>{title}</h2>
        <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem', marginBottom: '2rem' }}>{message}</p>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button className="btn btn-ghost" onClick={onCancel}>
            {cancelText}
          </button>
          <button 
            className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'}`} 
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes modalSlide {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ConfirmModal;
