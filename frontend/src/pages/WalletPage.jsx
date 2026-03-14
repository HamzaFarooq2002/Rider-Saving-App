import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const DEMO_CUSTOMERS = [
  'Fatima A.', 'Ali H.', 'Zara M.', 'Omar S.',
  'Sana B.', 'Bilal T.', 'Aisha K.', 'Usman R.',
];
const randomCustomer = () => DEMO_CUSTOMERS[Math.floor(Math.random() * DEMO_CUSTOMERS.length)];

function timeAgo(isoString) {
  const diff = (Date.now() - new Date(isoString).getTime()) / 1000;
  if (diff < 60)  return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function initials(name) {
  return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
}

export default function WalletPage({ rider, onPaymentReceived, onRefresh }) {
  const [wallet, setWallet]   = useState(null);
  const [amount, setAmount]   = useState('');
  const [customer, setCustomer] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchWallet = useCallback(async () => {
    try {
      const data = await api.getWallet();
      setWallet(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => { fetchWallet(); }, [fetchWallet]);

  // Refresh wallet when parent refreshes rider
  useEffect(() => { fetchWallet(); }, [rider, fetchWallet]);

  const handleSimulate = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setLoading(true);
    try {
      const customer_name = customer.trim() || randomCustomer();
      const payment = await api.receivePayment(amount, customer_name);
      await fetchWallet();
      onPaymentReceived(payment);
      setAmount('');
      setCustomer('');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Balance Card ── */}
      <div className="wallet-card">
        <div className="wallet-label">Available Balance</div>
        <div className="wallet-balance">
        Rs.{(wallet?.balance ?? rider?.balance ?? 0).toLocaleString('en-PK', { minimumFractionDigits: 2 })}
        </div>
        <div className="wallet-subtitle">Linked to your bank account</div>

        <div className="wallet-pills">
          <div className="wallet-pill">
            <span className="pill-icon">🏦</span>
            <span style={{ color: 'var(--text2)', fontSize: 12 }}>Total Saved</span>
            <span className="pill-val">
              Rs.{(wallet?.total_saved ?? rider?.total_saved ?? 0).toLocaleString('en-PK')}
            </span>
          </div>
          <div className="wallet-pill">
            <span className="pill-icon">📅</span>
            <span style={{ color: 'var(--text2)', fontSize: 12 }}>This Month</span>
            <span className="pill-val">
              Rs.{(wallet?.monthly_saved ?? rider?.monthly_saved ?? 0).toLocaleString('en-PK')}
            </span>
          </div>
        </div>
      </div>

      {/* ── Simulate Payment ── */}
      <div className="card" style={{ padding: '20px' }}>
        <div className="simulate-title">🎮 Simulate Incoming Payment</div>
        <div className="simulate-row">
          <div className="input-group">
            <label>Amount (Rs.)</label>
            <input
              className="styled-input"
              type="number"
              placeholder="e.g. 500"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSimulate()}
            />
          </div>
          <div className="input-group">
            <label>Customer Name</label>
            <input
              className="styled-input"
              type="text"
              placeholder="Auto-fill"
              value={customer}
              onChange={e => setCustomer(e.target.value)}
            />
          </div>
        </div>
        <button
          className="btn-primary"
          onClick={handleSimulate}
          disabled={loading || !amount}
        >
          {loading ? (
            <><span className="spinner" style={{ borderColor: 'rgba(0,0,0,.3)', borderTopColor: '#000' }} /></>
          ) : (
            <> ⚡ Receive Payment</>
          )}
        </button>
      </div>

      {/* ── Transaction History ── */}
      <div className="card" style={{ padding: '20px' }}>
        <div className="section-header">
          <span className="section-title">📋 Transaction History</span>
          <span className="section-badge">{wallet?.transactions?.length ?? 0} rides</span>
        </div>

        {!wallet ? (
          <div className="loading"><div className="spinner" /> Loading…</div>
        ) : wallet.transactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🛵</div>
            <div className="empty-text">No rides yet. Simulate a payment above!</div>
          </div>
        ) : (
          <div className="tx-list">
            {wallet.transactions.map((tx, i) => (
              <div className="tx-item" key={tx.id} style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="tx-avatar">{initials(tx.customer)}</div>
                <div className="tx-info">
                  <div className="tx-customer">{tx.customer}</div>
                  <div className="tx-time">{timeAgo(tx.timestamp)}</div>
                </div>
                <div className="tx-amounts">
                  <div className="tx-amount">+Rs.{tx.amount.toFixed(0)}</div>
                  {tx.status === 'saved' && tx.saved > 0 && (
                    <div className="tx-saved green">🏦 Rs.{tx.saved} saved</div>
                  )}
                  {tx.status === 'skipped' && (
                    <div className="tx-saved gray">skipped</div>
                  )}
                  {tx.status === 'pending' && (
                    <div className="tx-saved" style={{ color: 'var(--gold)' }}>pending…</div>
                  )}
                </div>
                <div className={`tx-status-dot ${tx.status === 'saved' ? 'saved' : 'skipped'}`} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
