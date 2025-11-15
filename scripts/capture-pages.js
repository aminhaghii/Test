import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:8080';

async function capturePage(page, path, outputName, waitForSelector = null) {
  console.log(`📸 Capturing ${path}...`);
  
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}${path}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Wait for specific selector if provided
  if (waitForSelector) {
    try {
      await page.waitForSelector(waitForSelector, { timeout: 10000 });
      await page.waitForTimeout(1000);
    } catch (e) {
      console.warn(`⚠️  Selector ${waitForSelector} not found, continuing...`);
    }
  }

  // Scroll to load all content
  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  const step = 600;

  for (let y = 0; y < scrollHeight; y += step) {
    await page.evaluate((position) => window.scrollTo(0, position), y);
    await page.waitForTimeout(200);
  }

  // Scroll back to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);

  // Take full page screenshot
  await page.screenshot({
    path: outputName,
    fullPage: true,
  });

  console.log(`✅ Saved: ${outputName}`);
}

async function captureProductDetail(page) {
  console.log(`📸 Capturing Product Detail Modal...`);
  
  // First go to products page
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/products`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // Scroll to see products
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(2000);

  // Find and click first product card
  try {
    // Wait for product cards to load - look for the div with cursor-pointer
    await page.waitForSelector('.cursor-pointer, div[class*="cursor-pointer"]', { timeout: 15000 });
    await page.waitForTimeout(1000);

    // Try to click on first product card using evaluate to bypass pointer interception
    const clicked = await page.evaluate(() => {
      // Find first product card with cursor-pointer class that has an image
      const cards = Array.from(document.querySelectorAll('.cursor-pointer, div[class*="cursor-pointer"]'));
      const cardWithImage = cards.find(card => card.querySelector('img'));
      
      if (cardWithImage) {
        // Trigger click event directly
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        cardWithImage.dispatchEvent(clickEvent);
        return true;
      }
      return false;
    });
    
    if (clicked) {
      await page.waitForTimeout(3000);
      
      // Wait for modal to appear - ProductDetailModal usually has fixed positioning
      await page.waitForSelector('[role="dialog"], .fixed.inset-0, [class*="fixed"][class*="inset-0"], [class*="z-50"]', { timeout: 15000 });
      await page.waitForTimeout(2000);

      // Scroll within modal if needed
      const modalScrollHeight = await page.evaluate(() => {
        const modal = document.querySelector('[role="dialog"], .fixed.inset-0, [class*="fixed"][class*="inset-0"]');
        if (modal) {
          const scrollableContent = modal.querySelector('[class*="overflow"], [class*="scroll"]');
          return scrollableContent ? scrollableContent.scrollHeight : modal.scrollHeight;
        }
        return document.body.scrollHeight;
      });

      const step = 600;
      for (let y = 0; y < modalScrollHeight; y += step) {
        await page.evaluate((position) => {
          const modal = document.querySelector('[role="dialog"], .fixed.inset-0, [class*="fixed"][class*="inset-0"]');
          if (modal) {
            const scrollableContent = modal.querySelector('[class*="overflow"], [class*="scroll"]');
            if (scrollableContent) {
              scrollableContent.scrollTop = position;
            } else {
              modal.scrollTop = position;
            }
          } else {
            window.scrollTo(0, position);
          }
        }, y);
        await page.waitForTimeout(200);
      }

      // Scroll back to top of modal
      await page.evaluate(() => {
        const modal = document.querySelector('[role="dialog"], .fixed.inset-0, [class*="fixed"][class*="inset-0"]');
        if (modal) {
          const scrollableContent = modal.querySelector('[class*="overflow"], [class*="scroll"]');
          if (scrollableContent) {
            scrollableContent.scrollTop = 0;
          } else {
            modal.scrollTop = 0;
          }
        } else {
          window.scrollTo(0, 0);
        }
      });
      await page.waitForTimeout(1000);

      // Take screenshot
      await page.screenshot({
        path: 'screenshot-product-detail.png',
        fullPage: true,
      });

      console.log(`✅ Saved: screenshot-product-detail.png`);
    } else {
      console.warn('⚠️  No product card found, taking products page screenshot instead');
      await page.screenshot({
        path: 'screenshot-product-detail.png',
        fullPage: true,
      });
    }
  } catch (error) {
    console.error(`❌ Error capturing product detail: ${error.message}`);
    // Fallback: take screenshot of products page
    await page.screenshot({
      path: 'screenshot-product-detail.png',
      fullPage: true,
    });
  }
}

async function main() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // 1. Capture Main/Home Page
    await capturePage(page, '/', 'screenshot-home.png');

    // 2. Capture Products Page
    await capturePage(page, '/products', 'screenshot-products.png', '.cursor-pointer, div[class*="cursor-pointer"]');

    // 3. Capture Product Detail Modal
    await captureProductDetail(page);

    // 4. Capture About Page
    await capturePage(page, '/about', 'screenshot-about.png');

    console.log('\n🎉 All screenshots captured successfully!');
    console.log('📁 Files saved:');
    console.log('   - screenshot-home.png');
    console.log('   - screenshot-products.png');
    console.log('   - screenshot-product-detail.png');
    console.log('   - screenshot-about.png');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

