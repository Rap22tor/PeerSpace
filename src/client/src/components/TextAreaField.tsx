import { useId, type ReactNode, type Ref } from "react";
import { AlertCircleIcon } from "./icons";

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  hint?: string;
  // Shown under the field and announced to screen readers when it appears.
  error?: ReactNode;
  ref?: Ref<HTMLTextAreaElement>;
}

// A labelled multi-line input with the same underline look as TextField.
export function TextAreaField({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
  hint,
  error,
  ref,
}: TextAreaFieldProps) {
  const id = useId();

  const hasError = Boolean(error);
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  const describedIds: string[] = [];
  if (hasError) {
    describedIds.push(errorId);
  }
  if (hint !== undefined) {
    describedIds.push(hintId);
  }

  const controlState = hasError
    ? "border-danger shadow-[0_1px_0_0_var(--color-danger)]"
    : "border-field focus-within:border-accent focus-within:shadow-[0_1px_0_0_var(--color-accent)]";

  return (
    <div className="flex flex-col gap-1">
      <label className="text-small font-medium text-muted" htmlFor={id}>
        {label}
      </label>
      <div className={`flex border-b transition-colors ${controlState}`}>
        <textarea
          id={id}
          ref={ref}
          className="min-w-0 flex-1 resize-y bg-transparent py-1.5 text-fg outline-none placeholder:text-muted"
          rows={rows}
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
          }}
          placeholder={placeholder}
          aria-invalid={hasError ? true : undefined}
          aria-describedby={
            describedIds.length > 0 ? describedIds.join(" ") : undefined
          }
        />
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
