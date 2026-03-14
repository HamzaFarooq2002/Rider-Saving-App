import { useState, useEffect, useCallback } from 'react';
import Navbar       from './components/Navbar';
import AutoSaveModal from './components/AutoSaveModal';
import WalletPage   from './pages/WalletPage';
import SavingsPage  from './pages/SavingsPage';
import { api }      from './services/api';
import './index.css';

export default function App() {
  const [tab,            setTab]            = useState('wallet');
  const [rider,          setRider]          = useState(null);
  const [pendingPayment, setPendingPayment] = useState(null);
  const [xpToast,        setXpToast]        = useState(null); // { xp, msg }

  const fetchRider = useCallback(async () => {
    try { const d = await api.getRider(); setRider(d); }
    catch { /* backend not running yet */ }
  }, []);

  useEffect(() => { fetchRider(); }, [fetchRider]);

  const handlePaymentReceived = (payment) => setPendingPayment(payment);

  const handleSaveDecision = async (accept) => {
    if (!pendingPayment) return;
    try {
      const result = await api.processSave(
        pendingPayment.transaction.id,
        accept,
        pendingPayment.save_suggestion,
      );
      if (accept && result.xp_earned) {
        setXpToast({ xp: result.xp_earned, icon: result.level_icon });
        setTimeout(() => setXpToast(null), 3000);
      }
      await fetchRider();
    } catch (e) { console.error(e); }
    setPendingPayment(null);
  };

  return (
    <div className="app">
      {/* Ambient orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* XP toast */}
      {xpToast && (
        <div className="xp-toast">
          {xpToast.icon} +{xpToast.xp} XP earned! Keep saving! 🚀
        </div>
      )}

      <Navbar rider={rider} />

      {/* Tab Navigation */}
      <nav className="tab-nav">
        <button
          id="tab-wallet"
          className={`tab-btn ${tab === 'wallet' ? 'active' : ''}`}
          onClick={() => setTab('wallet')}
        >
          💳 Wallet
        </button>
        <button
          id="tab-savings"
          className={`tab-btn ${tab === 'savings' ? 'active' : ''}`}
          onClick={() => setTab('savings')}
        >
          🏆 Bachat
        </button>
      </nav>

      <main className="main-content">
        {!rider ? (
          <div className="loading" style={{ flexDirection: 'column', gap: 12, paddingTop: 60 }}>
            <div className="spinner" />
            <div style={{ color: 'var(--text2)', fontSize: 14 }}>
              Connecting to Rider Bachat…
              <div style={{ fontSize: 12, marginTop: 6, color: 'var(--text3)' }}>
                Make sure the FastAPI backend is running on port 8000
              </div>
            </div>
          </div>
        ) : (
          <>
            {tab === 'wallet' && (
              <WalletPage
                rider={rider}
                onPaymentReceived={handlePaymentReceived}
                onRefresh={fetchRider}
              />
            )}
            {tab === 'savings' && (
              <SavingsPage rider={rider} />
            )}
          </>
        )}
      </main>

      {pendingPayment && (
        <AutoSaveModal
          payment={pendingPayment}
          onAccept={() => handleSaveDecision(true)}
          onDecline={() => handleSaveDecision(false)}
        />
      )}
    </div>
  );
}
