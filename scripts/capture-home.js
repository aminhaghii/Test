import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:8080';

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const [, , rawPath = '/', outputName = 'full-home.png'] = process.argv;
  const target = new URL(rawPath, BASE_URL).toString();

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(target, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  const step = 600;

  for (let y = 0; y < scrollHeight; y += step) {
    await page.evaluate((position) => window.scrollTo(0, position), y);
    await page.waitForTimeout(150);
  }

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  await page.screenshot({
    path: outputName,
    fullPage: true,
  });

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

