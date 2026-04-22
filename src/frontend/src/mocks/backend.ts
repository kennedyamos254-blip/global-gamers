import type { backendInterface } from "../backend";
import { ExternalBlob, UserRole } from "../backend";

const mockBlob = ExternalBlob.fromURL(
  "/assets/generated/hero-bus-sim.dim_1400x600.jpg",
);

export const mockBackend = {
  activatePremium: async () => undefined,

  assignCallerUserRole: async () => undefined,

  createCheckoutSession: async () =>
    JSON.stringify({
      id: "cs_mock_session",
      url: "https://checkout.stripe.com/mock",
    }),

  deleteVideo: async () => undefined,

  getCallerUserProfile: async () => ({
    id: "principal-mock-user-1" as unknown as ReturnType<
      (typeof import("@icp-sdk/core/principal"))["Principal"]["fromText"]
    >,
    bio: "Bus simulator enthusiast. 500+ routes completed.",
    username: "Routemaster99",
    videoCount: BigInt(4),
    isPremium: true,
    totalLikesReceived: BigInt(312),
  }),

  getCallerUserRole: async () => UserRole.user,

  getLikeCount: async () => BigInt(42),

  getLikedVideos: async () => [
    {
      id: BigInt(3),
      title: "Night Route Through the City",
      likeCount: BigInt(28),
      owner: "principal-mock-user-2" as unknown as ReturnType<
        (typeof import("@icp-sdk/core/principal"))["Principal"]["fromText"]
      >,
      blob: mockBlob,
      createdAt: BigInt(Date.now() - 1000 * 60 * 60 * 5),
      description: "Beautiful night time route through downtown.",
      ownerIsPremium: false,
      ownerUsername: "NightDriver",
    },
  ],

  getStripeSessionStatus: async () => ({
    __kind__: "completed" as const,
    completed: { userPrincipal: "principal-mock-user-1", response: "" },
  }),

  getUserPremiumStatus: async () => false,

  getUserProfile: async () => ({
    id: "principal-mock-user-2" as unknown as ReturnType<
      (typeof import("@icp-sdk/core/principal"))["Principal"]["fromText"]
    >,
    bio: "Road veteran of the virtual highways.",
    username: "NightDriver",
    videoCount: BigInt(2),
    isPremium: false,
    totalLikesReceived: BigInt(87),
  }),

  getUserVideos: async () => [
    {
      id: BigInt(3),
      title: "Night Route Through the City",
      likeCount: BigInt(28),
      owner: "principal-mock-user-2" as unknown as ReturnType<
        (typeof import("@icp-sdk/core/principal"))["Principal"]["fromText"]
      >,
      blob: mockBlob,
      createdAt: BigInt(Date.now() - 1000 * 60 * 60 * 5),
      description: "Beautiful night time route through downtown.",
      ownerIsPremium: false,
      ownerUsername: "NightDriver",
    },
  ],

  getVideo: async () => ({
    id: BigInt(1),
    title: "Epic Bus Rally — Mountain Pass Run",
    likeCount: BigInt(112),
    owner: "principal-mock-user-1" as unknown as ReturnType<
      (typeof import("@icp-sdk/core/principal"))["Principal"]["fromText"]
    >,
    blob: mockBlob,
    createdAt: BigInt(Date.now() - 1000 * 60 * 60 * 2),
    description:
      "Took Bus 42 through the mountain pass at full speed. Nail-biting corners, stunning views, and zero passengers lost.",
    ownerIsPremium: true,
    ownerUsername: "Routemaster99",
  }),

  getVideos: async () => [
    {
      id: BigInt(1),
      title: "Epic Bus Rally — Mountain Pass Run",
      likeCount: BigInt(112),
      owner: "principal-mock-user-1" as unknown as ReturnType<
        (typeof import("@icp-sdk/core/principal"))["Principal"]["fromText"]
      >,
      blob: mockBlob,
      createdAt: BigInt(Date.now() - 1000 * 60 * 60 * 2),
      description:
        "Took Bus 42 through the mountain pass at full speed. Nail-biting corners, stunning views, and zero passengers lost.",
      ownerIsPremium: true,
      ownerUsername: "Routemaster99",
    },
    {
      id: BigInt(2),
      title: "Coastal Highway Speedrun — New Record!",
      likeCount: BigInt(89),
      owner: "principal-mock-user-1" as unknown as ReturnType<
        (typeof import("@icp-sdk/core/principal"))["Principal"]["fromText"]
      >,
      blob: mockBlob,
      createdAt: BigInt(Date.now() - 1000 * 60 * 60 * 10),
      description: "Coastal highway in under 8 minutes. Premium bus, max grip.",
      ownerIsPremium: true,
      ownerUsername: "Routemaster99",
    },
    {
      id: BigInt(3),
      title: "Night Route Through the City",
      likeCount: BigInt(28),
      owner: "principal-mock-user-2" as unknown as ReturnType<
        (typeof import("@icp-sdk/core/principal"))["Principal"]["fromText"]
      >,
      blob: mockBlob,
      createdAt: BigInt(Date.now() - 1000 * 60 * 60 * 24),
      description: "Beautiful night time route through downtown.",
      ownerIsPremium: false,
      ownerUsername: "NightDriver",
    },
  ],

  hasLiked: async () => false,

  isCallerAdmin: async () => false,

  isPremiumMember: async () => true,

  isStripeConfigured: async () => true,

  likeVideo: async () => undefined,

  registerUser: async () => undefined,

  saveCallerUserProfile: async () => undefined,

  setStripeConfiguration: async () => undefined,

  transform: async (input) => ({
    status: BigInt(200),
    body: input.response.body,
    headers: input.response.headers,
  }),

  unlikeVideo: async () => undefined,

  updateUserProfile: async () => undefined,

  uploadVideo: async () => BigInt(99),
} satisfies Partial<backendInterface> as unknown as backendInterface;
