import puppeteer from 'puppeteer-core';

async function test() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=angle', '--use-angle=metal']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err));

  console.log('Navigating to http://localhost:3000/ ...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });

  // Wait 1.5 seconds for BootScene and transitions
  await new Promise(r => setTimeout(r, 1500));

  await page.screenshot({ path: 'test_menu.png' });
  console.log('Screenshot saved to test_menu.png');

  await browser.close();
}

test().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
