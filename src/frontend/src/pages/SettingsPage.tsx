import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  CheckCircle2,
  Crown,
  ExternalLink,
  Save,
  Settings,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PremiumBadge } from "../components/PremiumBadge";
import { useAuth } from "../hooks/useAuth";
import {
  useCreateCheckoutSession,
  useMyProfile,
  usePremiumStatus,
  useRegisterUser,
  useSaveProfile,
} from "../hooks/useBackend";

const PREMIUM_PERKS = [
  "Golden crown badge on your profile and all videos",
  "Stand out in the community feed",
  "Priority visibility in the video feed",
  "Exclusive premium community status",
];

export function SettingsPage() {
  const { isAuthenticated } = useAuth();
  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const { data: premiumStatus } = usePremiumStatus();
  const saveProfile = useSaveProfile();
  const registerUser = useRegisterUser();
  const createCheckout = useCreateCheckoutSession();

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (profile) {
      setUsername(profile.username);
      setBio(profile.bio);
    }
  }, [profile]);

  if (!isAuthenticated) {
    return (
      <div
        className="container py-20 text-center"
        data-ocid="settings.error_state"
      >
        <AlertCircle size={40} className="text-muted-foreground mx-auto mb-4" />
        <p className="font-display text-lg font-semibold text-foreground mb-1">
          Sign in required
        </p>
        <p className="text-muted-foreground text-sm">
          You need an account to access settings.
        </p>
      </div>
    );
  }

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) {
      registerUser.mutate(
        { username, bio },
        {
          onSuccess: () => toast.success("Profile created!"),
          onError: () => toast.error("Failed to create profile"),
        },
      );
      return;
    }
    saveProfile.mutate(
      { username, bio },
      {
        onSuccess: () => toast.success("Profile saved!"),
        onError: () => toast.error("Failed to save profile"),
      },
    );
  }

  function handleUpgradeToPremium() {
    createCheckout.mutate(undefined, {
      onSuccess: (session) => {
        if (!session?.url) {
          toast.error("Could not start checkout. Please try again.");
          return;
        }
        window.location.href = session.url;
      },
      onError: () => toast.error("Failed to start checkout. Please try again."),
    });
  }

  const isSaving = saveProfile.isPending || registerUser.isPending;

  return (
    <div className="flex-1 bg-background" data-ocid="settings.page">
      <div className="container max-w-2xl py-10 animate-fade-up">
        {/* Page header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <Settings size={18} className="text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground leading-tight">
              Account Settings
            </h1>
            <p className="text-xs text-muted-foreground">
              Manage your Global Gamers profile
            </p>
          </div>
        </div>

        {/* Profile section */}
        <section
          className="bg-card border border-border rounded-xl p-6 mb-4"
          data-ocid="settings.profile.section"
        >
          <div className="flex items-center gap-2 mb-5">
            <User size={15} className="text-primary" />
            <h2 className="font-display text-sm font-semibold text-foreground uppercase tracking-wider">
              Profile
            </h2>
          </div>

          {profileLoading ? (
            <div className="space-y-4" data-ocid="settings.loading_state">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-20 w-full" />
              </div>
              <Skeleton className="h-9 w-28" />
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="settings-username"
                  className="font-display text-sm"
                >
                  Username{" "}
                  <span className="text-destructive" aria-hidden>
                    *
                  </span>
                </Label>
                <Input
                  id="settings-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="RouteMasterUK"
                  required
                  maxLength={32}
                  data-ocid="settings.username.input"
                  className="bg-background border-input font-body"
                />
                <p className="text-xs text-muted-foreground">
                  This is your public display name across Global Gamers.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="settings-bio" className="font-display text-sm">
                  Bio
                </Label>
                <Textarea
                  id="settings-bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Bus enthusiast exploring routes across Europe and beyond..."
                  rows={3}
                  maxLength={200}
                  data-ocid="settings.bio.textarea"
                  className="bg-background border-input resize-none font-body"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {bio.length}/200
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  type="submit"
                  disabled={isSaving || !username.trim()}
                  className="bg-primary text-primary-foreground hover:opacity-90 font-display font-semibold transition-smooth"
                  data-ocid="settings.save_button"
                >
                  <Save size={14} className="mr-1.5" />
                  {isSaving
                    ? "Saving…"
                    : profile
                      ? "Save Changes"
                      : "Create Profile"}
                </Button>

                {(saveProfile.isSuccess || registerUser.isSuccess) && (
                  <span
                    className="flex items-center gap-1.5 text-sm text-primary animate-fade-in"
                    data-ocid="settings.success_state"
                  >
                    <CheckCircle2 size={14} />
                    Saved
                  </span>
                )}
              </div>

              {(saveProfile.isError || registerUser.isError) && (
                <p
                  className="text-sm text-destructive flex items-center gap-1.5"
                  data-ocid="settings.profile.error_state"
                >
                  <AlertCircle size={13} />
                  Failed to save. Please try again.
                </p>
              )}
            </form>
          )}
        </section>

        <Separator className="my-4 bg-border/50" />

        {/* Premium section */}
        <section
          className="bg-card border border-border rounded-xl p-6"
          data-ocid="settings.premium.section"
        >
          <div className="flex items-center gap-2 mb-5">
            <Crown size={15} className="text-accent" />
            <h2 className="font-display text-sm font-semibold text-foreground uppercase tracking-wider">
              Premium Membership
            </h2>
          </div>

          {premiumStatus?.isPremium ? (
            /* Already premium */
            <div
              className="flex items-start gap-4 p-4 rounded-xl bg-accent/10 border border-accent/40"
              style={{ boxShadow: "0 0 20px oklch(0.68 0.22 55 / 0.15)" }}
              data-ocid="settings.premium.active_state"
            >
              <Crown
                size={28}
                className="text-accent fill-accent shrink-0 mt-0.5"
              />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="font-display font-bold text-foreground">
                    You're a Premium Member
                  </span>
                  <PremiumBadge />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your golden crown badge is visible on your profile and all
                  your videos across the community.
                </p>
              </div>
            </div>
          ) : (
            /* Upgrade prompt */
            <div data-ocid="settings.premium.upgrade_section">
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Unlock the full Global Gamers experience with a one-time Premium
                membership. Stand out from the crowd with an exclusive golden
                crown badge.
              </p>

              <ul className="space-y-2.5 mb-6">
                {PREMIUM_PERKS.map((perk) => (
                  <li
                    key={perk}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle2
                      size={14}
                      className="text-accent mt-0.5 shrink-0"
                    />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <Button
                  onClick={handleUpgradeToPremium}
                  disabled={createCheckout.isPending}
                  className="bg-accent text-accent-foreground hover:opacity-90 font-display font-bold gap-2 transition-smooth"
                  style={{ boxShadow: "0 0 12px oklch(0.68 0.22 55 / 0.3)" }}
                  data-ocid="settings.upgrade_button"
                >
                  <Crown size={15} />
                  {createCheckout.isPending
                    ? "Redirecting to checkout…"
                    : "Upgrade to Premium"}
                  {!createCheckout.isPending && (
                    <ExternalLink size={12} className="opacity-60" />
                  )}
                </Button>

                <p className="text-xs text-muted-foreground">
                  Secure checkout via Stripe
                </p>
              </div>

              {createCheckout.isError && (
                <p
                  className="text-sm text-destructive mt-3 flex items-center gap-1.5"
                  data-ocid="settings.upgrade.error_state"
                >
                  <AlertCircle size={13} />
                  Failed to start checkout. Please try again.
                </p>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
