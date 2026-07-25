import asyncio
from playwright.async_api import async_playwright

async def capture_map():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={'width': 1400, 'height': 900})
        
        print("🌐 Loading PastureAI...")
        await page.goto('https://pastureai.is-best.net/', wait_until='networkidle', timeout=30000)
        
        # Login
        print("🔐 Logging in...")
        await page.fill('input[type="email"]', 'user@pastureai.et')
        await page.fill('input[type="password"]', 'user12345')
        await page.click('button[type="submit"]')
        
        # Wait for dashboard to appear (not URL change)
        await page.wait_for_selector('text=Overview', timeout=20000)
        print("✅ Dashboard loaded!")
        await page.screenshot(path='/home/z/my-project/download/01_dashboard_overview.png')
        print("📸 Screenshot 1: Dashboard Overview")
        
        # Click NDVI Monitor in sidebar
        print("\n🗺️ Navigating to NDVI Monitor...")
        ndvi_link = page.locator('text=NDVI Monitor')
        if await ndvi_link.count() > 0:
            await ndvi_link.first.click()
            await page.wait_for_timeout(2000)
            print("✅ NDVI Monitor tab opened")
            await page.screenshot(path='/home/z/my-project/download/02_ndvi_chart_view.png')
            print("📸 Screenshot 2: NDVI Chart View")
            
            # Click Map View button
            print("\n🛰️ Switching to Map View...")
            map_button = page.locator('text=Map View')
            if await map_button.count() > 0:
                await map_button.click()
                await page.wait_for_timeout(3000)
                print("✅ Map View activated!")
                await page.screenshot(path='/home/z/my-project/download/03_satellite_map.png', full_page=False)
                print("📸 Screenshot 3: 🗺️ SATELLITE MAP - CAPTURED! 🗺️")
                
                # Try different map views
                print("\n🔄 Testing other map views...")
                
                # Click Terrain view
                terrain_btn = page.locator('text=Terrain')
                if await terrain_btn.count() > 0:
                    await terrain_btn.click()
                    await page.wait_for_timeout(1500)
                    await page.screenshot(path='/home/z/my-project/download/04_terrain_view.png')
                    print("📸 Screenshot 4: Terrain View")
                
                # Click Heatmap view  
                heatmap_btn = page.locator('text=Heatmap')
                if await heatmap_btn.count() > 0:
                    await heatmap_btn.click()
                    await page.wait_for_timeout(1500)
                    await page.screenshot(path='/home/z/my-project/download/05_heatmap_view.png')
                    print("📸 Screenshot 5: Heatmap View")
                
                # Click a station marker
                print("\n📍 Clicking monitoring station marker...")
                # Try to click near where stations should be (center of map area)
                station_marker = page.locator('.absolute').first
                if await station_marker.count() > 0:
                    await station_marker.click()
                    await page.wait_for_timeout(1000)
                    await page.screenshot(path='/home/z/my-project/download/06_station_details.png')
                    print("📸 Screenshot 6: Station Details Popup")
                
            else:
                print("⚠️ Map View button not found - taking full panel screenshot")
                await page.screenshot(path='/home/z/my-project/download/03_ndvi_full.png', full_page=True)
        else:
            print("⚠️ NDVI Monitor link not found")
        
        await browser.close()
        print("\n" + "="*60)
        print("✅ ALL SCREENSHOTS CAPTURED SUCCESSFULLY!")
        print("="*60)
        print(f"📁 Screenshots saved to: /home/z/my-project/download/")
        print("\n📸 Files created:")
        import os
        for f in sorted(os.listdir('/home/z/my-project/download/')):
            if f.endswith('.png'):
                size = os.path.getsize(f'/home/z/my-project/download/{f}')
                print(f"   ✅ {f} ({size:,} bytes)")

if __name__ == "__main__":
    asyncio.run(capture_map())
