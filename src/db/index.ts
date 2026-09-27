import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const g = globalThis as unknown as { __ftkPool?: Pool };

const pool =
  g.__ftkPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
  });
if (process.env.NODE_ENV !== "production") g.__ftkPool = pool;

export const db = drizzle(pool, { schema });
export * from "./schema";
