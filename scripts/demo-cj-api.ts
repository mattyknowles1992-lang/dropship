#!/usr/bin/env tsx
/**
 * CJ Dropshipping API Demo (No Database Required)
 * 
 * This script demonstrates fetching products from CJ Dropshipping API
 * without requiring a database connection.
 */

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options: {
    maxPages?: number;
    pageSize?: number;
    categoryId?: string;
    countryCode?: string;
    keyWord?: string;
  } = {};

  for (const arg of args) {
    const [key, value] = arg.replace(/^--/, "").split("=");
    
    switch (key) {
      case "pageSize":
        options.pageSize = parseInt(value, 10);
        break;
      case "maxPages":
        options.maxPages = parseInt(value, 10);
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
    }
  }

  return options;
}

async function fetchCjProducts(
  page: number,
  size: number,
  options?: {
    categoryId?: string;
    countryCode?: string;
    keyWord?: string;
  }
) {
  const url = process.env.CJ_API_URL;
  const token = process.env.CJ_API_TOKEN;

  if (!url || !token) {
    throw new Error("CJ_API_URL and CJ_API_TOKEN must be set");
  }

  const queryParams: Record<string, string> = {
    page: String(page),
    size: String(size),
  };

  if (options?.categoryId) queryParams.categoryId = options.categoryId;
  if (options?.countryCode) queryParams.countryCode = options.countryCode;
  if (options?.keyWord) queryParams.keyWord = options.keyWord;

  const query = new URLSearchParams(queryParams).toString();
  const fetchUrl = `${url}?${query}`;

  const response = await fetch(fetchUrl, {
    method: "GET",
    headers: {
      "CJ-Access-Token": token,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`CJ API returned ${response.status}: ${text}`);
  }

  return response.json();
}

function parseProducts(data: any): any[] {
  // Handle various CJ API response structures
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.data?.list)) return data.data.list;
  if (Array.isArray(data.data?.products)) return data.data.products;
  if (Array.isArray(data.result?.list)) return data.result.list;
  return [];
}

async function main() {
  console.log("🎄 CJ Dropshipping API Demo");
  console.log("============================\n");

  const args = parseArgs();
  const pageSize = args.pageSize || 20;
  const maxPages = args.maxPages || 2;

  console.log("Configuration:");
  console.log(`  Page Size: ${pageSize}`);
  console.log(`  Max Pages: ${maxPages}`);
  if (args.categoryId) console.log(`  Category ID: ${args.categoryId}`);
  if (args.countryCode) console.log(`  Country Code: ${args.countryCode}`);
  if (args.keyWord) console.log(`  Keyword: ${args.keyWord}`);
  console.log();

  const allProducts: any[] = [];
  
  for (let page = 1; page <= maxPages; page++) {
    console.log(`📥 Fetching page ${page}/${maxPages}...`);
    
    try {
      const data = await fetchCjProducts(page, pageSize, {
        categoryId: args.categoryId,
        countryCode: args.countryCode,
        keyWord: args.keyWord,
      });

      const products = parseProducts(data);
      
      if (products.length === 0) {
        console.log(`   No products found on page ${page}`);
        break;
      }

      console.log(`   ✅ Retrieved ${products.length} products`);
      allProducts.push(...products);

      // Show sample product from first page
      if (page === 1 && products.length > 0) {
        const sample = products[0];
        console.log(`\n   📦 Sample Product:`);
        console.log(`      ID: ${sample.pid || sample.id || 'N/A'}`);
        console.log(`      Name: ${(sample.productNameEn || sample.productName || sample.name || 'N/A').substring(0, 60)}`);
        console.log(`      Price: $${sample.sellPrice || sample.price || 'N/A'}`);
        console.log();
      }

      // Respect rate limits
      if (page < maxPages) {
        await new Promise(resolve => setTimeout(resolve, 1200));
      }

    } catch (error) {
      console.error(`   ❌ Error fetching page ${page}:`, error instanceof Error ? error.message : error);
      break;
    }
  }

  console.log(`\n✨ Demo Complete!`);
  console.log(`   Total products fetched: ${allProducts.length}`);
  
  if (allProducts.length > 0) {
    // Show statistics
    const prices = allProducts
      .map(p => p.sellPrice || p.price)
      .filter(p => typeof p === 'number' && p > 0);
    
    if (prices.length > 0) {
      const avgPrice = (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2);
      const minPrice = Math.min(...prices).toFixed(2);
      const maxPrice = Math.max(...prices).toFixed(2);
      
      console.log(`\n   💰 Price Statistics:`);
      console.log(`      Min: $${minPrice}`);
      console.log(`      Max: $${maxPrice}`);
      console.log(`      Avg: $${avgPrice}`);
    }

    // Show unique warehouses
    const warehouses = new Set(
      allProducts
        .map(p => p.warehouse || p.warehouseName || p.warehouseCode)
        .filter(Boolean)
    );
    
    if (warehouses.size > 0) {
      console.log(`\n   🏭 Warehouses Found: ${warehouses.size}`);
      console.log(`      ${Array.from(warehouses).slice(0, 5).join(', ')}${warehouses.size > 5 ? '...' : ''}`);
    }

    // Save sample to file
    console.log(`\n   💾 Saving sample data to /tmp/cj-products-sample.json`);
    const fs = await import('fs/promises');
    await fs.writeFile(
      '/tmp/cj-products-sample.json',
      JSON.stringify(allProducts.slice(0, 10), null, 2)
    );
    console.log(`   ✅ Saved first 10 products for inspection`);
  }

  console.log(`\n📚 Next Steps:`);
  console.log(`   1. Review sample data: cat /tmp/cj-products-sample.json`);
  console.log(`   2. Set up database and run: npx tsx scripts/import-cj-products.ts`);
  console.log(`   3. See docs/CJ_API_INTEGRATION.md for full documentation\n`);
}

main().catch(error => {
  console.error("\n❌ Error:", error instanceof Error ? error.message : error);
  process.exit(1);
});
