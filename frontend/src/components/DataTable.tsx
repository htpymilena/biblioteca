import React, { useState } from 'react';

interface DataTableProps {
  headers: string[];
  data: any[];
  renderRow: (item: any, index: number) => React.ReactNode;
  itemsPerPage?: number;
}

const DataTable: React.FC<DataTableProps> = ({ headers, data, renderRow, itemsPerPage = 8 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {headers.map((header, idx) => (
                <th key={idx}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item, idx) => renderRow(item, startIndex + idx))
            ) : (
              <tr>
                <td colSpan={headers.length} style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-500)' }}>
                  Nenhum dado encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
            Mostrando <strong>{startIndex + 1}</strong> a <strong>{Math.min(startIndex + itemsPerPage, data.length)}</strong> de <strong>{data.length}</strong> registros
          </span>
          <div style={{ display: 'flex', gap: '0.375rem' }}>
            <button
              className="btn btn-ghost"
              style={{ padding: '0.4rem 0.8rem' }}
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`btn ${currentPage === page ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '0.4rem 0.8rem', minWidth: '36px' }}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="btn btn-ghost"
              style={{ padding: '0.4rem 0.8rem' }}
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Próximo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
