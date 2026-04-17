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
        
        # -> Navigate to http://localhost:5174/session/test-room-004 to load the session page (or reveal UI to allow injecting sessionStorage).
        await page.goto("http://localhost:5174/session/test-room-004")
        
        # -> Inject sessionStorage 'matchPayload' with a valid question and reload the session page so the UI renders.
        await page.goto("data:text/html;charset=utf-8,<script>sessionStorage.setItem('matchPayload',JSON.stringify({question:{id:'q1',prompt:'Which color do you prefer?',choices:['Red','Green','Blue','Yellow']},round:1,me:{id:'me',name:'You'},opponent:{id:'other',name:'Stranger'}}));location.href='http://localhost:5174/session/test-room-004';</script>")
        
        # -> Navigate to http://localhost:5174/session/test-room-004 (load the session page so the SPA can read sessionStorage and render)
        await page.goto("http://localhost:5174/session/test-room-004")
        
        # --> Assertions to verify final state
        frame = context.pages[-1]
        assert await frame.locator("xpath=//*[contains(., 'waiting for the stranger to answer')] ").nth(0).is_visible(), "The UI should display 'waiting for the stranger to answer' after submitting an answer."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    