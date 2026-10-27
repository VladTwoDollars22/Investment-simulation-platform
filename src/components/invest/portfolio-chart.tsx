"use client";

import { useId } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { STARTING_BUDGET } from "@/lib/invest-data";

type ChartPoint = {
  x: number;
  y: number;
};

function smoothPath(points: ChartPoint[]) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const p0 = points[index - 1] ?? points[index];
    const p1 = points[index];
    const p2 = points[index + 1];
    const p3 = points[index + 2] ?? p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  return path;
}

export function PortfolioChart({
  values,
  visible = values.length,
  className,
}: {
  values: number[];
  visible?: number;
  className?: string;
}) {
  const gradientId = useId().replace(/[:]/g, "");
  const width = 760;
  const height = 300;
  const padding = { top: 22, right: 18, bottom: 38, left: 64 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const maxValue = Math.max(...values, STARTING_BUDGET) * 1.08;
  const minValue = 0;
  const range = maxValue - minValue || 1;

  const points = values.map((value, index) => ({
    x:
      padding.left +
      (index / Math.max(values.length - 1, 1)) * chartWidth,
    y: padding.top + chartHeight - ((value - minValue) / range) * chartHeight,
  }));

  const shown = points.slice(0, Math.max(1, Math.min(visible, points.length)));
  const line = smoothPath(shown);
  const area = shown.length
    ? `${line} L ${shown[shown.length - 1].x} ${
        padding.top + chartHeight
      } L ${shown[0].x} ${padding.top + chartHeight} Z`
    : "";
  const yTicks = Array.from({ length: 4 }, (_, index) => {
    const value = (maxValue / 3) * index;
    return {
      value,
      y: padding.top + chartHeight - (value / range) * chartHeight,
    };
  });
  const baselineY =
    padding.top +
    chartHeight -
    ((STARTING_BUDGET - minValue) / range) * chartHeight;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Portfolio value over five years"
      className={cn("h-auto w-full overflow-visible", className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5438f5" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#5438f5" stopOpacity="0" />
        </linearGradient>
      </defs>

      {yTicks.map((tick) => (
        <g key={tick.value}>
          <line
            x1={padding.left}
            x2={width - padding.right}
            y1={tick.y}
            y2={tick.y}
            stroke="#14131a"
            strokeOpacity="0.08"
            strokeDasharray="3 6"
          />
          <text
            x={padding.left - 12}
            y={tick.y + 4}
            textAnchor="end"
            fontSize="11"
            fontWeight="600"
            fill="#6d6a76"
          >
            {formatCurrency(tick.value, { compact: true })}
          </text>
        </g>
      ))}

      <line
        x1={padding.left}
        x2={width - padding.right}
        y1={baselineY}
        y2={baselineY}
        stroke="#14131a"
        strokeOpacity="0.24"
        strokeDasharray="2 5"
      />
      <text
        x={width - padding.right}
        y={baselineY - 7}
        textAnchor="end"
        fontSize="10"
        fontWeight="700"
        fill="#6d6a76"
        letterSpacing="0.06em"
      >
        STARTING $10K
      </text>

      {area && <path d={area} fill={`url(#${gradientId})`} />}
      {line && (
        <path
          d={line}
          fill="none"
          stroke="#5438f5"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {shown.map((point, index) => {
        const isLast = index === shown.length - 1;
        return (
          <g key={index}>
            {isLast && (
              <circle
                cx={point.x}
                cy={point.y}
                r="10"
                fill="#5438f5"
                opacity="0.14"
                className="animate-pulse-soft"
              />
            )}
            <circle
              cx={point.x}
              cy={point.y}
              r={isLast ? 6 : 4.5}
              fill={isLast ? "#d6f56d" : "#fffcf5"}
              stroke="#14131a"
              strokeWidth="2"
            />
          </g>
        );
      })}

      {["Start", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5"].map(
        (label, index) => (
          <text
            key={label}
            x={
              padding.left +
              (index / Math.max(values.length - 1, 1)) * chartWidth
            }
            y={height - 12}
            textAnchor={
              index === 0 ? "start" : index === 5 ? "end" : "middle"
            }
            fontSize="11"
            fontWeight="600"
            fill={index < shown.length ? "#14131a" : "#a9a49a"}
          >
            {label}
          </text>
        ),
      )}
    </svg>
  );
}
