import { Link } from "@tanstack/react-router";
import { Heart, Play } from "lucide-react";
import type { Video } from "../types";
import { PremiumBadge } from "./PremiumBadge";

interface VideoCardProps {
  video: Video;
  index: number;
}

function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

function formatTimeAgo(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const diff = Date.now() - ms;
  const days = Math.floor(diff / 86400000);
  if (days > 365) return `${Math.floor(days / 365)}y ago`;
  if (days > 30) return `${Math.floor(days / 30)}mo ago`;
  if (days > 0) return `${days}d ago`;
  const hours = Math.floor(diff / 3600000);
  if (hours > 0) return `${hours}h ago`;
  return "Just now";
}

export function VideoCard({ video, index }: VideoCardProps) {
  return (
    <Link
      to="/video/$videoId"
      params={{ videoId: video.id }}
      data-ocid={`video.item.${index}`}
      className="group block rounded-lg overflow-hidden bg-card border border-border card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={
            video.thumbnailUrl ||
            "/assets/generated/hero-bus-sim.dim_1400x600.jpg"
          }
          alt={video.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="video-card-overlay" />

        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth">
          <div className="rounded-full bg-primary/90 p-3 glow-primary">
            <Play
              size={20}
              className="fill-primary-foreground text-primary-foreground"
            />
          </div>
        </div>

        {/* Like count */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 text-xs text-white/90 bg-black/50 rounded-full px-2 py-0.5">
          <Heart size={10} className="fill-current" />
          {formatCount(video.likeCount)}
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-display font-semibold text-sm text-foreground line-clamp-2 leading-snug mb-1">
          {video.title}
        </h3>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <Link
              to="/user/$userId"
              params={{ userId: video.creatorId }}
              onClick={(e) => e.stopPropagation()}
              data-ocid={`video.creator_link.${index}`}
              className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200 truncate"
            >
              {video.creatorName}
            </Link>
            {video.creatorIsPremium && <PremiumBadge size="sm" />}
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
            {formatTimeAgo(video.createdAt)}
          </span>
        </div>
        {video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {video.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
