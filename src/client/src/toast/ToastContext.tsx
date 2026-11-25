import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Toast, ToastRegion } from "../components/Toast";

interface ToastItem {
  id: number;
  message: string;
}

interface ToastContextValue {
  // Shows a short confirmation that dismisses itself.
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

interface ToastProviderProps {
  children: ReactNode;
}

// Holds the toasts and renders them. Mounted once in main.tsx.
export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const showToast = useCallback((message: string) => {
    nextId.current += 1;
    const id = nextId.current;
    setToasts((current) => {
      return [...current, { id, message }];
    });
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => {
      return current.filter((toast) => {
        return toast.id !== id;
      });
    });
  }, []);

  const value = useMemo(() => {
    return { showToast };
  }, [showToast]);

  return (
    <ToastContext value={value}>
      {children}
      <ToastRegion>
        {toasts.map((toast) => {
          return (
            <Toast
              key={toast.id}
              onDismiss={() => {
                dismissToast(toast.id);
              }}
            >
              {toast.message}
            </Toast>
          );
        })}
      </ToastRegion>
    </ToastContext>
  );
}

export function useToast(): ToastContextValue {
  const value = useContext(ToastContext);
  if (value === null) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return value;
}
