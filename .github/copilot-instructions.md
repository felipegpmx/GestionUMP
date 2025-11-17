# Copilot / AI Agent Instructions

This file describes the minimal, actionable knowledge an AI coding agent needs to be productive in this repository.

**Project Overview:**
- **App entry:** `index.html` — single-page web app (vanilla JS) and PWA assets (`manifest.json`, `sw.js`).
- **Core app object:** `App` is defined in `script.js` and holds state (`App.data`), storage helpers (`App.storage`), UI helpers (`App.ui`), and feature areas (`App.form`, `App.registros`, `App.puntos`, etc.).
- **Modules folder:** feature modules live in `Modules/` (examples: `Modules/users.js`, `Modules/maps.js`, `Modules/backup.js`, `Modules/pdf-export.js`). Each module exports a global const (e.g. `Users`, `MapModule`, `Backup`, `PDFExport`) and usually registers DOMContentLoaded init logic.

**How the app runs (developer workflow):**
- No build step — open `index.html` in a browser or use a static server (`Live Server` or `npx http-server`).
- The page loads `script.js` first then individual modules via `<script src="modules/..">` tags in `index.html`. Maintain that order for modules that rely on `App`.
- Persistent state is stored in `localStorage` under keys: `datosControles`, `puntos`, `papelera`, `currentUser`, `darkMode`, `autoBackup`, `lastAutoBackup`.

**Important integration points / external libs:**
- Charts: `Chart.js` (loaded from CDN in `index.html`) — used by `Modules/charts.js`.
- Maps: `Leaflet` (CDN) — used by `Modules/maps.js` (global `L` available).
- PDF: `jsPDF` + `jspdf-autotable` — used by `Modules/pdf-export.js`.
- Service worker: `sw.js` registers a PWA service worker at runtime.

**Conventions and patterns to follow when editing/adding code:**
- Global namespacing: follow existing pattern — modules export a single global const (e.g. `const Users = { ... }`). Avoid polluting the global scope beyond that.
- Spanish identifiers: function names, comments and UI texts are in Spanish. Keep messages consistent (e.g. `App.toast(...)` expects emojis + Spanish text).
- DOM usage: the app manipulates DOM directly. Modules rely on specific element IDs present in `index.html` (e.g. `#controlForm`, `#tablaCuerpo`, `#map`). When adding HTML, add matching IDs.
- Data normalization: points are normalized by `App.utils.normalizarBaseDatos` — when changing structure, update normalization logic.
- Module init: if a module needs to run on load, add a `document.addEventListener('DOMContentLoaded', ...)` block similar to other modules.

**Files to inspect for examples:**
- `script.js` — app state, persistence, UI flows and primary entry points.
- `index.html` — DOM structure, order of script tags, and controls referenced by modules.
- `Modules/users.js` — role & permission pattern (`Users.hasPermission`) and login flow.
- `Modules/maps.js` — Leaflet usage and how the map consumes aggregated `App.data`.
- `Modules/backup.js` & `Modules/pdf-export.js` — patterns for exports (JSON, CSV, PDF) and FileReader usage.
- `Modules/coordenadas-helper.js` — CSV import and coordinate validation patterns.

**Manual test / debug commands and checks:**
- Open the app: open `index.html` in Chrome/Firefox. Use DevTools console for debugging.
- Reinitialize app from console: `App.init()` (reloads UI state from `localStorage`).
- Reset data: remove relevant keys in console: `localStorage.removeItem('datosControles'); localStorage.removeItem('puntos'); localStorage.removeItem('papelera'); App.init();`
- Trigger common helpers: `Backup.export()`, `PDFExport.generate()`, `App.exportar.csv()`.
- Check service worker registration: `navigator.serviceWorker.getRegistrations().then(r => console.log(r));`

**Project-specific gotchas / notes for the agent:**
- File paths in `index.html` reference `modules/` (lowercase). On Windows this is tolerant, but keep the `<script>` paths lowercase and match how they are referenced in `index.html` to avoid confusion in other environments.
- Many modules assume `App` exists. Changes that split `App` into multiple files must preserve `App` being available before modules run.
- Localization: numbers/dates use `es-CL` formatting — keep this consistent in any UI text or exported files.
- Backup format: backups include a `version` field (currently `'2.0'`). If changing schema, bump version and add migration logic in `Backup.restore`.

**When you make edits:**
- Update or add modules under `Modules/` and ensure the script tag is present in `index.html` (the order matters).
- If adding new persistent data, register keys in `App.storage` and update `App.storage.guardar*`/`cargar*` as needed.
- Prefer minimal, local changes over global refactors. The app is a tightly-coupled single-page script-heavy codebase.

If any part of the app's runtime behavior is unclear (missing elements, index/script ordering, or expected storage schema), tell me which component you want clarified and I will expand this guidance or update examples.
