export interface FilterOption<T extends string> {
  id: T;
  label: string;
}

interface SegmentedFilterProps<T extends string> {
  ariaLabel: string;
  options: readonly FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedFilter<T extends string>({
  ariaLabel,
  options,
  value,
  onChange,
}: SegmentedFilterProps<T>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex shrink-0 rounded-lg border border-current/15 p-1 text-sm"
    >
      {options.map((option) => {
        const active = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => {
              return onChange(option.id);
            }}
            className={`rounded-md px-3 py-1 font-medium transition ${
              active ? "bg-accent text-page" : "text-muted hover:text-fg"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
