# Pre-Deployment Checklist

Use this checklist before pushing your first deployment.

## Local Development Setup

- [ ] Node.js 20+ installed (`node --version`)
- [ ] npm 10+ installed (`npm --version`)
- [ ] Dependencies installed (`npm install`)
- [ ] Development server runs (`npm run dev`)
- [ ] Production build succeeds (`npm run build`)
- [ ] Preview works (`npm run preview`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No linting errors (`npm run lint`)
- [ ] Code is formatted (`npm run format`)

## Content & Assets

- [ ] Homepage content added/updated
- [ ] About page created (if needed)
- [ ] Factions page content ready
- [ ] All images optimized (WebP/AVIF)
- [ ] Favicon added to `/public/favicon.ico`
- [ ] Open Graph image created (`/public/og-image.jpg`)
- [ ] Fonts added to `/public/fonts/` (Orbitron, Inter)
- [ ] 404 page customized

## SEO & Meta Tags

- [ ] Page titles are unique and descriptive
- [ ] Meta descriptions added (150-160 characters)
- [ ] Open Graph tags configured
- [ ] Twitter Card tags configured
- [ ] Canonical URLs set correctly
- [ ] Structured data (JSON-LD) added
- [ ] Alt text for all images
- [ ] Headings follow proper hierarchy (h1 → h2 → h3)

## Performance

- [ ] Images < 300KB each
- [ ] Total page size < 500KB
- [ ] JavaScript bundle < 150KB
- [ ] CSS bundle < 30KB
- [ ] Fonts < 100KB total
- [ ] Lazy loading implemented for below-fold images
- [ ] Critical CSS inlined
- [ ] No render-blocking resources

## Accessibility

- [ ] Color contrast ratio ≥ 4.5:1 for text
- [ ] All interactive elements keyboard accessible
- [ ] Focus states visible on all interactive elements
- [ ] ARIA labels added where needed
- [ ] Skip to content link present
- [ ] Form labels associated with inputs
- [ ] Language attribute set (`<html lang="en">`)

## Git Repository

- [ ] `.gitignore` configured correctly
- [ ] No sensitive data in repository
- [ ] No `.env` files committed
- [ ] Large files excluded (> 1MB)
- [ ] Git repository initialized (`git init`)
- [ ] Initial commit created
- [ ] GitHub repository created
- [ ] Remote added (`git remote add origin ...`)
- [ ] Code pushed to GitHub (`git push -u origin main`)

## GitHub Configuration

- [ ] Repository name: `bloom-marketing-website`
- [ ] Repository description added
- [ ] Topics/tags added (astro, netlify, game, marketing)
- [ ] Branch protection enabled for `main`
- [ ] GitHub Actions enabled
- [ ] Secrets configured:
  - [ ] `NETLIFY_AUTH_TOKEN`
  - [ ] `NETLIFY_SITE_ID`
- [ ] Issue templates added
- [ ] PR template added

## Netlify Setup

- [ ] Netlify account created
- [ ] Site created from GitHub repo
- [ ] Build settings configured:
  - Build command: `npm run build`
  - Publish directory: `dist`
- [ ] Environment variables set:
  - [ ] `NODE_VERSION=20`
  - [ ] `PUBLIC_SITE_URL`
  - [ ] `PUBLIC_PLAUSIBLE_DOMAIN`
  - [ ] `PUBLIC_PLAUSIBLE_API_HOST`
- [ ] Deploy preview enabled for PRs
- [ ] Branch deploys enabled for `develop`
- [ ] HTTPS enabled
- [ ] Custom domain configured (if applicable)

## Analytics

- [ ] Plausible account created
- [ ] Site added to Plausible
- [ ] Plausible script added to pages
- [ ] Analytics tracking tested
- [ ] Custom events configured (if needed)
- [ ] Goal tracking set up (optional)
- [ ] Analytics working in production (not dev)

## Security

- [ ] Security headers configured in `netlify.toml`:
  - [ ] Content-Security-Policy
  - [ ] X-Frame-Options
  - [ ] X-Content-Type-Options
  - [ ] Strict-Transport-Security
  - [ ] Referrer-Policy
- [ ] HTTPS forced (HTTP → HTTPS redirect)
- [ ] No inline scripts (CSP compliant)
- [ ] Dependencies audited (`npm audit`)
- [ ] No high/critical vulnerabilities
- [ ] Secrets not in repository
- [ ] Environment variables used for config

## Testing

- [ ] Lighthouse performance score ≥ 90
- [ ] Lighthouse accessibility score ≥ 90
- [ ] Lighthouse best practices score ≥ 90
- [ ] Lighthouse SEO score ≥ 90
- [ ] Core Web Vitals passing:
  - [ ] LCP < 2.5s
  - [ ] FID < 100ms
  - [ ] CLS < 0.1
- [ ] Tested on Chrome
- [ ] Tested on Firefox
- [ ] Tested on Safari (if available)
- [ ] Tested on mobile viewport
- [ ] Tested on tablet viewport
- [ ] Tested on desktop viewport
- [ ] No console errors
- [ ] No console warnings

## Content Validation

- [ ] All links work (no 404s)
- [ ] All images load correctly
- [ ] Videos play correctly (if applicable)
- [ ] Forms submit successfully (if applicable)
- [ ] All CTAs (Call to Actions) functional
- [ ] Contact information correct
- [ ] Social media links correct
- [ ] Copyright year current
- [ ] No Lorem Ipsum text
- [ ] No placeholder content

## SEO Submission

- [ ] Sitemap generated (`/sitemap-index.xml`)
- [ ] robots.txt configured (`/robots.txt`)
- [ ] Google Search Console account created
- [ ] Site verified in Search Console
- [ ] Sitemap submitted to Google
- [ ] Bing Webmaster Tools account created
- [ ] Site verified in Bing
- [ ] Sitemap submitted to Bing

## Documentation

- [ ] README.md updated with correct info
- [ ] DEPLOYMENT.md reviewed
- [ ] Environment variables documented
- [ ] Build process documented
- [ ] Contributing guidelines added (if open source)
- [ ] License file present
- [ ] Contact information added

## Post-Deployment

- [ ] Site accessible at production URL
- [ ] HTTPS certificate active
- [ ] All pages load correctly
- [ ] No broken links
- [ ] Analytics tracking verified
- [ ] Forms working (if applicable)
- [ ] Search functionality working (if applicable)
- [ ] 404 page displays correctly
- [ ] Redirects working correctly

## Monitoring Setup

- [ ] Uptime monitoring configured (UptimeRobot, Freshping)
- [ ] Deploy notifications enabled (email/Slack)
- [ ] Error tracking configured (optional: Sentry)
- [ ] Performance monitoring enabled
- [ ] Analytics dashboard accessible

## Social Media

- [ ] Open Graph tags tested (Facebook Debugger)
- [ ] Twitter Cards tested (Twitter Card Validator)
- [ ] LinkedIn preview tested (Post Inspector)
- [ ] Social media accounts linked
- [ ] Share buttons working (if applicable)

## Marketing

- [ ] Launch announcement prepared
- [ ] Social media posts scheduled
- [ ] Press kit ready (if applicable)
- [ ] Email list notified (if applicable)
- [ ] Blog post published (if applicable)

## Legal & Compliance

- [ ] Privacy policy page (if collecting data)
- [ ] Terms of service page (if applicable)
- [ ] Cookie consent banner (if using cookies)
- [ ] GDPR compliance verified
- [ ] CCPA compliance verified (if US audience)
- [ ] Accessibility statement (optional)

## Backup & Recovery

- [ ] GitHub repository backed up
- [ ] Netlify site backed up
- [ ] Content backed up separately
- [ ] Database backed up (if applicable)
- [ ] Recovery procedure documented
- [ ] Rollback procedure tested

## Final Checks

- [ ] All team members have access
- [ ] Deployment runbook created
- [ ] Emergency contacts documented
- [ ] Support channels established
- [ ] Maintenance schedule defined
- [ ] Update procedures documented

---

## Quick Test Commands

Run these before deploying:

```bash
# Install dependencies
npm install

# Type check
npm run type-check

# Lint
npm run lint

# Format check
npm run format:check

# Build
npm run build

# Lighthouse
npm run lighthouse

# Security audit
npm audit --production
```

All should pass without errors before deploying.

---

## Deployment Command

Once all checks pass:

```bash
git add .
git commit -m "feat: Initial website launch"
git push origin main
```

This will trigger automatic deployment to Netlify via GitHub Actions.

---

## Emergency Rollback

If something goes wrong after deployment:

### Option 1: Netlify UI
1. Go to Netlify → Deploys
2. Find last working deploy
3. Click "Publish deploy"

### Option 2: Git Revert
```bash
git revert HEAD
git push origin main
```

---

## Post-Launch Checklist

After successful deployment:

- [ ] Verify site is live
- [ ] Test all critical user paths
- [ ] Monitor analytics for first 24 hours
- [ ] Watch for error reports
- [ ] Monitor performance metrics
- [ ] Celebrate! 🎉

---

**Estimated Time to Complete:** 2-4 hours (first time)

**Support:** See DEPLOYMENT.md for detailed instructions on each step.
