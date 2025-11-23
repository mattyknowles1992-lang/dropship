#!/usr/bin/env tsx
/**
 * CJ Dropshipping API Connection Test
 * 
 * This script tests the connection to CJ Dropshipping API and validates credentials.
 * It fetches a small sample of products to verify everything is working.
 */

// Simple test script that doesn't require database
async function testCjApiConnection() {
  console.log("🧪 Testing CJ Dropshipping API Connection");
  console.log("==========================================\n");

  // Check environment variables
  const token = process.env.CJ_API_TOKEN;
  const url = process.env.CJ_API_URL;

  if (!token) {
    console.error("❌ Error: CJ_API_TOKEN is not set");
    console.error("Please set it in your .env.local file");
    process.exit(1);
  }

  if (!url) {
    console.error("❌ Error: CJ_API_URL is not set");
    console.error("Please set it in your .env.local file");
    process.exit(1);
  }

  console.log("✅ Environment variables found:");
  console.log(`   API URL: ${url}`);
  console.log(`   Token: ${token.substring(0, 20)}...`);
  console.log();

  // Test API connection
  console.log("📡 Testing API connection...\n");

  try {
    const testUrl = `${url}?page=1&size=10`;
    
    console.log(`Request URL: ${testUrl}`);
    console.log(`Request Headers: CJ-Access-Token: ${token.substring(0, 20)}...`);
    console.log();

    const response = await fetch(testUrl, {
      method: "GET",
      headers: {
        "CJ-Access-Token": token,
        "Content-Type": "application/json",
      },
    });

    console.log(`Response Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("\n❌ API Request Failed!");
      console.error(`Status: ${response.status}`);
      console.error(`Response: ${errorText}`);
      
      if (response.status === 401) {
        console.error("\n💡 Hint: Your API token may be invalid or expired.");
        console.error("   Please check your credentials at https://cjdropshipping.com");
      } else if (response.status === 429) {
        console.error("\n💡 Hint: Rate limit exceeded. Wait a moment and try again.");
      }
      
      process.exit(1);
    }

    const data = await response.json();
    console.log("\n✅ API Connection Successful!");
    
    // Parse the response structure
    let products: any[] = [];
    let totalCount = 0;

    // CJ API can return data in various structures
    if (Array.isArray(data)) {
      products = data;
    } else if (data.data) {
      if (Array.isArray(data.data)) {
        products = data.data;
      } else if (Array.isArray(data.data.list)) {
        products = data.data.list;
        totalCount = data.data.total || data.data.totalCount || 0;
      } else if (Array.isArray(data.data.products)) {
        products = data.data.products;
        totalCount = data.data.total || data.data.totalCount || 0;
      }
    } else if (data.result && Array.isArray(data.result.list)) {
      products = data.result.list;
      totalCount = data.result.total || data.result.totalCount || 0;
    }

    console.log(`\n📦 Sample Data Retrieved:`);
    console.log(`   Products in response: ${products.length}`);
    if (totalCount > 0) {
      console.log(`   Total products available: ${totalCount}`);
    }

    if (products.length > 0) {
      const sample = products[0];
      console.log(`\n📋 First Product Sample:`);
      console.log(`   ID: ${sample.pid || sample.id || sample.productId || 'N/A'}`);
      console.log(`   Name: ${sample.productNameEn || sample.productName || sample.name || 'N/A'}`);
      console.log(`   Price: ${sample.sellPrice || sample.price || 'N/A'}`);
      console.log(`   Image: ${sample.productImage || sample.image || 'N/A'}`);
      
      console.log(`\n🔍 Full first product data:`);
      console.log(JSON.stringify(sample, null, 2));
    } else {
      console.log("\n⚠️  Warning: No products returned in the response.");
      console.log("   This might be normal if your account has no products yet.");
    }

    console.log("\n✨ Connection test completed successfully!");
    console.log("\nYou can now run the full import script:");
    console.log("  npx tsx scripts/import-cj-products.ts --maxPages=5\n");

  } catch (error) {
    console.error("\n❌ Connection Test Failed!");
    
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
      
      if (error.message.includes("fetch")) {
        console.error("\n💡 Hint: Network error. Check your internet connection and API URL.");
      }
    } else {
      console.error(error);
    }
    
    process.exit(1);
  }
}

// Run the test
testCjApiConnection();
