# ArtSell: Caffeine → Vercel Migration Plan

## Migration decision

The original project is a Vite + React application backed by Motoko canister code and Caffeine services. The frontend is being kept visually and functionally equivalent where practical, while the runtime is moved to a normal Next.js/Vercel stack.

| Existing Caffeine/ICP feature | Replacement |
|---|---|
| Motoko `artworks` Map | PostgreSQL `Artwork` table through Prisma |
| Motoko artwork IDs | PostgreSQL auto-increment IDs |
| Motoko cart Map | Browser-persisted Zustand cart. Checkout re-validates prices from PostgreSQL |
| Motoko `Order` records | PostgreSQL `Order` + `OrderItem` tables |
| Caffeine authorization / Internet Identity | Admin password + signed HttpOnly admin cookie |
| Caffeine object storage / `ExternalBlob` | Vercel Blob object storage |
| Caffeine Stripe helper | Stripe Checkout via official Stripe Node SDK |
| Stripe session polling | Stripe Checkout redirect + signed Stripe webhook |
| Caffeine OQL analytics | PostgreSQL `AnalyticsEvent` table + admin analytics endpoint |
| Caffeine/Vite runtime | Next.js App Router |
| Caffeine frontend actor calls | Next.js `/api/*` route handlers |
| Caffeine-specific environment/bootstrap | `.env` / Vercel project environment variables |
| Caffeine attribution/footer | Removed |
| ICP Principal user identity | Guest checkout; customer identity is email/name from Stripe Checkout |
| Caffeine/Motoko deployment | GitHub → Vercel |

## Feature coverage

- Home page and responsive gallery design: preserved.
- Shop/catalog: preserved.
- Artwork detail pages: preserved.
- Cart and quantity controls: preserved.
- Admin artwork creation: preserved.
- Admin artwork editing: preserved.
- Admin artwork deletion: preserved.
- Customer orders: preserved through Stripe webhook + PostgreSQL.
- Stripe checkout: preserved, but implemented directly with Stripe.
- Admin analytics: implemented with page-view, checkout-start and purchase events.
- External image storage: implemented with Vercel Blob.
- Authentication: intentionally changed because Internet Identity is an ICP-specific dependency.
- Database persistence: moved from canister memory to PostgreSQL.

## Important data-migration limitation

The supplied ZIP contains the Motoko schema and application logic, but it does **not** contain the live contents of the Caffeine canister or its external object-storage blobs. The original migration file explicitly initializes empty artwork and order maps.

Therefore this rebuild cannot truthfully claim that live production artwork records/images have already been copied. The application is ready for those records to be imported after exporting them from the running Caffeine deployment.

For a real production migration, export:

1. artwork ID, title, price, description, featured flag;
2. original artwork image files;
3. order/order-item history if historical orders must be retained.

Then import records into PostgreSQL and upload images to Vercel Blob.

## Security changes

- The admin password is server-side only.
- Admin session is an HttpOnly, SameSite cookie signed with `ADMIN_SESSION_SECRET`.
- Admin mutation endpoints verify the signed session server-side.
- Stripe webhook signatures are verified before creating paid orders.
- Checkout prices are looked up from PostgreSQL rather than trusted from the browser.
- Artwork uploads are sent to Vercel Blob from a protected server route.

## Testing plan

Run:

```bash
npm install
cp .env.example .env
npx prisma db push
npm run dev
```

Then verify:

1. `/` loads and is responsive.
2. `/shop` loads artwork records.
3. `/artwork/:id` loads the correct artwork.
4. Add/update/remove cart items.
5. Admin login works with `ADMIN_PASSWORD`.
6. Admin artwork upload creates a PostgreSQL record and Vercel Blob URL.
7. Admin artwork edit preserves the old image when no replacement is selected.
8. Admin artwork delete removes the record.
9. Stripe Checkout opens.
10. Stripe webhook creates a PAID order exactly once.
11. Admin order table shows the order.
12. Analytics counters change after page views/checkouts/purchases.
13. `npm run build` succeeds.

## Vercel deployment architecture

```text
Browser
   |
   v
Next.js on Vercel
   |---- App Router pages
   |---- /api/artworks
   |---- /api/admin/*
   |---- /api/checkout
   |---- /api/stripe/webhook
   |
   +---- Prisma ----> PostgreSQL
   |
   +---- Vercel Blob ----> Artwork images
   |
   +---- Stripe ----> Checkout + payment webhook
```
