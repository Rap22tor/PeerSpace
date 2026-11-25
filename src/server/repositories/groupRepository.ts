import { Db } from "../db/database";
import {
  type GroupWithMembership,
  type UpdateGroupMetadataInput,
  type CreateGroupInput,
  type CatalogGroupItem,
  type UserGroupCardItem,
} from "../../shared/groupTypes";

// Home page: get all groups list with members count + LIKE-search in title/tags
export function getGroups(
  db: Db,
  userId: number,
  searchQuery?: string,
  isPrivate?: number,
): CatalogGroupItem[] {
  let query = `
    SELECT
      g.group_id,
      g.title,
      g.description,
      g.tags,
      g.is_private,
      g.max_capacity,
      g.owner_id,
      g.created_at,
      COUNT(CASE WHEN all_gm.status = 'approved' THEN 1 END) AS member_count,
      user_gm.status AS membership_status
    FROM groups g
    LEFT JOIN group_members all_gm ON g.group_id = all_gm.group_id
    LEFT JOIN group_members user_gm
      ON g.group_id = user_gm.group_id AND user_gm.user_id = ?
    WHERE 1=1
  `;
  const params: Array<string | number> = [userId];

  if (isPrivate !== undefined) {
    query += ` AND g.is_private = ?`;
    params.push(isPrivate);
  }

  if (searchQuery && searchQuery.trim() !== "") {
    query += ` AND (g.title LIKE ? OR g.tags LIKE ?)`;
    const pattern = `%${searchQuery.trim()}%`;
    params.push(pattern, pattern);
  }

  // Group by primary key so aggregate count stays per study group
  query += ` GROUP BY g.group_id ORDER BY g.created_at DESC`;

  const statement = db.prepare(query);
  return statement.all(...params) as CatalogGroupItem[];
}

// For "My Groups" list: returns approved and pending groups with members count
export function getUserGroups(db: Db, userId: number): UserGroupCardItem[] {
  const statement = db.prepare(`
    SELECT
      g.group_id,
      g.title,
      g.description,
      g.tags,
      g.is_private,
      g.max_capacity,
      g.owner_id,
      g.created_at,
      gm.role,
      gm.status,
      gm.joined_at,
      COUNT(CASE WHEN all_gm.status = 'approved' THEN 1 END) AS member_count
    FROM groups g
    JOIN group_members gm
      ON g.group_id = gm.group_id AND gm.user_id = ?
    LEFT JOIN group_members all_gm ON g.group_id = all_gm.group_id
    WHERE gm.status IN ('approved', 'pending')
    GROUP BY g.group_id, gm.role, gm.status, gm.joined_at
    ORDER BY g.created_at DESC
  `);

  return statement.all(userId) as UserGroupCardItem[]; // returns list of groups
}

// Get ONE group basic info + the User's status in this group
export function getGroupWithUserMembership(
  db: Db,
  groupId: number,
  userId: number,
): GroupWithMembership | undefined {
  const statement = db.prepare(`
    SELECT
      g.group_id,
      g.title,
      g.description,
      g.tags,
      g.is_private,
      g.max_capacity,
      g.owner_id,
      g.created_at,
      gm.role,
      gm.status
    FROM groups g
    LEFT JOIN group_members gm ON g.group_id = gm.group_id AND gm.user_id = ?
    WHERE g.group_id = ?
  `);

  return statement.get(userId, groupId) as GroupWithMembership | undefined; // return ONE group info
}

export function getGroupInviteCode(
  db: Db,
  groupId: number,
): string | null | undefined {
  // invite_code can be null
  const statement = db.prepare(
    `SELECT invite_code FROM groups WHERE group_id = ?`,
  );
  const result = statement.get(groupId) as { invite_code: string } | undefined;
  return result?.invite_code;
}

// Creating a new group
export function addGroup(db: Db, data: CreateGroupInput): number {
  const insertGroupQuery = db.prepare(`
    INSERT INTO groups (title, description, tags, is_private, max_capacity, invite_code, owner_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMemberQuery = db.prepare(`
    INSERT INTO group_members (group_id, user_id, role, status)
    VALUES (?, ?, 'admin', 'approved')
  `);

  // this transaction combines 2 operations (add new group + add admin) into 1 single action:
  const createGroupTx = db.transaction(
    (groupData: CreateGroupInput): number => {
      const result = insertGroupQuery.run(
        groupData.title,
        groupData.description,
        groupData.tags,
        groupData.isPrivate,
        groupData.maxCapacity,
        groupData.inviteCode,
        groupData.ownerId,
      );

      const groupId = Number(result.lastInsertRowid);
      insertMemberQuery.run(groupId, groupData.ownerId);

      return groupId;
    },
  );

  return createGroupTx(data);
}

export function updateGroupMetadata(
  db: Db,
  groupId: number,
  data: UpdateGroupMetadataInput,
): number {
  const statement = db.prepare(`
    UPDATE groups 
    SET title = ?, description = ?, tags = ?, max_capacity = ?, is_private = ?
    WHERE group_id = ?
  `);

  const result = statement.run(
    data.title,
    data.description ?? null,
    data.tags ?? null,
    data.maxCapacity,
    data.isPrivate,
    groupId,
  );
  return result.changes;
}

// Delete Group
export function deleteGroup(db: Db, groupId: number): number {
  const statement = db.prepare(`
    DELETE FROM groups WHERE group_id = ?
  `);

  const result = statement.run(groupId);
  return result.changes; // returns number of deleted lines (0 if not found)
}
