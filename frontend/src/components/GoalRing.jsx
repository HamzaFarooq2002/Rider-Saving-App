const R = 72;
const C = 2 * Math.PI * R; // ~452.4

export default function GoalRing({ progress = 0, size = 180 }) {
  const pct    = Math.min(100, Math.max(0, progress));
  const offset = C * (1 - pct / 100);

  return (
    <div className="goal-ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 180 180">
        {/* track */}
        <circle
          cx={90} cy={90} r={R}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={14}
        />
        {/* fill */}
        <circle
          cx={90} cy={90} r={R}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth={14}
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)' }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#00D9A3" />
            <stop offset="100%" stopColor="#0EA5E9" />
          </linearGradient>
        </defs>
      </svg>
      <div className="goal-ring-center">
        <span className="goal-pct">{pct.toFixed(0)}%</span>
        <span className="goal-sub">of goal</span>
      </div>
    </div>
  );
}
