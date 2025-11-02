#!/bin/bash

# Bloom Marketing Website - Build Optimization Script
# This script optimizes the build output for production deployment

set -e  # Exit on error

echo "========================================="
echo "Bloom Build Optimization Script"
echo "========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo -e "${RED}Error: dist directory not found. Run 'npm run build' first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build directory found${NC}"
echo ""

# 1. Remove source maps in production (optional)
if [ "$NODE_ENV" = "production" ]; then
    echo "Removing source maps..."
    find dist -name "*.map" -type f -delete
    echo -e "${GREEN}✓ Source maps removed${NC}"
    echo ""
fi

# 2. Optimize SVG files
if command -v svgo &> /dev/null; then
    echo "Optimizing SVG files..."
    find dist -name "*.svg" -type f -exec svgo {} \;
    echo -e "${GREEN}✓ SVG files optimized${NC}"
    echo ""
else
    echo -e "${YELLOW}⚠ svgo not found, skipping SVG optimization${NC}"
    echo -e "  Install with: npm install -g svgo"
    echo ""
fi

# 3. Generate integrity hashes for assets (optional)
echo "Build output analysis:"
echo "======================"

# Total size
TOTAL_SIZE=$(du -sh dist | cut -f1)
echo "Total size: $TOTAL_SIZE"

# JavaScript size
JS_SIZE=$(find dist -name "*.js" -type f -exec du -ch {} + | tail -1 | cut -f1)
echo "JavaScript: $JS_SIZE"

# CSS size
CSS_SIZE=$(find dist -name "*.css" -type f -exec du -ch {} + | tail -1 | cut -f1)
echo "CSS: $CSS_SIZE"

# Image size
if [ -d "dist/_assets" ]; then
    IMG_SIZE=$(du -sh dist/_assets 2>/dev/null | cut -f1 || echo "0K")
    echo "Images: $IMG_SIZE"
fi

# HTML size
HTML_SIZE=$(find dist -name "*.html" -type f -exec du -ch {} + | tail -1 | cut -f1)
echo "HTML: $HTML_SIZE"

echo ""

# 4. Count files
echo "File counts:"
echo "============"
JS_COUNT=$(find dist -name "*.js" -type f | wc -l)
CSS_COUNT=$(find dist -name "*.css" -type f | wc -l)
HTML_COUNT=$(find dist -name "*.html" -type f | wc -l)
IMG_COUNT=$(find dist/_assets -type f 2>/dev/null | wc -l || echo "0")

echo "JavaScript files: $JS_COUNT"
echo "CSS files: $CSS_COUNT"
echo "HTML files: $HTML_COUNT"
echo "Images: $IMG_COUNT"
echo ""

# 5. Check for large files (> 500KB)
echo "Large files (>500KB):"
echo "====================="
LARGE_FILES=$(find dist -type f -size +500k)
if [ -z "$LARGE_FILES" ]; then
    echo -e "${GREEN}✓ No large files found${NC}"
else
    echo -e "${YELLOW}Warning: Found large files:${NC}"
    find dist -type f -size +500k -exec ls -lh {} \; | awk '{print $5, $9}'
fi
echo ""

# 6. Verify critical files exist
echo "Verifying critical files:"
echo "========================="

CRITICAL_FILES=(
    "dist/index.html"
    "dist/404.html"
    "dist/sitemap-index.xml"
    "dist/robots.txt"
)

ALL_EXIST=true
for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $(basename $file)"
    else
        echo -e "${RED}✗${NC} $(basename $file) - MISSING"
        ALL_EXIST=false
    fi
done
echo ""

# 7. Generate build report
BUILD_REPORT="dist/build-report.json"
cat > "$BUILD_REPORT" <<EOF
{
  "buildTime": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "totalSize": "$TOTAL_SIZE",
  "jsSize": "$JS_SIZE",
  "cssSize": "$CSS_SIZE",
  "htmlSize": "$HTML_SIZE",
  "imageSize": "$IMG_SIZE",
  "fileCounts": {
    "js": $JS_COUNT,
    "css": $CSS_COUNT,
    "html": $HTML_COUNT,
    "images": $IMG_COUNT
  },
  "nodeVersion": "$(node --version)",
  "npmVersion": "$(npm --version)"
}
EOF

echo -e "${GREEN}✓ Build report generated: build-report.json${NC}"
echo ""

# 8. Final summary
echo "========================================="
echo "Build Optimization Complete"
echo "========================================="
echo ""

if [ "$ALL_EXIST" = true ]; then
    echo -e "${GREEN}✓ All critical files present${NC}"
    echo -e "${GREEN}✓ Build is ready for deployment${NC}"
    exit 0
else
    echo -e "${RED}✗ Some critical files are missing${NC}"
    echo -e "${RED}✗ Please review the build output${NC}"
    exit 1
fi
