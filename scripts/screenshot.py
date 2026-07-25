import asyncio
from playwright.async_api import async_playwright

async def take_screenshot():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={'width': 1280, 'height': 800})
        
        print("🌐 Navigating to PastureAI...")
        try:
            await page.goto('https://pastureai.is-best.net/', wait_until='networkidle', timeout=30000)
            print("✅ Page loaded!")
            
            # Take screenshot of login page
            await page.screenshot(path='/home/z/my-project/download/01_login_page.png', full_page=True)
            print("📸 Screenshot 1: Login page saved")
            
            # Try to login with demo credentials
            print("🔐 Attempting login...")
            
            # Fill in email field
            email_input = await page.query_selector('input[type="email"], input[name="email"], input[placeholder*="mail"]')
            if email_input:
                await email_input.fill('user@pastureai.et')
                print("   ✓ Email filled")
            
            # Fill in password field  
            password_input = await page.query_selector('input[type="password"], input[name="password"]')
            if password_input:
                await password_input.fill('user12345')
                print("   ✓ Password filled")
            
            # Click login button
            login_button = await page.query_selector('button[type="submit"], button:has-text("Login"), button:has-text("Sign")')
            if login_button:
                await login_button.click()
                print("   ✓ Login button clicked")
                
                # Wait for navigation to dashboard
                await page.wait_for_url('**/dashboard/**', timeout=15000)
                print("   ✓ Redirected to dashboard!")
                
                # Take screenshot of dashboard
                await page.screenshot(path='/home/z/my-project/download/02_dashboard.png', full_page=True)
                print("📸 Screenshot 2: Dashboard saved")
                
                # Look for NDVI Monitor tab/button
                ndvi_tab = await page.query_selector('text=NDVI Monitor, text=ndvi-monitor, [data-tab="ndvi-monitor"]')
                if ndvi_tab:
                    await ndvi_tab.click()
                    print("   ✓ NDVI Monitor tab clicked")
                    await page.wait_for_timeout(2000)
                    
                    # Look for Map View button
                    map_button = await page.query_selector('text=Map View, text=map view')
                    if map_button:
                        await map_button.click()
                        print("   ✓ Map View button clicked")
                        await page.wait_for_timeout(2000)
                        
                        # Take screenshot of the map!
                        await page.screenshot(path='/home/z/my-project/download/03_map_view.png', full_page=True)
                        print("📸 Screenshot 3: MAP VIEW saved! 🗺️")
                    else:
                        # Take screenshot even without clicking map view
                        await page.screenshot(path='/home/z/my-project/download/03_ndvi_panel.png', full_page=True)
                        print("📸 Screenshot 3: NDVI Panel (no map button found)")
                else:
                    await page.screenshot(path='/home/z/my-project/download/03_dashboard_full.png', full_page=True)
                    print("📸 Screenshot 3: Full Dashboard (NDVI tab not found)")
            else:
                print("   ⚠️ Login button not found")
                await page.screenshot(path='/home/z/my-project/download/02_login_form.png', full_page=True)
                
        except Exception as e:
            print(f"❌ Error: {e}")
            # Take screenshot anyway to see what's there
            await page.screenshot(path='/home/z/my-project/download/error_screenshot.png', full_page=True)
            print("📸 Error screenshot saved")
        
        await browser.close()
        print("\n✅ Screenshots complete!")

if __name__ == "__main__":
    asyncio.run(take_screenshot())
