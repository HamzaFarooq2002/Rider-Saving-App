export default function Navbar({ rider }) {
  const level   = rider?.level      ?? '—';
  const icon    = rider?.level_icon ?? '🥈';
  const streak  = rider?.streak     ?? 0;
  const name    = rider?.name       ?? 'Rider';

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">⚡</span>
        <div>
          <div className="navbar-title">Rider Bachat</div>
          <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 1 }}>{name}</div>
        </div>
      </div>

      <div className="navbar-right">
        <div className="level-badge">
          {icon} {level}
        </div>
        {streak > 0 && (
          <div className="streak-badge">
            <span className="streak-flame">🔥</span>
            {streak}
          </div>
        )}
      </div>
    </nav>
  );
}
