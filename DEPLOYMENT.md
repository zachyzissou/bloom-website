# Deployment Guide - Bloom Marketing Website

## Deployment Architecture

**Workflow:**
1. Push code to GitHub
2. Build process (CI/CD or manual)
3. Pull built package to Docker container on Unraid
4. Serve via reverse proxy (Nginx/Traefik)

---

## Build Process

### Option 1: Build Locally, Push to GitHub

```bash
# Install dependencies
npm install

# Build for production
npm run build

# The dist/ folder contains the static site
# Commit and push to GitHub
git add dist/
git commit -m "Build: Production build"
git push
```

### Option 2: GitHub Actions (Recommended)

Create `.github/workflows/build.yml`:

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/
```

---

## Docker Deployment

### Build Docker Image

```bash
# Build the image
docker build -t bloom-website:latest .

# Or use docker-compose
docker-compose build
```

### Run Container

```bash
# Standalone
docker run -d \
  --name bloom-website \
  -p 8080:80 \
  --restart unless-stopped \
  bloom-website:latest

# Or with docker-compose
docker-compose up -d
```

### Update Container

```bash
# Pull latest code
git pull

# Rebuild
docker-compose build

# Restart
docker-compose up -d
```

---

## Unraid Deployment

### Method 1: Docker Container (Recommended)

1. **In Unraid Docker UI:**
   - Go to Docker tab
   - Click "Add Container"
   - Use "bloom-website" template or import `docker-compose.yml`

2. **Container Settings:**
   - **Name**: `bloom-website`
   - **Repository**: `bloom-website:latest` (or your registry)
   - **Network Type**: `bridge` or `custom`
   - **Port Mapping**: `8080:80` (adjust as needed)

3. **Volume Mounts** (optional):
   - If using custom nginx config: `/path/to/nginx.conf:/etc/nginx/conf.d/default.conf:ro`

4. **Environment Variables**:
   - `NODE_ENV=production`

### Method 2: Reverse Proxy (Nginx Proxy Manager / Traefik)

**With Nginx Proxy Manager:**
1. Build and run container on port 8080
2. In NPM, add proxy host:
   - Domain: `bloom-game.com`
   - Forward to: `bloom-website:8080` (or container IP)
   - SSL: Enable (Let's Encrypt)

**With Traefik:**
- Labels in `docker-compose.yml` are pre-configured
- Ensure Traefik network is connected
- Container will auto-register

---

## Reverse Proxy Configuration

### Nginx (Standalone)

```nginx
server {
    listen 443 ssl http2;
    server_name bloom-game.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://bloom-website:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Traefik (via Docker Labels)

Labels are already configured in `docker-compose.yml`:
- Auto SSL via Let's Encrypt
- HTTP to HTTPS redirect
- Health checks

---

## Health Checks

The container includes a health check endpoint:

```bash
# Check health
curl http://localhost:8080/health

# Expected response: "healthy"
```

---

## Troubleshooting

### Container won't start
```bash
# Check logs
docker logs bloom-website

# Check if port is in use
netstat -tulpn | grep 8080
```

### Build fails
```bash
# Clear cache and rebuild
docker-compose down
docker system prune -f
docker-compose build --no-cache
```

### Static files not loading
- Check nginx configuration
- Verify `dist/` folder was copied correctly
- Check file permissions in container

### Reverse proxy issues
- Verify container is accessible: `curl http://localhost:8080`
- Check proxy configuration
- Verify SSL certificates

---

## Performance Optimization

### Production Build
- Images are optimized (AVIF/WebP)
- CSS/JS are minified
- Assets are compressed (gzip)
- Static files cached for 1 year

### Caching Strategy
- **Static assets**: 1 year cache
- **HTML**: No cache (always fresh)
- **API responses**: As needed

### CDN (Optional)
- Consider Cloudflare or similar
- Point DNS to CDN
- CDN caches static assets globally

---

## Security

### Headers
Security headers are configured in `nginx.conf`:
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy

### SSL/TLS
- Always use HTTPS in production
- Let's Encrypt via reverse proxy
- HSTS enabled (via reverse proxy)

---

## Monitoring

### Logs
```bash
# View container logs
docker logs -f bloom-website

# View nginx access logs
docker exec bloom-website tail -f /var/log/nginx/access.log
```

### Metrics
- Container stats: `docker stats bloom-website`
- Nginx status: Configure status module if needed

---

## Backup

### Backup Strategy
1. **Code**: Git repository (GitHub)
2. **Build artifacts**: `dist/` folder (optional)
3. **Docker image**: Push to registry

### Restore
```bash
# Pull image from registry
docker pull bloom-website:latest

# Run container
docker-compose up -d
```

---

## Next Steps

1. ✅ Set up GitHub repository
2. ✅ Configure CI/CD (optional)
3. ✅ Build Docker image
4. ✅ Deploy to Unraid
5. ✅ Configure reverse proxy
6. ✅ Set up SSL
7. ✅ Test health checks
8. ✅ Monitor logs

---

**Questions?** Check the main README or open an issue on GitHub.
