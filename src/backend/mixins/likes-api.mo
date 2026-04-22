import Map "mo:core/Map";
import Set "mo:core/Set";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import UserTypes "../types/users";
import VideoTypes "../types/videos";
import LikesLib "../lib/likes";

mixin (
  accessControlState : AccessControl.AccessControlState,
  videos : Map.Map<Nat, VideoTypes.VideoInternal>,
  likes : Map.Map<Nat, Set.Set<Principal>>,
) {
  /// Like a video. Caller must be authenticated.
  public shared ({ caller }) func likeVideo(videoId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in to like videos");
    };
    if (not videos.containsKey(videoId)) {
      Runtime.trap("Video not found");
    };
    LikesLib.likeVideo(videoId, caller, likes);
  };

  /// Unlike a video. Caller must be authenticated.
  public shared ({ caller }) func unlikeVideo(videoId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in to unlike videos");
    };
    LikesLib.unlikeVideo(videoId, caller, likes);
  };

  /// Check whether the caller has liked a specific video.
  public query ({ caller }) func hasLiked(videoId : Nat) : async Bool {
    LikesLib.isLiked(videoId, caller, likes);
  };

  /// Get the like count for a video.
  public query func getLikeCount(videoId : Nat) : async Nat {
    LikesLib.getLikeCount(videoId, likes);
  };
};
