export default function SeasonProgressRing({
  watched = 0,
  total = 0,
  size = 34,
  stroke = 4,
}) {
  if (!total || total <= 0) return null;

  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(watched / total, 1);
  const offset = circumference * (1 - progress);
  const percent = Math.round(progress * 100);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="block"
    >
      {/* BACKGROUND RING */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#e5e7eb"
        strokeWidth={stroke}
        fill="none"
      />

      {/* PROGRESS RING */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#22c55e"
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />

      {/* CENTER TEXT */}
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="9"
        fontWeight="600"
        fill="#16a34a"
      >
        {percent}%
      </text>
    </svg>
  );
}
