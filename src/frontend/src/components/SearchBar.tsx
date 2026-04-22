import { Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search clips by title…",
  className = "",
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync external value changes (e.g. clear from parent)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value;
      setLocalValue(next);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onChange(next), 300);
    },
    [onChange],
  );

  const handleClear = useCallback(() => {
    setLocalValue("");
    if (timerRef.current) clearTimeout(timerRef.current);
    onChange("");
  }, [onChange]);

  return (
    <div
      className={`relative flex items-center group ${className}`}
      data-ocid="feed.search_input"
    >
      <Search
        size={15}
        className="absolute left-3 text-muted-foreground group-focus-within:text-primary transition-colors duration-200 pointer-events-none"
      />
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="Search clips by title"
        className="w-full pl-9 pr-8 py-2 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors duration-200"
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          data-ocid="feed.search_clear_button"
          className="absolute right-2.5 text-muted-foreground hover:text-foreground transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
