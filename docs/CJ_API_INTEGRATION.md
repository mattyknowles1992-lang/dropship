# CJ Dropshipping API Integration

This document explains how to use the CJ Dropshipping API integration to import products into your dropshipping store.

## Setup

### 1. Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# CJ Dropshipping API credentials
CJ_API_TOKEN=your_cj_api_token_here
CJ_API_URL=https://developers.cjdropshipping.com/api2.0/v1/product/list

# Admin API token for authentication
ADMIN_API_TOKEN=your_admin_token_here

# Region configuration
NEXT_PUBLIC_REGION=uk  # or 'us'
```

### 2. Database Setup

Make sure your PostgreSQL database is running and configured. The connection string should be set in your `.env` or `.env.local`:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/dropship
```

Run Prisma migrations to set up the database schema:

```bash
npx prisma migrate dev
```

## Usage

### Option 1: CLI Script (Recommended for bulk imports)

The CLI script provides the most flexibility and control over the import process.

#### Basic Usage

```bash
# Import all products (default: UK region, 20 pages, 100 products per page)
npx tsx scripts/import-cj-products.ts

# Import for US region
npx tsx scripts/import-cj-products.ts --region=us

# Import first 5 pages only
npx tsx scripts/import-cj-products.ts --maxPages=5

# Import with specific page size
npx tsx scripts/import-cj-products.ts --pageSize=50 --maxPages=10
```

#### Advanced Filtering

```bash
# Search for specific products
npx tsx scripts/import-cj-products.ts --keyWord=christmas

# Filter by price range
npx tsx scripts/import-cj-products.ts --startSellPrice=10 --endSellPrice=50

# Filter by country inventory
npx tsx scripts/import-cj-products.ts --countryCode=US

# Filter by category ID
npx tsx scripts/import-cj-products.ts --categoryId=12345

# Combine multiple filters
npx tsx scripts/import-cj-products.ts --region=uk --keyWord=gift --countryCode=GB --maxPages=10
```

#### Available Options

- `--region=<uk|us>` - Target region (default: uk)
- `--pageSize=<number>` - Products per page (default: 100, min: 10, max: 100)
- `--maxPages=<number>` - Maximum pages to fetch (default: 20)
- `--startPage=<number>` - Starting page number (default: 1)
- `--throttleMs=<number>` - Delay between requests in ms (default: 1200)
- `--categoryId=<string>` - Filter by CJ category ID
- `--countryCode=<string>` - Filter by country code (e.g., US, GB, CN)
- `--keyWord=<string>` - Search by product name or SKU
- `--startSellPrice=<number>` - Minimum price filter
- `--endSellPrice=<number>` - Maximum price filter
- `--help` - Show help message

### Option 2: API Endpoints

You can also trigger imports via HTTP API calls, which is useful for automation or scheduled jobs.

#### Standard Import Endpoint

```bash
curl -X POST http://localhost:3000/api/admin/import/cj \
  -H "Content-Type: application/json" \
  -H "x-admin-token: your_admin_token" \
  -d '{
    "region": "uk",
    "pageSize": 100,
    "maxPages": 20,
    "categoryId": "12345",
    "countryCode": "GB",
    "keyWord": "christmas"
  }'
```

#### Slow Import Endpoint (with more throttling)

```bash
curl -X POST http://localhost:3000/api/admin/import/cj/slow \
  -H "Content-Type: application/json" \
  -H "x-admin-token: your_admin_token" \
  -d '{
    "region": "uk",
    "pageSize": 20,
    "pages": 5,
    "throttleMs": 3000
  }'
```

## API Parameters

### Product List Parameters

The CJ Dropshipping API v2.0 supports the following parameters:

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `page` | number | Page number (min: 1, max: 1000) | 1 |
| `size` | number | Results per page (min: 10, max: 100) | 100 |
| `categoryId` | string | Filter by category ID (third level) | - |
| `countryCode` | string | Filter by country inventory (e.g., CN, US, GB) | - |
| `keyWord` | string | Search by product name or SKU | - |
| `startSellPrice` | number | Minimum price filter | - |
| `endSellPrice` | number | Maximum price filter | - |

