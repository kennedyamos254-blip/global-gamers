import Common "common";

module {
  public type UserId = Common.UserId;
  public type Timestamp = Common.Timestamp;

  public type PremiumStatus = {
    isPremium : Bool;
    activatedAt : ?Timestamp;
  };
};
