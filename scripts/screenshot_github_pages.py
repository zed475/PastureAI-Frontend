#!/usr/bin/env python3
"""Screenshot the live GitHub Pages deployment"""

import asyncio
from playwright.async_api import async_playwright

async def capture_live_site():
    print("🎬 Capturing LIVE GitHub Pages deployment...")
    print("🌐 URL: https://hope0351.github.io/PastureAI/")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={'width': 1400, 'height': 1000},
            device_scale_factor=2
        )
        page = await context.new_page()
        
        # Load the live site
        url = "https://hope0351.github.io/PastureAI/"
        print(f"📄 Loading: {url}")
        
        try:
            await page.goto(url, wait_until='networkidle', timeout=30000)
            print("✅ Page loaded successfully!")
            
            # Wait for any JavaScript to execute
            await page.wait_for_timeout(3000)
            
            # Full page screenshot of homepage
            await page.screenshot(
                path='/home/z/my-project/download/github_pages_home.png',
                full_page=True
            )
            print("✅ Homepage screenshot saved!")
            
            # Viewport screenshot
            await page.screenshot(path='/home/z/my-project/download/github_pages_viewport.png')
            print("✅ Viewport screenshot saved!")
            
            # Try navigating to login page
            login_url = f"{url}login/"
            print(f"\n🔐 Loading login page: {login_url}")
            try:
                await page.goto(login_url, wait_until='networkidle', timeout=20000)
                await page.wait_for_timeout(2000)
                await page.screenshot(path='/home/z/my-project/download/github_pages_login.png')
                print("✅ Login page screenshot saved!")
                
                # Try to fill in credentials
                email_input = await page.query_selector('input[type="email"], input[name="email"]')
                password_input = await page.query_selector('input[type="password"]')
                
                if email_input and password_input:
                    print("🔑 Attempting login...")
                    await email_input.fill('admin@pastureai.et')
                    await password_input.fill('admin123')
                    
                    login_btn = await page.query_selector('button[type="submit"]')
                    if login_btn:
                        await login_btn.click()
                        await page.wait_for_timeout(4000)
                        await page.screenshot(path='/home/z/my-project/download/github_pages_dashboard.png', full_page=True)
                        print("✅ Dashboard screenshot saved!")
            except Exception as e:
                print(f"⚠️ Could not access login: {e}")
            
        except Exception as e:
            print(f"❌ Error: {e}")
        
        await browser.close()
    
    print("\n🎉 All screenshots saved to /home/z/my-project/download/")

if __name__ == "__main__":
    asyncio.run(capture_live_site())
