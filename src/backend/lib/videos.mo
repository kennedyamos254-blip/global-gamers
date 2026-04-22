import Map "mo:core/Map";
import Set "mo:core/Set";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Storage "mo:caffeineai-object-storage/Storage";
import Types "../types/videos";
import UserTypes "../types/users";

module {
  public type Video = Types.Video;
  public type VideoInternal = Types.VideoInternal;

  public func newVideo(
    id : Nat,
    owner : Principal,
    title : Text,
    description : Text,
    blob : Storage.ExternalBlob,
  ) : VideoInternal {
    { id; owner; title; description; blob; createdAt = Time.now() };
  };

  public func toPublic(
    self : VideoInternal,
    ownerUsername : Text,
    likeCount : Nat,
    ownerIsPremium : Bool,
  ) : Video {
    {
      id = self.id;
      owner = self.owner;
      ownerUsername;
      title = self.title;
      description = self.description;
      blob = self.blob;
      likeCount;
      createdAt = self.createdAt;
      ownerIsPremium;
    };
  };

  // Helper: resolve a single VideoInternal to its public form
  func resolve(
    v : VideoInternal,
    users : Map.Map<Principal, UserTypes.UserProfileInternal>,
    likes : Map.Map<Nat, Set.Set<Principal>>,
  ) : Video {
    let ownerUsername = switch (users.get(v.owner)) {
      case (?u) { u.username };
      case null { "" };
    };
    let ownerIsPremium = switch (users.get(v.owner)) {
      case (?u) { u.isPremium };
      case null { false };
    };
    let likeCount = switch (likes.get(v.id)) {
      case (?s) { s.size() };
      case null { 0 };
    };
    toPublic(v, ownerUsername, likeCount, ownerIsPremium);
  };

  public func getFeed(
    videos : Map.Map<Nat, VideoInternal>,
    users : Map.Map<Principal, UserTypes.UserProfileInternal>,
    likes : Map.Map<Nat, Set.Set<Principal>>,
  ) : [Video] {
    let all = videos.values().map(func(v) { resolve(v, users, likes) }).toArray();
    all.sort(func(a : Video, b : Video) : Order.Order { Int.compare(b.createdAt, a.createdAt) });
  };

  public func getByOwner(
    ownerId : Principal,
    videos : Map.Map<Nat, VideoInternal>,
    users : Map.Map<Principal, UserTypes.UserProfileInternal>,
    likes : Map.Map<Nat, Set.Set<Principal>>,
  ) : [Video] {
    let owned = videos.values()
      .filter(func(v) { Principal.equal(v.owner, ownerId) })
      .map(func(v) { resolve(v, users, likes) })
      .toArray();
    owned.sort(func(a : Video, b : Video) : Order.Order { Int.compare(b.createdAt, a.createdAt) });
  };

  public func getLikedVideos(
    viewerId : Principal,
    videos : Map.Map<Nat, VideoInternal>,
    users : Map.Map<Principal, UserTypes.UserProfileInternal>,
    likes : Map.Map<Nat, Set.Set<Principal>>,
  ) : [Video] {
    let liked = videos.values()
      .filter(func(v) {
        switch (likes.get(v.id)) {
          case (?s) { s.contains(viewerId) };
          case null { false };
        };
      })
      .map(func(v) { resolve(v, users, likes) })
      .toArray();
    liked.sort(func(a : Video, b : Video) : Order.Order { Int.compare(b.createdAt, a.createdAt) });
  };
};
