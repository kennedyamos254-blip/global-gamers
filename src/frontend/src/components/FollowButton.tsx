import { Button } from "@/components/ui/button";
import { UserCheck, UserPlus } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import {
  useFollowUser,
  useIsFollowing,
  useUnfollowUser,
} from "../hooks/useBackend";

interface FollowButtonProps {
  userId: string;
  size?: "sm" | "default";
}

export function FollowButton({ userId, size = "default" }: FollowButtonProps) {
  const { isAuthenticated } = useAuth();
  const { data: isFollowing, isLoading } = useIsFollowing(
    isAuthenticated ? userId : null,
  );
  const followMutation = useFollowUser();
  const unfollowMutation = useUnfollowUser();

  const isPending = followMutation.isPending || unfollowMutation.isPending;

  const handleClick = () => {
    if (!isAuthenticated || isPending) return;
    if (isFollowing) {
      unfollowMutation.mutate(userId);
    } else {
      followMutation.mutate(userId);
    }
  };

  if (!isAuthenticated) {
    return (
      <Button
        size={size}
        variant="outline"
        disabled
        title="Sign in to follow creators"
        data-ocid="profile.follow_button"
        className="gap-1.5 opacity-60 cursor-not-allowed"
      >
        <UserPlus size={14} />
        Follow
      </Button>
    );
  }

  return (
    <Button
      size={size}
      variant={isFollowing ? "outline" : "default"}
      onClick={handleClick}
      disabled={isLoading || isPending}
      data-ocid="profile.follow_button"
      className="gap-1.5 font-display font-semibold transition-smooth"
    >
      {isFollowing ? (
        <>
          <UserCheck size={14} />
          Following
        </>
      ) : (
        <>
          <UserPlus size={14} />
          Follow
        </>
      )}
    </Button>
  );
}
