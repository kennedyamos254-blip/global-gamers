// Global Gamers — shared types matching backend contract

export interface UserProfile {
  id: string;
  username: string;
  bio: string;
  videoCount: number;
  totalLikes: number;
  isPremium: boolean;
  createdAt: bigint;
  followerCount: number;
  followingCount: number;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  creatorName: string;
  creatorIsPremium: boolean;
  thumbnailUrl: string;
  videoUrl: string;
  likeCount: number;
  createdAt: bigint;
  tags: string[];
}

export interface PremiumStatus {
  isPremium: boolean;
  activatedAt?: bigint;
}

export interface CheckoutSession {
  sessionId: string;
  url: string;
}

export interface VideoUploadPayload {
  title: string;
  description: string;
  blob: import("../backend").ExternalBlob;
}

export interface ProfileUpdatePayload {
  username: string;
  bio: string;
}

// Route params
export interface VideoRouteParams {
  videoId: string;
}

export interface ProfileRouteParams {
  userId: string;
}
