import { Db } from "../db/database";


// Get group comments + its authors
export function getGroupComments(db: Db, groupId: number) {
  const statement = db.prepare(`
    SELECT 
      c.comment_id, 
      c.content, 
      c.created_at, 
      u.user_id, 
      u.username
    FROM comments c
    JOIN users u ON c.user_id = u.user_id
    WHERE c.group_id = ?
    ORDER BY c.created_at ASC
  `);
  
  return statement.all(groupId);
}


export function addComment(db: Db, groupId: number, userId: number, content: string) {
  const statement = db.prepare(`
    INSERT INTO comments (group_id, user_id, content)
    VALUES (?, ?, ?)
  `);
  const result = statement.run(groupId, userId, content);
  return result.lastInsertRowid;
}