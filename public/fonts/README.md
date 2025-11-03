# Fonts for Bloom Website

## Required Fonts

### Orbitron (Headings)
- Download from: https://fonts.google.com/specimen/Orbitron
- File needed: orbitron-v29-latin-regular.woff2
- Weight: 400 (Regular)
- License: Open Font License

### Inter (Body)
- Download from: https://fonts.google.com/specimen/Inter
- File needed: inter-v13-latin-regular.woff2
- Weight: 400 (Regular)
- License: Open Font License

## Installation

1. Download both fonts from Google Fonts
2. Convert to WOFF2 format (if needed)
3. Place in this directory (`public/fonts/`)
4. Files should be named:
   - `orbitron-v29-latin-regular.woff2`
   - `inter-v13-latin-regular.woff2`

## Alternative: Use Google Fonts CDN

If you prefer not to self-host, update BaseLayout.astro to use:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400&family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
```

Then remove the font preload links from BaseLayout.astro.
