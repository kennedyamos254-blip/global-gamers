import { useActor } from "@caffeineai/core-infrastructure";
import { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  PremiumStatus,
  ProfileUpdatePayload,
  UserProfile,
  Video,
  VideoUploadPayload,
} from "../types";
import { useAuth } from "./useAuth";

// Typed actor — backend methods will be available once bindgen is wired
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BackendActor = any;

function useBackendActor() {
  return useActor<BackendActor>(createActor as Parameters<typeof useActor>[0]);
}

// ── User Profile ──────────────────────────────────────────────────────────────

export function useMyProfile() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<UserProfile | null>({
    queryKey: ["myProfile"],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getCallerUserProfile();
      if (!result) return null;
      return mapProfile(result);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserProfile(userId: string | null) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      if (!actor || !userId) return null;
      const result = await actor.getUserProfile(Principal.fromText(userId));
      if (!result) return null;
      return mapProfile(result);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useRegisterUser() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      username,
      bio,
    }: { username: string; bio: string }) => {
      if (!actor) throw new Error("Not connected");
      await actor.registerUser(username, bio);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}

export function useSaveProfile() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ProfileUpdatePayload) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateUserProfile(payload.username, payload.bio);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}

// ── Videos ────────────────────────────────────────────────────────────────────

export function useVideos() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Video[]>({
    queryKey: ["videos"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getVideos();
      return (result ?? []).map(mapVideo);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchVideos(query: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Video[]>({
    queryKey: ["searchVideos", query],
    queryFn: async () => {
      if (!actor || !query) return [];
      const result = await actor.searchVideos(query);
      return (result ?? []).map(mapVideo);
    },
    enabled: !!actor && !isFetching && query.length > 0,
  });
}

export function useUserVideos(userId: string | null) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Video[]>({
    queryKey: ["userVideos", userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      const result = await actor.getUserVideos(Principal.fromText(userId));
      return (result ?? []).map(mapVideo);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useMyLikedVideos() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Video[]>({
    queryKey: ["myLikedVideos"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getLikedVideos();
      return (result ?? []).map(mapVideo);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useVideo(videoId: string | null) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Video | null>({
    queryKey: ["video", videoId],
    queryFn: async () => {
      if (!actor || !videoId) return null;
      const result = await actor.getVideo(BigInt(videoId));
      if (!result) return null;
      return mapVideo(result);
    },
    enabled: !!actor && !isFetching && !!videoId,
  });
}

export function useUploadVideo() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: VideoUploadPayload) => {
      if (!actor) throw new Error("Not connected");
      return actor.uploadVideo(
        payload.title,
        payload.description,
        payload.blob,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["videos"] });
      qc.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}

export function useDeleteVideo() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (videoId: string) => {
      if (!actor) throw new Error("Not connected");
      await actor.deleteVideo(BigInt(videoId));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["videos"] });
    },
  });
}

// ── Likes ─────────────────────────────────────────────────────────────────────

export function useLikeCount(videoId: string | null) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<number>({
    queryKey: ["likeCount", videoId],
    queryFn: async () => {
      if (!actor || !videoId) return 0;
      return Number(await actor.getLikeCount(BigInt(videoId)));
    },
    enabled: !!actor && !isFetching && !!videoId,
  });
}

export function useHasLiked(videoId: string | null) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<boolean>({
    queryKey: ["hasLiked", videoId],
    queryFn: async () => {
      if (!actor || !videoId) return false;
      return actor.hasLiked(BigInt(videoId));
    },
    enabled: !!actor && !isFetching && !!videoId,
  });
}

export function useLikeVideo() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (videoId: string) => {
      if (!actor) throw new Error("Not connected");
      await actor.likeVideo(BigInt(videoId));
    },
    onSuccess: (_d, videoId) => {
      qc.invalidateQueries({ queryKey: ["likeCount", videoId] });
      qc.invalidateQueries({ queryKey: ["hasLiked", videoId] });
    },
  });
}

export function useUnlikeVideo() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (videoId: string) => {
      if (!actor) throw new Error("Not connected");
      await actor.unlikeVideo(BigInt(videoId));
    },
    onSuccess: (_d, videoId) => {
      qc.invalidateQueries({ queryKey: ["likeCount", videoId] });
      qc.invalidateQueries({ queryKey: ["hasLiked", videoId] });
    },
  });
}

// ── Follow System ─────────────────────────────────────────────────────────────

