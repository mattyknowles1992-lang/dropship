# CJ Dropshipping API - Quick Start Guide

This guide will help you get started with importing products from CJ Dropshipping in just a few minutes.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (optional for testing, required for full import)
- CJ Dropshipping account with API access

## Step 1: Get Your API Credentials

1. Log in to your CJ Dropshipping account at https://cjdropshipping.com
2. Navigate to **Authorization > API**
3. Generate or copy your API access token
4. Save it for the next step

Your token will look like:
```
API@CJ1596430@CJ:eyJhbGciOiJIUzI1NiJ9...
```

## Step 2: Configure Environment

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your credentials:
   ```bash
   CJ_API_TOKEN=API@CJ1596430@CJ:your_token_here
   CJ_API_URL=https://developers.cjdropshipping.com/api2.0/v1/product/list
   ADMIN_API_TOKEN=your_random_secure_token
   NEXT_PUBLIC_REGION=uk
   ```

3. For the database (if you want to import products):
   ```bash
   DATABASE_URL=postgresql://user:password@localhost:5432/dropship
   ```

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Test Your Connection

Run the connection test to verify your credentials:

```bash
npx tsx scripts/test-cj-connection.ts
```

You should see:
```
✅ API Connection Successful!
📦 Sample Data Retrieved: 10 products
```

If you get an error, check:
- Your CJ_API_TOKEN is correct
- Your internet connection is working
- The CJ API is accessible from your location

## Step 5: Try the Demo (No Database Required)

Run a demo to see the API in action without setting up a database:

```bash
npx tsx scripts/demo-cj-api.ts --maxPages=2
```

This will:
- Fetch 2 pages of products
- Show sample product data
- Display price statistics
- Save sample data to `/tmp/cj-products-sample.json`

## Step 6: Set Up Database (For Full Import)

If you want to import products into your database:

1. Make sure PostgreSQL is running

2. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```

3. Verify with Prisma Studio:
   ```bash
   npx prisma studio
   ```

## Step 7: Import Products

Now you can import products from CJ Dropshipping:

### Basic Import

Import all products (UK region, first 20 pages):
```bash
npx tsx scripts/import-cj-products.ts
```

### Import for US Region

```bash
npx tsx scripts/import-cj-products.ts --region=us
```

### Import with Filters

Search for Christmas products:
```bash
npx tsx scripts/import-cj-products.ts --keyWord=christmas --maxPages=10
```

Filter by price range:
```bash
npx tsx scripts/import-cj-products.ts --startSellPrice=10 --endSellPrice=50
```

Filter by country (products with US inventory):
```bash
npx tsx scripts/import-cj-products.ts --countryCode=US
```

Combine multiple filters:
```bash
npx tsx scripts/import-cj-products.ts \
  --region=uk \
  --keyWord=gift \
  --countryCode=GB \
  --maxPages=10 \
  --startSellPrice=5 \
  --endSellPrice=100
```

## Step 8: Use the API Endpoint

Start the development server:
```bash
npm run dev
```

Trigger an import via HTTP:
```bash
curl -X POST http://localhost:3000/api/admin/import/cj \
  -H "Content-Type: application/json" \
  -H "x-admin-token: your_admin_token" \
  -d '{
    "region": "uk",
    "pageSize": 100,
    "maxPages": 20,
    "keyWord": "christmas"
  }'
```

## Common Commands

| Command | Description |
|---------|-------------|
| `npx tsx scripts/test-cj-connection.ts` | Test API connection |
| `npx tsx scripts/demo-cj-api.ts` | Demo without database |
| `npx tsx scripts/import-cj-products.ts --help` | Show all import options |
| `npx tsx scripts/import-cj-products.ts --maxPages=5` | Import 5 pages |
| `npx prisma studio` | Browse database |
| `npm run dev` | Start dev server |

## Troubleshooting

### "CJ_API_TOKEN is not set"

Make sure you created `.env.local` with your credentials.

### "CJ API returned 401"

Your API token is invalid or expired. Get a new one from CJ Dropshipping.

### "CJ API returned 429"

You hit the rate limit (1 request/second). The script will automatically retry. You can also increase throttling:
```bash
npx tsx scripts/import-cj-products.ts --throttleMs=2000
```

### "Database connection error"

Make sure PostgreSQL is running and DATABASE_URL is correct in `.env.local`.

## Next Steps

1. ✅ Test the connection
2. ✅ Run the demo
3. ✅ Import your first batch of products
4. Set up scheduled imports (daily/weekly)
5. Integrate with your storefront
6. Configure product categories
7. Set up pricing rules

## Need Help?

- **Full Documentation**: See `docs/CJ_API_INTEGRATION.md`
- **CJ API Docs**: https://developers.cjdropshipping.com/en/api/start/development.html
- **Code Reference**: See `src/lib/importers/cj.ts`

## Example Workflow

Here's a complete workflow for importing products:

```bash
# 1. Test connection
npx tsx scripts/test-cj-connection.ts

# 2. Try demo
npx tsx scripts/demo-cj-api.ts --maxPages=2 --keyWord=christmas

# 3. Set up database
npx prisma migrate dev

# 4. Import products
npx tsx scripts/import-cj-products.ts --region=uk --maxPages=10

# 5. View in database
npx prisma studio

# 6. Start your app
npm run dev
```

That's it! You're now ready to import products from CJ Dropshipping! 🎉
