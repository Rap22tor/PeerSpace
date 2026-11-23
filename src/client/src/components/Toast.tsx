import { useEffect, useRef, type ReactNode } from "react";
import { CheckIcon, CloseIcon } from "./icons";

interface ToastRegionProps {
  children: ReactNode;
}

// Live region at the bottom of the screen that ToastProvider renders toasts into.
export function ToastRegion({ children }: ToastRegionProps) {
  return (
    <div
      role="status"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-center gap-2 md:items-end"
    >
      {children}
    </div>
  );
}

interface ToastProps {
  children: ReactNode;
  // Called when the toast times out or the user closes it. The parent removes it.
  onDismiss: () => void;
  // Milliseconds until the toast dismisses itself.
  duration?: number;
}

// A short confirmation that goes away by itself. Use it through useToast().
export function Toast({ children, onDismiss, duration = 5000 }: ToastProps) {
  // Ref, so a new onDismiss from a re-render does not restart the timer.
  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      onDismissRef.current();
    }, duration);
    return () => {
      window.clearTimeout(timer);
    };
  }, [duration]);

  return (
    <div className="pointer-events-auto flex items-center gap-3 rounded-md bg-fg px-4 py-3 text-sm text-page">
      <span className="flex">
        <CheckIcon />
      </span>
      <span>{children}</span>
      <button
        type="button"
        className="-mr-1 flex cursor-pointer rounded p-1 text-page/70 hover:text-page focus-visible:outline-page"
        aria-label="Dismiss"
        onClick={onDismiss}
      >
        <CloseIcon />
      </button>
    </div>
  );
}
