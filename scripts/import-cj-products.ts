#!/usr/bin/env tsx
/**
 * CJ Dropshipping Product Import Script
 * 
 * This script fetches all products from CJ Dropshipping API and imports them into the database.
 * 
 * Usage:
 *   npx tsx scripts/import-cj-products.ts
 *   npx tsx scripts/import-cj-products.ts --region=us
 *   npx tsx scripts/import-cj-products.ts --pages=10 --pageSize=100
 *   npx tsx scripts/import-cj-products.ts --category=123 --country=US
 */

import { fetchCjFeedAll, importCjProducts } from "../src/lib/importers/cj";
import type { Region } from "../src/content/regions";

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options: {
    region?: Region;
    pageSize?: number;
    maxPages?: number;
    startPage?: number;
    throttleMs?: number;
    categoryId?: string;
    countryCode?: string;
    keyWord?: string;
    startSellPrice?: number;
    endSellPrice?: number;
  } = {};

  for (const arg of args) {
    const [key, value] = arg.replace(/^--/, "").split("=");
    
    switch (key) {
      case "region":
        if (value === "uk" || value === "us") {
          options.region = value;
        }
        break;
      case "pageSize":
      case "pages":
        options.pageSize = parseInt(value, 10);
        break;
      case "maxPages":
        options.maxPages = parseInt(value, 10);
        break;
      case "startPage":
        options.startPage = parseInt(value, 10);
        break;
      case "throttle":
      case "throttleMs":
        options.throttleMs = parseInt(value, 10);
        break;
      case "category":
      case "categoryId":
        options.categoryId = value;
        break;
      case "country":
      case "countryCode":
        options.countryCode = value;
        break;
      case "keyword":
      case "keyWord":
        options.keyWord = value;
        break;
      case "minPrice":
      case "startSellPrice":
        options.startSellPrice = parseFloat(value);
        break;
      case "maxPrice":
      case "endSellPrice":
        options.endSellPrice = parseFloat(value);
        break;
      case "help":
      case "h":
        console.log(`
CJ Dropshipping Product Import Script

Usage:
  npx tsx scripts/import-cj-products.ts [options]

Options:
  --region=<uk|us>           Target region (default: uk)
  --pageSize=<number>        Products per page (default: 100, min: 10, max: 100)
  --maxPages=<number>        Maximum pages to fetch (default: 20)
  --startPage=<number>       Starting page number (default: 1)
  --throttleMs=<number>      Delay between requests in ms (default: 1200)
  --categoryId=<string>      Filter by CJ category ID
  --countryCode=<string>     Filter by country code (e.g., US, GB, CN)
  --keyWord=<string>         Search by product name or SKU
  --startSellPrice=<number>  Minimum price filter
  --endSellPrice=<number>    Maximum price filter
  --help                     Show this help message

Examples:
  # Import all products for UK region
  npx tsx scripts/import-cj-products.ts --region=uk

  # Import first 5 pages only
  npx tsx scripts/import-cj-products.ts --maxPages=5

  # Import products in specific price range
  npx tsx scripts/import-cj-products.ts --startSellPrice=10 --endSellPrice=50

  # Import products with inventory in the US
  npx tsx scripts/import-cj-products.ts --countryCode=US

  # Search for specific products
  npx tsx scripts/import-cj-products.ts --keyWord=christmas
        `);
        process.exit(0);
    }
  }

  return options;
}

async function main() {
  console.log("🎄 CJ Dropshipping Product Import Script");
  console.log("=========================================\n");

  // Check environment variables
  if (!process.env.CJ_API_TOKEN) {
    console.error("❌ Error: CJ_API_TOKEN environment variable is not set");
    console.error("Please set it in your .env.local file or environment");
    process.exit(1);
  }

  if (!process.env.CJ_API_URL) {
    console.error("❌ Error: CJ_API_URL environment variable is not set");
    console.error("Please set it in your .env.local file or environment");
    process.exit(1);
  }

  const args = parseArgs();
  const region: Region = args.region ?? "uk";

  console.log("Configuration:");
  console.log(`  Region: ${region}`);
  console.log(`  API URL: ${process.env.CJ_API_URL}`);
  console.log(`  Page Size: ${args.pageSize ?? 100}`);
  console.log(`  Max Pages: ${args.maxPages ?? 20}`);
  console.log(`  Start Page: ${args.startPage ?? 1}`);
  console.log(`  Throttle: ${args.throttleMs ?? 1200}ms`);
  
  if (args.categoryId) console.log(`  Category ID: ${args.categoryId}`);
  if (args.countryCode) console.log(`  Country Code: ${args.countryCode}`);
  if (args.keyWord) console.log(`  Keyword: ${args.keyWord}`);
  if (args.startSellPrice) console.log(`  Min Price: ${args.startSellPrice}`);
  if (args.endSellPrice) console.log(`  Max Price: ${args.endSellPrice}`);
  
  console.log("\n📥 Fetching products from CJ Dropshipping API...\n");

  const startTime = Date.now();

  try {
    // Fetch products
    const products = await fetchCjFeedAll({
      pageSize: args.pageSize,
      maxPages: args.maxPages,
      startPage: args.startPage,
      throttleMs: args.throttleMs,
      categoryId: args.categoryId,
      countryCode: args.countryCode,
      keyWord: args.keyWord,
      startSellPrice: args.startSellPrice,
      endSellPrice: args.endSellPrice,
    });

    console.log(`✅ Fetched ${products.length} products from CJ API`);

    if (products.length === 0) {
      console.log("\n⚠️  No products found. Check your filters or API configuration.");
      return;
    }

    console.log("\n💾 Importing products into database...\n");

    // Import products
    const result = await importCjProducts(region, products);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log("\n✨ Import completed!");
    console.log(`  Products fetched: ${products.length}`);
    console.log(`  Products imported: ${result.imported}`);
    console.log(`  Duration: ${duration}s`);
    console.log(`  Region: ${region}`);

  } catch (error) {
    console.error("\n❌ Import failed:");
    if (error instanceof Error) {
      console.error(`  ${error.message}`);
      if (error.stack) {
        console.error("\nStack trace:");
        console.error(error.stack);
      }
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

main();
