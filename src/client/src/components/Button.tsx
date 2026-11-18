import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  type?: "submit" | "button";
  onClick?: () => void;
}

// The full-width primary action button.
export function Button({ children, type = "submit", onClick }: ButtonProps) {
  return (
    <button
      type={type}
      className="h-10 w-full cursor-pointer rounded-md bg-fg font-medium text-page active:scale-[0.99]"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
