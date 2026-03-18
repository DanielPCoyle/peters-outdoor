import path from "path";
import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Load .env before Prisma reads env vars
config({ path: path.join(import.meta.dirname, ".env") });
config({ path: path.join(import.meta.dirname, ".env.local"), override: true });

const dbUrl = process.env.DB_URL ?? "";

export default defineConfig({
  schema: path.join(import.meta.dirname, "prisma/schema.prisma"),
  datasource: {
    url: dbUrl,
  },
});
