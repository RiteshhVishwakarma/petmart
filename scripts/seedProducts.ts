/**
 * Run this ONCE to seed products into Firestore.
 * After running, delete or ignore this file.
 *
 * How to run:
 *   npx ts-node --skip-project scripts/seedProducts.ts
 *
 * NOTE: This uses firebase-admin — install it first:
 *   npm install -D firebase-admin ts-node
 */

// ─── We'll do this from inside the app instead ───────────────────────────────
// Since Expo doesn't support Node scripts easily, we'll add a one-time
// "Seed" button in the Admin screen that pushes products to Firestore.
// See AdminScreen.tsx for the seed logic.

export {};
