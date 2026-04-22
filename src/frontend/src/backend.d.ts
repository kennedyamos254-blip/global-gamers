import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Video {
    id: VideoId;
    title: string;
    likeCount: bigint;
    owner: UserId;
    blob: ExternalBlob;
    createdAt: Timestamp;
    description: string;
    ownerIsPremium: boolean;
    ownerUsername: string;
}
export type Timestamp = bigint;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface UserProfilePublic {
    id: UserId;
    bio: string;
    username: string;
    videoCount: bigint;
    isPremium: boolean;
    followerCount: bigint;
    followingCount: bigint;
    totalLikesReceived: bigint;
}
export interface http_header {
    value: string;
    name: string;
}
export type UserId = Principal;
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type VideoId = bigint;
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    activatePremium(): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    deleteVideo(videoId: bigint): Promise<void>;
    followUser(userId: UserId): Promise<void>;
    getCallerUserProfile(): Promise<UserProfilePublic | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFollowers(userId: UserId): Promise<Array<UserId>>;
    getFollowing(userId: UserId): Promise<Array<UserId>>;
    getLikeCount(videoId: bigint): Promise<bigint>;
    getLikedVideos(): Promise<Array<Video>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserPremiumStatus(userId: Principal): Promise<boolean>;
    getUserProfile(userId: Principal): Promise<UserProfilePublic | null>;
    getUserVideos(userId: Principal): Promise<Array<Video>>;
    getVideo(videoId: bigint): Promise<Video | null>;
    getVideos(): Promise<Array<Video>>;
    hasLiked(videoId: bigint): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    isFollowing(userId: UserId): Promise<boolean>;
    isPremiumMember(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    likeVideo(videoId: bigint): Promise<void>;
    registerUser(username: string, bio: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfilePublic): Promise<void>;
    searchVideos(titleQuery: string): Promise<Array<Video>>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    unfollowUser(userId: UserId): Promise<void>;
    unlikeVideo(videoId: bigint): Promise<void>;
    updateUserProfile(username: string, bio: string): Promise<void>;
    uploadVideo(title: string, description: string, blob: ExternalBlob): Promise<bigint>;
}
