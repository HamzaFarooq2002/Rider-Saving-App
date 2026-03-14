import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import GoalRing from '../components/GoalRing';
import BadgeGrid from '../components/BadgeGrid';

function useAnimatedCount(target, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function SavingsPage({ rider }) {
  const [savings,   setSavings]   = useState(null);
  const [community, setCommunity] = useState(null);
  const [badges,    setBadges]    = useState([]);

  const fetchAll = useCallback(async () => {
    try {
      const [s, c, b] = await Promise.all([
        api.getSavings(), api.getCommunity(), api.getBadges(),
      ]);
      setSavings(s);
      setCommunity(c);
      setBadges(b);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);
  useEffect(() => { fetchAll(); }, [rider, fetchAll]);

  // Live community counter (increments every 5s for effect)
  useEffect(() => {
    const t = setInterval(async () => {
      try { const c = await api.getCommunity(); setCommunity(c); } catch {}
    }, 8000);
    return () => clearInterval(t);
  }, []);

  const totalSaved   = savings?.total_saved   ?? 0;
  const monthlySaved = savings?.monthly_saved ?? 0;
  const weeklySaved  = savings?.weekly_saved  ?? 0;
  const goalProgress = savings?.goal_progress ?? 0;
  const goalAmount   = savings?.goal_amount   ?? 5000;
  const streak       = savings?.streak        ?? 0;
  const xp           = savings?.xp            ?? 0;
  const levelMax     = savings?.level_max     ?? 1000;
  const levelMin     = savings?.level_min     ?? 0;
  const level        = savings?.level         ?? '—';
  const levelIcon    = savings?.level_icon    ?? '🥈';
  const totalRides   = savings?.total_rides   ?? 0;
  const savingRides  = savings?.saving_rides  ?? 0;
  const communityCount = community?.total_riders_saving ?? 12847;
  const todayJoined    = community?.today_joined        ?? 234;

  const xpPct = Math.min(100, ((xp - levelMin) / (levelMax - levelMin)) * 100);

  return (
    <>
      {/* ── Hero ── */}
      <div className="card hero-savings card-glow">
        <div className="hero-label">Total Bachat 🏦</div>
        <div className="hero-amount">
          Rs.{totalSaved.toLocaleString('en-PK', { minimumFractionDigits: 2 })}
        </div>
        <div className="hero-sub">
          {goalProgress.toFixed(1)}% of Rs.{goalAmount.toLocaleString('en-PK')} goal
        </div>
      </div>

      {/* ── Community Banner ── */}
      <div className="community-banner">
        <div className="community-pulse">
          <span className="community-icon">👥</span>
        </div>
        <div className="community-text">
          <div className="community-count">
            {communityCount.toLocaleString('en-PK')} riders
          </div>
          <div className="community-label">are saving just like you! 🚀</div>
          <div className="community-today">
            <span>+{todayJoined}</span> joined today — you're not alone!
          </div>
        </div>
      </div>

      {/* ── Goal Ring ── */}
      <div className="card">
        <div className="goal-section">
          <GoalRing progress={goalProgress} size={162} />
          <div className="goal-info">
            <div className="goal-title">Emergency Fund Goal 🎯</div>
            <div className="goal-desc">
              You've saved Rs.{totalSaved.toLocaleString('en-PK')} of your Rs.{goalAmount.toLocaleString('en-PK')} target.
              {goalProgress >= 100
                ? ' 🎉 Goal complete!'
                : ` Rs.${(goalAmount - totalSaved).toLocaleString('en-PK')} to go!`}
            </div>
            <div className="goal-progress-bar">
              <div className="goal-progress-fill" style={{ width: `${goalProgress}%` }} />
            </div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 5, textAlign: 'right' }}>
              {goalProgress.toFixed(1)}% complete
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-value green">Rs.{monthlySaved.toLocaleString('en-PK')}</div>
          <div className="stat-label">This Month</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📆</div>
          <div className="stat-value gold">Rs.{weeklySaved.toLocaleString('en-PK')}</div>
          <div className="stat-label">This Week</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🛵</div>
          <div className="stat-value purple">{totalRides}</div>
          <div className="stat-label">Total Rides</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💚</div>
          <div className="stat-value blue">{savingRides}</div>
          <div className="stat-label">Rides Saved</div>
        </div>
      </div>

      {/* ── Streak ── */}
      <div className="card streak-card">
        <div className="streak-main">
          <div className="streak-info">
            <h3>Saving Streak</h3>
            <div className="streak-num">
              {streak}
              <span className="flame-emoji"> 🔥</span>
            </div>
            <div className="streak-unit">days in a row</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 8 }}>Keep it up!</div>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(239,68,68,.25), rgba(239,68,68,.05))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid rgba(239,68,68,.3)',
              fontSize: 26,
            }}>🔥</div>
          </div>
        </div>
        <div className="streak-calendar">
          {DAYS.map((d, i) => (
            <div key={i} className={`streak-dot ${i < streak % 7 ? 'filled' : 'empty'}`}>
              {d}
            </div>
          ))}
        </div>
      </div>

      {/* ── Level / XP ── */}
      <div className="card level-card">
        <div className="level-header">
          <div className="level-name">{levelIcon} {level}</div>
          <div className="level-xp">{xp} / {levelMax} XP</div>
        </div>
        <div className="xp-bar">
          <div className="xp-fill" style={{ width: `${xpPct}%` }} />
        </div>
        <div className="level-next">
          {levelMax - xp > 0 ? `${levelMax - xp} XP to next level` : '🏆 Max level!'}
        </div>
      </div>

      {/* ── Badges ── */}
      <div className="card" style={{ padding: '20px' }}>
        <BadgeGrid badges={badges} />
      </div>
    </>
  );
}
