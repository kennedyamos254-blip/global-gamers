import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { Bus, SlidersHorizontal, Upload, Video } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useMemo, useState } from "react";
import { SearchBar } from "../components/SearchBar";
import { VideoCard } from "../components/VideoCard";
import { useAuth } from "../hooks/useAuth";
import { useSearchVideos, useVideos } from "../hooks/useBackend";

const SKELETON_KEYS = [
  "sk-a",
  "sk-b",
  "sk-c",
  "sk-d",
  "sk-e",
  "sk-f",
  "sk-g",
  "sk-h",
  "sk-i",
];

export function FeedPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const isSearching = searchQuery.trim().length > 0;

  const {
    data: allVideos,
    isLoading: allLoading,
    isError: allError,
  } = useVideos();
  const {
    data: searchResults = [],
    isLoading: searchLoading,
    isError: searchError,
  } = useSearchVideos(searchQuery.trim());

  const { isAuthenticated } = useAuth();

  const handleSearch = useCallback((val: string) => setSearchQuery(val), []);

  const displayVideos = useMemo(() => {
    if (isSearching) return searchResults;
    if (!allVideos) return [];
    return [...allVideos].sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
  }, [isSearching, allVideos, searchResults]);

  const isLoading = isSearching ? searchLoading : allLoading;
  const isError = isSearching ? searchError : allError;

  return (
    <div className="flex-1 bg-background" data-ocid="feed.page">
      {/* Feed header bar */}
      <div className="bg-card border-b border-border">
        <div className="container max-w-7xl py-4 flex flex-col gap-3 sm:gap-0 sm:flex-row sm:items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
              <Video size={14} className="text-primary" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-foreground leading-tight">
                {isSearching ? "Search Results" : "Latest Videos"}
              </h1>
              {!isLoading && (
                <p className="text-xs text-muted-foreground">
                  {isSearching
                    ? `${displayVideos.length} clip${displayVideos.length !== 1 ? "s" : ""} for "${searchQuery}"`
                    : displayVideos.length > 0
                      ? `${displayVideos.length} ${displayVideos.length === 1 ? "video" : "videos"} · sorted by newest`
                      : null}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Search bar */}
            <SearchBar
              value={searchQuery}
              onChange={handleSearch}
              className="w-full sm:w-64"
            />

            {!isSearching && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 border border-border rounded-md px-2.5 py-1.5 shrink-0">
                <SlidersHorizontal size={12} />
                <span>Most Recent</span>
              </div>
            )}

            {isAuthenticated && (
              <Button
                asChild
                size="sm"
                data-ocid="feed.upload_button"
                className="font-display font-semibold shrink-0"
              >
                <Link to="/upload">
                  <Upload size={13} className="mr-1.5" />
                  Upload
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container py-6 max-w-7xl">
        {/* Loading skeleton */}
        {isLoading && (
          <div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
            data-ocid="feed.loading_state"
          >
            {SKELETON_KEYS.map((sk) => (
              <div
                key={sk}
                className="rounded-lg overflow-hidden bg-card border border-border"
              >
                <Skeleton className="aspect-video w-full skeleton-shimmer" />
                <div className="p-3 space-y-2">
                  <Skeleton className="h-4 w-3/4 skeleton-shimmer" />
                  <Skeleton className="h-3 w-1/2 skeleton-shimmer" />
                  <div className="flex gap-1.5">
                    <Skeleton className="h-3 w-12 skeleton-shimmer" />
                    <Skeleton className="h-3 w-10 skeleton-shimmer" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {isError && !isLoading && (
          <div
            className="flex flex-col items-center justify-center py-24 text-center"
            data-ocid="feed.error_state"
          >
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
              <Video size={28} className="text-destructive" />
            </div>
            <h2 className="font-display text-lg font-bold text-foreground mb-2">
              Couldn't load videos
            </h2>
            <p className="text-muted-foreground text-sm max-w-xs">
              Something went wrong while loading the feed. Please refresh the
              page to try again.
            </p>
          </div>
        )}

        {/* Search empty state */}
        {!isLoading &&
          !isError &&
          isSearching &&
          displayVideos.length === 0 && (
            <motion.div
              className="flex flex-col items-center justify-center py-24 text-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              data-ocid="feed.search_empty_state"
            >
              <div className="w-20 h-20 rounded-2xl bg-muted border border-border flex items-center justify-center mb-5">
                <Bus size={36} className="text-muted-foreground" />
              </div>
              <h2 className="font-display text-xl font-bold text-foreground mb-2">
                No clips found
              </h2>
              <p className="text-muted-foreground text-sm max-w-xs">
                No clips match{" "}
                <span className="text-foreground font-medium">
                  &ldquo;{searchQuery}&rdquo;
                </span>
                . Try a different title or browse all videos.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                data-ocid="feed.search_clear_all_button"
                className="mt-5 text-sm text-primary hover:underline font-display font-semibold focus-visible:outline-none focus-visible:underline"
              >
                Clear search
              </button>
            </motion.div>
          )}

        {/* Feed empty state (no videos at all) */}
        {!isLoading &&
          !isError &&
          !isSearching &&
          displayVideos.length === 0 && (
            <div
              className="flex flex-col items-center justify-center py-24 text-center"
              data-ocid="feed.empty_state"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                  <Bus size={36} className="text-primary" />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                  No videos yet
                </h2>
                <p className="text-muted-foreground text-sm max-w-sm mb-6 leading-relaxed">
                  Be the first to share your bus simulator adventures. Upload a
                  clip and start the Global Gamers community rolling!
                </p>
                {isAuthenticated ? (
                  <Button asChild data-ocid="feed.empty_state_upload_button">
                    <Link to="/upload">
                      <Upload size={15} className="mr-2" />
                      Upload First Video
                    </Link>
                  </Button>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Sign in to upload your first video
                  </p>
                )}
              </motion.div>
            </div>
          )}

        {/* Video grid */}
        {!isLoading && !isError && displayVideos.length > 0 && (
          <motion.div
            key={isSearching ? `search-${searchQuery}` : "all"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
            data-ocid="feed.list"
          >
            {displayVideos.map((video, i) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.45), duration: 0.35 }}
              >
                <VideoCard video={video} index={i + 1} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