export function useIsFollowing(userId: string | null) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<boolean>({
    queryKey: ["isFollowing", userId],
    queryFn: async () => {
      if (!actor || !userId) return false;
      return actor.isFollowing(Principal.fromText(userId));
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useGetFollowers(userId: string | null) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<string[]>({
    queryKey: ["followers", userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      const result = await actor.getFollowers(Principal.fromText(userId));
      return (result ?? []).map((p: Principal) => p.toText());
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useGetFollowing(userId: string | null) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<string[]>({
    queryKey: ["following", userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      const result = await actor.getFollowing(Principal.fromText(userId));
      return (result ?? []).map((p: Principal) => p.toText());
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useFollowUser() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  const { userId: myUserId } = useAuth();
  return useMutation({
    mutationFn: async (userId: string) => {
      if (!actor) throw new Error("Not connected");
      await actor.followUser(Principal.fromText(userId));
    },
    onSuccess: (_d, userId) => {
      qc.invalidateQueries({ queryKey: ["isFollowing", userId] });
      qc.invalidateQueries({ queryKey: ["followers", userId] });
      qc.invalidateQueries({ queryKey: ["userProfile", userId] });
      qc.invalidateQueries({ queryKey: ["myProfile"] });
      qc.invalidateQueries({ queryKey: ["following", myUserId] });
    },
  });
}

export function useUnfollowUser() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  const { userId: myUserId } = useAuth();
  return useMutation({
    mutationFn: async (userId: string) => {
      if (!actor) throw new Error("Not connected");
      await actor.unfollowUser(Principal.fromText(userId));
    },
    onSuccess: (_d, userId) => {
      qc.invalidateQueries({ queryKey: ["isFollowing", userId] });
      qc.invalidateQueries({ queryKey: ["followers", userId] });
      qc.invalidateQueries({ queryKey: ["userProfile", userId] });
      qc.invalidateQueries({ queryKey: ["myProfile"] });
      qc.invalidateQueries({ queryKey: ["following", myUserId] });
    },
  });
}

// ── Premium / Stripe ──────────────────────────────────────────────────────────

export function usePremiumStatus() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<PremiumStatus>({
    queryKey: ["premiumStatus"],
    queryFn: async () => {
      if (!actor) return { isPremium: false };
      const isPremium = await actor.isPremiumMember();
      return { isPremium: !!isPremium };
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateCheckoutSession() {
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const successUrl = `${baseUrl}/payment-success`;
      const cancelUrl = `${baseUrl}/payment-cancel`;
      const premiumItem = {
        productName: "Global Gamers Premium",
        currency: "usd",
        quantity: BigInt(1),
        priceInCents: BigInt(999),
        productDescription:
          "Lifetime Premium membership with golden crown badge",
      };
      const raw = await actor.createCheckoutSession(
        [premiumItem],
        successUrl,
        cancelUrl,
      );
      const session = JSON.parse(raw) as { id?: string; url?: string };
      if (!session?.url) throw new Error("Stripe session missing url");
      return { sessionId: session.id ?? "", url: session.url };
    },
  });
}

export function useActivatePremium() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_unused?: undefined) => {
      if (!actor) throw new Error("Not connected");
      await actor.activatePremium();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["premiumStatus"] });
      qc.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}

// ── Mappers ───────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProfile(raw: any): UserProfile {
  return {
    id: String(raw.id ?? raw.principal ?? ""),
    username: raw.username ?? "Unnamed Driver",
    bio: raw.bio ?? "",
    videoCount: Number(raw.videoCount ?? 0),
    totalLikes: Number(raw.totalLikesReceived ?? raw.totalLikes ?? 0),
    isPremium: !!raw.isPremium,
    createdAt: BigInt(0),
    followerCount: Number(raw.followerCount ?? 0),
    followingCount: Number(raw.followingCount ?? 0),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapVideo(raw: any): Video {
  return {
    id: String(raw.id ?? ""),
    title: raw.title ?? "Untitled",
    description: raw.description ?? "",
    creatorId: String(raw.owner ?? raw.creatorId ?? ""),
    creatorName: raw.ownerUsername ?? raw.creatorName ?? "Unknown Driver",
    creatorIsPremium: !!(raw.ownerIsPremium || raw.creatorIsPremium),
    thumbnailUrl:
      raw.thumbnailUrl ?? "/assets/generated/hero-bus-sim.dim_1400x600.jpg",
    videoUrl: raw.videoUrl ?? (raw.blob ? raw.blob.getDirectURL() : ""),
    likeCount: Number(raw.likeCount ?? 0),
    createdAt: BigInt(raw.createdAt ?? 0),
    tags: raw.tags ?? [],
  };
}
