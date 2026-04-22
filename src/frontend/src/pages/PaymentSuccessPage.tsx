import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Crown, Loader2, TriangleAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { PremiumBadge } from "../components/PremiumBadge";
import { useActivatePremium } from "../hooks/useBackend";

type ActivationState = "pending" | "activating" | "success" | "error";

export function PaymentSuccessPage() {
  const navigate = useNavigate();
  const activatePremium = useActivatePremium();
  const [state, setState] = useState<ActivationState>("pending");
  const activated = useRef(false);

  const mutate = activatePremium.mutate;

  useEffect(() => {
    if (activated.current) return;
    activated.current = true;

    setState("activating");
    mutate(undefined, {
      onSuccess: () => {
        setState("success");
        toast.success("Premium activated! Welcome to the club! 👑");
      },
      onError: () => {
        setState("error");
      },
    });
  }, [mutate]);

  return (
    <div
      className="flex-1 flex items-center justify-center bg-background p-6"
      data-ocid="payment-success.page"
    >
      <div className="max-w-md w-full text-center animate-fade-up">
        {(state === "pending" || state === "activating") && (
          <div data-ocid="payment-success.loading_state">
            <div className="flex items-center justify-center mb-5">
              <div
                className="p-5 rounded-full bg-accent/10 border border-accent/30"
                style={{ boxShadow: "0 0 32px oklch(0.68 0.22 55 / 0.2)" }}
              >
                <Loader2 size={36} className="text-accent animate-spin" />
              </div>
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Activating your Premium…
            </h1>
            <p className="text-muted-foreground text-sm">
              We're confirming your payment and unlocking your crown badge.
            </p>
          </div>
        )}

        {state === "success" && (
          <div data-ocid="payment-success.success_state">
            <div className="flex items-center justify-center mb-5">
              <div
                className="p-5 rounded-full bg-accent/10 border border-accent/30"
                style={{ boxShadow: "0 0 40px oklch(0.68 0.22 55 / 0.3)" }}
              >
                <Crown size={36} className="text-accent fill-accent" />
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 mb-3">
              <CheckCircle2 size={18} className="text-primary" />
              <h1 className="font-display text-2xl font-bold text-foreground">
                You're Premium now!
              </h1>
            </div>
            <div className="flex justify-center mb-4">
              <PremiumBadge size="md" />
            </div>
            <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
              Your golden crown badge is now live on your profile and all your
              videos. Welcome to the Global Gamers Premium community!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => navigate({ to: "/feed" })}
                className="bg-primary text-primary-foreground hover:opacity-90 font-display font-semibold transition-smooth"
                data-ocid="payment-success.go_feed_button"
              >
                Back to Feed
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate({ to: "/profile" })}
                className="font-display font-semibold transition-smooth"
                data-ocid="payment-success.view_profile_button"
              >
                View My Profile
              </Button>
            </div>
          </div>
        )}

        {state === "error" && (
          <div data-ocid="payment-success.error_state">
            <div className="flex items-center justify-center mb-5">
              <div className="p-5 rounded-full bg-destructive/10 border border-destructive/30">
                <TriangleAlert size={36} className="text-destructive" />
              </div>
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Activation Issue
            </h1>
            <p className="text-muted-foreground text-sm mb-2 leading-relaxed">
              Your payment was processed but we couldn't automatically activate
              premium. This sometimes happens due to network delays.
            </p>
            <p className="text-muted-foreground text-sm mb-8">
              Please visit <strong className="text-foreground">Settings</strong>{" "}
              to retry activation, or contact support.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => navigate({ to: "/settings" })}
                className="bg-primary text-primary-foreground hover:opacity-90 font-display font-semibold transition-smooth"
                data-ocid="payment-success.go_settings_button"
              >
                Go to Settings
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate({ to: "/feed" })}
                className="font-display font-semibold transition-smooth"
                data-ocid="payment-success.go_feed_button"
              >
                Back to Feed
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
