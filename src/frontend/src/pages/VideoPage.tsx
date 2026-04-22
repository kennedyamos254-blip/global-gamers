import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Heart, Trash2, User } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { PremiumBadge } from "../components/PremiumBadge";
import { useAuth } from "../hooks/useAuth";
import {
  useDeleteVideo,
  useHasLiked,
  useLikeCount,
  useLikeVideo,
  useUnlikeVideo,
  useVideo,
} from "../hooks/useBackend";

export function VideoPage() {
  const { videoId } = useParams({ strict: false });
  const navigate = useNavigate();
  const { isAuthenticated, userId } = useAuth();
  const queryClient = useQueryClient();

  const { data: video, isLoading } = useVideo(videoId ?? null);
  const { data: likeCount = 0 } = useLikeCount(videoId ?? null);
  const { data: hasLiked = false } = useHasLiked(videoId ?? null);
  const likeMutation = useLikeVideo();
  const unlikeMutation = useUnlikeVideo();
  const deleteMutation = useDeleteVideo();

  const isOwner = !!userId && !!video && video.creatorId === userId;
  const isPending = likeMutation.isPending || unlikeMutation.isPending;

  function handleLike() {
    if (!isAuthenticated) {
      toast.error("Sign in to like videos");
      return;
    }
    if (!videoId) return;

    // Optimistic update
    const prevLiked = hasLiked;
    const prevCount = likeCount;

    queryClient.setQueryData<boolean>(["hasLiked", videoId], !hasLiked);
    queryClient.setQueryData<number>(
      ["likeCount", videoId],
      hasLiked ? Math.max(0, prevCount - 1) : prevCount + 1,
    );

    if (hasLiked) {
      unlikeMutation.mutate(videoId, {
        onError: () => {
          queryClient.setQueryData<boolean>(["hasLiked", videoId], prevLiked);
          queryClient.setQueryData<number>(["likeCount", videoId], prevCount);
          toast.error("Failed to unlike video");
        },
      });
    } else {
      likeMutation.mutate(videoId, {
        onError: () => {
          queryClient.setQueryData<boolean>(["hasLiked", videoId], prevLiked);
          queryClient.setQueryData<number>(["likeCount", videoId], prevCount);
          toast.error("Failed to like video");
        },
      });
    }
  }

  function handleDelete() {
    if (!videoId) return;
    deleteMutation.mutate(videoId, {
      onSuccess: () => {
        toast.success("Video deleted");
        navigate({ to: "/feed" });
      },
      onError: () => toast.error("Failed to delete video"),
    });
  }

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div data-ocid="video.loading_state" className="flex-1">
        <Skeleton className="w-full aspect-video skeleton-shimmer" />
        <div className="container max-w-5xl py-6 space-y-3">
          <Skeleton className="h-9 w-3/4 skeleton-shimmer" />
          <Skeleton className="h-5 w-1/3 skeleton-shimmer" />
          <Skeleton className="h-20 w-full skeleton-shimmer rounded-lg" />
        </div>
      </div>
    );
  }

  // ── Not found ─────────────────────────────────────────────────────────────
  if (!video) {
    return (
      <div
        className="flex-1 flex flex-col items-center justify-center py-24 text-center"
        data-ocid="video.error_state"
      >
        <p className="text-2xl font-display font-bold text-foreground mb-2">
          Video not found
        </p>
        <p className="text-muted-foreground mb-6 text-sm">
          It may have been removed or the link is invalid.
        </p>
        <Button asChild variant="outline" data-ocid="video.back.link">
          <Link to="/feed">
            <ArrowLeft size={14} className="mr-1.5" />
            Back to Feed
          </Link>
        </Button>
      </div>
    );
  }

  const videoSrc =
    video.videoUrl ||
    (
      video as { blob?: { getDirectURL?: () => string } }
    ).blob?.getDirectURL?.();

  return (
    <div className="flex-1 bg-background" data-ocid="video.page">
      {/* ── Hero player — full width ─────────────────────────────────────── */}
      <div className="w-full bg-black">
        {videoSrc ? (
          <video
            src={videoSrc}
            controls
            className="w-full max-h-[78vh] object-contain"
            poster={video.thumbnailUrl}
            data-ocid="video.canvas_target"
            autoPlay={false}
          >
            <track kind="captions" src="" label="Captions" />
          </video>
        ) : video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full max-h-[78vh] object-contain"
          />
        ) : (
          <div className="w-full aspect-video flex items-center justify-center bg-muted">
            <span className="text-muted-foreground text-sm">
              No video available
            </span>
          </div>
        )}
      </div>

      {/* ── Meta panel ──────────────────────────────────────────────────── */}
      <div className="container max-w-5xl py-6">
        {/* Back nav */}
        <Link
          to="/feed"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 mb-5"
          data-ocid="video.back.link"
        >
          <ArrowLeft size={14} />
          Back to Feed
        </Link>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 leading-tight"
        >
          {video.title}
        </motion.h1>

        {/* Creator row + actions */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.07 }}
          className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-5 border-b border-border"
        >
          {/* Creator */}
          <Link
            to="/user/$userId"
            params={{ userId: video.creatorId }}
            className="flex items-center gap-2.5 hover:opacity-80 transition-smooth group"
            data-ocid="video.creator.link"
          >
            <div className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0 group-hover:border-primary transition-colors duration-200">
              <User size={17} className="text-muted-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-semibold text-sm text-foreground">
                  {video.creatorName}
                </span>
                {video.creatorIsPremium && <PremiumBadge size="sm" />}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Creator</p>
            </div>
          </Link>

          {/* Right side: like + delete */}
          <div className="flex items-center gap-2">
            {/* Like button */}
            <Button
              onClick={handleLike}
              disabled={isPending}
              variant={hasLiked ? "default" : "outline"}
              size="sm"
              className={`gap-1.5 font-display font-semibold transition-smooth ${
                hasLiked
                  ? "bg-primary text-primary-foreground glow-primary"
                  : "border-border text-foreground hover:border-primary hover:text-primary"
              }`}
              data-ocid="video.like_button"
              aria-label={hasLiked ? "Unlike video" : "Like video"}
            >
              <Heart
                size={14}
                className={hasLiked ? "fill-primary-foreground" : ""}
              />
              <span>{likeCount}</span>
              <span>{hasLiked ? "Liked" : "Like"}</span>
            </Button>

            {/* Delete button — owner only */}
            {isOwner && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 border-destructive/50 text-destructive hover:bg-destructive/10 hover:border-destructive transition-smooth"
                    data-ocid="video.delete_button"
                    disabled={deleteMutation.isPending}
                    aria-label="Delete video"
                  >
                    <Trash2 size={14} />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent
                  className="bg-popover border-border"
                  data-ocid="video.dialog"
                >
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-display">
                      Delete this video?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. The video and all its likes
                      will be permanently removed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      className="font-display"
                      data-ocid="video.cancel_button"
                    >
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-display"
                      data-ocid="video.confirm_button"
                    >
                      {deleteMutation.isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </motion.div>

        {/* Tags */}
        {video.tags && video.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap gap-2 mb-4"
          >
            {video.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-body"
              >
                #{tag}
              </span>
            ))}
          </motion.div>
        )}

        {/* Description */}
        {video.description && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="p-5 rounded-xl bg-card border border-border"
          >
            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed font-body">
              {video.description}
            </p>
          </motion.div>
        )}

        {/* Auth nudge for unauthenticated */}
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="mt-6 p-4 rounded-xl bg-card border border-border flex items-center justify-between gap-4"
            data-ocid="video.auth_nudge"
          >
            <p className="text-sm text-muted-foreground">
              Sign in to like this video and join the community.
            </p>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:opacity-90 glow-primary shrink-0 font-display font-semibold"
              onClick={() => toast.info("Use the Sign In button in the header")}
              data-ocid="video.signin_button"
            >
              Sign In
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
