import { Crown } from "lucide-react";

interface PremiumBadgeProps {
  size?: "sm" | "md";
  className?: string;
}

export function PremiumBadge({
  size = "md",
  className = "",
}: PremiumBadgeProps) {
  const iconSize = size === "sm" ? 10 : 12;
  const textClass = size === "sm" ? "text-[10px]" : "text-xs";

  return (
    <span className={`badge-premium ${textClass} ${className}`}>
      <Crown size={iconSize} className="fill-accent" />
      PREMIUM
    </span>
  );
}
