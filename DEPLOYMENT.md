# Deployment Checklist for Bloom Marketing Website

## Pre-Deployment Setup

### 1. Initialize Git Repository
```bash
cd /mnt/c/Users/Zachg/Bloom-Website
git init
git add .
git commit -m "Initial commit: Bloom marketing website setup"
```

### 2. Create GitHub Repository
1. Go to https://github.com/new
2. Create repository named `bloom-marketing-website`
3. **Do NOT** initialize with README, .gitignore, or license
4. Push local repository:
```bash
git remote add origin https://github.com/YOUR_USERNAME/bloom-marketing-website.git
git branch -M main
git push -u origin main
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Verify Local Build
```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### 5. Run Quality Checks
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Format check
npm run format:check

# Lighthouse CI (local)
npm run lighthouse
```

## Netlify Setup

### 1. Create Netlify Account
- Sign up at https://app.netlify.com/signup
- Use GitHub account for authentication (recommended)

### 2. Create New Site
1. Click "Add new site" > "Import an existing project"
2. Choose "GitHub" as provider
3. Authorize Netlify to access your repositories
4. Select `bloom-marketing-website` repository

### 3. Configure Build Settings
Netlify should auto-detect Astro settings, but verify:

```
Build command: npm run build
Publish directory: dist
```

### 4. Environment Variables
Go to **Site settings > Environment variables** and add:

```
NODE_VERSION=20
PUBLIC_SITE_URL=https://YOUR_SITE.netlify.app (update after custom domain)
PUBLIC_PLAUSIBLE_DOMAIN=YOUR_SITE.netlify.app
PUBLIC_PLAUSIBLE_API_HOST=https://plausible.io
```

### 5. Deploy Site
Click "Deploy site" - this will trigger the first build.

## GitHub Actions Setup

### 1. Add GitHub Secrets
Go to **Repository Settings > Secrets and variables > Actions**

Add the following secrets:

```
NETLIFY_AUTH_TOKEN
- Get from: https://app.netlify.com/user/applications#personal-access-tokens
- Click "New access token"
- Copy token and add to GitHub secrets

NETLIFY_SITE_ID
- Get from: Site settings > General > Site details > API ID
- Copy and add to GitHub secrets
```

### 2. Optional: Lighthouse CI App Token
For enhanced Lighthouse reporting:

```
LHCI_GITHUB_APP_TOKEN
- Install Lighthouse CI GitHub App: https://github.com/apps/lighthouse-ci
- Grant repository access
- Token will be automatically available
```

### 3. Enable GitHub Actions
GitHub Actions should automatically run on:
- Push to `main` or `develop` branches
- Pull request creation/updates

### 4. Branch Protection Rules (Optional but Recommended)
Go to **Repository Settings > Branches > Add rule**

For `main` branch:
- ✅ Require status checks to pass before merging
  - Select: `Build and Test`
  - Select: `Lighthouse CI`
- ✅ Require branches to be up to date before merging
- ✅ Require linear history (optional)
- ✅ Do not allow bypassing the above settings

## Custom Domain Setup

### 1. Purchase Domain
- Recommended: Namecheap, Google Domains, Cloudflare

### 2. Configure DNS in Netlify
**Site settings > Domain management > Add custom domain**

1. Add your domain (e.g., `bloom-game.com`)
2. Netlify will provide DNS records:

```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: YOUR_SITE.netlify.app
```

### 3. Update DNS at Registrar
Add the records provided by Netlify to your domain registrar's DNS settings.

### 4. Enable HTTPS
**Site settings > Domain management > HTTPS**
- Netlify automatically provisions SSL certificate (Let's Encrypt)
- Wait 5-10 minutes for certificate to be issued
- ✅ Force HTTPS

### 5. Update Environment Variables
Update in Netlify:
```
PUBLIC_SITE_URL=https://bloom-game.com
PUBLIC_PLAUSIBLE_DOMAIN=bloom-game.com
```

## Performance Optimization

### 1. Enable Netlify CDN Features
Already configured in `netlify.toml`:
- Asset optimization
- Brotli compression
- HTTP/2 Server Push
- Caching headers

### 2. Test Performance
```bash
# Run Lighthouse locally
npm run lighthouse

