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

  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <div className={hasError ? "field-control invalid" : "field-control"}>
        <input
          id={id}
          ref={ref}
          className="field-input"
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
          <span className="field-valid">
            <CheckIcon />
          </span>
        ) : null}
        {isPassword ? (
          <button
            type="button"
            className="field-toggle"
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
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      ) : null}
      {hasError ? (
        <p id={errorId} role="alert" className="field-error">
          <AlertCircleIcon />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}
