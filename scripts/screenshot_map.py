#!/usr/bin/env python3
"""Screenshot script to capture the PastureAI map"""

import asyncio
from playwright.async_api import async_playwright
import os

async def capture_screenshot():
    """Capture screenshot of the deployed map"""
    
    # Path to local build output
    build_dir = "/home/z/my-project/out"
    
    print("🎬 Starting Playwright to capture map screenshot...")
    
    async with async_playwright() as p:
        # Launch browser
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={'width': 1400, 'height': 900},
            device_scale_factor=2  # High DPI for crisp screenshots
        )
        page = await context.new_page()
        
        # Try to load from local build first
        index_html = os.path.join(build_dir, "index.html")
        
        if os.path.exists(index_html):
            print(f"📂 Loading from local build: {index_html}")
            await page.goto(f"file://{index_html}", wait_until='networkidle', timeout=30000)
            
            # Wait a moment for any animations
            await page.wait_for_timeout(2000)
            
            # Take full page screenshot of homepage
            await page.screenshot(
                path='/home/z/my-project/download/pastureai_homepage.png',
                full_page=True
            )
            print("✅ Homepage screenshot saved")
            
            # Navigate to login page
            login_path = os.path.join(build_dir, "login", "index.html")
            if os.path.exists(login_path):
                await page.goto(f"file://{login_path}", wait_until='networkidle', timeout=30000)
                await page.wait_for_timeout(1000)
                await page.screenshot(path='/home/z/my-project/download/pastureai_login.png')
                print("✅ Login page screenshot saved")
                
                # Try to fill in demo credentials and login
                try:
                    # Look for email/password fields
                    email_input = await page.query_selector('input[type="email"], input[name="email"], input[placeholder*="mail"]')
                    password_input = await page.query_selector('input[type="password"], input[name="password"]')
                    
                    if email_input and password_input:
                        await email_input.fill('admin@pastureai.et')
                        await password_input.fill('admin123')
                        
                        # Click login button
                        login_btn = await page.query_selector('button[type="submit"], button:has-text("Login"), button:has-text("Sign")')
                        if login_btn:
                            await login_btn.click()
                            await page.wait_for_timeout(3000)  # Wait for navigation
                            
                            # Screenshot after login attempt
                            await page.screenshot(path='/home/z/my-project/download/pastureai_after_login.png')
                            print("✅ After-login screenshot saved")
                except Exception as e:
                    print(f"⚠️ Could not auto-login: {e}")
            
            # Navigate directly to dashboard (if accessible)
            dashboard_path = os.path.join(build_dir, "dashboard", "index.html")
            if os.path.exists(dashboard_path):
                print(f"📊 Loading dashboard: {dashboard_path}")
                await page.goto(f"file://{dashboard_path}", wait_until='networkidle', timeout=30000)
                
                # Wait for data to load (weather API calls)
                print("⏳ Waiting for weather data to load...")
                await page.wait_for_timeout(5000)  # Give time for API calls
                
                # Take dashboard screenshot
                await page.screenshot(
                    path='/home/z/my-project/download/pastureai_dashboard_map.png',
                    full_page=True
                )
                print("✅ Dashboard/Map screenshot saved!")
                
                # Scroll down to see more of the map
                await page.evaluate('window.scrollBy(0, 400)')
                await page.wait_for_timeout(1000)
                await page.screenshot(
                    path='/home/z/my-project/download/pastureai_map_detail.png'
                )
                print("✅ Map detail screenshot saved!")
        
        await browser.close()
    
    print("\n🎉 All screenshots captured successfully!")
    print("📁 Screenshots saved to /home/z/my-project/download/")

if __name__ == "__main__":
    asyncio.run(capture_screenshot())