# Check Lighthouse CI results in GitHub Actions
# View at: https://github.com/YOUR_USERNAME/bloom-marketing-website/actions
```

### 3. Verify Core Web Vitals
Tools to test:
- PageSpeed Insights: https://pagespeed.web.dev/
- WebPageTest: https://www.webpagetest.org/
- Chrome DevTools (Lighthouse tab)

Target metrics:
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1
- FCP (First Contentful Paint): < 1.5s
- TBT (Total Blocking Time): < 300ms

## Analytics Setup

### 1. Set Up Plausible Analytics
Follow the guide in `plausible-setup.md`

### 2. Verify Tracking
1. Visit your live site
2. Check Plausible dashboard
3. Confirm events are being tracked

## Security Verification

### 1. Security Headers
Test at: https://securityheaders.com/

Should achieve: **A** or **A+** rating

Headers configured:
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security
- Referrer-Policy
- Permissions-Policy

### 2. SSL/TLS Configuration
Test at: https://www.ssllabs.com/ssltest/

Should achieve: **A** or **A+** rating

### 3. Dependency Audit
```bash
npm audit --production
```

Fix any critical or high vulnerabilities:
```bash
npm audit fix
```

## SEO Verification

### 1. Test Sitemap
Visit: https://bloom-game.com/sitemap-index.xml

Should list all pages.

### 2. Test robots.txt
Visit: https://bloom-game.com/robots.txt

Should allow crawling and reference sitemap.

### 3. Submit to Search Engines

**Google Search Console**
1. Go to: https://search.google.com/search-console
2. Add property: `bloom-game.com`
3. Verify ownership (DNS or HTML file)
4. Submit sitemap: `https://bloom-game.com/sitemap-index.xml`

**Bing Webmaster Tools**
1. Go to: https://www.bing.com/webmasters
2. Add site: `bloom-game.com`
3. Verify ownership
4. Submit sitemap

### 4. Verify Meta Tags
Check with:
- Facebook Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

## Monitoring & Maintenance

### 1. Set Up Uptime Monitoring (Optional)
Free options:
- UptimeRobot: https://uptimerobot.com/ (Free: 50 monitors)
- Freshping: https://www.freshworks.com/website-monitoring/ (Free: 50 checks)
- Netlify Analytics (Built-in, paid)

### 2. Enable Deploy Notifications
**Netlify > Site settings > Build & deploy > Deploy notifications**

Add notifications for:
- Deploy started
- Deploy succeeded
- Deploy failed

Options:
- Email
- Slack webhook
- Discord webhook

### 3. Scheduled Maintenance
Monthly tasks:
- ✅ Review Lighthouse CI trends
- ✅ Check for dependency updates: `npm outdated`
- ✅ Review analytics (traffic, top pages, sources)
- ✅ Check for security vulnerabilities: `npm audit`
- ✅ Review Core Web Vitals in Search Console
- ✅ Update content if needed

### 4. Update Dependencies
```bash
# Check for updates
npm outdated

# Update all dependencies
npm update

# Or use npm-check-updates
npx npm-check-updates -u
npm install

# Test after updates
npm run build
npm run preview
npm run lighthouse
```

## Rollback Procedure

If a deployment breaks production:

### Option 1: Netlify UI
1. Go to **Deploys** tab
2. Find last working deploy
3. Click three dots menu
4. Select "Publish deploy"

### Option 2: Git Revert
```bash
# Revert last commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard COMMIT_HASH
git push --force origin main  # Use with caution!
```

### Option 3: Lock Deploy (Temporary)
**Deploys > Deploy settings > Stop auto publishing**

## Troubleshooting

### Build Fails on Netlify
1. Check build logs in Netlify UI
2. Verify Node version matches local (20.x)
3. Clear cache and retry: **Deploys > Trigger deploy > Clear cache and deploy site**
4. Check environment variables are set correctly

### Lighthouse CI Fails
1. Review Lighthouse report in GitHub Actions artifacts
2. Check specific metrics that failed
3. Run locally: `npm run lighthouse`
4. Temporarily lower thresholds in `.lighthouserc.json` if needed

### Images Not Optimizing
1. Verify Sharp is installed: `npm list sharp`
2. Check image formats in `/src/assets/`
3. Use Astro's `<Image>` component, not raw `<img>`
4. Verify `astro.config.mjs` image service is configured

### Analytics Not Tracking
1. Check Plausible script is in `<head>`
2. Verify domain matches in Plausible dashboard
3. Check browser console for errors
4. Ensure CSP allows `plausible.io`
5. Test with ad blocker disabled

## Post-Launch Checklist

- ✅ Site is live and accessible
- ✅ Custom domain configured (if applicable)
- ✅ HTTPS enabled and forced
- ✅ Lighthouse scores ≥90 on all metrics
- ✅ Analytics tracking verified
- ✅ Sitemap submitted to search engines
- ✅ Security headers configured (A+ rating)
- ✅ GitHub Actions running successfully
- ✅ Branch protection rules enabled
- ✅ Uptime monitoring configured
- ✅ Team notified of go-live
- ✅ Social media cards tested
- ✅ 404 page working correctly
- ✅ Mobile responsiveness verified
- ✅ All CTAs functional

## Resources

- Astro Documentation: https://docs.astro.build/
- Netlify Documentation: https://docs.netlify.com/
- Lighthouse CI: https://github.com/GoogleChrome/lighthouse-ci
- Plausible Analytics: https://plausible.io/docs
- Web.dev (Performance): https://web.dev/
- GitHub Actions: https://docs.github.com/en/actions

## Support Contacts

- Netlify Support: https://answers.netlify.com/
- Astro Discord: https://astro.build/chat
- GitHub Community: https://github.com/orgs/community/discussions
