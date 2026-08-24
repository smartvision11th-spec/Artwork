# Simple deployment: GitHub + Vercel + Supabase

This version does NOT use Prisma, Caffeine, ICP, Motoko, Internet Identity, or Vercel Blob.

## 1. GitHub
Upload the contents of this folder to a new GitHub repository. Do not upload `.env` files.

## 2. Supabase
Create a Supabase project. Open SQL Editor and run the complete `supabase.sql` file once.
Then open Project Settings > API and copy:
- Project URL
- service_role key (keep this secret)

## 3. Vercel
Import the GitHub repository into Vercel as a Next.js project.
Add these Environment Variables:
- NEXT_PUBLIC_SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- ADMIN_PASSWORD
- ADMIN_SESSION_SECRET
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- NEXT_PUBLIC_SITE_URL

Redeploy after adding variables.

## 4. Admin
Open /admin on the deployed site. Use ADMIN_PASSWORD.
Add one artwork and confirm it appears on /shop.

## 5. Stripe
In Stripe Dashboard, create a webhook endpoint:
https://YOUR_DOMAIN/api/stripe/webhook
Listen for `checkout.session.completed`.
Copy the webhook signing secret into STRIPE_WEBHOOK_SECRET and redeploy.

## 6. Domain
Only connect the final custom domain after the vercel.app URL works end-to-end.

## 7. Old Caffeine data
Export artwork metadata and images from Caffeine separately. Upload/import them after the new system is verified.
