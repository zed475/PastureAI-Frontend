#!/usr/bin/env python3
"""Screenshot the demo HTML page"""

import asyncio
from playwright.async_api import async_playwright

async def capture_demo():
    print("🎬 Capturing PastureAI Demo with Real Map Data...")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={'width': 1400, 'height': 1000},
            device_scale_factor=2
        )
        page = await context.new_page()
        
        # Load the demo HTML file
        demo_path = "/home/z/my-project/download/pastureai_demo.html"
        print(f"📄 Loading: {demo_path}")
        
        await page.goto(f"file://{demo_path}", wait_until='load', timeout=30000)
        
        # Wait for data to load (Open-Meteo API calls)
        print("⏳ Waiting for weather data to load (15s)...")
        await page.wait_for_timeout(15000)
        
        # Full page screenshot
        await page.screenshot(
            path='/home/z/my-project/download/pastureai_map_proof.png',
            full_page=True
        )
        print("✅ Full page screenshot saved!")
        
        # Viewport screenshot of just the map area
        await page.screenshot(path='/home/z/my-project/download/pastureai_map_view.png')
        print("✅ Map viewport screenshot saved!")
        
        # Click on a station to show popup
        try:
            # Find and click first station marker
            markers = await page.query_selector_all('div[style*="position: absolute"]')
            if markers:
                await markers[0].click()
                await page.wait_for_timeout(2000)
                await page.screenshot(path='/home/z/my-project/download/pastureai_station_popup.png')
                print("✅ Station popup screenshot saved!")
        except Exception as e:
            print(f"⚠️ Could not click station: {e}")
        
        await browser.close()
    
    print("\n🎉 Done! Screenshots saved to /home/z/my-project/download/")

if __name__ == "__main__":
    asyncio.run(capture_demo())
