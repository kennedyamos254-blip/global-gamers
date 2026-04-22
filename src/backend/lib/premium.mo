import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import UserTypes "../types/users";

module {
  public func activatePremium(
    caller : Principal,
    users : Map.Map<Principal, UserTypes.UserProfileInternal>,
  ) {
    switch (users.get(caller)) {
      case (?profile) { profile.isPremium := true };
      case null { Runtime.trap("User profile not found") };
    };
  };

  public func isPremium(
    userId : Principal,
    users : Map.Map<Principal, UserTypes.UserProfileInternal>,
  ) : Bool {
    switch (users.get(userId)) {
      case (?profile) { profile.isPremium };
      case null { false };
    };
  };
};
