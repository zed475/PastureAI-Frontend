#!/usr/bin/env python3
"""FTP Deployment Script for InfinityFree"""

import os
import ftplib
import sys
from pathlib import Path

# FTP Configuration
FTP_HOST = "ftp.infinityfree.com"
FTP_USER = "if0_41577130"
FTP_PASS = "ZQvlDfJU8jtn"
LOCAL_DIR = "/home/z/my-project/out"
REMOTE_DIR = "htdocs"

def upload_file(ftp, local_path, remote_path):
    """Upload a single file"""
    try:
        with open(local_path, 'rb') as f:
            ftp.storbinary(f'STOR {remote_path}', f)
        print(f"  ✓ Uploaded: {remote_path}")
        return True
    except Exception as e:
        print(f"  ✗ Failed: {remote_path} - {e}")
        return False

def ensure_dir(ftp, remote_path):
    """Ensure remote directory exists"""
    dirs = remote_path.split('/')
    current = ''
    for d in dirs:
        if d:
            current += '/' + d
            try:
                ftp.cwd(current)
            except:
                try:
                    ftp.mkd(current)
                except:
                    pass  # Directory might exist
                try:
                    ftp.cwd(current)
                except:
                    pass
    ftp.cwd('/')

def deploy():
    """Main deployment function"""
    print(f"🚀 Starting deployment to {FTP_HOST}...")
    print(f"📁 Local directory: {LOCAL_DIR}")
    print(f"📂 Remote directory: {REMOTE_DIR}")
    
    # Connect to FTP
    try:
        ftp = ftplib.FTP(FTP_HOST)
        ftp.login(FTP_USER, FTP_PASS)
        print("✅ Connected to FTP server")
    except Exception as e:
        print(f"❌ Failed to connect: {e}")
        sys.exit(1)
    
    # Count files
    total_files = 0
    uploaded_files = 0
    failed_files = 0
    
    local_path = Path(LOCAL_DIR)
    
    for root, dirs, files in os.walk(local_path):
        # Calculate relative path
        rel_root = os.path.relpath(root, LOCAL_DIR)
        
        # Create remote directory structure
        if rel_root != '.':
            remote_subdir = f"{REMOTE_DIR}/{rel_root.replace(os.sep, '/')}"
            ensure_dir(ftp, remote_subdir.replace('\\', '/'))
        
        # Upload files
        for filename in files:
            total_files += 1
            local_file = os.path.join(root, filename)
            
            if rel_root == '.':
                remote_file = f"{REMOTE_DIR}/{filename}"
            else:
                remote_file = f"{REMOTE_DIR}/{rel_root.replace(os.sep, '/')}/{filename}"
            
            if upload_file(ftp, local_file, remote_file.replace('\\', '/')):
                uploaded_files += 1
            else:
                failed_files += 1
    
    # Close connection
    try:
        ftp.quit()
    except:
        ftp.close()
    
    print(f"\n🎉 Deployment complete!")
    print(f"   Total files: {total_files}")
    print(f"   Uploaded: {uploaded_files}")
    print(f"   Failed: {failed_files}")

if __name__ == "__main__":
    deploy()
