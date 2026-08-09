export default function ScoreGauge({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference - (clamped / 100) * circumference;

  const color = clamped >= 75 ? "#4FD1C5" : clamped >= 45 ? "#F2A93B" : "#EF7C6B";
  const label = clamped >= 85 ? "Excellent" : clamped >= 75 ? "Strong" : clamped >= 60 ? "Promising" : clamped >= 45 ? "Developing" : "Early Stage";

  return (
    <div className="relative w-36 h-36 shrink-0">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#1F2838" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono-num text-3xl font-semibold" style={{ color }}>
          {clamped}
        </span>
        <span className="text-[11px] text-muted tracking-wide">MATCH SCORE</span>
        <span className="text-[10px] mt-1 font-medium" style={{ color }}>
          {label}
        </span>
      </div>
    </div>
  );
}
