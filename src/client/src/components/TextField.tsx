import { useId, useState, type ReactNode, type Ref } from "react";
import { AlertCircleIcon, CheckIcon, EyeIcon, EyeOffIcon } from "./icons";

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "password";
  autoComplete?: string;
  placeholder?: string;
  hint?: string;
  // Shown under the field and announced to screen readers when it appears.
  error?: ReactNode;
  // Shows a tick at the end of the field.
  valid?: boolean;
  // Id of another element that describes this field (for example a rules list).
  describedBy?: string;
  autoFocus?: boolean;
  ref?: Ref<HTMLInputElement>;
}

// A labelled underline input. Password fields get a show/hide toggle.
export function TextField({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  placeholder,
  hint,
  error,
  valid = false,
  describedBy,
  autoFocus,
  ref,
}: TextFieldProps) {
  const id = useId();
  const [revealed, setRevealed] = useState(false);

  const hasError = Boolean(error);
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const isPassword = type === "password";

  const describedIds: string[] = [];
  if (hasError) {
    describedIds.push(errorId);
  }
  if (hint !== undefined) {
    describedIds.push(hintId);
  }
  if (describedBy !== undefined) {
    describedIds.push(describedBy);
  }

  // Pick one set of state classes. Stacking both would not work: the
  // focus-within selector is more specific, so the red underline would turn
  // blue whenever an invalid field is focused. The thicker underline is a
  // shadow, so focusing never shifts the layout.
  const controlState = hasError
    ? "border-danger shadow-[0_1px_0_0_var(--color-danger)]"
    : "border-field focus-within:border-accent focus-within:shadow-[0_1px_0_0_var(--color-accent)]";

  return (
    <div className="flex flex-col gap-1">
      <label className="text-small font-medium text-muted" htmlFor={id}>
        {label}
      </label>
      <div
        className={`flex items-center gap-2 border-b transition-colors ${controlState}`}
      >
        <input
          id={id}
          ref={ref}
          className="h-9 min-w-0 flex-1 bg-transparent py-1.5 text-fg outline-none placeholder:text-muted"
          type={isPassword && revealed ? "text" : type}
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
          }}
          autoComplete={autoComplete}
          placeholder={placeholder}
          autoFocus={autoFocus}
          aria-invalid={hasError ? true : undefined}
          aria-describedby={
            describedIds.length > 0 ? describedIds.join(" ") : undefined
          }
        />
        {valid && !hasError ? (
          <span className="flex text-accent">
            <CheckIcon />
          </span>
        ) : null}
        {isPassword ? (
          <button
            type="button"
            className="flex cursor-pointer rounded p-1 text-lg text-muted hover:text-fg"
            aria-label="Show password"
            aria-pressed={revealed}
            onClick={() => {
              setRevealed(!revealed);
            }}
          >
            {revealed ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        ) : null}
      </div>
      {hint !== undefined ? (
        <p id={hintId} className="text-small text-muted">
          {hint}
        </p>
      ) : null}
      {hasError ? (
        <p
          id={errorId}
          role="alert"
          className="flex items-start gap-1.5 text-small text-danger [&>svg]:mt-0.5 [&>svg]:shrink-0"
        >
          <AlertCircleIcon />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}
