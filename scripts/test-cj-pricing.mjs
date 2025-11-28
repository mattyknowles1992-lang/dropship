// Lightweight CJ pricing/stock test harness.
// This script DOES NOT call the external CJ API.
// It reads a sample of stored RawCjProduct rows and compares raw CJ
// prices/currency against the mapped Product rows.

import { prisma } from "../src/lib/db-script.cjs";

async function main() {
  const limit = Number(process.env.CJ_TEST_LIMIT ?? 10);

  console.log("CJ pricing test (local only)");
  console.log("Limit:", limit);

  const raws = await prisma.rawCjProduct.findMany({
    orderBy: { updatedAt: "desc" },
    take: limit,
  });

  if (raws.length === 0) {
    console.log("No RawCjProduct rows found. Run a small CJ sync once, then re-run this test.");
    return;
  }

  for (const row of raws) {
    const data = /** @type {any} */ (row.data);
    const pid = row.id;

    const product = {
      pid: pid,
      nameEn: data.nameEn ?? null,
      productNameEn: data.productNameEn ?? null,
      nowPrice: data.nowPrice ?? null,
      discountPrice: data.discountPrice ?? null,
      sellPrice: data.sellPrice ?? null,
      costPrice: data.costPrice ?? null,
      currency: data.currency ?? null,
      warehouseInventoryNum: data.warehouseInventoryNum ?? null,
      totalVerifiedInventory: data.totalVerifiedInventory ?? null,
    };

    const title = product.nameEn || product.productNameEn || "(no title)";
    const prices = {
      sellPrice: Number(product.sellPrice ?? 0) || null,
      nowPrice: Number(product.nowPrice ?? 0) || null,
      discountPrice: Number(product.discountPrice ?? 0) || null,
      costPrice: Number(product.costPrice ?? 0) || null,
    };

    console.log("────");
    console.log("CJ pid:", pid);
    console.log("Title:", title);
    console.log("Currency:", product.currency ?? "(none)");
    console.log("Raw prices:", prices);
    console.log("Raw inventory totals:", {
      warehouseInventoryNum: product.warehouseInventoryNum,
      totalVerifiedInventory: product.totalVerifiedInventory,
    });

    // Find the corresponding normalised Product row if present.
    const mapped = await prisma.product.findFirst({
      where: { externalId: pid, supplier: "cjdropshipping" },
    });

    if (!mapped) {
      console.log("Local Product: (not yet imported via CJ normaliser)");
      continue;
    }

    console.log("Local Product:", {
      id: mapped.id,
      title: mapped.title,
      price: mapped.price?.toString(),
      costPrice: mapped.costPrice?.toString() ?? null,
      currency: mapped.cjCurrency ?? null,
      stock: mapped.stock,
      warehouseId: mapped.warehouseId,
      warehouseCode: mapped.warehouseCode,
    });
  }
}

main()
  .catch((error) => {
    console.error("CJ pricing test failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await prisma.$disconnect();
    } catch {
      // ignore
    }
  });
