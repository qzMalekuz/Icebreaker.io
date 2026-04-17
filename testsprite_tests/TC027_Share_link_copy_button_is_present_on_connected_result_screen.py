import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Interact with the page elements to simulate user flow
        # -> Navigate to http://localhost:5174
        await page.goto("http://localhost:5174")
        
        # -> Inject sessionStorage key 'gameOver' with the required JSON and navigate to /result/test-room-789, then wait for the page to load so the UI can be inspected.
        await page.goto("data:text/html,<script>sessionStorage.setItem('gameOver','{"outcome":"connected","strangerUsername":"Echo","shareLink":"https://icebreaker.io/link/xyz"}');location.href='http://localhost:5174/result/test-room-789';</script>")
        
        # -> Navigate directly to http://localhost:5174/result/test-room-789 and wait for the page to finish loading so the UI can be inspected.
        await page.goto("http://localhost:5174/result/test-room-789")
        
        # --> Assertions to verify final state
        frame = context.pages[-1]
        assert await frame.locator("xpath=//*[contains(., 'https://icebreaker.io/link/xyz')]").nth(0).is_visible(), "The share link URL should be visible as a button on the result page.",
        assert await frame.locator("xpath=//*[contains(., 'copied ✓')]").nth(0).text_content() == 'copied ✓', "The share link button should change its text to 'copied ✓' after being clicked.",
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    