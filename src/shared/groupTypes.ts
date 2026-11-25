// basic type
export interface GroupSummary {
  group_id: number;
  title: string;
  tags?: string | null;
  description?: string | null;
  is_private: number;
  max_capacity: number;
  owner_id: number;
  created_at: string;
}

// Catalog item for HomePage: group fields + approved members count + current user's status
// used in fetchGroups(), getGroups()
export interface CatalogGroupItem extends GroupSummary {
  member_count: number;
  membership_status: "approved" | "pending" | null;
}

// TO DELETE LATER (?)
// Caralogue item for My Groups Page
// used in getUserGroups() (membership status = "approved")
export interface UserGroupItem extends GroupSummary {
  role: "admin" | "member";
  status: "approved" | "pending";
  joined_at: string;
}

// User group item for GroupsPage: membership fields + approved member count
export interface UserGroupCardItem extends UserGroupItem {
  member_count: number;
}

// TO DELETE LATER (?)
// basic group info + membership info (role, request status, joined_at datetime)
// for getGroupWithUserMembership, so null is necessary if User is not in the group
export interface GroupWithMembership extends GroupSummary {
  role?: "admin" | "member" | null;
  status?: "approved" | "pending" | null;
}

// can be used for creating new group
export interface CreateGroupInput {
  title: string;
  description?: string | null;
  tags?: string | null;
  isPrivate: number;
  maxCapacity: number;
  inviteCode: string;
  ownerId: number;
}

// can be used for updating group info
export interface UpdateGroupMetadataInput {
  title: string;
  description?: string | null;
  tags?: string | null;
  maxCapacity: number;
  isPrivate: number;
}
