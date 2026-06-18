import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import DataTable from '../../components/DataTable';
import EmptyState from '../../components/EmptyState';

interface AuditLog {
  id: number;
  userEmail: string;
  action: string;
  timestamp: string;
}

const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.get('/api/admin/audit/logs');
      // Ordena logs por timestamp decrescente (mais recentes primeiro)
      const sorted = response.data.sort((a: AuditLog, b: AuditLog) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setLogs(sorted);
    } catch (err: any) {
      console.error(err);
      setError('Falha ao carregar os logs da trilha de auditoria.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const tableHeaders = ['ID', 'Operador (E-mail)', 'Ação Realizada', 'Data / Horário'];

  const renderRow = (log: AuditLog) => (
    <tr key={log.id}>
      <td><code>#{log.id}</code></td>
      <td style={{ fontWeight: 600 }}>{log.userEmail || 'Sistema (Anonymous)'}</td>
      <td>
        <span style={{
          display: 'inline-block',
          padding: '0.2rem 0.5rem',
          backgroundColor: 'var(--blue-100)',
          color: 'var(--blue-700)',
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '0.8rem',
          fontWeight: 600
        }}>
          {log.action}
        </span>
      </td>
      <td>{new Date(log.timestamp).toLocaleString('pt-BR')}</td>
    </tr>
  );

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Carregando logs de auditoria...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1>Trilha de Auditoria</h1>
        <p className="subtitle">Histórico de ações críticas registradas por segurança (Aspectos AOP do Backend).</p>
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
          <button className="btn btn-secondary" onClick={fetchLogs} style={{ padding: '0.4rem 0.8rem' }}>
            Recarregar
          </button>
        </div>
      )}

      {logs.length > 0 ? (
        <DataTable
          headers={tableHeaders}
          data={logs}
          renderRow={renderRow}
          itemsPerPage={10}
        />
      ) : (
        <EmptyState
          message="Nenhum log de auditoria registrado no momento."
        />
      )}
    </div>
  );
};

export default AuditLogsPage;
