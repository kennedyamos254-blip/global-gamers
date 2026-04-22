import Map "mo:core/Map";
import Set "mo:core/Set";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import UserTypes "../types/users";
import VideoTypes "../types/videos";
import UsersLib "../lib/users";
import FollowsLib "../lib/follows";

mixin (
  accessControlState : AccessControl.AccessControlState,
  users : Map.Map<Principal, UserTypes.UserProfileInternal>,
  videos : Map.Map<Nat, VideoTypes.VideoInternal>,
  likes : Map.Map<Nat, Set.Set<Principal>>,
  follows : Map.Map<Principal, Set.Set<Principal>>,
) {
  /// Register a new user profile. Caller must be authenticated.
  public shared ({ caller }) func registerUser(username : Text, bio : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in to register");
    };
    if (users.containsKey(caller)) {
      Runtime.trap("Profile already exists");
    };
    let profile = UsersLib.newProfile(caller, username, bio);
    users.add(caller, profile);
  };

  /// Get the caller's own profile.
  public query ({ caller }) func getCallerUserProfile() : async ?UserTypes.UserProfilePublic {
    switch (users.get(caller)) {
      case (?profile) {
        let videoCount = UsersLib.getVideoCount(caller, videos);
        let totalLikes = UsersLib.getTotalLikesReceived(caller, videos, likes);
        let fwrCount = FollowsLib.followerCount(caller, follows);
        let fwgCount = FollowsLib.followingCount(caller, follows);
        ?profile.toPublic(videoCount, totalLikes, fwrCount, fwgCount);
      };
      case null { null };
    };
  };

  /// Update caller's username and bio.
  public shared ({ caller }) func updateUserProfile(username : Text, bio : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    switch (users.get(caller)) {
      case (?profile) { profile.updateProfile(username, bio) };
      case null { Runtime.trap("Profile not found") };
    };
  };

  /// Get any user's public profile by principal.
  public query func getUserProfile(userId : Principal) : async ?UserTypes.UserProfilePublic {
    switch (users.get(userId)) {
      case (?profile) {
        let videoCount = UsersLib.getVideoCount(userId, videos);
        let totalLikes = UsersLib.getTotalLikesReceived(userId, videos, likes);
        let fwrCount = FollowsLib.followerCount(userId, follows);
        let fwgCount = FollowsLib.followingCount(userId, follows);
        ?profile.toPublic(videoCount, totalLikes, fwrCount, fwgCount);
      };
      case null { null };
    };
  };

  /// Save (upsert) the caller's profile — used by authorization extension flow.
  public shared ({ caller }) func saveCallerUserProfile(profile : UserTypes.UserProfilePublic) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    switch (users.get(caller)) {
      case (?existing) {
        existing.updateProfile(profile.username, profile.bio);
      };
      case null {
        let newProfile = UsersLib.newProfile(caller, profile.username, profile.bio);
        users.add(caller, newProfile);
      };
    };
  };
};
