import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { getFormErrorMessage } from "../auth/errors";
import { AuthLayout } from "../components/AuthLayout";
import { FormBanner } from "../components/FormBanner";

// Placeholder landing page for signed-in users.
export function HomePage() {
  const { user, logout } = useAuth();
  const [error, setError] = useState<string | null>(null);

  async function handleSignOut() {
    setError(null);
    try {
      await logout();
      // RequireAuth sends us to the sign in page once the state is cleared.
    } catch (caught) {
      setError(getFormErrorMessage(caught));
    }
  }

  return (
    <AuthLayout
      title="You're signed in"
      subtitle={`Signed in as ${user?.name ?? "unknown"}. This is a placeholder home page.`}
    >
      {error !== null ? <FormBanner>{error}</FormBanner> : null}
      <button
        type="button"
        className="btn"
        onClick={() => {
          void handleSignOut();
        }}
      >
        Sign out
      </button>
    </AuthLayout>
  );
}
