# Briefing

A custom new tab page. Clock, daily mantra, todos, weather, and a rotating quote -- everything you need before you go do the thing.

## Features

- **Clock** with Inter sans-serif display type; 12/24-hour and optional seconds in settings
- **Greeting** -- time-of-day greeting with an optional name
- **Daily mantra** -- seeded random rotation, new one each day
- **Todo list** -- localStorage persistence, carries undone tasks forward, clears completed ones at midnight
- **Weather** -- OpenWeatherMap integration (free API key required)
- **Daily quote** -- 30 quotes, deterministic daily rotation
- **Background images** -- rotating landscape photography, subtle overlay for readability

## Setup

1. Clone this repo
2. Open `index.html` in your browser, or set it as your homepage
3. Click **Settings** (bottom-right) to add your OpenWeatherMap API key and location

### Weather API Key

Sign up at [openweathermap.org/api](https://openweathermap.org/api) for a free key. Takes ~2 hours to activate after signup.

### Use as your New Tab page (browser extension)

The repo ships a `manifest.json` that overrides the browser's new-tab page with `index.html`.

**Firefox (temporary -- for trying it out):**

1. Go to `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on…** and select `manifest.json` in this folder
3. Open a new tab. (Temporary add-ons are removed when Firefox restarts.)

**Firefox (permanent):** regular Firefox only runs *signed* extensions. Two options:

- **Self-sign via AMO (recommended):** zip the repo contents (with `manifest.json` at the top level) and submit it at [addons.mozilla.org](https://addons.mozilla.org/developers/) as an **unlisted** add-on. Mozilla signs it and gives you a `.xpi` you install privately -- it then survives restarts.
- **Developer/ESR edition:** in Firefox Developer Edition, Nightly, or ESR, set `xpinstall.signatures.required` to `false` in `about:config`, then install the packaged `.xpi`.

> Firefox honors the same `chrome_url_overrides.newtab` key Chrome uses, so the one manifest works for both. In **Chrome/Edge/Brave**: `chrome://extensions` → enable **Developer mode** → **Load unpacked** → select this folder.

## Stack

Single HTML file. No build step. Vanilla JS, localStorage, Google Fonts (Inter + Cormorant Garamond + JetBrains Mono).

**Planned**: React/Vite refactor, Supabase persistence, Netlify deployment at `briefing.andrewfbutler.com`, integration with other apps (Where's Andy, Devoured, ScaleUp).

## Design

Dark editorial aesthetic. Crimson and amber accents on near-black. Frosted glass todo panel. Text shadows for legibility over background photography.
