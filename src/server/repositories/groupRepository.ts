import { Db } from "../db/database";


// Home page: get all groups list (+ Search, + Filtering)
export function getGroups(db: Db, searchQuery?: string, isPrivate?: number) {
  let query = `SELECT * FROM groups WHERE 1=1`; // WHERE 1=1 is necessary for adding AND in query later
  const params: any[] = [];

  // 1. If filter is added
  if (isPrivate !== undefined) {
    query += ` AND is_private = ?`;
    params.push(isPrivate);
  }

  // 2. If search query is made
  if (searchQuery && searchQuery.trim() !== "") {
    query += ` AND (title LIKE ? OR tags LIKE ?)`;
    params.push(`%${searchQuery.trim()}%`, `%${searchQuery.trim()}%`);
  }

  query += ` ORDER BY created_at DESC`;

  const statement = db.prepare(query);
  return statement.all(...params);
}


// Get User's groups list (with 'approved' request status)
export function getUserGroups(db: Db, userId: number) {
  const statement = db.prepare(`
    SELECT g.*, gm.role, gm.status, gm.joined_at 
    FROM groups g
    JOIN group_members gm ON g.group_id = gm.group_id
    WHERE gm.user_id = ? AND gm.status = 'approved'
    ORDER BY g.created_at DESC
  `);
  
  return statement.all(userId);
}


// Get a group's basic info + the User's membership status in this group
export function getGroupWithUserMembership(db: Db, groupId: number, userId: number) {
  const statement = db.prepare(`
    SELECT 
      g.*, 
      gm.role as user_role, 
      gm.status as user_status
    FROM groups g
    LEFT JOIN group_members gm ON g.group_id = gm.group_id AND gm.user_id = ?
    WHERE g.group_id = ?
  `);
  
  return statement.get(userId, groupId);
}


export function getGroupInviteCode(db: Db, groupId: number) {
  const statement = db.prepare(`SELECT invite_code FROM groups WHERE group_id = ?`);
  const result = statement.get(groupId) as { invite_code: string } | undefined;
  return result?.invite_code;
}


// Creating a new group
export function addGroup(db: Db, title: string, description: string, tags: string, isPrivate: number, maxCapacity: number, inviteCode: string, ownerId: number) {
  const insertGroupQuery = db.prepare(`
    INSERT INTO groups (title, description, tags, is_private, max_capacity, invite_code, owner_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const result = insertGroupQuery.run(title, description, tags, isPrivate, maxCapacity, inviteCode, ownerId);


  // User gets the "Admin" role
  const insertMemberQuery = db.prepare(`
    INSERT INTO group_members (group_id, user_id, role, status)
    VALUES (?, ?, 'admin', 'approved')
  `);
  insertMemberQuery.run(result.lastInsertRowid, ownerId);

  // result.lastInsertRowid — ID of a freshly made row in the table
  return result.lastInsertRowid;
}


export function updateGroupMetadata(
  db: Db, 
  groupId: number, 
  title: string, 
  description: string, 
  tags: string, 
  maxCapacity: number, 
  isPrivate: number
) {
  const statement = db.prepare(`
    UPDATE groups 
    SET title = ?, description = ?, tags = ?, max_capacity = ?, is_private = ?
    WHERE group_id = ?
  `);
  
  const result = statement.run(title, description, tags, maxCapacity, isPrivate, groupId);
  return result.changes;
}


// Delete Group
export function deleteGroup(db: Db, groupId: number) {
  const statement = db.prepare(`
    DELETE FROM groups WHERE group_id = ?
  `);
  
  const result = statement.run(groupId);
  return result.changes; // returns number of deleted lines (0 if not found)
}