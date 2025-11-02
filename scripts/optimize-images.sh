#!/bin/bash
################################################################################
# Bloom Website - Image Optimization Pipeline
# Converts Unity HDRP screenshots to optimized web formats
#
# Requirements:
#   - ImageMagick 7+ (brew install imagemagick)
#   - libwebp (brew install webp)
#   - libavif (brew install libavif)
#
# Usage:
#   ./scripts/optimize-images.sh
#   npm run optimize:images
################################################################################

set -e

# Configuration
INPUT_DIR="./src/assets/raw"
OUTPUT_DIR="./public/images"
TEMP_DIR="./temp/images"

# Quality settings (balance size vs quality)
AVIF_QUALITY=70
WEBP_QUALITY=80
JPEG_QUALITY=85
BLUR_QUALITY=50

# Size breakpoints
SIZES=(1600 1200 800 400)
BLUR_SIZE=20

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

################################################################################
# Functions
################################################################################

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

check_dependencies() {
    log_info "Checking dependencies..."

    if ! command -v magick &> /dev/null; then
        echo "Error: ImageMagick not found. Install with: brew install imagemagick"
        exit 1
    fi

    # Check for AVIF support
    if ! magick -list format | grep -q "AVIF"; then
        log_warning "AVIF support not detected. Install libavif for better compression."
    fi

    # Check for WebP support
    if ! magick -list format | grep -q "WEBP"; then
        log_warning "WebP support not detected. Install libwebp."
    fi

    log_success "All dependencies found"
}

create_directories() {
    log_info "Creating output directories..."
    mkdir -p "$OUTPUT_DIR"
    mkdir -p "$TEMP_DIR"
    log_success "Directories created"
}

get_file_size() {
    local file=$1
    if [[ "$OSTYPE" == "darwin"* ]]; then
        stat -f%z "$file"
    else
        stat -c%s "$file"
    fi
}

format_size() {
    local bytes=$1
    if [ $bytes -lt 1024 ]; then
        echo "${bytes}B"
    elif [ $bytes -lt 1048576 ]; then
        echo "$(( bytes / 1024 ))KB"
    else
        echo "$(( bytes / 1048576 ))MB"
    fi
}

process_image() {
    local input=$1
    local filename=$(basename "$input")
    local basename="${filename%.*}"
    local extension="${filename##*.}"

    log_info "Processing: $filename"

    # Get original size
    local original_size=$(get_file_size "$input")
    log_info "  Original size: $(format_size $original_size)"

    # Create output directory for this image
    local img_output_dir="$OUTPUT_DIR"

    # Generate AVIF variants (best compression)
    log_info "  Generating AVIF variants..."
    for size in "${SIZES[@]}"; do
        magick "$input" \
            -resize "${size}x" \
            -quality $AVIF_QUALITY \
            -define avif:compression-speed=4 \
            "$img_output_dir/${basename}-${size}.avif" 2>/dev/null || {
                log_warning "AVIF generation failed for ${size}px, skipping..."
            }
    done

    # Generate WebP variants (good compression, better support)
    log_info "  Generating WebP variants..."
    for size in "${SIZES[@]}"; do
        magick "$input" \
            -resize "${size}x" \
            -quality $WEBP_QUALITY \
            "$img_output_dir/${basename}-${size}.webp"
    done

    # Generate JPEG fallback (best compatibility)
    log_info "  Generating JPEG fallback..."
    magick "$input" \
        -resize "1200x" \
        -quality $JPEG_QUALITY \
        -sampling-factor 4:2:0 \
        -strip \
        -interlace Plane \
        "$img_output_dir/${basename}-1200.jpg"

    # Generate blur-up placeholder
    log_info "  Generating blur placeholder..."
    magick "$input" \
        -resize "${BLUR_SIZE}x" \
        -blur 0x2 \
        -quality $BLUR_QUALITY \
        "$img_output_dir/${basename}-blur.webp"

    # Generate thumbnail (for grid views)
    log_info "  Generating thumbnail..."
    magick "$input" \
        -resize "400x300^" \
        -gravity center \
        -extent 400x300 \
        -quality 85 \
        "$img_output_dir/${basename}-thumb.webp"

    # Calculate compression ratio
    local webp_1200_size=$(get_file_size "$img_output_dir/${basename}-1200.webp")
    local compression_ratio=$(( 100 - (webp_1200_size * 100 / original_size) ))

    log_success "  Completed: $basename (${compression_ratio}% reduction)"
    log_info "  Output size (1200px WebP): $(format_size $webp_1200_size)"
    echo ""
}

generate_image_manifest() {
    log_info "Generating image manifest..."

    local manifest_file="$OUTPUT_DIR/manifest.json"

    echo "{" > "$manifest_file"
    echo '  "images": [' >> "$manifest_file"

    local first=true
    for img in "$OUTPUT_DIR"/*-1200.webp; do
        [ -e "$img" ] || continue

        local basename=$(basename "$img" "-1200.webp")
        local size=$(get_file_size "$img")

        if [ "$first" = true ]; then
            first=false
        else
            echo "," >> "$manifest_file"
        fi

        echo "    {" >> "$manifest_file"
        echo "      \"name\": \"$basename\"," >> "$manifest_file"
        echo "      \"size\": $size," >> "$manifest_file"
        echo "      \"sizes\": [400, 800, 1200, 1600]," >> "$manifest_file"
        echo "      \"formats\": [\"avif\", \"webp\", \"jpg\"]" >> "$manifest_file"
        echo -n "    }" >> "$manifest_file"
    done

    echo "" >> "$manifest_file"
    echo "  ]," >> "$manifest_file"
    echo "  \"generated\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"" >> "$manifest_file"
    echo "}" >> "$manifest_file"

    log_success "Manifest generated: $manifest_file"
}

################################################################################
# Main Script
################################################################################

main() {
    log_info "====================================="
    log_info "Bloom Website Image Optimization"
    log_info "====================================="
    echo ""

    check_dependencies
    create_directories

    # Check if input directory exists
    if [ ! -d "$INPUT_DIR" ]; then
        log_warning "Input directory not found: $INPUT_DIR"
        log_info "Creating input directory..."
        mkdir -p "$INPUT_DIR"
        log_info "Place your raw images in: $INPUT_DIR"
        exit 0
    fi

    # Count images to process
    local image_count=0
    for ext in jpg jpeg png; do
        for img in "$INPUT_DIR"/*.$ext; do
            [ -e "$img" ] && ((image_count++))
        done
    done

    if [ $image_count -eq 0 ]; then
        log_warning "No images found in $INPUT_DIR"
        log_info "Supported formats: .jpg, .jpeg, .png"
        exit 0
    fi

    log_info "Found $image_count image(s) to process"
    echo ""

    # Process all images
    local processed=0
    for ext in jpg jpeg png; do
        for img in "$INPUT_DIR"/*.$ext; do
            [ -e "$img" ] || continue
            process_image "$img"
            ((processed++))
        done
    done

    # Generate manifest
    generate_image_manifest

    # Summary
    echo ""
    log_success "====================================="
    log_success "Optimization Complete!"
    log_success "====================================="
    log_info "Processed: $processed image(s)"
    log_info "Output: $OUTPUT_DIR"

    # Calculate total size
    local total_size=0
    for img in "$OUTPUT_DIR"/*.webp "$OUTPUT_DIR"/*.avif "$OUTPUT_DIR"/*.jpg; do
        [ -e "$img" ] || continue
        local size=$(get_file_size "$img")
        total_size=$((total_size + size))
    done

    log_info "Total output size: $(format_size $total_size)"
    echo ""
}

# Run main function
main "$@"
