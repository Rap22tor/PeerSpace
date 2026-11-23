import { get } from "../backendRaw";
import type {
  GroupListResponse,
  GroupSummary,
} from "../../../shared/groupTypes";

// One function per endpoint, typed with the shared request and response types.
// Paths are relative to /api. Errors reject with an ApiError (see backendRaw.ts).

export interface GroupListFilters {
  q?: string;
  isPrivate?: boolean;
}

// GET /api/groups
export async function fetchGroups(
  filters: GroupListFilters = {},
): Promise<GroupSummary[]> {
  let isPrivate: number | undefined;
  if (filters.isPrivate !== undefined) {
    isPrivate = filters.isPrivate ? 1 : 0;
  }

  const response = await get<GroupListResponse>("/groups", {
    q: filters.q,
    isPrivate,
  });
  return response.groups;
}
