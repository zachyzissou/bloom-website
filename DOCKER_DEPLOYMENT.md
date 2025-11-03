# Docker Deployment Guide

This guide explains how to deploy the Bloom Marketing Website using Docker on Unraid or any other Docker-compatible platform.

## Quick Start

### Prerequisites
- Docker installed
- Docker Compose installed (optional, but recommended)

### Option 1: Using Docker Compose (Recommended for Unraid)

1. **Build the static site first:**
   ```bash
   npm install
   npm run build:fast
   ```

2. **Start the container:**
   ```bash
   docker-compose up -d
   ```

3. **Access the website:**
   - Open http://localhost:8080 in your browser
   - Or replace `localhost` with your server's IP address

### Option 2: Using Docker CLI

1. **Build the static site:**
   ```bash
   npm install
   npm run build:fast
   ```

2. **Build the Docker image:**
   ```bash
   docker build -t bloom-website .
   ```

3. **Run the container:**
   ```bash
   docker run -d -p 8080:80 --name bloom-website bloom-website
   ```

4. **Access the website:**
   - Open http://localhost:8080 in your browser

## Unraid Setup

### Using Unraid Web UI:

1. **Prepare the build:**
   - SSH into your Unraid server
   - Navigate to where you want to store the site files
   - Clone the repository or upload the files
   - Run `npm install` and `npm run build:fast`

2. **Add Container via Unraid Docker Tab:**
   - Go to Docker tab → Add Container
   - **Name:** `bloom-website`
   - **Repository:** (leave empty if building locally)
   - **Docker Hub URL:** (can use `nginx:alpine` as base)
   - **Port Mapping:** `8080` → `80`
   - **Path:** Map `/mnt/user/appdata/bloom-website/dist` to `/usr/share/nginx/html`
   - **Path:** Map `/mnt/user/appdata/bloom-website/nginx.conf` to `/etc/nginx/nginx.conf`

3. **Or use Docker Compose in Unraid:**
   - Place the `docker-compose.yml` file in `/mnt/user/appdata/bloom-website/`
   - Use the Compose Manager plugin or run from terminal

### Using Unraid Community Applications:

If you want to add this to Community Applications, you'll need to:
1. Create a Docker repository (e.g., on Docker Hub)
2. Push your built image to that repository
3. Use that image URL in Unraid

## Configuration

### Ports
By default, the site is exposed on port 8080. You can change this in `docker-compose.yml`:

```yaml
ports:
  - "YOUR_PORT:80"  # Change YOUR_PORT to desired port
```

### Environment Variables
The container doesn't require any environment variables for basic operation.

### Health Checks
The container includes a health check that runs every 30 seconds:
- Checks if nginx is responding on port 80
- Useful for monitoring and auto-restart

## Updating

To update the site with new content:

1. **Pull latest changes:**
   ```bash
   git pull origin main
   ```

2. **Rebuild the static site:**
   ```bash
   npm install
   npm run build:fast
   ```

3. **Rebuild and restart the container:**
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

   Or with Docker CLI:
   ```bash
   docker stop bloom-website
   docker rm bloom-website
   docker build -t bloom-website .
   docker run -d -p 8080:80 --name bloom-website bloom-website
   ```

## Features

### Background Music Persistence
The website now uses Astro View Transitions, which means:
- Music plays continuously across page navigation
- No reloading or interruption when clicking links
- Smooth page transitions
- Music state (playing/muted) is preserved

### Performance
- Static files served by nginx
- Optimized with gzip compression
- Long-term caching for static assets (1 year)
- Audio files properly configured with range support for seeking

## Troubleshooting

### Container won't start
```bash
# Check container logs
docker logs bloom-website

# Check if port 8080 is already in use
netstat -tulpn | grep 8080

# Use a different port
docker run -d -p 8081:80 --name bloom-website bloom-website
```

### Website not accessible
```bash
# Verify container is running
docker ps | grep bloom

# Check nginx status inside container
docker exec bloom-website nginx -t

# Test health check manually
docker exec bloom-website wget --spider http://localhost/
```

### Music not playing
- The music requires user interaction to start (browser autoplay policy)
- Click the music button in the bottom-right corner
- Check browser console for any audio-related errors

## Advanced Configuration

### Custom nginx.conf
If you need to customize nginx settings, edit `nginx.conf` and rebuild:
```bash
docker-compose down
docker-compose up -d --build
```

### SSL/HTTPS
For production, use a reverse proxy (like nginx-proxy-manager or traefik) in front of this container to handle SSL certificates.

### Resource Limits
Add resource limits in `docker-compose.yml`:
```yaml
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 512M
```

## Support

For issues or questions:
- Check the main README.md
- Review nginx logs: `docker logs bloom-website`
- Verify the build completed successfully: `ls -la dist/`
