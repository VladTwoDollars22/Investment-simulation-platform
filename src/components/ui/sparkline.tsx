import { cn, polylinePoints } from "@/lib/utils";

export function Sparkline({
  values,
  className,
  stroke = "#5438f5",
  fill = "rgba(84, 56, 245, 0.12)",
  strokeWidth = 2.5,
  showArea = true,
}: {
  values: number[];
  className?: string;
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
  showArea?: boolean;
}) {
  const points = polylinePoints(values, 120, 38);
  if (!points) return null;

  return (
    <svg
      viewBox="0 0 120 40"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn("h-10 w-full overflow-visible", className)}
    >
      {showArea && (
        <polygon points={`0,40 ${points} 120,40`} fill={fill} stroke="none" />
      )}
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
