import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "../config/env";

const pool = new Pool({
  connectionString: env.DB_CONNECTION,
  ssl: true,
});

export const db = drizzle(pool);
