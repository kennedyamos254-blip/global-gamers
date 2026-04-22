import Map "mo:core/Map";
import Set "mo:core/Set";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Storage "mo:caffeineai-object-storage/Storage";
import AccessControl "mo:caffeineai-authorization/access-control";
import UserTypes "../types/users";
import VideoTypes "../types/videos";
import VideosLib "../lib/videos";

mixin (
  accessControlState : AccessControl.AccessControlState,
  users : Map.Map<Principal, UserTypes.UserProfileInternal>,
  videos : Map.Map<Nat, VideoTypes.VideoInternal>,
  likes : Map.Map<Nat, Set.Set<Principal>>,
  nextVideoId : { var value : Nat },
) {
  /// Upload a new video. Caller must be authenticated and have a profile.
  public shared ({ caller }) func uploadVideo(
    title : Text,
    description : Text,
    blob : Storage.ExternalBlob,
  ) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in to upload");
    };
    if (not users.containsKey(caller)) {
      Runtime.trap("Profile required: Please create a profile before uploading");
    };
    let id = nextVideoId.value;
    nextVideoId.value += 1;
    let video = VideosLib.newVideo(id, caller, title, description, blob);
    videos.add(id, video);
    id;
  };

  /// Delete a video. Only the owner may delete their video.
  public shared ({ caller }) func deleteVideo(videoId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    switch (videos.get(videoId)) {
      case (?video) {
        if (not Principal.equal(video.owner, caller)) {
          Runtime.trap("Unauthorized: Only the owner can delete this video");
        };
        videos.remove(videoId);
      };
      case null { Runtime.trap("Video not found") };
    };
  };

  /// Get the main feed — all public videos sorted most recent first.
  public query func getVideos() : async [VideoTypes.Video] {
    VideosLib.getFeed(videos, users, likes);
  };

  /// Get a single video by id.
  public query func getVideo(videoId : Nat) : async ?VideoTypes.Video {
    switch (videos.get(videoId)) {
      case (?v) {
        let ownerUsername = switch (users.get(v.owner)) {
          case (?u) { u.username };
          case null { "" };
        };
        let ownerIsPremium = switch (users.get(v.owner)) {
          case (?u) { u.isPremium };
          case null { false };
        };
        let likeCount = switch (likes.get(videoId)) {
          case (?s) { s.size() };
          case null { 0 };
        };
        ?v.toPublic(ownerUsername, likeCount, ownerIsPremium);
      };
      case null { null };
    };
  };

  /// Get all videos uploaded by a specific user.
  public query func getUserVideos(userId : Principal) : async [VideoTypes.Video] {
    VideosLib.getByOwner(userId, videos, users, likes);
  };

  /// Get videos liked by the caller.
  public query ({ caller }) func getLikedVideos() : async [VideoTypes.Video] {
    VideosLib.getLikedVideos(caller, videos, users, likes);
  };
};
