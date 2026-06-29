# Briefing

A custom new tab page. Clock, daily mantra, todos, weather, and a rotating quote -- everything you need before you go do the thing.

## Features

- **24-hour clock** with Cormorant Garamond display type
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

### Chrome New Tab Override

To use as your actual new tab page, either:

- **Simple**: Set `file:///path/to/index.html` as your startup page in Chrome settings
- **Extension**: A small Chrome extension can override the new tab (planned)

## Stack

Single HTML file. No build step. Vanilla JS, localStorage, Google Fonts (Cormorant Garamond + JetBrains Mono).

**Planned**: React/Vite refactor, Supabase persistence, Netlify deployment at `briefing.andrewfbutler.com`, integration with other apps (Where's Andy, Devoured, ScaleUp).

## Design

Dark editorial aesthetic. Crimson and amber accents on near-black. Frosted glass todo panel. Text shadows for legibility over background photography.
