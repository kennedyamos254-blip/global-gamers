import { useInternetIdentity } from "@caffeineai/core-infrastructure";

export function useAuth() {
  const {
    identity,
    login,
    clear,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
  } = useInternetIdentity();

  const userId = identity?.getPrincipal().toText() ?? null;

  return {
    identity,
    userId,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    login,
    logout: clear,
  };
}