## Authentication

All API requests require authentication via the `CJ-Access-Token` header:

```bash
CJ-Access-Token: your_token_here
```

The token is automatically included by the importer functions when `CJ_API_TOKEN` is set in your environment variables.

## Rate Limiting

CJ Dropshipping enforces a rate limit of approximately **1 request per second**. The importer includes:

- Automatic retry logic with exponential backoff
- Configurable throttling between requests (default: 1200ms)
- Rate limit detection and error handling

To avoid rate limit issues:

1. Use the `--throttleMs` option to add delays between requests
2. Reduce `--maxPages` for smaller imports
3. Use the slow import endpoint for production environments

## Data Structure

### Imported Product Fields

Each product imported from CJ includes:

- `externalId` - CJ product ID (pid)
- `title` - Product name
- `slug` - URL-friendly slug
- `description` - Product description
- `price` - Selling price
- `compareAt` - Original/retail price (if higher than selling price)
- `image` - Main product image URL
- `imageAlt` - Image alt text
- `showInUk` / `showInUs` - Region visibility flags
- `tags` - Product tags (including warehouse info)
- `supplier` - Always "cjdropshipping"
- `sourceUrl` - Link to product on CJ platform
- `variants` - Product variants (if available)
- `stock` - Stock quantity (if available)

### Raw Data Storage

The importer also stores the raw CJ API response in the `RawCjProduct` table for:

- Data auditing
- Future re-processing
- Debugging

## Troubleshooting

### Common Issues

#### 1. "CJ_API_TOKEN is not set"

Make sure you have created a `.env.local` file with your CJ API token:

```bash
CJ_API_TOKEN=API@CJ1596430@CJ:your_token_here
```

#### 2. "CJ API returned 401"

Your API token is invalid or expired. Get a new token from the CJ Dropshipping dashboard.

#### 3. "CJ API returned 429"

You've hit the rate limit. Wait a few seconds and try again, or increase the `throttleMs` value.

#### 4. Database connection errors

Ensure PostgreSQL is running and `DATABASE_URL` is correctly configured.

## Best Practices

1. **Start Small**: Begin with a small number of pages to test the integration
2. **Use Filters**: Use category/country filters to import only relevant products
3. **Schedule Wisely**: Run large imports during off-peak hours
4. **Monitor Logs**: Check console output for errors or warnings
5. **Regular Updates**: Schedule periodic imports to keep product data fresh
6. **Backup Database**: Always backup your database before running large imports

## Additional Features

### Variant and Stock Sync

For products with variants, you can sync detailed variant and stock information:

```typescript
import { syncCjVariantsForProduct } from "@/lib/importers/cj";

// Sync variants for a specific product
const result = await syncCjVariantsForProduct({
  id: "product_id",
  externalId: "cj_pid"
});

console.log(`Synced ${result.variantCount} variants, total stock: ${result.totalStock}`);
```

### Freight Calculation

Calculate shipping costs for specific products:

```typescript
import { calculateCjFreightQuote } from "@/lib/importers/cj";

const quote = await calculateCjFreightQuote({
  countryCode: "US",
  postCode: "10001",
  items: [
    { vid: "variant_id_1", quantity: 2 },
    { vid: "variant_id_2", quantity: 1 }
  ]
});

console.log("Shipping options:", quote.options);
```

## Support

For issues with:

- **CJ API**: Contact CJ Dropshipping support or check their [official documentation](https://developers.cjdropshipping.com/en/api/start/development.html)
- **Integration Code**: Check the implementation in `src/lib/importers/cj.ts`
- **Database Issues**: Review Prisma schema in `prisma/schema.prisma`

## References

- [CJ Dropshipping API Documentation](https://developers.cjdropshipping.com/en/api/start/development.html)
- [CJ Product API v2.0](https://developers.cjdropshipping.com/en/api/api2/api/product.html)
- [CJ Authorization Guide](https://developers.cjdropshipping.com/en/summary/course.html)
