import { get } from "../backendRaw";
import type {
  CatalogGroupItem,
  UserGroupCardItem,
  GroupDetail,
} from "../../../shared/groupTypes";

interface CatalogGroupsResponse {
  groups: CatalogGroupItem[];
}

interface MyGroupsResponse {
  groups: UserGroupCardItem[];
}

interface GroupDetailResponse {
  group: GroupDetail;
}

export interface GroupListFilters {
  q?: string;
  isPrivate?: boolean;
}

// One function per endpoint, typed with the shared request and response types.
// Paths are relative to /api. Errors reject with an ApiError (see backendRaw.ts).

// GET /api/groups
// Fetches catalog groups with member counts and current user's status
export async function fetchGroups(
  filters: GroupListFilters = {},
): Promise<CatalogGroupItem[]> {
  let isPrivateParam: number | undefined;
  if (filters.isPrivate !== undefined) {
    isPrivateParam = filters.isPrivate ? 1 : 0;
  }

  const response = await get<CatalogGroupsResponse>("/groups", {
    q: filters.q,
    isPrivate: isPrivateParam,
  });
  return response.groups;
}

// GET /api/groups/me from backendRaw.ts, then browser sends HTTP on Express server
// where groupRouter (router.get("/me", ...)) processes it
// Fetches groups where the current user is approved or has a pending join request
// is used in GroupsPage.tsx
export async function fetchMyGroups(): Promise<UserGroupCardItem[]> {
  const response = await get<MyGroupsResponse>("/groups/me");
  return response.groups;
}

// GET /api/groups/:id
// Fetches full details and approved members for a single group.
export async function fetchGroupById(groupId: number): Promise<GroupDetail> {
  const response = await get<GroupDetailResponse>(`/groups/${groupId}`);
  return response.group;
}
