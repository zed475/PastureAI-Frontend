#!/usr/bin/env python3
"""Screenshot the live InfinityFree deployment with retry logic"""

import asyncio
from playwright.async_api import async_playwright

async def capture_infinityfree():
    url = "https://pastureai.is-best.net/"
    print(f"🎬 Capturing LIVE InfinityFree deployment...")
    print(f"🌐 URL: {url}")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={'width': 1400, 'height': 1000},
            device_scale_factor=2,
            ignore_https_errors=True  # Ignore SSL issues if any
        )
        page = await context.new_page()
        
        # Try multiple times
        max_retries = 3
        for attempt in range(1, max_retries + 1):
            print(f"\n📄 Attempt {attempt}/{max_retries}...")
            try:
                response = await page.goto(url, wait_until='domcontentloaded', timeout=30000)
                status = response.status if response else 'N/A'
                print(f"   Status: {status}")
                
                if response and (200 <= response.status < 400):
                    break
                    
            except Exception as e:
                print(f"   Error: {e}")
                if attempt < max_retries:
                    await asyncio.sleep(5)
                    continue
        
        # Wait for page to fully render
        print("⏳ Waiting for page to render...")
        await page.wait_for_timeout(5000)
        
        # Take screenshots
        await page.screenshot(
            path='/home/z/my-project/download/infinityfree_home.png',
            full_page=True
        )
        print("✅ Homepage screenshot saved!")
        
        await page.screenshot(path='/home/z/my-project/download/infinityfree_viewport.png')
        print("✅ Viewport screenshot saved!")
        
        # Try login page
        login_url = f"{url}login/"
        print(f"\n🔐 Loading login page: {login_url}")
        try:
            await page.goto(login_url, wait_until='domcontentloaded', timeout=20000)
            await page.wait_for_timeout(3000)
            await page.screenshot(path='/home/z/my-project/download/infinityfree_login.png')
            print("✅ Login page screenshot saved!")
            
            # Try login
            email_input = await page.query_selector('input[type="email"], input[name="email"]')
            password_input = await page.query_selector('input[type="password"]')
            
            if email_input and password_input:
                print("🔑 Attempting login...")
                await email_input.fill('admin@pastureai.et')
                await password_input.fill('admin123')
                
                login_btn = await page.query_selector('button[type="submit"]')
                if login_btn:
                    await login_btn.click()
                    await page.wait_for_timeout(5000)
                    await page.screenshot(
                        path='/home/z/my-project/download/infinityfree_dashboard.png',
                        full_page=True
                    )
                    print("✅ Dashboard screenshot saved!")
                    
                    # Wait for map data to load
                    print("⏳ Waiting for map/weather data...")
                    await page.wait_for_timeout(8000)
                    await page.screenshot(
                        path='/home/z/my-project/download/infinityfree_map_loaded.png',
                        full_page=True
                    )
                    print("✅ Map with data screenshot saved!")
        except Exception as e:
            print(f"⚠️ Login error: {e}")
        
        await browser.close()
    
    print("\n🎉 All screenshots saved to /home/z/my-project/download/")

if __name__ == "__main__":
    asyncio.run(capture_infinityfree())
