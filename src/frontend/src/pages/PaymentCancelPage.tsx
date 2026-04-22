import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Crown, XCircle } from "lucide-react";

export function PaymentCancelPage() {
  const navigate = useNavigate();

  return (
    <div
      className="flex-1 flex items-center justify-center bg-background p-6"
      data-ocid="payment-cancel.page"
    >
      <div className="max-w-md w-full text-center animate-fade-up">
        <div className="flex items-center justify-center mb-5">
          <div className="p-5 rounded-full bg-muted border border-border">
            <XCircle size={36} className="text-muted-foreground" />
          </div>
        </div>

        <h1 className="font-display text-2xl font-bold text-foreground mb-2">
          Checkout Cancelled
        </h1>
        <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
          No worries — you haven't been charged. You can upgrade to Premium
          whenever you're ready from your account settings.
        </p>

        {/* Reminder card */}
        <div className="bg-card border border-border rounded-xl p-5 mb-8 text-left">
          <div className="flex items-center gap-2 mb-3">
            <Crown size={15} className="text-accent" />
            <span className="font-display text-sm font-semibold text-foreground">
              Premium perks waiting for you
            </span>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {[
              "Golden crown badge on profile and all videos",
              "Stand out in the community feed",
              "Exclusive premium community status",
            ].map((perk) => (
              <li key={perk} className="flex items-start gap-2">
                <span className="text-accent mt-0.5">›</span>
                <span>{perk}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate({ to: "/settings" })}
            className="bg-accent text-accent-foreground hover:opacity-90 font-display font-bold gap-2 transition-smooth"
            style={{ boxShadow: "0 0 12px oklch(0.68 0.22 55 / 0.25)" }}
            data-ocid="payment-cancel.retry_button"
          >
            <Crown size={14} />
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate({ to: "/feed" })}
            className="font-display font-semibold transition-smooth"
            data-ocid="payment-cancel.go_feed_button"
          >
            Back to Feed
          </Button>
        </div>
      </div>
    </div>
  );
}
