import Map "mo:core/Map";
import Set "mo:core/Set";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import Stripe "mo:caffeineai-stripe/stripe";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import UserTypes "types/users";
import VideoTypes "types/videos";
import UsersMixin "mixins/users-api";
import VideosMixin "mixins/videos-api";
import LikesMixin "mixins/likes-api";
import PremiumMixin "mixins/premium-api";
import FollowsMixin "mixins/follows-api";

actor {
  // --- Authorization ---
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // --- Object Storage ---
  include MixinObjectStorage();

  // --- Domain State ---
  let users = Map.empty<Principal, UserTypes.UserProfileInternal>();
  let videos = Map.empty<Nat, VideoTypes.VideoInternal>();
  let likes = Map.empty<Nat, Set.Set<Principal>>();
  let follows = Map.empty<Principal, Set.Set<Principal>>();
  let nextVideoId = { var value : Nat = 0 };
  var stripeConfiguration : ?Stripe.StripeConfiguration = null;

  // --- Mixins ---
  include UsersMixin(accessControlState, users, videos, likes, follows);
  include VideosMixin(accessControlState, users, videos, likes, nextVideoId);
  include LikesMixin(accessControlState, videos, likes);
  include PremiumMixin(accessControlState, users);
  include FollowsMixin(accessControlState, follows);

  // --- Stripe (required directly in actor) ---
  public query func isStripeConfigured() : async Bool {
    stripeConfiguration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can configure Stripe");
    };
    stripeConfiguration := ?config;
  };

  func getStripeConfig() : Stripe.StripeConfiguration {
    switch (stripeConfiguration) {
      case (null) { Runtime.trap("Stripe is not configured") };
      case (?cfg) { cfg };
    };
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfig(), caller, items, successUrl, cancelUrl, transform);
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfig(), sessionId, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };
};
