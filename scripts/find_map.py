import asyncio
from playwright.async_api import async_playwright

async def find_and_capture_map():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={'width': 1400, 'height': 1000})
        
        print("🌐 Loading PastureAI...")
        await page.goto('https://pastureai.is-best.net/', wait_until='networkidle', timeout=30000)
        
        # Login
        print("🔐 Logging in...")
        await page.fill('input[type="email"]', 'user@pastureai.et')
        await page.fill('input[type="password"]', 'user12345')
        await page.click('button[type="submit"]')
        await page.wait_for_selector('text=Overview', timeout=20000)
        print("✅ Logged in!")
        
        # Navigate to NDVI Monitor
        print("\n🗺️ Going to NDVI Monitor...")
        ndvi_link = page.locator('text=NDVI Monitor')
        await ndvi_link.first.click()
        await page.wait_for_timeout(2000)
        
        # Take screenshot of full page first (to see everything including header)
        print("📸 Taking full page screenshot...")
        await page.screenshot(path='/home/z/my-project/download/ndvi_full_page.png', full_page=True)
        
        # Look for ANY button containing "map" (case insensitive)
        print("\n🔍 Searching for Map View button...")
        
        # Get all buttons on page
        buttons = await page.query_selector_all('button')
        print(f"   Found {len(buttons)} buttons total")
        
        for i, btn in enumerate(buttons):
            text = await btn.text_content()
            if text and ('map' in text.lower() or 'chart' in text.lower()):
                print(f"   ✅ Button {i}: '{text.strip()}'")
                if 'map' in text.lower():
                    print(f"      → Clicking this button!")
                    await btn.click()
                    await page.wait_for_timeout(3000)
                    break
        
        # Take screenshot after clicking map button
        await page.screenshot(path='/home/z/my-project/download/map_after_click.png', full_page=True)
        print("📸 Screenshot after clicking Map button")
        
        # Also try looking for links with "map"
        print("\n🔍 Searching for any element with 'Map' text...")
        map_elements = await page.query_selector_all('text=/map/i')
        print(f"   Found {len(map_elements)} elements with 'map' text")
        
        for elem in map_elements:
            tag = await elem.evaluate('el => el.tagName')
            text = await elem.text_content()
            visible = await elem.is_visible()
            print(f"   - <{tag}>: '{text[:50] if text else ''}...' (visible: {visible})")
        
        # Try scrolling to top and taking screenshot
        print("\n⬆️ Scrolling to top...")
        await page.evaluate('window.scrollTo(0, 0)')
        await page.wait_for_timeout(1000)
        await page.screenshot(path='/home/z/my-project/download/ndvi_top_section.png')
        print("📸 Top section screenshot")
        
        # Look at the HTML structure around NDVI Monitor heading
        print("\n🔍 Examining NDVI panel structure...")
        ndvi_heading = page.locator('text=NDVI Vegetation Monitor').first
        if await ndvi_heading.count() > 0:
            parent = await ndvi_heading.evaluate('el => el.parentElement.innerHTML')
            print(f"   Parent HTML length: {len(parent)} chars")
            
        await browser.close()

if __name__ == "__main__":
    asyncio.run(find_and_capture_map())
