import { defineConfig } from "drizzle-kit";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to run Drizzle commands");
}

/** Configuración histórica para la base MySQL de Manus durante la transición. */
export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle/mysql-migrations",
  dialect: "mysql",
  dbCredentials: { url: connectionString },
});
