import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';

const ParametersPage: React.FC = () => {
  const [rate, setRate] = useState<number>(5.00);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchParameter = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.get('/api/admin/parameters/penalty');
      // A resposta tem paramValue que é string ou algo similar.
      // Vamos ver se o controller retorna o objeto SystemParameter ou apenas o valor.
      // Retorna SystemParameter, que tem paramValue: "5.00"
      if (response.data && response.data.paramValue) {
        setRate(Number(response.data.paramValue));
      }
    } catch (err: any) {
      console.error(err);
      setError('Falha ao carregar a taxa de multa atual.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParameter();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      await adminApi.put('/api/admin/parameters/penalty', {
        penaltyRate: rate
      });
      setSuccess('Parâmetro de multa diária atualizado com sucesso!');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Falha ao atualizar o parâmetro.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Carregando parâmetros...</div>;
  }

  return (
    <div style={{ maxWidth: '600px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1>Parâmetros do Sistema</h1>
        <p className="subtitle">Configure os limites e regras globais de negócios da biblioteca.</p>
      </div>

      <div className="card">
        {success && (
          <div style={{
            backgroundColor: 'var(--emerald-500)',
            color: 'var(--white-pure)',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
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
            marginBottom: '1.5rem',
            textAlign: 'center',
            fontWeight: 500
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Taxa de Multa Diária por Atraso (R$)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--gray-500)' }}>R$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-control"
                style={{ fontSize: '1.25rem', padding: '0.5rem 0.75rem', maxWidth: '180px' }}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                required
                disabled={submitting}
              />
            </div>
            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: '0.5rem' }}>
              Esta taxa é aplicada a cada dia de atraso após o vencimento do empréstimo de um livro.
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={fetchParameter}
              disabled={submitting}
            >
              Recarregar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParametersPage;
