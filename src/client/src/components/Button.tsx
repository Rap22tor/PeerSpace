import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  type?: "submit" | "button";
  // "primary" is the filled main action, "secondary" an outlined one (Cancel).
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const BASE_CLASSES =
  "h-10 cursor-pointer rounded-md font-medium active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60";

const VARIANT_CLASSES = {
  primary: "bg-fg text-page",
  secondary: "border border-line text-fg hover:border-field",
};

export function Button({
  children,
  type = "submit",
  variant = "primary",
  fullWidth = true,
  disabled = false,
  onClick,
}: ButtonProps) {
  const widthClasses = fullWidth ? "w-full" : "px-4";

  return (
    <button
      type={type}
      className={`${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${widthClasses}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
