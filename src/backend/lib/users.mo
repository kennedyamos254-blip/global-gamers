import Map "mo:core/Map";
import Set "mo:core/Set";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Types "../types/users";
import VideoTypes "../types/videos";

module {
  public type UserProfile = Types.UserProfilePublic;
  public type UserProfileInternal = Types.UserProfileInternal;

  public func newProfile(id : Principal, username : Text, bio : Text) : UserProfileInternal {
    {
      id;
      var username;
      var bio;
      var isPremium = false;
      createdAt = Time.now();
    };
  };

  public func toPublic(
    self : UserProfileInternal,
    videoCount : Nat,
    totalLikesReceived : Nat,
    followerCount : Nat,
    followingCount : Nat,
  ) : UserProfile {
    {
      id = self.id;
      username = self.username;
      bio = self.bio;
      isPremium = self.isPremium;
      videoCount;
      totalLikesReceived;
      followerCount;
      followingCount;
    };
  };

  public func updateProfile(self : UserProfileInternal, username : Text, bio : Text) {
    self.username := username;
    self.bio := bio;
  };

  public func setPremium(self : UserProfileInternal, isPremium : Bool) {
    self.isPremium := isPremium;
  };

  public func getVideoCount(
    ownerId : Principal,
    videos : Map.Map<Nat, VideoTypes.VideoInternal>,
  ) : Nat {
    videos.values().filter(func(v) { Principal.equal(v.owner, ownerId) }).size();
  };

  public func getTotalLikesReceived(
    ownerId : Principal,
    videos : Map.Map<Nat, VideoTypes.VideoInternal>,
    likes : Map.Map<Nat, Set.Set<Principal>>,
  ) : Nat {
    videos.values()
      .filter(func(v) { Principal.equal(v.owner, ownerId) })
      .foldLeft(
        0,
        func(acc : Nat, v : VideoTypes.VideoInternal) : Nat {
          let count = switch (likes.get(v.id)) {
            case (?s) { s.size() };
            case null { 0 };
          };
          acc + count;
        },
      );
  };
};
