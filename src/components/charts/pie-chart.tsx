"use client";

import { useState } from "react";

interface PieChartProps {
  data: { label: string; value: number; color?: string }[];
  size?: number;
}

const chartColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function PieChart({ data, size = 180 }: PieChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return null;

  let currentAngle = -90;
  const segments = data.map((d, i) => {
    const angle = (d.value / total) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;
    return { ...d, startAngle, angle, color: d.color || chartColors[i % chartColors.length] };
  });

  const polarToCartesian = (angle: number, radius: number) => ({
    x: 50 + radius * Math.cos((angle * Math.PI) / 180),
    y: 50 + radius * Math.sin((angle * Math.PI) / 180),
  });

  // Create donut path (arc instead of pie slice)
  const createArcPath = (startAngle: number, endAngle: number, outerR: number, innerR: number) => {
    const startOuter = polarToCartesian(startAngle, outerR);
    const endOuter = polarToCartesian(endAngle, outerR);
    const startInner = polarToCartesian(endAngle, innerR);
    const endInner = polarToCartesian(startAngle, innerR);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${startOuter.x} ${startOuter.y} A ${outerR} ${outerR} 0 ${largeArc} 1 ${endOuter.x} ${endOuter.y} L ${startInner.x} ${startInner.y} A ${innerR} ${innerR} 0 ${largeArc} 0 ${endInner.x} ${endInner.y} Z`;
  };

  return (
    <div className="flex items-center justify-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {segments.map((seg, i) => {
            const isHovered = hoveredIndex === i;
            const outerR = isHovered ? 42 : 40;
            return (
              <path
                key={i}
                d={createArcPath(seg.startAngle + 90, seg.startAngle + seg.angle + 90, outerR, 28)}
                fill={seg.color}
                className="transition-all duration-200 cursor-pointer"
                style={{
                  filter: isHovered ? "brightness(1.15) drop-shadow(0 2px 4px rgba(0,0,0,0.15))" : undefined,
                }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-foreground">{total}</span>
          <span className="text-xs text-muted-foreground">Total</span>
        </div>
      </div>
      <div className="space-y-2">
        {segments.map((d, i) => {
          const isHovered = hoveredIndex === i;
          const percentage = ((d.value / total) * 100).toFixed(0);
          return (
            <div
              key={d.label}
              className={`flex items-center gap-2 text-sm rounded-md px-2 py-1 transition-colors cursor-pointer ${
                isHovered ? "bg-muted" : ""
              }`}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: d.color }}
              />
              <span className="font-medium">{d.label}</span>
              <span className="text-muted-foreground ml-auto">
                {d.value} ({percentage}%)
              </span>
            </div>
          );
        })}  
      </div>
    </div>
  );
}
