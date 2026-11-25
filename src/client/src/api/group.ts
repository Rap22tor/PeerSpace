import { get, post } from "../backendRaw";
import type { CreateGroupRequest } from "../../../shared/groupSchemas";
import type {
  CreateGroupResponse,
  GroupListResponse,
  GroupSummary,
  GroupWithMembership,
} from "../../../shared/groupTypes";

export type { CreateGroupRequest };

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

// POST /api/groups
export async function createGroup(
  input: CreateGroupRequest,
): Promise<GroupWithMembership> {
  const response = await post<CreateGroupResponse>("/groups", input);
  return response.group;
}
