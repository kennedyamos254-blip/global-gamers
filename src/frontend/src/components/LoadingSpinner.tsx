interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  className = "",
}: LoadingSpinnerProps) {
  const sizeMap = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-10 w-10" };
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`${sizeMap[size]} animate-spin rounded-full border-2 border-muted border-t-primary ${className}`}
    />
  );
}

export function PageLoader() {
  return (
    <div
      className="flex flex-1 items-center justify-center min-h-[40vh]"
      data-ocid="page.loading_state"
    >
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-muted-foreground font-body">Loading...</p>
      </div>
    </div>
  );
}
