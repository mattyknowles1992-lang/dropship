// Minimal Prisma client for Node scripts (no Next.js/TS/adapter).
// This avoids importing the TS + adapter-based client from `db.ts`.

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: ["error"],
});

module.exports = { prisma };
