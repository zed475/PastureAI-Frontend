import asyncio
from playwright.async_api import async_playwright

async def final_screenshot_capture():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={'width': 1400, 'height': 1000})
        
        print("🌐 Loading PastureAI (fresh deployment)...")
        await page.goto('https://pastureai.is-best.net/', wait_until='networkidle', timeout=30000)
        
        # Login
        print("🔐 Logging in...")
        await page.fill('input[type="email"]', 'user@pastureai.et')
        await page.fill('input[type="password"]', 'user12345')
        await page.click('button[type="submit"]')
        await page.wait_for_selector('text=Overview', timeout=20000)
        print("✅ Successfully logged in!")
        
        # Screenshot 1: Dashboard Overview
        await page.screenshot(path='/home/z/my-project/download/proof_01_dashboard.png')
        print("📸 Proof #1: Dashboard Overview - CAPTURED")
        
        # Navigate to NDVI Monitor
        print("\n🗺️ Opening NDVI Monitor...")
        ndvi_link = page.locator('text=NDVI Monitor')
        await ndvi_link.first.click()
        await page.wait_for_timeout(2000)
        
        # Screenshot 2: NDVI Panel (should show Chart View with buttons)
        await page.screenshot(path='/home/z/my-project/download/proof_02_ndvi_panel.png')
        print("📸 Proof #2: NDVI Monitor Panel - CAPTURED")
        
        # Look for and click "Map View" button
        print("\n🛰️ Looking for Map View button...")
        map_found = False
        
        # Try multiple selectors for the Map View button
        selectors = [
            'button:has-text("Map View")',
            'button:has-text("map")',
            'text=Map View',
            '[class*="map"]:has-text("View")'
        ]
        
        for selector in selectors:
            try:
                btn = page.locator(selector).first
                if await btn.count() > 0 and await btn.is_visible():
                    print(f"   ✅ Found Map View button with: {selector}")
                    await btn.click()
                    await page.wait_for_timeout(3000)
                    map_found = True
                    break
            except:
                continue
        
        if not map_found:
            print("   ⚠️ Trying alternative approach - checking all buttons...")
            buttons = await page.query_selector_all('button')
            for btn in buttons:
                text = await btn.text_content()
                if text:
                    text = text.strip()
                    print(f"      Button: '{text}'")
                    if 'map' in text.lower():
                        print(f"      → Clicking: {text}")
                        await btn.click()
                        await page.wait_for_timeout(3000)
                        map_found = True
                        break
        
        # Screenshot 3: THE MAP!
        await page.screenshot(path='/home/z/my-project/download/proof_03_SATELLITE_MAP.png', full_page=False)
        print(f"📸{'🎉' if map_found else ''} Proof #3: {'🗺️ MAP VIEW - CAPTURED! 🗺️' if map_found else 'Current View'}")
        
        # If we found the map, try different views
        if map_found:
            print("\n🔄 Testing different map views...")
            
            # Try Satellite view (might already be selected)
            satellite_btn = page.locator('button:has-text("Satellite")').first
            if await satellite_btn.count() > 0:
                await satellite_btn.click()
                await page.wait_for_timeout(1500)
                await page.screenshot(path='/home/z/my-project/download/proof_04_satellite_view.png')
                print("📸 Proof #4: Satellite View")
            
            # Try Heatmap view
            heatmap_btn = page.locator('button:has-text("Heatmap")').first
            if await heatmap_btn.count() > 0:
                await heatmap_btn.click()
                await page.wait_for_timeout(1500)
                await page.screenshot(path='/home/z/my-project/download/proof_05_heatmap_view.png')
                print("📸 Proof #5: Heatmap View")
            
            # Click on a station marker to show details
            print("\n📍 Clicking station marker...")
            markers = page.locator('.absolute[class*="cursor-pointer"]').first
            if await markers.count() > 0:
                await markers.click()
                await page.wait_for_timeout(1500)
                await page.screenshot(path='/home/z/my-project/download/proof_06_station_clicked.png')
                print("📸 Proof #6: Station Details Popup")
        
        # Final summary screenshot
        await page.screenshot(path='/home/z/my-project/download/proof_final.png', full_page=True)
        print("\n📸 Final Proof: Full Page - CAPTURED")
        
        await browser.close()
        
        # List all screenshots
        import os
        print("\n" + "="*70)
        print("✅ SCREENSHOT PROOF COMPLETE!")
        print("="*70)
        print(f"\n📁 Location: /home/z/my-project/download/")
        print(f"🕐 Time: {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"\n📸 Captured Files:")
        total_size = 0
        for f in sorted(os.listdir('/home/z/my-project/download/')):
            if f.endswith('.png'):
                size = os.path.getsize(f'/home/z/my-project/download/{f}')
                total_size += size
                status = "🗺️ MAP!" if "MAP" in f or "map" in f else "📊"
                print(f"   {status} {f} ({size:,} bytes)")
        
        print(f"\n💾 Total size: {total_size:,} bytes ({total_size/1024:.1f} KB)")
        print("\n" + "="*70)

if __name__ == "__main__":
    asyncio.run(final_screenshot_capture())
