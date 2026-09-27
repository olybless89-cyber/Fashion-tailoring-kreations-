// Runs on every Railway start: applies pending migrations, then seeds the catalogue once (only if empty).
import "dotenv/config";
import { randomUUID } from "node:crypto";
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { categories, products } from "./catalog.mjs";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Add a Postgres service on Railway and reference its DATABASE_URL.");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: url });
try {
  await migrate(drizzle(pool), { migrationsFolder: "./drizzle" });
  console.log("✓ migrations applied");

  const { rows } = await pool.query("select count(*)::int as n from categories");
  if (rows[0].n === 0 && process.env.SKIP_SEED !== "1") {
    const ids = {};
    for (const [i, c] of categories.entries()) {
      ids[c.slug] = randomUUID();
      await pool.query(
        "insert into categories (id, slug, name, tagline, description, image, sort_order) values ($1,$2,$3,$4,$5,$6,$7)",
        [ids[c.slug], c.slug, c.name, c.tagline, c.description, c.image, i],
      );
    }
    for (const [i, p] of products.entries()) {
      await pool.query(
        `insert into products (id, slug, name, description, price, images, fabric, colors, sizes, bespoke, lead_time_days, featured, sort_order, category_id)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
        [randomUUID(), p.slug, p.name, p.description, p.price, p.images, p.fabric, p.colors, p.sizes, p.bespoke, p.leadTimeDays, p.featured, i, ids[p.cat]],
      );
    }
    console.log(`✓ seeded ${categories.length} collections and ${products.length} products`);
  }
} catch (err) {
  console.error(err);
  process.exit(1);
} finally {
  await pool.end();
}
