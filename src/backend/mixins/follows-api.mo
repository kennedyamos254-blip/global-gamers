import Map "mo:core/Map";
import Set "mo:core/Set";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import CommonTypes "../types/common";
import FollowsLib "../lib/follows";

mixin (
  accessControlState : AccessControl.AccessControlState,
  follows : Map.Map<Principal, Set.Set<Principal>>,
) {
  /// Follow another user. Caller must be authenticated.
  public shared ({ caller }) func followUser(userId : CommonTypes.UserId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in to follow");
    };
    if (Principal.equal(caller, userId)) {
      Runtime.trap("Cannot follow yourself");
    };
    FollowsLib.follow(caller, userId, follows);
  };

  /// Unfollow a user. Caller must be authenticated.
  public shared ({ caller }) func unfollowUser(userId : CommonTypes.UserId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in to unfollow");
    };
    FollowsLib.unfollow(caller, userId, follows);
  };

  /// Get all followers of a user.
  public query func getFollowers(userId : CommonTypes.UserId) : async [CommonTypes.UserId] {
    FollowsLib.getFollowers(userId, follows);
  };

  /// Get all users that userId is following.
  public query func getFollowing(userId : CommonTypes.UserId) : async [CommonTypes.UserId] {
    FollowsLib.getFollowing(userId, follows);
  };

  /// Check if the caller is following a given user.
  public query ({ caller }) func isFollowing(userId : CommonTypes.UserId) : async Bool {
    FollowsLib.isFollowing(caller, userId, follows);
  };
};
