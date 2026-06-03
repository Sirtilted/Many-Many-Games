# Many Many Games

A web launcher for your `html/` game collection.

## What this repo contains

- `index.html` — game launcher UI
- `html/` — folder containing playable HTML/HTM game files
- `folder-games.js` — file list used by the static launcher
- `server.js` — optional Node.js server for dynamic auto-detection
- `package.json` — Node project metadata

## Run locally

### Option 1: Use the Node.js server (recommended for automatic updates)

1. Install Node.js from https://nodejs.org/
2. Run:
   ```bash
   npm install
   npm start
   ```
3. Open `http://localhost:3000`

The Node server will scan `html/` automatically and serve new games immediately.

### Option 2: Use VS Code Live Server

1. Open `index.html` in VS Code
2. Click **Go Live** in the bottom-right corner

This works for a static preview; if you add a new game file you should also update `folder-games.js` or re-run the generator.

## Add new games

Add new `.html` or `.htm` files to the `html/` folder.

- For the Node server: no extra action required.
- For static preview: update `folder-games.js` or run `npm run generate` after installing Node.

## Helpful scripts

- `npm start` — run the Express server
- `npm run generate` — regenerate `folder-games.js` from the `html/` folder

## GitHub Pages

This repository can be published as a GitHub Pages site from the repository root.

If you want, I can also add a GitHub Actions workflow to build or deploy it automatically.

## Vercel notes

- Vercel serves the repository contents as a static site. To play games from this launcher on Vercel you must either:
   - Commit and push the `html/` folder with your game files, or
   - Host the game files on a CDN or another static host and set the "Games base URL" in the launcher UI (top-right) to that host (for example `https://cdn.example.com/games/`).

- This repository now includes a Vercel build helper that installs Git LFS during the build and pulls the actual game files before deployment.

- The helper script is now part of the repository and the package also includes a standard `build` script, so Vercel should run it during deploy.

- If the Vercel build still cannot fetch LFS objects, use an external static host for the `html/` assets and point the launcher at that URL.
