import { Db } from "../db/database";


// Get all group study sessions
export function getGroupSessions(db: Db, groupId: number) {
  const statement = db.prepare(`
    SELECT * FROM sessions
    WHERE group_id = ?
    ORDER BY scheduled_at ASC
  `);
  
  return statement.all(groupId);
}


// Add new study session
export function addSession(db: Db, groupId: number, title: string, scheduledAt: string, meetingLink?: string) {
  const statement = db.prepare(`
    INSERT INTO sessions (group_id, title, scheduled_at, meeting_link)
    VALUES (?, ?, ?, ?)
  `);
  const result = statement.run(groupId, title, scheduledAt, meetingLink || null);
  return result.lastInsertRowid;
}


export function updateSession(db: Db, sessionId: number, title: string, scheduledAt: string, meetingLink?: string) {
  const statement = db.prepare(`
    UPDATE sessions 
    SET title = ?, scheduled_at = ?, meeting_link = ?
    WHERE session_id = ?
  `);
  const result = statement.run(title, scheduledAt, meetingLink || null, sessionId);
  return result.changes; // number of changed lines
}