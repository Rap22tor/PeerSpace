import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { getFormErrorMessage } from "../auth/errors";

// The signed-in user's name and the sign out button.
export function UserArea() {
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
    <div className="flex min-w-0 items-center gap-3">
      {error !== null ? (
        <span role="alert" className="text-small text-danger">
          {error}
        </span>
      ) : null}
      <span className="min-w-0 truncate font-medium">{user?.username}</span>

      {
        // Placeholder sign out button for now until we have a proper profile section
      }

      <button
        type="button"
        className="h-9 shrink-0 cursor-pointer rounded-md border border-line px-3 text-sm hover:border-field"
        onClick={() => {
          void handleSignOut();
        }}
      >
        Sign out
      </button>
    </div>
  );
}
