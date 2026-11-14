import { env } from "./env";
import { openDb } from "./db/database";
import { createApp } from "./app";

const db = openDb(env.DB_PATH);

createApp(db, env.SESSION_SECRET).listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});
