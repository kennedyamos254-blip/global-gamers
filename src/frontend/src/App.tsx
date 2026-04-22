import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Layout } from "./components/Layout";
import { useAuth } from "./hooks/useAuth";
import { FeedPage } from "./pages/FeedPage";
import { LandingPage } from "./pages/LandingPage";
import { PaymentCancelPage } from "./pages/PaymentCancelPage";
import { PaymentSuccessPage } from "./pages/PaymentSuccessPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SettingsPage } from "./pages/SettingsPage";
import { UploadPage } from "./pages/UploadPage";
import { VideoPage } from "./pages/VideoPage";

// Root route with layout
const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
      <Toaster position="bottom-right" theme="dark" />
    </Layout>
  ),
});

// Routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: IndexPage,
});

const feedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/feed",
  component: FeedPage,
});

const videoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/video/$videoId",
  component: VideoPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilePage,
});

const userProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/user/$userId",
  component: ProfilePage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: SettingsPage,
});

const uploadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/upload",
  component: UploadPage,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-success",
  component: PaymentSuccessPage,
});

const paymentCancelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-cancel",
  component: PaymentCancelPage,
});

function IndexPage() {
  const { isAuthenticated, isInitializing } = useAuth();
  if (isInitializing) return null;
  if (isAuthenticated) return <FeedPage />;
  return <LandingPage />;
}

const routeTree = rootRoute.addChildren([
  indexRoute,
  feedRoute,
  videoRoute,
  profileRoute,
  userProfileRoute,
  settingsRoute,
  uploadRoute,
  paymentSuccessRoute,
  paymentCancelRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
