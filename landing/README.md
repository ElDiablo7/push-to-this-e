# GRACE-X Locked Landing Page

## Overview

The locked landing page gates access to the Investor Pack. Visitors must enter a key to view the pack.

## Files

| File | Purpose |
|------|---------|
| `landing/index.html` | Lock gate + investor pack iframe |
| `landing/landing.css` | Lock screen styling |
| `config/landing.js` | Config: enabled flag + key |

## Config (`config/landing.js`)

```js
window.LANDING_CONFIG = {
  enabled: true,   // Set false to disable landing (skip to main app)
  key: "gracex2026"  // Change this to set the unlock key
};
```

## How to Remove Landing

### Option 1: Disable (keep files)
Edit `config/landing.js` and set `enabled: false`. Visitors go straight to the main app.

### Option 2: Remove from index
Delete the landing redirect block from `index.html` (the script tag and inline script that load `config/landing.js` and redirect to `landing/`).

### Option 3: Remove entirely
1. Delete the `landing/` folder
2. Delete `config/landing.js`
3. Remove the landing redirect block from `index.html`

## Default Key

Default key: `gracex2026`

Change in `config/landing.js`.

## Flow

1. Visitor goes to site → redirected to `landing/`
2. Enter key → unlocks, shows Investor Pack in iframe
3. "Enter Main App" → sets bypass, goes to main app
4. Next visit to root → bypass remembered (sessionStorage), goes to main app
