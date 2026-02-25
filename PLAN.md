# /plan — Whale Ops 2 Rebuild Notes

## Goal
Fork/rebuild the original **whale-ops-2** experience, preserve the Call of Duty-style loading/lobby flow, and add a standalone asset preview endpoint.

## How this project was made (architecture understanding)

- **Stack:** Vite + React + TypeScript + Tailwind + Framer Motion + Wouter
- **Runtime shape:**
  - Client app in `client/`
  - Small Node/Express server in `server/`
  - Shared types in `shared/`
- **Routing:** `wouter` routes in `client/src/App.tsx`
- **Main UX flow:**
  1. `/` → cinematic loading/enter screen (`Loading.tsx`)
  2. Auth gate via in-memory/local auth context (`AuthContext`)
  3. Protected pages (`/lobby`, `/emotes`, `/roadmap`)
- **Aesthetic construction:**
  - Fullscreen media backgrounds from `client/public/images/*`
  - Motion overlays (scanlines, flicker, glow, timing animations)
  - Military HUD-inspired typography and contrast
- **Content source:** Most media is static in `client/public/images` plus generated image packs in `client/public/assets/generated`.

## How it is built/deployed

- Dev: `npm run dev` (runs Vite with host binding)
- Build: `npm run build` (client build + esbuild bundle for server)
- Production entry: `npm run start`

## Rebuild/Fork execution plan

1. Clone source and create a clean rebuild branch.
2. Create a new repo for the rebuild (not tied to existing deployment).
3. Preserve core app behavior and route flow.
4. Add **standalone `/assets` page** with:
   - visual previews (images/videos/audio)
   - exact public paths displayed
   - no button linkage from existing app UI
5. Add manifest generation script for deterministic asset indexing.
6. Build + smoke test.
7. Deploy new Vercel project with unique name.
8. Return repo URL + Vercel URL + usage notes.

## Implemented in this rebuild

- New route: `/assets`
- New page: `client/src/pages/Assets.tsx`
- New script: `scripts/generate-asset-manifest.mjs`
- Generated file target: `client/public/asset-manifest.json`
- Package scripts updated so manifest refreshes before dev/build.
