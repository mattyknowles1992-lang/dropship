import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

if (process.env.PRISMA_ACCELERATE_URL) {
  delete process.env.PRISMA_ACCELERATE_URL;
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString,
    ssl: { rejectUnauthorized: false },
  }),
});

async function main() {
  const product = await prisma.product.findFirst();
  console.log(product ? `Fetched product id: ${product.id}` : 'No products found');
}

main()
  .catch((error) => {
    console.error('Prisma query failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
