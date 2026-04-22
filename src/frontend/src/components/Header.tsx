import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useRouter } from "@tanstack/react-router";
import { Bus, Crown, LogOut, Menu, Upload, User, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useMyProfile } from "../hooks/useBackend";
import { PremiumBadge } from "./PremiumBadge";

export function Header() {
  const { isAuthenticated, login, logout, isLoggingIn } = useAuth();
  const { data: profile } = useMyProfile();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = profile?.username
    ? profile.username.slice(0, 2).toUpperCase()
    : "GG";

  function handleLogout() {
    logout();
    router.navigate({ to: "/" });
  }

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-xs">
      <div className="container flex h-14 items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to="/"
          data-ocid="header.link"
          className="flex items-center gap-2 font-display font-bold text-lg text-foreground hover:text-primary transition-colors duration-200 shrink-0"
          aria-label="Global Gamers home"
        >
          <Bus size={22} className="text-primary" />
          <span>
            Global <span className="text-primary">Gamers</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            data-ocid="nav.feed.link"
            className="px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth"
          >
            Feed
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Button
                asChild
                size="sm"
                className="hidden sm:flex gap-1.5 bg-primary text-primary-foreground hover:opacity-90"
                data-ocid="header.upload_button"
              >
                <Link to="/upload">
                  <Upload size={14} />
                  Upload
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full relative"
                    data-ocid="header.profile.open_modal_button"
                    aria-label="Open profile menu"
                  >
                    <Avatar className="h-8 w-8 border border-border">
                      <AvatarFallback className="bg-secondary text-foreground text-xs font-display">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    {profile?.isPremium && (
                      <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-accent">
                        <Crown
                          size={8}
                          className="text-accent-foreground fill-accent-foreground"
                        />
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-52 bg-popover border-border"
                >
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-display font-semibold text-foreground truncate">
                      {profile?.username ?? "Loading..."}
                    </p>
                    {profile?.isPremium && (
                      <PremiumBadge size="sm" className="mt-1" />
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      to="/profile"
                      data-ocid="nav.profile.link"
                      className="cursor-pointer"
                    >
                      <User size={14} className="mr-2" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="sm:hidden">
                    <Link
                      to="/upload"
                      data-ocid="nav.upload.link"
                      className="cursor-pointer"
                    >
                      <Upload size={14} className="mr-2" />
                      Upload Video
                    </Link>
                  </DropdownMenuItem>
                  {!profile?.isPremium && (
                    <DropdownMenuItem asChild>
                      <Link
                        to="/settings"
                        data-ocid="nav.premium.link"
                        className="cursor-pointer text-accent"
                      >
                        <Crown size={14} className="mr-2" />
                        Get Premium
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    data-ocid="header.logout_button"
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut size={14} className="mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                onClick={login}
                disabled={isLoggingIn}
                size="sm"
                className="bg-primary text-primary-foreground hover:opacity-90 glow-primary"
                data-ocid="header.login_button"
              >
                {isLoggingIn ? "Connecting..." : "Sign In"}
              </Button>
              {/* Mobile menu toggle */}
              <button
                type="button"
                className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
                data-ocid="header.menu_toggle"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile nav panel — unauthenticated */}
      {mobileOpen && !isAuthenticated && (
        <nav
          className="md:hidden bg-card border-t border-border px-4 py-3 flex flex-col gap-1"
          data-ocid="header.mobile_nav"
        >
          <Link
            to="/"
            data-ocid="nav.mobile.feed.link"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth"
          >
            Feed
          </Link>
          <Button
            onClick={() => {
              setMobileOpen(false);
              login();
            }}
            size="sm"
            className="mt-1 w-full bg-primary text-primary-foreground hover:opacity-90"
            data-ocid="header.mobile_login_button"
          >
            Sign In to Upload
          </Button>
        </nav>
      )}
    </header>
  );
}
