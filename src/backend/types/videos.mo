import Common "common";
import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type UserId = Common.UserId;
  public type VideoId = Common.VideoId;
  public type Timestamp = Common.Timestamp;

  public type VideoInternal = {
    id : VideoId;
    owner : UserId;
    title : Text;
    description : Text;
    blob : Storage.ExternalBlob;
    createdAt : Timestamp;
  };

  // Shared-safe video for API responses
  public type Video = {
    id : VideoId;
    owner : UserId;
    ownerUsername : Text;
    title : Text;
    description : Text;
    blob : Storage.ExternalBlob;
    likeCount : Nat;
    createdAt : Timestamp;
    ownerIsPremium : Bool;
  };
};
