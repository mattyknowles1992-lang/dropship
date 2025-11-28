import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

type BaseClient = PrismaClient;

const globalForPrisma = globalThis as unknown as {
  prisma?: BaseClient;
};

function createPrismaClient(): BaseClient {
  if (process.env.PRISMA_ACCELERATE_URL) {
    delete process.env.PRISMA_ACCELERATE_URL;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set in the environment");
  }

  return new PrismaClient({
    log: ["error"],
    adapter: new PrismaPg({
      connectionString,
      ssl: { rejectUnauthorized: false },
    }),
  });
}

export const prisma: BaseClient = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
