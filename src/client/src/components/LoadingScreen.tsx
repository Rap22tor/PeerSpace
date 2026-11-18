// Shown while we find out whether the visitor already has a session.
export function LoadingScreen() {
  return (
    <div
      role="status"
      className="flex min-h-screen items-center justify-center text-muted"
    >
      Loading…
    </div>
  );
}
