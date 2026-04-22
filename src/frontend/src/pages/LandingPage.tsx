import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Bus, Crown, Heart, Play, Upload, Users } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../hooks/useAuth";

const FEATURES = [
  {
    icon: Play,
    title: "Watch Bus Sim Videos",
    desc: "Browse an ever-growing library of bus simulator gameplay, routes, and livery showcases.",
  },
  {
    icon: Upload,
    title: "Share Your Rides",
    desc: "Upload your best runs — scenic routes, speed records, or custom livery reveals.",
  },
  {
    icon: Heart,
    title: "Like & Engage",
    desc: "Show love for your favourite drivers. Every like fuels the community.",
  },
  {
    icon: Crown,
    title: "Go Premium",
    desc: "Unlock a golden premium badge, stand out in the feed, and support the platform.",
  },
];

const SAMPLE_DRIVERS = [
  { name: "RouteMaster UK", tag: "London Routes", premium: true },
  { name: "Alpine Explorer", tag: "Mountain Passes", premium: false },
  { name: "City Cruiser", tag: "Double Decker", premium: true },
  { name: "Routenaster", tag: "Custom Liveries", premium: false },
];

export function LandingPage() {
  const { login, isLoggingIn } = useAuth();

  return (
    <div className="flex flex-col" data-ocid="landing.page">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] overflow-hidden bg-background text-center px-4">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-bus-sim.dim_1400x600.jpg')",
          }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background"
          aria-hidden
        />

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-display font-semibold mb-6">
            <Bus size={14} />
            Bus Simulator Community
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-foreground leading-tight mb-4">
            Drive. Share. <span className="text-primary">Dominate.</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground font-body max-w-xl mx-auto mb-8 leading-relaxed">
            The ultimate hub for bus simulator drivers worldwide. Upload your
            routes, earn likes, and climb to Premium status.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              onClick={login}
              disabled={isLoggingIn}
              size="lg"
              className="bg-primary text-primary-foreground hover:opacity-90 glow-primary font-display font-bold px-8"
              data-ocid="landing.login_button"
            >
              {isLoggingIn ? "Connecting..." : "Join the Community"}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-border text-foreground hover:bg-secondary font-display"
              asChild
              data-ocid="landing.browse_button"
            >
              <Link to="/feed">Browse Videos</Link>
            </Button>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground"
          aria-hidden
        >
          <div className="w-0.5 h-8 bg-gradient-to-b from-transparent to-primary mx-auto" />
        </motion.div>
      </section>

      {/* Features */}
      <section className="bg-muted/30 border-y border-border py-20 px-4">
        <div className="container max-w-5xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl font-bold text-center text-foreground mb-12"
          >
            Everything a bus sim driver needs
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col gap-3 p-5 rounded-xl bg-card border border-border"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                  <f.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground">
                  {f.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community members */}
      <section className="py-20 px-4 bg-background">
        <div className="container max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Users size={14} />
              Community Drivers
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-8">
              Meet the drivers
            </h2>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-3">
            {SAMPLE_DRIVERS.map((driver, i) => (
              <motion.div
                key={driver.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border"
              >
                <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center font-display text-xs font-bold text-foreground">
                  {driver.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-sm font-display text-foreground">
                  {driver.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  · {driver.tag}
                </span>
                {driver.premium && (
                  <Crown size={12} className="text-accent fill-accent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-muted/40 border-t border-border py-20 px-4">
        <div className="container max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-4"
          >
            <Bus size={40} className="text-primary" />
            <h2 className="font-display text-3xl font-bold text-foreground">
              Ready to start your route?
            </h2>
            <p className="text-muted-foreground">
              Sign in to upload, like, and connect with the community.
            </p>
            <Button
              onClick={login}
              disabled={isLoggingIn}
              size="lg"
              className="bg-primary text-primary-foreground hover:opacity-90 glow-primary font-display font-bold mt-2"
              data-ocid="landing.cta_button"
            >
              {isLoggingIn ? "Connecting..." : "Get Started — It's Free"}
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
