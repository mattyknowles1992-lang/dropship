import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

if (process.env.PRISMA_ACCELERATE_URL) {
  delete process.env.PRISMA_ACCELERATE_URL;
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set. Aborting seed.");
  process.exit(1);
}

const prisma = new PrismaClient({
  log: ["error"],
  adapter: new PrismaPg({
    connectionString,
    ssl: { rejectUnauthorized: false },
  }),
});

const seedAssets = [
  { key: "logo", path: "/uploads/logo-holly-jolly.png" },
  { key: "heroPrimary", path: "/uploads/hero-primary-1.jpg" },
  { key: "heroSecondary", path: "/uploads/hero-primary-1.jpg" },
];

const seedCategories = [
  {
    slug: "gifts-for-him",
    name: "Gifts for Him",
    description:
      "Explore Christmas gift ideas with fast UK Christmas delivery, from stocking fillers to thoughtful presents.",
    showInUk: true,
    showInUs: true,
  },
  {
    slug: "gifts-for-her",
    name: "Gifts for Her",
    description:
      "Explore Christmas gift ideas with fast UK Christmas delivery, from stocking fillers to thoughtful presents.",
    showInUk: true,
    showInUs: true,
  },
  {
    slug: "gifts-for-kids",
    name: "Gifts for Kids",
    description:
      "Explore Christmas gift ideas with fast UK Christmas delivery, from stocking fillers to thoughtful presents.",
    showInUk: true,
    showInUs: true,
  },
  {
    slug: "secret-santa",
    name: "Secret Santa",
    description:
      "Explore Christmas gift ideas with fast UK Christmas delivery, from stocking fillers to thoughtful presents.",
    showInUk: true,
    showInUs: true,
  },
  {
    slug: "stocking-fillers",
    name: "Stocking Fillers",
    description:
      "Explore Christmas gift ideas with fast UK Christmas delivery, from stocking fillers to thoughtful presents.",
    showInUk: true,
    showInUs: true,
  },
];

const seedProducts = [
  {
    id: "cozy-christmas-mug",
    slug: "cozy-christmas-mug",
    title: "Cozy Christmas Cocoa Mug",
    description:
      "A festive ceramic mug with a Christmas pattern, perfect for hot chocolate by the tree and winter evenings.",
    price: 14.99,
    image: "/uploads/cozy-mug.jpg",
    categorySlug: "gifts-for-her",
    tags: ["Best seller", "Stocking filler"],
    regions: ["uk", "us"],
    supplier: "aliexpress",
    externalId: "cozy-christmas-mug-123",
    sourceUrl: "https://www.aliexpress.com/",
  },
  {
    id: "winter-knit-scarf",
    slug: "winter-knit-scarf",
    title: "Winter Knit Christmas Scarf",
    description:
      "Warm knit scarf with subtle Christmas colours - a classic Christmas gift for him or her.",
    price: 29.99,
    image: "/uploads/scarf.jpg",
    categorySlug: "gifts-for-him",
    tags: ["New", "Christmas essential"],
    regions: ["uk", "us"],
    supplier: "cjdropshipping",
    externalId: "winter-knit-scarf-456",
    sourceUrl: "https://cjdropshipping.com/",
  },
  {
    id: "kids-activity-set",
    slug: "kids-activity-set",
    title: "Christmas Kids Activity Set",
    description:
      "A Christmas craft and colouring kit that keeps kids busy while waiting for Santa.",
    price: 19.99,
    image: "/uploads/activity-set.jpg",
    categorySlug: "gifts-for-kids",
    tags: ["Great for families"],
    regions: ["uk", "us"],
  },
  {
    id: "secret-santa-socks",
    slug: "secret-santa-socks",
    title: "Funny Christmas Secret Santa Socks",
    description:
      "Festive socks with a fun Christmas slogan - ideal Secret Santa gift under $20/£15.",
    price: 9.99,
    image: "/uploads/socks.jpg",
    categorySlug: "secret-santa",
    tags: ["Under 20", "Office favourite"],
    regions: ["uk", "us"],
  },
  {
    id: "santa-hats-velvet-green-trim",
    slug: "santa-hats-velvet-green-trim",
    title: "Santa Hats Velvet Christmas Hat Xmas Holiday Hat",
    description:
      "Comfortable plush Santa hats with furry green cuffs to keep things warm and festive.",
    price: 3,
    image: "/uploads/santa-hat-model-1.jpg",
    categorySlug: "stocking-fillers",
    tags: ["New", "Stocking filler"],
    regions: ["uk", "us"],
    supplier: "cjdropshipping",
    externalId: "CJYS255243501AZ",
    sourceUrl: "https://cjdropshipping.com",
  },
];

