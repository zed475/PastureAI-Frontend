#!/bin/bash

# PastureAI Deployment Script
# Uploads static export to InfinityFree hosting

FTP_HOST="ftpupload.net"
FTP_USER="if0_41577130"
FTP_PASS="ZQvlDfJU8jtn"
REMOTE_DIR="/pastureai.is-best.net/htdocs"
LOCAL_DIR="/home/z/my-project/out"

echo "🚀 Starting deployment to pastureai.is-best.net..."

cd "$LOCAL_DIR"

# Create a temporary file list for uploading
find . -type f \( -name "*.html" -o -name "*.css" -o -name "*.js" -o -name "*.svg" -o -name "*.ico" -o -name "*.txt" -o -name "*.map" \) > /tmp/files_to_upload.txt

TOTAL=$(wc -l < /tmp/files_to_upload.txt)
CURRENT=0

echo "Found $TOTAL files to upload"

while IFS= read -r file; do
    CURRENT=$((CURRENT + 1))
    
    # Remove leading ./
    REMOTE_FILE="${file#./}"
    
    # Get directory part
    DIR=$(dirname "$REMOTE_FILE")
    
    echo "[$CURRENT/$TOTAL] Uploading: $REMOTE_FILE"
    
    # Upload file
    curl -s -T "$file" \
        -u "$FTP_USER:$FTP_PASS" \
        "ftp://$FTP_HOST$REMOTE_DIR/$REMOTE_FILE" \
        --ftp-create-dirs
    
done < /tmp/files_to_upload.txt

rm /tmp/files_to_upload.txt

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your site is now live at: https://pastureai.is-best.net"
