// RequireAuth stores the page the visitor wanted in the navigation state as
// { from: "/path" }. After signing in we send them back there. Only local
// paths are accepted.
export function getRedirectTarget(state: unknown): string {
  if (
    typeof state === "object" &&
    state !== null &&
    "from" in state &&
    typeof state.from === "string" &&
    state.from.startsWith("/") &&
    !state.from.startsWith("//")
  ) {
    return state.from;
  }
  return "/";
}
