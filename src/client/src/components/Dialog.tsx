import { useEffect, useId, useRef, type ReactNode } from "react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

// True when the point is on the backdrop. event.target is not enough, the dialog's own scrollbar targets it too.
function isOutsideBox(
  dialog: HTMLDialogElement,
  x: number,
  y: number,
): boolean {
  const box = dialog.getBoundingClientRect();
  return x < box.left || x > box.right || y < box.top || y > box.bottom;
}

// A modal on the native <dialog>. Children only render while open, so a form inside starts empty.
export function Dialog({ open, onClose, title, children }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  // The mouse press started on the backdrop, so selecting text and releasing outside does not close.
  const pressedOnBackdrop = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog === null) {
      return;
    }
    if (open && !dialog.open) {
      dialog.showModal();
    }
    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-md border border-line bg-page p-0 text-fg backdrop:bg-scrim"
      // Fires for Esc and for the programmatic close() above.
      onClose={onClose}
      onMouseDown={(event) => {
        pressedOnBackdrop.current = isOutsideBox(
          event.currentTarget,
          event.clientX,
          event.clientY,
        );
      }}
      onClick={(event) => {
        const startedOnBackdrop = pressedOnBackdrop.current;
        pressedOnBackdrop.current = false;
        if (
          startedOnBackdrop &&
          event.target === event.currentTarget &&
          isOutsideBox(event.currentTarget, event.clientX, event.clientY)
        ) {
          onClose();
        }
      }}
    >
      {open ? (
        <div className="p-6">
          <h2 id={titleId} className="mb-5 text-lg leading-tight font-medium">
            {title}
          </h2>
          {children}
        </div>
      ) : null}
    </dialog>
  );
}
