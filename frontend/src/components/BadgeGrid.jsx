export default function BadgeGrid({ badges = [] }) {
  return (
    <div>
      <div className="section-header">
        <span className="section-title"> Achievements</span>
        <span className="section-badge">{badges.filter(b => b.earned).length}/{badges.length} earned</span>
      </div>
      <div className="badges-grid">
        {badges.map(badge => (
          <div key={badge.id} className={`badge-item ${badge.earned ? 'earned' : 'locked'}`}>
            <div className="badge-emoji">{badge.icon}</div>
            <div className="badge-name">{badge.name}</div>
            <div className={`badge-rarity ${badge.rarity}`}>{badge.rarity}</div>
            {!badge.earned && (
              <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>Locked</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
