// One-off helper script to normalise CJ supplier key values.
// Usage (from project root):
//   node ./scripts/fix-cj-supplier.mjs

import { prisma } from "../src/lib/db";

async function main() {
  const before = await prisma.product.count({ where: { supplier: "cj" } });
  console.log(`Found ${before} products with supplier = "cj"`);

  if (before === 0) {
    console.log("No records to update. Done.");
    return;
  }

  const result = await prisma.product.updateMany({
    where: { supplier: "cj" },
    data: { supplier: "cjdropshipping" },
  });

  console.log(`Updated ${result.count} products to supplier = "cjdropshipping"`);
}

main()
  .catch((error) => {
    console.error("fix-cj-supplier failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await prisma.$disconnect();
    } catch {
      // ignore
    }
  });
