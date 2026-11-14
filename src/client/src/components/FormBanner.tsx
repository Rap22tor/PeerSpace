import type { ReactNode } from "react";
import { AlertCircleIcon } from "./icons";

interface FormBannerProps {
  children: ReactNode;
}

// An error that belongs to the whole form, not to one field.
export function FormBanner({ children }: FormBannerProps) {
  return (
    <div role="alert" className="banner">
      <AlertCircleIcon />
      <span>{children}</span>
    </div>
  );
}
