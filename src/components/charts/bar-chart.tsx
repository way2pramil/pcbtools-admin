"use client";

import { useState } from "react";

interface BarChartProps {
  data: { label: string; value: number }[];
  height?: number;
}

export function BarChart({ data, height = 200 }: BarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.value), 1);
  const barWidth = 100 / data.length;

  return (
    <div className="w-full" style={{ height }}>
      <svg viewBox={`0 0 100 ${height}`} className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" className="[stop-color:hsl(var(--chart-1))]" stopOpacity="1" />
            <stop offset="100%" className="[stop-color:hsl(var(--chart-1))]" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="barGradientHover" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" className="[stop-color:hsl(var(--chart-1))]" stopOpacity="1" />
            <stop offset="100%" className="[stop-color:hsl(var(--chart-1))]" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((ratio) => (
          <line
            key={ratio}
            x1="0"
            y1={height - 20 - (height - 50) * ratio}
            x2="100"
            y2={height - 20 - (height - 50) * ratio}
            className="stroke-border/50"
            strokeDasharray="2 2"
          />
        ))}
        {data.map((d, i) => {
          const barHeight = (d.value / max) * (height - 50);
          const isHovered = hoveredIndex === i;
          return (
            <g
              key={d.label}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ cursor: "pointer" }}
            >
              <rect
                x={i * barWidth + barWidth * 0.15}
                y={height - barHeight - 20}
                width={barWidth * 0.7}
                height={barHeight}
                fill={isHovered ? "url(#barGradientHover)" : "url(#barGradient)"}
                rx={4}
                className="transition-all duration-200"
                style={{ filter: isHovered ? "brightness(1.1)" : undefined }}
              />
              {/* Value label on hover */}
              {isHovered && (
                <text
                  x={i * barWidth + barWidth / 2}
                  y={height - barHeight - 25}
                  textAnchor="middle"
                  className="text-[7px] fill-foreground font-medium"
                >
                  {d.value}
                </text>
              )}
              <text
                x={i * barWidth + barWidth / 2}
                y={height - 5}
                textAnchor="middle"
                className="text-[6px] fill-muted-foreground"
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
