import puppeteer from 'puppeteer-core';

async function testPhase9() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=angle', '--use-angle=metal']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
    console.log('BROWSER:', msg.type(), msg.text());
  });
  page.on('pageerror', err => {
    errors.push(err.message);
    console.error('BROWSER ERROR:', err);
  });

  console.log('1. Loading game...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  // Press Enter on NEW GAME
  console.log('2. Starting New Game...');
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 1400));

  // Advance past prologue into Entrance Hall
  console.log('3. Advancing past prologue into Entrance Hall...');
  await page.keyboard.press('Space');
  await new Promise(r => setTimeout(r, 800));

  // Wait 1.5 seconds in Entrance Hall to let clock ticking sound execute
  console.log('4. Listening to Grandfather Clock pendulum ticking in Entrance Hall...');
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'test_p9_1_entrance_hall_dust_and_clock.png' });
  console.log('Captured test_p9_1_entrance_hall_dust_and_clock.png');

  // Transition to Main Hallway
  console.log('5. Walking north into Main Hallway...');
  await page.keyboard.down('ArrowUp');
  await new Promise(r => setTimeout(r, 2000));
  await page.keyboard.up('ArrowUp');
  await new Promise(r => setTimeout(r, 300));

  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 1000));

  // Sprint across wood floor with Shift + Arrow keys to trigger creaking floorboard audio
  console.log('6. Sprinting across wood parquet floor to test creaking floorboards...');
  await page.keyboard.down('Shift');
  await page.keyboard.down('ArrowRight');
  await new Promise(r => setTimeout(r, 1500));
  await page.keyboard.up('ArrowRight');
  await page.keyboard.down('ArrowLeft');
  await new Promise(r => setTimeout(r, 1500));
  await page.keyboard.up('ArrowLeft');
  await page.keyboard.up('Shift');
  await new Promise(r => setTimeout(r, 500));

  await page.screenshot({ path: 'test_p9_2_main_hallway_creaking_floorboards.png' });
  console.log('Captured test_p9_2_main_hallway_creaking_floorboards.png');

  // Trigger Sub-Cellar crypt water drip
  console.log('7. Loading Sub-Cellar Crypt to verify subterranean water drips...');
  await page.evaluate(() => {
    const game = window.__PHASER_GAME__;
    const gameScene = game.scene.getScene('GameScene');
    gameScene.roomManager.loadRoom('basement', gameScene.getPlayer());
    gameScene.audioManager.playWaterDrip();
  });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: 'test_p9_3_subcellar_crypt_water_drips.png' });
  console.log('Captured test_p9_3_subcellar_crypt_water_drips.png');

  // Trigger ambient sheet lightning flash & thunder
  console.log('8. Triggering ambient sheet lightning flash & thunder rumble...');
  await page.evaluate(() => {
    const game = window.__PHASER_GAME__;
    const gameScene = game.scene.getScene('GameScene');
    gameScene.cameras.main.flash(200, 220, 230, 255);
    gameScene.cameras.main.shake(160, 0.006);
    gameScene.audioManager.playThunder();
  });
  await new Promise(r => setTimeout(r, 500));

  await page.screenshot({ path: 'test_p9_4_lightning_flash.png' });
  console.log('Captured test_p9_4_lightning_flash.png');

  await browser.close();

  console.log('Phase 9 Verification Complete! Browser errors:', errors.length);
  if (errors.length > 0) {
    console.error('Errors encountered:', errors);
    process.exit(1);
  }
}

testPhase9().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