const bundleGroups = [
  { id: "3-for-20", name: "3 for £20", price: 20 },
  { id: "3-for-30", name: "3 for £30", price: 30 },
  { id: "3-for-50", name: "3 for £50", price: 50 },
];

async function seedAssetsTable() {
  console.log(`Seeding ${seedAssets.length} assets...`);
  for (const asset of seedAssets) {
    await prisma.asset.upsert({
      where: { key: asset.key },
      update: { path: asset.path },
      create: { key: asset.key, path: asset.path },
    });
  }
}

async function seedCategoriesTable() {
  console.log(`Seeding ${seedCategories.length} categories...`);
  const categoryIdsBySlug = new Map();

  for (const category of seedCategories) {
    const record = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        showInUk: category.showInUk,
        showInUs: category.showInUs,
      },
      create: {
        slug: category.slug,
        name: category.name,
        description: category.description,
        showInUk: category.showInUk,
        showInUs: category.showInUs,
      },
    });

    categoryIdsBySlug.set(category.slug, record.id);
  }

  return categoryIdsBySlug;
}

async function seedProductsTable(categoryIdsBySlug) {
  console.log(`Seeding ${seedProducts.length} products...`);

  for (const product of seedProducts) {
    const showInUk = !product.regions || product.regions.includes("uk");
    const showInUs = !product.regions || product.regions.includes("us");
    const categoryId = categoryIdsBySlug.get(product.categorySlug) ?? null;

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        title: product.title,
        description: product.description,
        price: product.price,
        image: product.image,
        imageAlt: product.title,
        tags: product.tags ?? [],
        pages: product.pages ?? [],
        showInUk,
        showInUs,
        categoryId,
        supplier: product.supplier ?? null,
        supplierSku: product.externalId ?? null,
        externalId: product.externalId ?? null,
        sourceUrl: product.sourceUrl ?? null,
      },
      create: {
        id: product.id,
        title: product.title,
        slug: product.slug,
        description: product.description,
        price: product.price,
        image: product.image,
        imageAlt: product.title,
        tags: product.tags ?? [],
        pages: product.pages ?? [],
        showInUk,
        showInUs,
        categoryId,
        supplier: product.supplier ?? null,
        supplierSku: product.externalId ?? null,
        externalId: product.externalId ?? null,
        sourceUrl: product.sourceUrl ?? null,
      },
    });
  }
}

async function seedBundleGroups() {
  console.log(`Seeding ${bundleGroups.length} bundle groups...`);

  for (const group of bundleGroups) {
    const groupRecord = await prisma.productGroup.upsert({
      where: { id: group.id },
      update: { name: group.name, description: group.name },
      create: { id: group.id, name: group.name, description: group.name },
    });

    const ruleId = `${group.id}-min3`;
    await prisma.productGroupRule.upsert({
      where: { id: ruleId },
      update: {
        groupId: groupRecord.id,
        name: group.name,
        minQuantity: 3,
        bundlePrice: group.price,
      },
      create: {
        id: ruleId,
        groupId: groupRecord.id,
        name: group.name,
        minQuantity: 3,
        bundlePrice: group.price,
      },
    });

    for (const product of seedProducts) {
      await prisma.productGroupItem.upsert({
        where: {
          groupId_productId: {
            groupId: groupRecord.id,
            productId: product.id,
          },
        },
        update: {},
        create: {
          groupId: groupRecord.id,
          productId: product.id,
        },
      });
    }
  }
}

async function main() {
  await seedAssetsTable();
  const categoryIdsBySlug = await seedCategoriesTable();
  await seedProductsTable(categoryIdsBySlug);
  await seedBundleGroups();
}

main()
  .then(() => {
    console.log("Seed completed successfully.");
  })
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
