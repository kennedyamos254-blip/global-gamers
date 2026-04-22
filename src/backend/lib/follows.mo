import Map "mo:core/Map";
import Set "mo:core/Set";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";

module {
  public type UserId = Principal;
  public type FollowsState = Map.Map<Principal, Set.Set<Principal>>;

  /// Follow a user. follower subscribes to followee.
  public func follow(follower : UserId, followee : UserId, follows : FollowsState) {
    let existing = switch (follows.get(follower)) {
      case (?s) { s };
      case null {
        let s = Set.empty<Principal>();
        follows.add(follower, s);
        s;
      };
    };
    existing.add(followee);
  };

  /// Unfollow a user.
  public func unfollow(follower : UserId, followee : UserId, follows : FollowsState) {
    switch (follows.get(follower)) {
      case (?s) { s.remove(followee) };
      case null {};
    };
  };

  /// Get all followers of a user (principals who follow userId).
  public func getFollowers(userId : UserId, follows : FollowsState) : [UserId] {
    follows.entries()
      .filter(func((_, following) : (Principal, Set.Set<Principal>)) : Bool {
        following.contains(userId)
      })
      .map<(Principal, Set.Set<Principal>), Principal>(func((follower, _)) { follower })
      .toArray();
  };

  /// Get all users that userId is following.
  public func getFollowing(userId : UserId, follows : FollowsState) : [UserId] {
    switch (follows.get(userId)) {
      case (?s) { s.toArray() };
      case null { [] };
    };
  };

  /// Check whether follower is following followee.
  public func isFollowing(follower : UserId, followee : UserId, follows : FollowsState) : Bool {
    switch (follows.get(follower)) {
      case (?s) { s.contains(followee) };
      case null { false };
    };
  };

  /// Count how many principals follow userId.
  public func followerCount(userId : UserId, follows : FollowsState) : Nat {
    follows.values()
      .filter(func(s : Set.Set<Principal>) : Bool { s.contains(userId) })
      .size();
  };

  /// Count how many users userId is following.
  public func followingCount(userId : UserId, follows : FollowsState) : Nat {
    switch (follows.get(userId)) {
      case (?s) { s.size() };
      case null { 0 };
    };
  };
};
