import path from "path";
import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Load .env before Prisma reads env vars
config({ path: path.join(import.meta.dirname, ".env") });
config({ path: path.join(import.meta.dirname, ".env.local"), override: true });

// Use the direct (non-pooled) URL for schema migrations if available,
// falling back to the pooler URL for runtime queries.
const dbUrl = process.env.DB_URL_DIRECT ?? process.env.DB_URL ?? "";

export default defineConfig({
  schema: path.join(import.meta.dirname, "prisma/schema.prisma"),
  datasource: {
    url: dbUrl,
  },
});
