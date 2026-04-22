import Map "mo:core/Map";
import Set "mo:core/Set";
import Principal "mo:core/Principal";

module {
  public func likeVideo(
    videoId : Nat,
    caller : Principal,
    likes : Map.Map<Nat, Set.Set<Principal>>,
  ) {
    let likers = switch (likes.get(videoId)) {
      case (?s) { s };
      case null {
        let s = Set.empty<Principal>();
        likes.add(videoId, s);
        s;
      };
    };
    likers.add(caller);
  };

  public func unlikeVideo(
    videoId : Nat,
    caller : Principal,
    likes : Map.Map<Nat, Set.Set<Principal>>,
  ) {
    switch (likes.get(videoId)) {
      case (?s) { s.remove(caller) };
      case null {};
    };
  };

  public func isLiked(
    videoId : Nat,
    caller : Principal,
    likes : Map.Map<Nat, Set.Set<Principal>>,
  ) : Bool {
    switch (likes.get(videoId)) {
      case (?s) { s.contains(caller) };
      case null { false };
    };
  };

  public func getLikeCount(
    videoId : Nat,
    likes : Map.Map<Nat, Set.Set<Principal>>,
  ) : Nat {
    switch (likes.get(videoId)) {
      case (?s) { s.size() };
      case null { 0 };
    };
  };
};
