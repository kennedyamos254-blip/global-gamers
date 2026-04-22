import Common "common";

module {
  public type UserId = Common.UserId;
  public type Timestamp = Common.Timestamp;

  public type FollowEntry = {
    follower : UserId;
    followee : UserId;
    createdAt : Timestamp;
  };
};
