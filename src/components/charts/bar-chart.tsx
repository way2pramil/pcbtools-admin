"use client";

interface BarChartProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
}

export function BarChart({ data, height = 200, color = "#3b82f6" }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const barWidth = 100 / data.length;

  return (
    <div className="w-full" style={{ height }}>
      <svg viewBox={`0 0 100 ${height}`} className="w-full h-full" preserveAspectRatio="none">
        {data.map((d, i) => {
          const barHeight = (d.value / max) * (height - 30);
          return (
            <g key={d.label}>
              <rect
                x={i * barWidth + barWidth * 0.1}
                y={height - barHeight - 20}
                width={barWidth * 0.8}
                height={barHeight}
                fill={color}
                rx={2}
                className="transition-all duration-300"
              />
              <text
                x={i * barWidth + barWidth / 2}
                y={height - 5}
                textAnchor="middle"
                className="text-[8px] fill-muted-foreground"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
