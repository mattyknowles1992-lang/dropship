# Christmas Dropshipping Store

A Next.js 16 + TypeScript dropshipping storefront focused on Christmas gifts with regional SEO for both a `.com` (US) site and a `.co.uk` (UK) site.

## Getting Started

```powershell
cd C:\dropship
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.

## Region configuration

Set the region with an environment variable:

```powershell
$env:NEXT_PUBLIC_REGION="us"   # for .com / US SEO
# or
$env:NEXT_PUBLIC_REGION="uk"   # for .co.uk / UK SEO
npm run dev
```

For production deployments, configure `NEXT_PUBLIC_REGION` separately for your `.com` and `.co.uk` environments.

## Project structure

- `src/app/layout.tsx` – global layout and region-aware metadata.
- `src/app/page.tsx` – Christmas landing page with categories, countdown, trust section and SEO copy.
- `src/content/regions.ts` – US/UK region config (titles, descriptions, currency).
- `src/content/categories.ts` – Christmas gift categories (for him, her, kids, Secret Santa).
- `src/content/products.ts` – mock products used to render gift ideas, annotated with AliExpress/CJdropshipping info.
- `src/components/Layout.tsx` – Christmas-themed shell with navigation and footer.
- `src/components/ProductCard.tsx` – reusable product card for listings.
- `src/components/ChristmasCountdown.tsx` – animated countdown to Christmas Day.
- `src/components/TrustBadges.tsx` – Klarna, card, PayPal and security trust signals.
- `src/lib/suppliers.ts` – AliExpress and CJdropshipping supplier metadata.

## Next steps

- Replace mock data in `src/content/products.ts` with real products from your dropshipping provider.
- Add dedicated category pages (e.g. `src/app/gifts-for-him/page.tsx`) and product detail pages (`src/app/products/[slug]/page.tsx`).
- Integrate live APIs/webhooks from AliExpress and CJdropshipping behind the `src/content/products.ts` abstractions.
- Refine Christmas SEO copy and internal linking for your specific niches (e.g. luxury Christmas gifts, pet Christmas presents).
