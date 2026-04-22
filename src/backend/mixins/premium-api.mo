import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import UserTypes "../types/users";
import PremiumLib "../lib/premium";

mixin (
  accessControlState : AccessControl.AccessControlState,
  users : Map.Map<Principal, UserTypes.UserProfileInternal>,
) {
  /// Activate premium for the caller after a verified payment.
  public shared ({ caller }) func activatePremium() : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    PremiumLib.activatePremium(caller, users);
  };

  /// Check whether the caller has an active premium membership.
  public query ({ caller }) func isPremiumMember() : async Bool {
    PremiumLib.isPremium(caller, users);
  };

  /// Check whether a specific user has premium.
  public query func getUserPremiumStatus(userId : Principal) : async Bool {
    PremiumLib.isPremium(userId, users);
  };
};
