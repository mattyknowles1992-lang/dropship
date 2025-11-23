# Christmas Dropshipping Store

A Next.js 16 + TypeScript dropshipping storefront focused on Christmas gifts with regional SEO for both a `.com` (US) site and a `.co.uk` (UK) site.

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your CJ Dropshipping API credentials

# Run the development server
npm run dev
```

Then open `http://localhost:3000` in your browser.

## CJ Dropshipping API Integration

This project includes a full CJ Dropshipping API integration for importing products.

### Quick Start

1. **Configure your credentials** in `.env.local`:
   ```bash
   CJ_API_TOKEN=your_token_here
   CJ_API_URL=https://developers.cjdropshipping.com/api2.0/v1/product/list
   ADMIN_API_TOKEN=your_admin_token
   ```

2. **Test the connection**:
   ```bash
   npx tsx scripts/test-cj-connection.ts
   ```

3. **Import products**:
   ```bash
   # Import all products (UK region, first 20 pages)
   npx tsx scripts/import-cj-products.ts

   # Import with filters
   npx tsx scripts/import-cj-products.ts --keyWord=christmas --maxPages=10
   ```

For detailed documentation, see [docs/CJ_API_INTEGRATION.md](docs/CJ_API_INTEGRATION.md).

## Region configuration

Set the region with an environment variable:

```bash
# For .com / US SEO
NEXT_PUBLIC_REGION=us npm run dev

# For .co.uk / UK SEO
NEXT_PUBLIC_REGION=uk npm run dev
```

Or on Windows PowerShell:

```powershell
$env:NEXT_PUBLIC_REGION="us"   # for .com / US SEO
# or
$env:NEXT_PUBLIC_REGION="uk"   # for .co.uk / UK SEO
npm run dev
```

For production deployments, configure `NEXT_PUBLIC_REGION` separately for your `.com` and `.co.uk` environments.

## Project structure

### Application Structure
- `src/app/layout.tsx` – global layout and region-aware metadata.
- `src/app/page.tsx` – Christmas landing page with categories, countdown, trust section and SEO copy.
- `src/app/api/admin/import/cj/` – API endpoints for importing CJ products.

### Content & Configuration
- `src/content/regions.ts` – US/UK region config (titles, descriptions, currency).
- `src/content/categories.ts` – Christmas gift categories (for him, her, kids, Secret Santa).
- `src/content/products.ts` – mock products used to render gift ideas, annotated with AliExpress/CJdropshipping info.

### Components
- `src/components/Layout.tsx` – Christmas-themed shell with navigation and footer.
- `src/components/ProductCard.tsx` – reusable product card for listings.
- `src/components/ChristmasCountdown.tsx` – animated countdown to Christmas Day.
- `src/components/TrustBadges.tsx` – Klarna, card, PayPal and security trust signals.

### API Integration
- `src/lib/importers/cj.ts` – CJ Dropshipping API client and product importer.
- `src/lib/importers/aliexpress.ts` – AliExpress API client (placeholder).
- `src/lib/suppliers.ts` – AliExpress and CJdropshipping supplier metadata.

### Scripts
- `scripts/import-cj-products.ts` – CLI tool for importing CJ products with filters.
- `scripts/test-cj-connection.ts` – Test script to verify CJ API connection.

### Documentation
- `docs/CJ_API_INTEGRATION.md` – Complete CJ API integration guide.

## Database

This project uses PostgreSQL with Prisma ORM.

```bash
# Set up database
npx prisma migrate dev

# View database in browser
npx prisma studio
```

## Available Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run start` – Start production server
- `npm run lint` – Run ESLint
- `npx tsx scripts/test-cj-connection.ts` – Test CJ API connection
- `npx tsx scripts/import-cj-products.ts` – Import products from CJ

## Next steps

- ✅ CJ Dropshipping API integration is complete
- [ ] Set up database and run migrations
- [ ] Import initial product catalog from CJ
- [ ] Add dedicated category pages (e.g. `src/app/gifts-for-him/page.tsx`)
- [ ] Add product detail pages (`src/app/products/[slug]/page.tsx`)
- [ ] Set up scheduled product imports (cron or GitHub Actions)
- [ ] Refine Christmas SEO copy and internal linking
- [ ] Configure AliExpress integration (optional)

