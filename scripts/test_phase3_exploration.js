import puppeteer from 'puppeteer-core';

async function testPhase3() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=angle', '--use-angle=metal']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  page.on('console', msg => console.log('BROWSER:', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('BROWSER ERROR:', err));

  console.log('1. Loading game...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  // Press Enter on NEW GAME
  console.log('2. Starting New Game...');
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 600));

  // Advance past prologue into Entrance Hall
  console.log('3. Advancing past prologue into Entrance Hall...');
  await page.keyboard.press('Space');
  await new Promise(r => setTimeout(r, 600));

  // Screenshot 1: Entrance Hall with Dynamic Lighting & Flashlight
  await page.screenshot({ path: 'test_p3_1_entrance_hall.png' });
  console.log('Saved test_p3_1_entrance_hall.png');

  // Walk Detective UP towards North Door
  console.log('4. Walking UP towards North Door (Main Hallway)...');
  await page.keyboard.down('ArrowUp');
  await new Promise(r => setTimeout(r, 1600));
  await page.keyboard.up('ArrowUp');
  await new Promise(r => setTimeout(r, 300));

  // Screenshot 2: Inspection Prompt visible above Detective's head
  await page.screenshot({ path: 'test_p3_2_inspect_prompt.png' });
  console.log('Saved test_p3_2_inspect_prompt.png');

  // Open Door to Main Corridor
  console.log('5. Pressing E to open door into Main Corridor...');
  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'test_p3_3_main_hallway.png' });
  console.log('Saved test_p3_3_main_hallway.png');

  // In Main Corridor, walk up-left to inspect the gothic fireplace
  console.log('6. Walking towards Fireplace in Main Corridor...');
  await page.keyboard.down('ArrowLeft');
  await page.keyboard.down('ArrowUp');
  await new Promise(r => setTimeout(r, 1400));
  await page.keyboard.up('ArrowLeft');
  await page.keyboard.up('ArrowUp');
  await new Promise(r => setTimeout(r, 300));

  // Inspect Fireplace
  console.log('7. Pressing E to inspect Fireplace and charred notes...');
  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'test_p3_4_fireplace_modal.png' });
  console.log('Saved test_p3_4_fireplace_modal.png');

  // Close modal
  console.log('8. Closing modal with E...');
  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 300));

  // Walk left to the Library door
  console.log('9. Walking left to Library door...');
  await page.keyboard.down('ArrowLeft');
  await new Promise(r => setTimeout(r, 1200));
  await page.keyboard.up('ArrowLeft');
  await new Promise(r => setTimeout(r, 300));

  // Open Library door
  console.log('10. Opening Library Door...');
  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'test_p3_5_library_room.png' });
  console.log('Saved test_p3_5_library_room.png');

  console.log('Phase 3 verification suite completed successfully!');
  await browser.close();
}

testPhase3().catch(err => {
  console.error('Phase 3 test failed:', err);
  process.exit(1);
});
