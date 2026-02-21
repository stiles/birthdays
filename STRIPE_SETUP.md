# Stripe Checkout Integration - Implementation Summary

## What was built

### 1. Infrastructure Changes
- ✅ Switched from `adapter-static` to `@sveltejs/adapter-vercel` in `svelte.config.js`
- ✅ Removed `prerender = true` from `src/routes/+layout.ts` (file deleted)
- ✅ Installed dependencies: `stripe` and `@sveltejs/adapter-vercel`

### 2. New Routes

#### `/shop` - Product Page
- **File:** `src/routes/shop/+page.svelte`
- Accepts `?month=X&day=Y` query params or lets user select birthday
- Shows personalized preview of what they'll receive
- Displays price ($10)
- "Buy Now" button triggers Stripe Checkout

#### `/shop/success` - Post-Purchase Page  
- **File:** `src/routes/shop/success/+page.svelte`
- Receives `session_id` from Stripe redirect
- Verifies payment completion
- Shows download button for the personalized PDF
- Download link expires in 1 hour

### 3. API Endpoints

#### `POST /api/create-checkout`
- **File:** `src/routes/api/create-checkout/+server.ts`
- Creates Stripe Checkout session
- Stores birthday (month/day) in session metadata
- Returns checkout URL for redirect

#### `GET /api/verify-session`
- **File:** `src/routes/api/verify-session/+server.ts`
- Verifies payment status with Stripe
- Generates one-time download token (base64url encoded)
- Token expires in 1 hour

#### `GET /api/download`
- **File:** `src/routes/api/download/+server.ts`
- Verifies download token
- Serves PDF file from `static/prints/{month}-{day}.pdf`
- Sets proper Content-Type and Content-Disposition headers

### 4. Updated CTAs

- **Main page header:** Links to `/shop` instead of Etsy
- **BirthdayPicker result banner:** Links to `/shop?month=X&day=Y` with selected birthday
- **Footer:** Links to `/shop` instead of Etsy

### 5. Configuration

- **`.env.example`:** Documents required environment variables
- User needs to create `.env` file with Stripe API keys

## What needs to be done (user's side)

### 1. Set up Stripe

1. Create or log into Stripe account
2. Get API keys from https://dashboard.stripe.com/apikeys
3. Create `.env` file:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

### 2. Generate PDFs

Run the batch script to create all 366 PDFs:
```bash
node scripts/batch-generate.js
```

This takes about 9-10 minutes and creates files in `static/prints/`.

### 3. Deploy to Vercel

The app now uses the Vercel adapter and requires server-side functions.

1. Commit changes
2. Push to GitHub
3. Deploy via Vercel dashboard or CLI
4. Add environment variables to Vercel project settings:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PUBLISHABLE_KEY`

### 4. Test the flow

1. Visit `/shop` (or click "Order a print" on main page)
2. Select a birthday
3. Click "Buy Now"
4. Use test card: `4242 4242 4242 4242`, any future date, any CVC
5. Complete checkout
6. Verify redirect to `/shop/success`
7. Download the PDF

## Technical Details

### Payment Flow

```
User selects birthday → /shop page
  ↓
Clicks "Buy Now" → POST /api/create-checkout
  ↓
Redirects to → Stripe Checkout (hosted)
  ↓
Payment succeeds → Redirects to /shop/success?session_id=xxx
  ↓
Page calls → GET /api/verify-session?session_id=xxx
  ↓
Returns download token → User clicks download
  ↓
Calls → GET /api/download?token=xxx&month=9&day=22
  ↓
Serves PDF file
```

### Security

- Download tokens are base64url encoded with embedded expiry (1 hour)
- Tokens include session ID, month, day, and expiration timestamp
- Download endpoint verifies token hasn't expired and matches requested file
- Stripe session verification happens server-side only
- No sensitive keys exposed to client

### File Storage

- PDFs stored in `static/prints/`
- Named as `{month}-{day}.pdf` (e.g., `9-22.pdf`)
- Served directly from filesystem (no database needed)

## Notes

- Price is hardcoded to $10.00 (1000 cents) in `create-checkout/+server.ts`
- Download links expire after 1 hour for security
- No webhook integration yet (can add later for order notifications)
- Etsy integration has been completely replaced with custom checkout
