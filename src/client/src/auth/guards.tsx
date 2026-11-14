import { Navigate, Outlet, useLocation } from "react-router";
import { LoadingScreen } from "../components/LoadingScreen";
import { useAuth } from "./AuthContext";
import { getRedirectTarget } from "./redirect";

// Wraps the pages that need a signed-in user.
export function RequireAuth() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return <LoadingScreen />;
  }
  if (status === "anonymous") {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}

// Wraps the sign in and register pages. A signed-in visitor is sent on to the
// page they originally wanted (or the home page). This also handles the jump
// right after a successful sign in or registration.
export function GuestOnly() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return <LoadingScreen />;
  }
  if (status === "authenticated") {
    return <Navigate to={getRedirectTarget(location.state)} replace />;
  }
  return <Outlet />;
}
