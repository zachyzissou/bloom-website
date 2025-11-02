# Quick Start Guide - Bloom Marketing Website

This guide will get you from zero to deployed in under 30 minutes.

## Prerequisites

- Node.js 20+ installed
- GitHub account
- Netlify account (free tier)

## Step 1: Local Setup (5 minutes)

```bash
# Navigate to project directory
cd /mnt/c/Users/Zachg/Bloom-Website

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit http://localhost:3000 to see your site.

## Step 2: Initialize Git Repository (2 minutes)

```bash
# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Bloom marketing website"
```

## Step 3: Create GitHub Repository (3 minutes)

1. Go to https://github.com/new
2. Repository name: `bloom-marketing-website`
3. Keep it public or private (your choice)
4. **DO NOT** initialize with README
5. Click "Create repository"

```bash
# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/bloom-marketing-website.git
git branch -M main
git push -u origin main
```

## Step 4: Deploy to Netlify (10 minutes)

### Create Netlify Account
1. Go to https://app.netlify.com/signup
2. Sign up with GitHub (recommended)

### Connect Repository
1. Click "Add new site" > "Import an existing project"
2. Choose "GitHub"
3. Authorize Netlify
4. Select `bloom-marketing-website`

### Configure Build Settings
Netlify should auto-detect these settings:

```
Build command: npm run build
Publish directory: dist
```

### Set Environment Variables
Go to **Site settings > Environment variables**:

```
NODE_VERSION=20
PUBLIC_SITE_URL=https://YOUR_SITE.netlify.app
PUBLIC_PLAUSIBLE_DOMAIN=YOUR_SITE.netlify.app
```

Replace `YOUR_SITE` with your actual Netlify subdomain.

### Deploy
Click "Deploy site" - first build takes ~2 minutes.

## Step 5: Setup GitHub Actions (5 minutes)

### Get Netlify Credentials

**Netlify Auth Token:**
1. Go to https://app.netlify.com/user/applications#personal-access-tokens
2. Click "New access token"
3. Name it "GitHub Actions"
4. Copy the token

**Netlify Site ID:**
1. Go to **Site settings > General > Site details**
2. Copy the "API ID"

### Add GitHub Secrets

1. Go to your GitHub repo
2. Navigate to **Settings > Secrets and variables > Actions**
3. Click "New repository secret"
4. Add these two secrets:

```
Name: NETLIFY_AUTH_TOKEN
Value: [paste your token]

Name: NETLIFY_SITE_ID
Value: [paste your site ID]
```

### Verify GitHub Actions

Push a change to trigger the workflow:

```bash
# Make a small change (e.g., edit README)
git add .
git commit -m "Test: Trigger GitHub Actions"
git push origin main
```

Go to **Actions** tab on GitHub to watch the workflow run.

## Step 6: Setup Plausible Analytics (5 minutes)

### Option A: Plausible Cloud (Easiest)
1. Sign up at https://plausible.io/register
2. Add your site: `YOUR_SITE.netlify.app`
3. Done! Analytics will start tracking immediately

### Option B: Skip for Now
Analytics is optional. You can add it later by following `plausible-setup.md`.

## You're Live!

Your site is now deployed at:
```
https://YOUR_SITE.netlify.app
```

## Next Steps

### Add Custom Domain (Optional)

1. Purchase a domain (Namecheap, Google Domains, etc.)
2. In Netlify: **Site settings > Domain management > Add custom domain**
3. Follow DNS configuration instructions
4. Enable HTTPS (automatic via Let's Encrypt)

### Create Develop Branch

```bash
# Create and switch to develop branch
git checkout -b develop
git push -u origin develop
```

Now you have:
- `main` → Production (https://bloom-game.com)
- `develop` → Staging (https://staging--YOUR_SITE.netlify.app)
- Pull Requests → Preview (https://pr-[NUMBER]--YOUR_SITE.netlify.app)

### Enable Branch Protection

Go to **Settings > Branches > Add rule**:

1. Branch name pattern: `main`
2. ✅ Require status checks to pass before merging
3. Select: Build and Test, Lighthouse CI
4. ✅ Require branches to be up to date

### Start Building Content

Create your first page:

```astro
---
// src/pages/about.astro
import SEO from '@/components/SEO.astro';
---

<html lang="en">
  <head>
    <SEO
      title="About Bloom - Post-Apocalyptic Strategy Game"
      description="Learn about Bloom, a game of survival, scavenging, and strategy in a harsh post-apocalyptic world."
    />
  </head>
  <body>
    <h1>About Bloom</h1>
    <p>Bloom is a post-apocalyptic resource management game...</p>
  </body>
</html>
```

## Helpful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Quality
npm run lint             # Check for errors
npm run format           # Format code
npm run type-check       # TypeScript checks

# Performance
npm run lighthouse       # Test performance
npm run analyze          # Analyze bundle size

# Cleanup
npm run clean            # Remove build artifacts
```

## Common Issues

### Build fails with "Cannot find module"
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 already in use
```bash
# Use different port
npm run dev -- --port 3001
```

### Git push rejected
```bash
# Pull latest changes first
git pull origin main --rebase
git push origin main
```

## Getting Help

- Deployment issues: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- Astro questions: https://docs.astro.build/
- Netlify support: https://answers.netlify.com/
- GitHub Actions: Check the Actions tab for detailed logs

## What You Get Out of the Box

✅ Automatic deployments on git push
✅ Performance testing (Lighthouse CI)
✅ Security scanning (Trivy)
✅ Preview deployments for PRs
✅ SEO optimization (meta tags, sitemap, robots.txt)
✅ Analytics ready (Plausible integration)
✅ Type checking (TypeScript)
✅ Code quality (ESLint + Prettier)
✅ Performance budget enforcement
✅ Edge CDN with optimal caching
✅ Security headers (CSP, HSTS, etc.)
✅ Image optimization (WebP/AVIF)

## Congratulations!

You now have a fully automated, performance-optimized deployment pipeline for your Bloom marketing website! 🚀

---

Next: Read [DEPLOYMENT.md](./DEPLOYMENT.md) for advanced configuration and [README.md](./README.md) for complete documentation.
