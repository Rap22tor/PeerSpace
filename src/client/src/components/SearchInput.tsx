interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search by title or tags...",
  ariaLabel = "Search groups",
}: SearchInputProps) {
  return (
    <div className="relative w-full">
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="w-full rounded-lg border border-current/15 bg-transparent px-3.5 py-2 pr-9 text-sm transition placeholder:text-muted focus:border-accent focus:outline-none"
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded px-1.5 py-0.5 text-xs text-muted transition hover:text-current"
        >
          ✕
        </button>
      )}
    </div>
  );
}
