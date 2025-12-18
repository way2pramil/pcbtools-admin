"use client";

import { useState } from "react";

interface DataPoint {
  label: string;
  value: number;
}

interface AreaChartProps {
  data: DataPoint[];
  height?: number;
}

export function AreaChart({ data, height = 200 }: AreaChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  if (data.length === 0) return null;
  
  const max = Math.max(...data.map((d) => d.value), 1);
  const min = 0;
  const range = max - min || 1;
  const padding = { top: 20, bottom: 30, left: 5, right: 5 };
  const chartHeight = height - padding.top - padding.bottom;
  
  const points = data.map((d, i) => ({
    x: padding.left + (i / (data.length - 1 || 1)) * (100 - padding.left - padding.right),
    y: padding.top + chartHeight - ((d.value - min) / range) * chartHeight,
    data: d,
  }));

  // Create smooth curve using cardinal spline
  const createSmoothPath = () => {
    if (points.length < 2) return `M ${points[0]?.x} ${points[0]?.y}`;
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      path += ` Q ${points[i].x} ${points[i].y} ${xc} ${yc}`;
    }
    path += ` L ${points[points.length - 1].x} ${points[points.length - 1].y}`;
    return path;
  };

  const pathD = createSmoothPath();
  const areaD = `${pathD} L ${100 - padding.right} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`;

  return (
    <div className="w-full relative" style={{ height }}>
      <svg viewBox={`0 0 100 ${height}`} className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGradientModern" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" className="[stop-color:hsl(var(--chart-1))]" stopOpacity="0.25" />
            <stop offset="50%" className="[stop-color:hsl(var(--chart-1))]" stopOpacity="0.1" />
            <stop offset="100%" className="[stop-color:hsl(var(--chart-1))]" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map((ratio) => (
          <line
            key={ratio}
            x1={padding.left}
            y1={padding.top + chartHeight * (1 - ratio)}
            x2={100 - padding.right}
            y2={padding.top + chartHeight * (1 - ratio)}
            className="stroke-border/30"
            strokeDasharray="2 2"
          />
        ))}
        
        {/* Area fill */}
        <path d={areaD} fill="url(#areaGradientModern)" />
        
        {/* Line */}
        <path
          d={pathD}
          fill="none"
          className="stroke-chart-1"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
        />
        
        {/* Data points */}
        {points.map((p, i) => {
          const isHovered = hoveredIndex === i;
          return (
            <g key={i}>
              {/* Invisible larger hit area */}
              <circle
                cx={p.x}
                cy={p.y}
                r="6"
                fill="transparent"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ cursor: "pointer" }}
              />
              {/* Visible point */}
              <circle
                cx={p.x}
                cy={p.y}
                r={isHovered ? 4 : 2.5}
                className="fill-chart-1 transition-all duration-150"
                style={{
                  filter: isHovered ? "drop-shadow(0 0 4px hsl(var(--chart-1)))" : undefined,
                }}
              />
              {/* Tooltip */}
              {isHovered && (
                <>
                  <line
                    x1={p.x}
                    y1={p.y}
                    x2={p.x}
                    y2={height - padding.bottom}
                    className="stroke-chart-1/30"
                    strokeDasharray="2 2"
                  />
                  <rect
                    x={p.x - 8}
                    y={p.y - 18}
                    width="16"
                    height="12"
                    rx="2"
                    className="fill-popover stroke-border"
                    strokeWidth="0.5"
                  />
                  <text
                    x={p.x}
                    y={p.y - 10}
                    textAnchor="middle"
                    className="text-[5px] fill-foreground font-medium"
                  >
                    {p.data.value}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
