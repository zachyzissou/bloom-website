# Plausible Analytics Setup Guide

## Overview
Plausible is a privacy-friendly, lightweight analytics solution that doesn't require cookie consent banners.

## Setup Instructions

### 1. Sign Up for Plausible
- Visit https://plausible.io/register
- Choose the Community Edition (self-hosted) for free, or
- Use Plausible Cloud with 30-day trial (€9/month after)

### 2. Add Your Website
- Add `bloom-game.com` as your domain
- Note: Plausible will provide a unique tracking script

### 3. Integration in Astro

Add the Plausible script to your base layout (e.g., `src/layouts/BaseLayout.astro`):

```astro
---
// src/layouts/BaseLayout.astro
const plausibleDomain = import.meta.env.PUBLIC_PLAUSIBLE_DOMAIN || 'bloom-game.com';
const plausibleHost = import.meta.env.PUBLIC_PLAUSIBLE_API_HOST || 'https://plausible.io';
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>

    <!-- Plausible Analytics -->
    <script
      defer
      data-domain={plausibleDomain}
      src={`${plausibleHost}/js/script.js`}
    ></script>
    <!-- End Plausible Analytics -->
  </head>
  <body>
    <slot />
  </body>
</html>
```

### 4. Advanced Tracking (Optional)

#### Track Custom Events
```javascript
// Track button clicks, downloads, etc.
window.plausible = window.plausible || function() {
  (window.plausible.q = window.plausible.q || []).push(arguments)
}

// Example: Track game download
plausible('Download', { props: { version: '1.0.0', platform: 'Windows' } });
```

#### Track 404 Pages
```astro
---
// src/pages/404.astro
---
<script>
  window.plausible('404', { props: { path: document.location.pathname } });
</script>
```

#### Track Outbound Links
Use `script.outbound-links.js` instead of `script.js`:

```astro
<script
  defer
  data-domain={plausibleDomain}
  src={`${plausibleHost}/js/script.outbound-links.js`}
></script>
```

### 5. Environment Variables

Create a `.env` file (already listed in `.gitignore`):

```env
PUBLIC_PLAUSIBLE_DOMAIN=bloom-game.com
PUBLIC_PLAUSIBLE_API_HOST=https://plausible.io
```

For Netlify, add these in:
**Site Settings > Environment Variables**

### 6. Verify Installation

1. Deploy your site
2. Visit your website
3. Check Plausible dashboard (updates in real-time)
4. Verify events are being tracked

### 7. CSP Compatibility

The `netlify.toml` already includes Plausible in the Content Security Policy:

```toml
Content-Security-Policy = '''
  script-src 'self' 'unsafe-inline' https://plausible.io;
  connect-src 'self' https://plausible.io;
'''
```

## Privacy Compliance

Plausible is compliant with:
- GDPR (EU)
- CCPA (California)
- PECR (UK)

### Why Plausible?
- No cookies or persistent identifiers
- No cross-site tracking
- Data ownership (you own your data)
- Lightweight (< 1KB script)
- Open source
- EU-hosted (GDPR compliant)

## Dashboard Features

Access your analytics at: https://plausible.io/bloom-game.com

Metrics available:
- Unique visitors
- Page views
- Bounce rate
- Visit duration
- Top pages
- Traffic sources
- Geographic locations
- Devices & browsers
- Custom events

## Cost

### Self-Hosted (Free)
- Use Plausible Community Edition
- Host on your own infrastructure
- Requires Docker setup

### Plausible Cloud (Recommended)
- €9/month for up to 10k monthly pageviews
- €19/month for up to 100k monthly pageviews
- 30-day free trial
- No infrastructure management

## Alternative: Self-Hosted Setup

If using Docker for self-hosting:

```bash
# Clone Plausible hosting repo
git clone https://github.com/plausible/hosting
cd hosting

# Configure
cp plausible-conf.env.example plausible-conf.env
# Edit plausible-conf.env with your settings

# Start services
docker compose up -d
```

## Support & Documentation

- Official Docs: https://plausible.io/docs
- Community Forum: https://github.com/plausible/analytics/discussions
- API Documentation: https://plausible.io/docs/stats-api
