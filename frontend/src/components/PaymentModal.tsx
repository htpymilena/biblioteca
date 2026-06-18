import React, { useState } from 'react';
import pixQr from '../assets/pix_qr.jpg';

interface PaymentModalProps {
  isOpen: boolean;
  amount: number;
  loanTitle: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
  submitting: boolean;
}

type PaymentMethod = 'pix' | 'card' | 'boleto';

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  amount,
  loanTitle,
  onConfirm,
  onClose,
  submitting
}) => {
  const [method, setMethod] = useState<PaymentMethod>('pix');
  
  // Card form states
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Format card number with spaces: #### #### #### ####
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formatted);
  };

  // Format expiry date: MM/AA
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setCardExpiry(value);
  };

  // Format CVV: Max 3 digits
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCardCvv(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (method === 'card') {
      if (!cardName.trim()) {
        setFormError('Por favor, insira o nome impresso no cartão.');
        return;
      }
      if (cardNumber.replace(/\s/g, '').length !== 16) {
        setFormError('O número do cartão deve conter 16 dígitos.');
        return;
      }
      if (cardExpiry.length !== 5) {
        setFormError('Informe a validade no formato MM/AA.');
        return;
      }
      if (cardCvv.length !== 3) {
        setFormError('O código de segurança (CVV) deve conter 3 dígitos.');
        return;
      }
    }

    onConfirm();
  };

  const handleCopy = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    alert(message);
  };

  const mockPixKey = "00020126580014br.gov.bcb.pix0136c88431fd-78eb-408d-9f44-fb5cc79957845204000053039865405" + amount.toFixed(2) + "5802BR5925Biblioteca Distribuida6009Sao Paulo62070503***6304A1B2";
  const mockBoletoBarCode = "34191.79001 01043.513184 91020.150008 7 987600000" + amount.toFixed(2).replace('.', '');

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(23, 37, 84, 0.5)', // --blue-950 com opacidade
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
      backdropFilter: 'blur(4px)'
    }}>
      <div className="card" style={{
        width: '100%',
        maxWidth: '500px',
        backgroundColor: 'var(--white-pure)',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        animation: 'modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ color: 'var(--blue-950)', fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
              Simulador de Pagamento
            </h2>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
              Multa: {loanTitle}
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              color: 'var(--gray-500)',
              cursor: 'pointer',
              padding: '0.25rem',
              lineHeight: 1
            }}
            disabled={submitting}
          >
            &times;
          </button>
        </div>

        {/* Amount Section */}
        <div style={{
          backgroundColor: 'var(--blue-50)',
          padding: '1rem',
          borderRadius: '8px',
          textAlign: 'center',
          marginBottom: '1.5rem',
          border: '1px solid var(--blue-100)'
        }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--gray-500)', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>
            Valor Total Devido
          </span>
          <strong style={{ fontSize: '1.75rem', color: 'var(--red-500)' }}>
            R$ {amount.toFixed(2).replace('.', ',')}
          </strong>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '2px solid var(--white-muted)',
          marginBottom: '1.5rem'
        }}>
          {(['pix', 'card', 'boleto'] as PaymentMethod[]).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setMethod(tab);
                setFormError(null);
              }}
              style={{
                flex: 1,
                padding: '0.75rem 0',
                border: 'none',
                background: 'none',
                borderBottom: method === tab ? '3px solid var(--blue-700)' : '3px solid transparent',
                color: method === tab ? 'var(--blue-700)' : 'var(--gray-500)',
                fontWeight: method === tab ? 600 : 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              type="button"
              disabled={submitting}
            >
              {tab === 'pix' && 'PIX'}
              {tab === 'card' && 'Cartão'}
              {tab === 'boleto' && 'Boleto'}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <form onSubmit={handleSubmit}>
          <div style={{ minHeight: '180px', marginBottom: '1.5rem' }}>
            {method === 'pix' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                {/* Imagem do QR Code do Pix */}
                <div style={{
                  padding: '1rem',
                  backgroundColor: 'var(--white-pure)',
                  border: '1px solid var(--blue-300)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img src={pixQr} alt="QR Code Pix" style={{ width: '150px', height: '150px', display: 'block', objectFit: 'contain' }} />
                </div>
                
                <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', textAlign: 'center', margin: 0 }}>
                  Aponte a câmera do seu celular para o QR Code ou copie a chave Pix abaixo para pagar.
                </p>

                <button
                  type="button"
                  onClick={() => handleCopy(mockPixKey, "Código Pix Copiado!")}
                  className="btn btn-ghost"
                  style={{
                    fontSize: '0.8rem',
                    padding: '0.5rem 1rem',
                    border: '1px solid var(--blue-300)',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  Copiar Código Pix
                </button>
              </div>
            )}

            {method === 'card' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {formError && (
                  <div style={{
                    fontSize: '0.8rem',
                    color: 'var(--red-500)',
                    backgroundColor: '#fee2e2',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    fontWeight: 500
                  }}>
                    {formError}
                  </div>
                )}
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--blue-950)', marginBottom: '0.25rem' }}>
                    Nome do Titular
                  </label>
                  <input
                    type="text"
                    placeholder="Como no cartão"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem',
                      border: '1px solid var(--blue-300)',
                      borderRadius: '6px',
                      fontSize: '0.9rem'
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--blue-950)', marginBottom: '0.25rem' }}>
                    Número do Cartão
                  </label>
                  <input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    style={{
                      width: '100%',
                      padding: '0.6rem',
                      border: '1px solid var(--blue-300)',
                      borderRadius: '6px',
                      fontSize: '0.9rem'
                    }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--blue-950)', marginBottom: '0.25rem' }}>
                      Validade
                    </label>
                    <input
                      type="text"
                      placeholder="MM/AA"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      style={{
                        width: '100%',
                        padding: '0.6rem',
                        border: '1px solid var(--blue-300)',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        textAlign: 'center'
                      }}
                      required
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--blue-950)', marginBottom: '0.25rem' }}>
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      value={cardCvv}
                      onChange={handleCvvChange}
                      style={{
                        width: '100%',
                        padding: '0.6rem',
                        border: '1px solid var(--blue-300)',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        textAlign: 'center'
                      }}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {method === 'boleto' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
                {/* CSS Barcode Simulation */}
                <div style={{
                  width: '100%',
                  height: '60px',
                  backgroundColor: 'var(--white-pure)',
                  border: '1px solid var(--blue-300)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2px',
                  padding: '0 1rem',
                  overflow: 'hidden'
                }}>
                  {[1, 3, 1, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1, 4, 1, 2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 2].map((width, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: `${width * 2}px`,
                        height: '40px',
                        backgroundColor: 'var(--blue-950)'
                      }}
                    />
                  ))}
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', textAlign: 'center', margin: 0 }}>
                  Você pode pagar o boleto em qualquer agência bancária ou internet banking utilizando a linha digitável abaixo.
                </p>

                <button
                  type="button"
                  onClick={() => handleCopy(mockBoletoBarCode, "Código de barras copiado!")}
                  className="btn btn-ghost"
                  style={{
                    fontSize: '0.8rem',
                    padding: '0.5rem 1rem',
                    border: '1px solid var(--blue-300)',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  Copiar Linha Digitável
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--white-muted)', paddingTop: '1.25rem' }}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {submitting ? 'Processando...' : 'Confirmar Pagamento'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes modalSlideIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default PaymentModal;
