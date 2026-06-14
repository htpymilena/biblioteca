import React from 'react';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getBadgeClass = (s: string) => {
    const clean = s.toUpperCase();
    if (clean === 'DISPONIVEL' || clean === 'DISPONÍVEL' || clean === 'RETURNED' || clean === 'DEVOLVIDO') {
      return 'badge-emerald';
    }
    if (clean === 'EMPRESTADO' || clean === 'RESERVADO' || clean === 'ACTIVE' || clean === 'ATIVO') {
      return 'badge-amber';
    }
    if (clean === 'INDISPONIVEL' || clean === 'INDISPONÍVEL' || clean === 'OVERDUE' || clean === 'ATRASADO') {
      return 'badge-red';
    }
    if (clean === 'ADMIN') {
      return 'badge-blue';
    }
    return 'badge-gray';
  };

  const getFriendlyText = (s: string) => {
    const clean = s.toUpperCase();
    if (clean === 'DISPONIVEL' || clean === 'DISPONÍVEL') return 'Disponível';
    if (clean === 'INDISPONIVEL' || clean === 'INDISPONÍVEL') return 'Indisponível';
    if (clean === 'RETURNED') return 'Devolvido';
    if (clean === 'ACTIVE') return 'Ativo';
    if (clean === 'OVERDUE') return 'Atrasado';
    return s;
  };

  return (
    <span className={`badge ${getBadgeClass(status)}`}>
      {getFriendlyText(status)}
    </span>
  );
};

export default StatusBadge;
