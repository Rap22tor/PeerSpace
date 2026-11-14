# FYP - Study group finder
A study group finder application as the final project for the Advanced Web Programming course @ SeoulTech.

## Architecture

Fullstack application (Frontend + Backend + Database)

- **Frontend**: React + Vite / TypeScript
- **Backend** Node.js + ExpressAPI / TypeScript
- **Database** SQLite

Automated testing of all backend code, as well as 
end-to-end tests for major interactions and security 
relevant code.

A CI pipline will be set up to run automated testing on
every merge. 

Auth is handled by a custom implementation using express
sessions with bycrpt. This is not production grade and 
should usually not be done, but for this type of project
and to learn how this stuff works, this is fine.

### Additional requirements set by the course:
- **Safe SQL** Every query uses parameters ( ?
placeholders). No user input is ever
concatenated into SQL.
- **Status Codes** Correct codes for each outcome: 200,
201, 400, 401, 403 or 404, 409, 500.
- **Registration** Server-side validation of every field;
duplicate email returns 409.
- **Password storage** Passwords hashed with bcrypt (cost
10 or more). Never stored or logged in
plaintext.
- **Sessions** express-session with an httpOnly, sameSite
cookie; session regenerated on login and destroyed on
logout. Same error message for unknown email and wrong 
password.
- **Authentication** A requireAuth middleware protects
every private route (401 when not signed in). 
- **Authorization** Every read, update and delete is
filtered by the session's userId. owner_id is never 
taken from the browser. Another user's record returns 403 
or 404
- **Frontend Pages** use fetch() for every API call,
show the server's messages, and insert user data with 
textContent, not innerHTML.
- **Secrets an repo** SESSION_SECRET (32+ characters)
in .env; .env, node_modules and the database file listed 
in .gitignore. Code in a GitHub repository.

## Features