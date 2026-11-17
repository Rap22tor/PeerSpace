import type { ReactNode } from "react";
import { AlertCircleIcon } from "./icons";

interface FormBannerProps {
  children: ReactNode;
}

// An error that belongs to the whole form, not to one field.
export function FormBanner({ children }: FormBannerProps) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-md bg-danger-soft px-3 py-2.5 text-sm text-danger [&>svg]:mt-0.75 [&>svg]:shrink-0"
    >
      <AlertCircleIcon />
      <span>{children}</span>
    </div>
  );
}
