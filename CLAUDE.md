# One In, One Out — Project Brief

## What this app is
A minimalist lifestyle web app that enforces the **one-in-one-out rule** for a London household. Every item purchased creates a "discard debt" in its category; the debt clears when the same number of items are discarded. Financial values tracked in £.

## Household profile
- Couple, central London flat
- 1-year-old baby
- No car, no pet

## Live app
Deployed on Vercel. Repo: `github.com/annaying0929/minimalist-app`

## Tech stack
- React 19 + Vite 8 + TypeScript
- Tailwind CSS v3
- localStorage (no backend, no auth — fully private)
- Manual PWA (manifest.webmanifest + sw.js) — **no vite-plugin-pwa**, it doesn't support Vite 8

## Design tokens
| Token | Value | Meaning |
|---|---|---|
| `accent` | `#4A6741` | Sage green — clear / balanced |
| `warn` | `#C4704F` | Terracotta — has debt |
| `bg` | `#F7F6F3` | Warm off-white background |
| Font | Inter | Google Fonts |

## 15 categories
clothing-adults, clothing-baby, shoes, books, electronics, kitchen, furniture, decorations, toys, baby-gear, games, sports, bedding, stationery, personal-care

## Key files
| File | Purpose |
|---|---|
| `src/types.ts` | Category, Entry, AppState interfaces |
| `src/data/categories.ts` | 15 pre-defined categories with icons |
| `src/hooks/useStore.ts` | localStorage state (entries + addEntry) |
| `src/components/LogModal.tsx` | Buy/discard form with live debt notice |
| `src/components/Dashboard.tsx` | StatStrip + category grid + activity feed |
| `src/components/History.tsx` | Filterable full entry log |
| `public/manifest.webmanifest` | PWA manifest |
| `public/sw.js` | Service worker (cache-first, offline support) |
| `public/icon.svg` | Source icon — two chevron arrows on sage green |

## Data model
```ts
interface Entry {
  id: string;           // crypto.randomUUID()
  type: 'bought' | 'discarded';
  categoryId: string;
  name: string;
  quantity: number;
  estimatedValue: number; // £
  date: string;           // ISO string
}
```
All derived state (debt per category, totals) is computed from entries — nothing stored redundantly.

## Important constraints
- Do NOT add vite-plugin-pwa — peer dep conflict with Vite 8, breaks Vercel build
- Icons are pre-generated PNGs in `public/` (pwa-64, pwa-192, pwa-512, maskable-512, apple-touch-180)
- App is installed on iPhone as PWA via Safari → Share → Add to Home Screen
