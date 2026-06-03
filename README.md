# Many Many Games

A web launcher for your `html/` game collection.

## What this repo contains

- `index.html` — game launcher UI
- `html/` — folder containing playable HTML/HTM game files
- `html/folder-games.js` — file list used by the static launcher
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

This works for a static preview, but if you add a new game file you should also update `html/folder-games.js` or re-run the generator.

## Add new games

Add new `.html` or `.htm` files to the `html/` folder.

- For the Node server: no extra action required.
- For static preview: update `html/folder-games.js` or run `npm run generate` after installing Node.

## Helpful scripts

- `npm start` — run the Express server
- `npm run generate` — regenerate `html/folder-games.js` from the `html/` folder

## GitHub Pages

This repository can be published as a GitHub Pages site from the repository root.

If you want, I can also add a GitHub Actions workflow to build or deploy it automatically.
