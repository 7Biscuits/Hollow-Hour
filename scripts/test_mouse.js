import puppeteer from 'puppeteer-core';

async function testMouse() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=angle', '--use-angle=metal']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  const canvas = await page.$('canvas');
  const box = await canvas.boundingBox();
  console.log('Canvas bounding box:', box);

  const targetX = box.x + box.width / 2;
  const targetY = box.y + (228 / 360) * box.height;

  console.log('Hovering over Settings at:', targetX, targetY);
  await page.mouse.move(targetX, targetY);
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'test_mouse_hover_settings.png' });

  console.log('Clicking Settings...');
  await page.mouse.click(targetX, targetY);
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'test_mouse_click_settings.png' });

  await browser.close();
  console.log('Mouse test complete!');
}

testMouse().catch(err => {
  console.error(err);
  process.exit(1);
});
