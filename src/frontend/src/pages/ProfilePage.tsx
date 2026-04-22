import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import { Crown, Heart, Play, User, Video } from "lucide-react";
import { motion } from "motion/react";
import { PremiumBadge } from "../components/PremiumBadge";
import { VideoCard } from "../components/VideoCard";
import { useAuth } from "../hooks/useAuth";
import {
  useMyLikedVideos,
  useMyProfile,
  useUserProfile,
  useUserVideos,
} from "../hooks/useBackend";

// ── Skeleton placeholders ─────────────────────────────────────────────────────
const SKELETON_KEYS = ["sk-a", "sk-b", "sk-c", "sk-d", "sk-e", "sk-f"];

function ProfileSkeleton() {
  return (
    <div className="flex-1 bg-background" data-ocid="profile.loading_state">
      {/* Header band skeleton */}
      <div className="bg-card border-b border-border py-8">
        <div className="container max-w-5xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <Skeleton className="w-24 h-24 rounded-full skeleton-shimmer shrink-0" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-7 w-48 skeleton-shimmer" />
              <Skeleton className="h-4 w-80 skeleton-shimmer" />
              <div className="flex gap-4">
                <Skeleton className="h-5 w-24 skeleton-shimmer" />
                <Skeleton className="h-5 w-24 skeleton-shimmer" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Grid skeleton */}
      <div className="container max-w-5xl py-8">
        <Skeleton className="h-5 w-32 mb-5 skeleton-shimmer" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SKELETON_KEYS.map((k) => (
            <Skeleton
              key={k}
              className="aspect-video rounded-lg skeleton-shimmer"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Liked video mini-card ─────────────────────────────────────────────────────
interface LikedCardProps {
  video: {
    id: string;
    title: string;
    thumbnailUrl: string;
    creatorName: string;
    creatorId: string;
    likeCount: number;
  };
  index: number;
}

function LikedCard({ video, index }: LikedCardProps) {
  return (
    <Link
      to="/video/$videoId"
      params={{ videoId: video.id }}
      data-ocid={`profile.liked.item.${index}`}
      className="group flex gap-3 rounded-lg bg-card border border-border p-2 card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative w-28 shrink-0 rounded overflow-hidden aspect-video bg-muted">
        <img
          src={
            video.thumbnailUrl ||
            "/assets/generated/hero-bus-sim.dim_1400x600.jpg"
          }
          alt={video.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth">
          <div className="rounded-full bg-primary/90 p-1.5 glow-primary">
            <Play
              size={12}
              className="fill-primary-foreground text-primary-foreground"
            />
          </div>
        </div>
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
        <p className="font-display text-sm font-semibold text-foreground line-clamp-2 leading-snug">
          {video.title}
        </p>
        <Link
          to="/user/$userId"
          params={{ userId: video.creatorId }}
          onClick={(e) => e.stopPropagation()}
          data-ocid={`profile.liked.creator_link.${index}`}
          className="text-xs text-primary hover:underline truncate w-fit"
        >
          {video.creatorName}
        </Link>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
          <Heart size={10} className="fill-current text-primary" />
          {video.likeCount.toLocaleString()}
        </div>
      </div>
    </Link>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function ProfilePage() {
  const params = useParams({ strict: false }) as { userId?: string };
  const { userId: myUserId, isAuthenticated } = useAuth();
  const isOwnProfile = !params.userId || params.userId === myUserId;

  const { data: myProfile, isLoading: myLoading } = useMyProfile();
  const { data: otherProfile, isLoading: otherLoading } = useUserProfile(
    isOwnProfile ? null : (params.userId ?? null),
  );

  const profileId = isOwnProfile
    ? (myProfile?.id ?? null)
    : (params.userId ?? null);

  const { data: userVideos = [], isLoading: videosLoading } =
    useUserVideos(profileId);
  const { data: likedVideos = [] } = useMyLikedVideos();

  const profile = isOwnProfile ? myProfile : otherProfile;
  const isLoading = isOwnProfile ? myLoading : otherLoading;

  // ── Guards ──
  if (!isAuthenticated && isOwnProfile) {
    return (
      <div
        className="flex-1 flex flex-col items-center justify-center py-24 gap-4"
        data-ocid="profile.error_state"
      >
        <User size={48} className="text-muted-foreground" />
        <p className="text-muted-foreground text-sm">
          Sign in to view your profile.
        </p>
      </div>
    );
  }

  if (isLoading || (isOwnProfile && !myProfile && myLoading)) {
    return <ProfileSkeleton />;
  }

  if (!profile) {
    return (
      <div
        className="flex-1 flex flex-col items-center justify-center py-24 gap-4"
        data-ocid="profile.error_state"
      >
        <User size={48} className="text-muted-foreground" />
        <p className="text-muted-foreground">Profile not found.</p>
      </div>
    );
  }

  const initials = profile.username.slice(0, 2).toUpperCase();

  return (
    <div className="flex-1 bg-background" data-ocid="profile.page">
      {/* ── Profile Hero Band ── */}
      <div className="bg-card border-b border-border">
        <div className="container max-w-5xl py-10">
          <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <div
                className={`w-24 h-24 rounded-full bg-secondary border-2 flex items-center justify-center font-display text-3xl font-bold text-foreground select-none ${profile.isPremium ? "border-accent" : "border-border"}`}
                style={
                  profile.isPremium
                    ? { boxShadow: "0 0 20px oklch(0.68 0.22 55 / 0.45)" }
                    : {}
                }
              >
                {initials}
              </div>
              {profile.isPremium && (
                <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-accent flex items-center justify-center border-2 border-background">
                  <Crown
                    size={13}
                    className="text-accent-foreground fill-accent-foreground"
                  />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground truncate">
                  {profile.username}
                </h1>
                {profile.isPremium && <PremiumBadge size="md" />}
              </div>

              {profile.bio ? (
                <p className="text-sm text-muted-foreground max-w-lg leading-relaxed mb-4">
                  {profile.bio}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground/50 italic mb-4">
                  {isOwnProfile
                    ? "No bio yet — add one in Settings."
                    : "No bio yet."}
                </p>
              )}

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-5">
                <div
                  className="flex items-center gap-1.5 text-sm"
                  data-ocid="profile.stats.videos"
                >
                  <Video size={15} className="text-primary" />
                  <span className="font-display font-bold text-foreground">
                    {profile.videoCount.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">Videos</span>
                </div>
                <div
                  className="flex items-center gap-1.5 text-sm"
                  data-ocid="profile.stats.likes"
                >
                  <Heart size={15} className="text-primary" />
                  <span className="font-display font-bold text-foreground">
                    {profile.totalLikes.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">Total Likes</span>
                </div>
                {profile.isPremium && (
                  <Badge
                    variant="outline"
                    className="border-primary/40 text-primary text-[11px] px-2 py-0.5 gap-1"
                    data-ocid="profile.premium_badge"
                  >
                    <Crown size={10} className="fill-primary" />
                    Premium Creator
                  </Badge>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Uploaded Videos Section ── */}
      <div className="bg-background">
        <div className="container max-w-5xl py-8">
          <div
            className="flex items-center gap-2 mb-5"
            data-ocid="profile.videos.section"
          >
            <Video size={16} className="text-primary" />
            <h2 className="font-display font-semibold text-foreground text-lg">
              {isOwnProfile ? "My Videos" : `${profile.username}'s Videos`}
            </h2>
            {!videosLoading && (
              <span className="text-muted-foreground text-sm ml-1">
                ({userVideos.length})
              </span>
            )}
          </div>

          {videosLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SKELETON_KEYS.map((k) => (
                <Skeleton
                  key={k}
                  className="aspect-video rounded-lg skeleton-shimmer"
                />
              ))}
            </div>
          ) : userVideos.length === 0 ? (
            <div
              className="text-center py-16 rounded-xl border border-dashed border-border bg-card/40"
              data-ocid="profile.videos.empty_state"
            >
              <Video size={36} className="text-muted-foreground mx-auto mb-3" />
              <p className="font-display font-medium text-foreground mb-1">
                {isOwnProfile ? "No videos yet" : "Nothing uploaded yet"}
              </p>
              <p className="text-muted-foreground text-sm">
                {isOwnProfile
                  ? "Share your first bus simulator ride with the community."
                  : "This creator hasn't posted anything yet."}
              </p>
              {isOwnProfile && (
                <Link
                  to="/upload"
                  data-ocid="profile.upload_button"
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-display font-semibold hover:opacity-90 transition-smooth"
                >
                  Upload a Video
                </Link>
              )}
            </div>
          ) : (
            <motion.div
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
              data-ocid="profile.videos.list"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.07 } },
                hidden: {},
              }}
            >
              {userVideos.map((video, i) => (
                <motion.div
                  key={video.id}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.35 }}
                >
                  <VideoCard video={video} index={i + 1} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* ── My Likes Section (own profile only) ── */}
      {isOwnProfile && (
        <div className="bg-muted/30 border-t border-border">
          <div className="container max-w-5xl py-8">
            <div
              className="flex items-center gap-2 mb-5"
              data-ocid="profile.liked.section"
            >
              <Heart size={16} className="text-primary fill-primary" />
              <h2 className="font-display font-semibold text-foreground text-lg">
                My Likes
              </h2>
              <span className="text-muted-foreground text-sm ml-1">
                ({likedVideos.length})
              </span>
            </div>

            {likedVideos.length === 0 ? (
              <div
                className="text-center py-12 rounded-xl border border-dashed border-border bg-card/30"
                data-ocid="profile.liked.empty_state"
              >
                <Heart
                  size={32}
                  className="text-muted-foreground mx-auto mb-3"
                />
                <p className="font-display font-medium text-foreground mb-1">
                  No liked videos yet
                </p>
                <p className="text-muted-foreground text-sm">
                  Videos you heart will appear here.
                </p>
                <Link
                  to="/feed"
                  data-ocid="profile.liked.browse_button"
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-display font-semibold hover:opacity-90 transition-smooth"
                >
                  Browse Videos
                </Link>
              </div>
            ) : (
              <motion.div
                className="grid sm:grid-cols-2 gap-3"
                data-ocid="profile.liked.list"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.05 } },
                  hidden: {},
                }}
              >
                {likedVideos.map((video, i) => (
                  <motion.div
                    key={video.id}
                    variants={{
                      hidden: { opacity: 0, x: -12 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <LikedCard
                      video={{
                        id: video.id,
                        title: video.title,
                        thumbnailUrl: video.thumbnailUrl,
                        creatorName: video.creatorName,
                        creatorId: video.creatorId,
                        likeCount: video.likeCount,
                      }}
                      index={i + 1}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
