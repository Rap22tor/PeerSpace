import { Route, Routes } from "react-router";
import { AppShell } from "./components/AppShell";
import { GuestOnly, RequireAuth } from "./auth/guards";
import { GroupDetailPage } from "./pages/GroupDetailPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { RegisterPage } from "./pages/RegisterPage";
import { GroupsPage } from "./pages/GroupsPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<GuestOnly />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route element={<RequireAuth />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/mygroups" element={<GroupsPage />} />
          <Route path="/groups/:id" element={<GroupDetailPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
