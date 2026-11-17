import {
  Activity,
  Armchair,
  Camera,
  LineChart,
  Store,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const icons: Record<string, LucideIcon> = {
  store: Store,
  armchair: Armchair,
  utensils: UtensilsCrossed,
  camera: Camera,
  activity: Activity,
};

export function StartupIcon({
  icon,
  className,
}: {
  icon: string;
  className?: string;
}) {
  const Icon = icons[icon] ?? LineChart;

  return <Icon aria-hidden="true" className={cn("size-5", className)} />;
}
