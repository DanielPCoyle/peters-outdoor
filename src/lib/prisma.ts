import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const connectionString = process.env.DB_URL;
  if (!connectionString) {
    console.warn("DB_URL not set — Prisma will not connect to the database.");
    // Return a client that will fail gracefully at query time
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pool = new Pool({ connectionString: "postgresql://localhost/placeholder" }) as any;
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pool = new Pool({ connectionString }) as any;
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
