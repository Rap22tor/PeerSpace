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

// Wraps the sign in and register pages. A signed-in visitor is sent on.
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
