export default function AutoSaveModal({ payment, onAccept, onDecline }) {
  const { transaction, save_suggestion, new_balance, percentage } = payment;
  const balanceAfter = (new_balance - save_suggestion).toFixed(2);
  const savingsAfter = save_suggestion;
  const xpPreview = Math.max(10, Math.floor(save_suggestion / 3));

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onDecline()}>
      <div className="modal-sheet">
        <div className="modal-handle" />

        <div className="modal-badge">Payment Received!</div>

        <div className="modal-title">New Payment from</div>
        <div className="modal-amount">Rs.{transaction.amount.toFixed(0)}</div>
        <div className="modal-from">from {transaction.customer} · just now</div>

        {/* Split preview */}
        <div
          style={{
            background: 'rgba(0,217,163,0.06)',
            border: '1px solid rgba(0,217,163,0.2)',
            borderRadius: 16,
            padding: '14px 16px',
            marginBottom: 16,
          }}
        >
          <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 10, fontWeight: 600 }}>
            Save just {percentage}% ({`Rs.${save_suggestion}`}) from this ride?
          </div>
          <div className="modal-split">
            <div className="modal-split-card">
              <div className="split-label"> Balance after</div>
              <div className="split-value normal">Rs.{balanceAfter}</div>
            </div>
            <div className="modal-split-card" style={{ borderColor: 'rgba(0,217,163,0.25)', background: 'rgba(0,217,163,0.05)' }}>
              <div className="split-label">Saved</div>
              <div className="split-value green">+Rs.{savingsAfter}</div>
            </div>
          </div>
        </div>

        <div className="modal-xp">
          <span>⚡ Earn</span>
          <strong>+{xpPreview} XP</strong>
          <span>for saving this ride</span>
        </div>

        <div className="modal-actions">
          <button className="btn-save" onClick={onAccept}>
            &nbsp;Yes, Save Rs.{save_suggestion}!
          </button>
          <button className="btn-danger" onClick={onDecline}>
            Skip this time
          </button>
        </div>
      </div>
    </div>
  );
}
