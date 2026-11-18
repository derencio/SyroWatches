# Syro — placeholder site

A minimal "coming soon" page for **Syro**: the logo on a dark background, a small flowing rainbow bar hinting at the product, and the line *"Time is ticking..."*. A day version with inverted colours is one click away (top-right toggle) and the visitor's choice is remembered.

## Tech

- [TanStack Start](https://tanstack.com/start) + React 19, Vite
- Tailwind CSS 4 plus a small block of hand-written CSS (`src/styles.css`)
- Netlify hosting and Netlify Image CDN for the logo asset

## Run locally

```bash
pnpm install
netlify dev   # or: pnpm dev
```

## Key files

- `src/routes/index.tsx` — the page
- `src/styles.css` — placeholder styles (bottom of file, `--syro-*` variables)
- `public/img/syro-logo.png`, `public/img/syro-mark.png` — transparent white logo assets
