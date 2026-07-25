#!/usr/bin/env python3
"""Screenshot script with local server"""

import asyncio
from playwright.async_api import async_playwright

async def capture_screenshot():
    """Capture screenshot from running server"""
    
    print("🎬 Capturing screenshots from local server...")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={'width': 1400, 'height': 900},
            device_scale_factor=2
        )
        page = await context.new_page()
        
        # Load from local server
        base_url = "http://localhost:8765"
        
        # Homepage
        print("📄 Loading homepage...")
        await page.goto(f"{base_url}/", wait_until='networkidle', timeout=30000)
        await page.wait_for_timeout(2000)
        await page.screenshot(path='/home/z/my-project/download/pastureai_home.png', full_page=True)
        print("✅ Homepage captured")
        
        # Login page
        print("🔐 Loading login page...")
        await page.goto(f"{base_url}/login/", wait_until='networkidle', timeout=30000)
        await page.wait_for_timeout(1000)
        await page.screenshot(path='/home/z/my-project/download/pastureai_login_page.png')
        print("✅ Login page captured")
        
        # Try to login
        try:
            print("🔑 Attempting login...")
            email_input = await page.query_selector('input[type="email"], input[name="email"]')
            password_input = await page.query_selector('input[type="password"]')
            
            if email_input and password_input:
                await email_input.fill('admin@pastureai.et')
                await password_input.fill('admin123')
                
                login_btn = await page.query_selector('button[type="submit"]')
                if login_btn:
                    await login_btn.click()
                    await page.wait_for_timeout(4000)
                    await page.screenshot(path='/home/z/my-project/download/pastureai_logged_in.png')
                    print("✅ After-login captured")
        except Exception as e:
            print(f"⚠️ Login attempt: {e}")
        
        # Dashboard (direct access - might redirect if auth required)
        print("📊 Loading dashboard...")
        await page.goto(f"{base_url}/dashboard/", wait_until='networkidle', timeout=30000)
        
        # Wait for weather data to load
        print("⏳ Waiting for map and data to load (10s)...")
        await page.wait_for_timeout(10000)  # Longer wait for API calls
        
        # Take multiple screenshots at different scroll positions
        await page.screenshot(
            path='/home/z/my-project/download/pastureai_map_full.png',
            full_page=True
        )
        print("✅ Full dashboard captured")
        
        # Viewport screenshot of just the map area
        await page.screenshot(path='/home/z/my-project/download/pastureai_map_viewport.png')
        print("✅ Map viewport captured")
        
        # Scroll down to see legend and stats
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight/2)')
        await page.wait_for_timeout(1000)
        await page.screenshot(path='/home/z/my-project/download/pastureai_map_scrolled.png')
        print("✅ Scrolled view captured")
        
        await browser.close()
    
    print("\n🎉 All screenshots saved to /home/z/my-project/download/")

if __name__ == "__main__":
    asyncio.run(capture_screenshot())
