export default function BridgeHero() {
  return (
    <svg
      viewBox="0 0 960 260"
      className="w-full h-auto"
      role="img"
      aria-label="Schematic diagram of a bridge connecting your current skills to the target role"
    >
      <defs>
        <linearGradient id="deckGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4FD1C5" />
          <stop offset="100%" stopColor="#F2A93B" />
        </linearGradient>
      </defs>

      {/* horizon line */}
      <line x1="0" y1="200" x2="960" y2="200" stroke="#2A3446" strokeWidth="1.5" />

      {/* left pier */}
      <g>
        <rect x="60" y="140" width="14" height="60" fill="#8A93A6" opacity="0.5" />
        <circle cx="67" cy="130" r="7" fill="#4FD1C5" />
        <text x="20" y="230" fill="#8A93A6" fontSize="13" fontFamily="var(--font-mono)" letterSpacing="0.5">
          YOUR RESUME
        </text>
      </g>

      {/* right pier */}
      <g>
        <rect x="886" y="140" width="14" height="60" fill="#8A93A6" opacity="0.5" />
        <circle cx="893" cy="130" r="7" fill="#F2A93B" />
        <text x="780" y="230" fill="#8A93A6" fontSize="13" fontFamily="var(--font-mono)" letterSpacing="0.5">
          THE TARGET ROLE
        </text>
      </g>

      {/* suspension cables */}
      <path
        d="M 67 130 Q 480 40 893 130"
        fill="none"
        stroke="#2A3446"
        strokeWidth="2"
        strokeDasharray="4 6"
      />

      {/* hangers */}
      {Array.from({ length: 11 }).map((_, i) => {
        const x = 100 + i * 76;
        const t = i / 10;
        const cableY = 130 - Math.sin(Math.PI * t) * 78;
        return (
          <line
            key={x}
            x1={x}
            y1={cableY + 12}
            x2={x}
            y2={140}
            stroke="#2A3446"
            strokeWidth="1.5"
          />
        );
      })}

      {/* deck / planks representing skills, filled in left-to-right */}
      {Array.from({ length: 11 }).map((_, i) => {
        const x = 88 + i * 76;
        return (
          <rect
            key={x}
            className="plank"
            style={{ animationDelay: `${i * 60}ms` }}
            x={x}
            y="140"
            width="56"
            height="9"
            rx="2"
            fill="url(#deckGrad)"
            opacity={0.55 + (i / 10) * 0.45}
          />
        );
      })}
    </svg>
  );
}
