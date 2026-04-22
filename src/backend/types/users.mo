import Common "common";

module {
  public type UserId = Common.UserId;
  public type Timestamp = Common.Timestamp;

  public type UserProfile = {
    id : UserId;
    username : Text;
    bio : Text;
    isPremium : Bool;
    createdAt : Timestamp;
  };

  // Shared-safe profile for API responses
  public type UserProfilePublic = {
    id : UserId;
    username : Text;
    bio : Text;
    isPremium : Bool;
    videoCount : Nat;
    totalLikesReceived : Nat;
    followerCount : Nat;
    followingCount : Nat;
  };

  // Mutable internal type for profile storage
  public type UserProfileInternal = {
    id : UserId;
    var username : Text;
    var bio : Text;
    var isPremium : Bool;
    createdAt : Timestamp;
  };
};
