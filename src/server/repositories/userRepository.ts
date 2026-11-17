import { Db } from "../db/database";


// Register (add) new User:
export function addUser(db: Db, username: string, email: string, passwordHash: string) {
  // 1. Safe SQL-query with "?""
  const stmt = db.prepare(`
    INSERT INTO users (username, email, password_hash)
    VALUES (?, ?, ?)
  `);

  // 2. SQL-query
  const result = stmt.run(username, email, passwordHash);

  // result.lastInsertRowid — ID of a freshly made row in the table
  return result.lastInsertRowid;
}


export function findUserByEmail(db: Db, email: string) {
  const findUserQuery = db.prepare(`
    SELECT * FROM users WHERE email = ?
  `);
  
  // Return User or undefined
  return findUserQuery.get(email);
}


export function findUserByUsername(db: Db, username: string) {
  const statement = db.prepare(`
    SELECT user_id, username, email, created_at 
    FROM users 
    WHERE username = ?
  `);
  return statement.get(username) as { user_id: number; username: string; email: string; created_at: string } | undefined;
}


export function deleteUser(db: Db, userId: number) {
  const statement = db.prepare(`
    DELETE FROM users WHERE user_id = ?
  `);
  
  const result = statement.run(userId);
  // returns number of the deleted rows (0 if User not found)
  return result.changes;
}