"use client";

interface PieChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
}

export function PieChart({ data, size = 200 }: PieChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return null;

  let currentAngle = -90;
  const segments = data.map((d) => {
    const angle = (d.value / total) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;
    return { ...d, startAngle, angle };
  });

  const polarToCartesian = (angle: number, radius: number) => ({
    x: 50 + radius * Math.cos((angle * Math.PI) / 180),
    y: 50 + radius * Math.sin((angle * Math.PI) / 180),
  });

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 100 100" style={{ width: size, height: size }}>
        {segments.map((seg, i) => {
          const start = polarToCartesian(seg.startAngle, 40);
          const end = polarToCartesian(seg.startAngle + seg.angle, 40);
          const largeArc = seg.angle > 180 ? 1 : 0;
          const d = `M 50 50 L ${start.x} ${start.y} A 40 40 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
          return <path key={i} d={d} fill={seg.color} />;
        })}
      </svg>
      <div className="space-y-1">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
            <span>{d.label}</span>
            <span className="text-muted-foreground">({d.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
