import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function testPhase8() {
  if (!fs.existsSync('test_screenshots')) {
    fs.mkdirSync('test_screenshots');
  }

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

  // Wait for GameScene to be active
  await page.waitForFunction(() => {
    const game = window.__PHASER_GAME__;
    return game && game.scene.isActive('GameScene');
  }, { timeout: 10000 });

  // Advance past prologue into Entrance Hall
  console.log('3. Advancing past prologue into Entrance Hall...');
  await page.keyboard.press('Space');
  await new Promise(r => setTimeout(r, 800));

  // --- SECTION A: Advance story through state and transition to Sub-Cellar Crypt ---
  console.log('4. Advancing narrative to Climax in Sub-Cellar Crypt...');
  await page.evaluate(() => {
    const game = window.__PHASER_GAME__;
    const gameScene = game.scene.getScene('GameScene');

    // Trigger all investigation milestones
    gameScene.storyManager.setFlag('clock_puzzle_solved', true);
    gameScene.storyManager.setFlag('cctv_footage_reviewed', true);
    gameScene.storyManager.triggerMurder('edward');
    gameScene.storyManager.setFlag('bookshelf_puzzle_solved', true);
    gameScene.storyManager.triggerMurder('victoria');

    // Add necessary ritual artifacts to inventory
    gameScene.inventorySystem.addItem('item_silver_sigil');
    gameScene.inventorySystem.addItem('item_ritual_dagger');

    // Load Sub-Cellar Crypt
    gameScene.roomManager.loadRoom('basement', gameScene.player);
    gameScene.storyManager.setFlag('occult_altar_solved', true);
    gameScene.storyManager.triggerMurder('hayes');
    gameScene.storyManager.setChapter('chapter_7_ritual');
  });
  await new Promise(r => setTimeout(r, 1200));

  // Inspect the Altar at x: 240, y: 130 (player spawns at 240, 260)
  console.log('5. Walking up to Occult Altar in Crypt...');
  await page.keyboard.down('ArrowUp');
  await new Promise(r => setTimeout(r, 1400));
  await page.keyboard.up('ArrowUp');
  await new Promise(r => setTimeout(r, 400));

  // Trigger Climax Choice Modal (E)
  console.log('6. Interacting with Altar to open Climax Choice Modal (E)...');
  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 800));

  console.log('7. Capturing Climax Choice Modal screenshot...');
  await page.screenshot({ path: 'test_screenshots/test_p8_1_climax_modal.png' });

  // --- SECTION B: Trigger Ending A (The Severed Curse / Exorcism) ---
  console.log('8. Selecting Choice [1]: Sever the Lunar Tether...');
  await page.keyboard.press('Digit1');
  await new Promise(r => setTimeout(r, 1500));

  // Wait for EndingScene to be active
  await page.waitForFunction(() => {
    const game = window.__PHASER_GAME__;
    return game && game.scene.isActive('EndingScene');
  }, { timeout: 10000 });
  await new Promise(r => setTimeout(r, 1000));

  console.log('9. Capturing Ending A: The Severed Curse screenshot...');
  await page.screenshot({ path: 'test_screenshots/test_p8_2_ending_severed_curse.png' });

  // --- SECTION C: Test Ending B (The Hollow Heir / Beast Transference) ---
  console.log('10. Transitioning to Ending B: The Hollow Heir...');
  await page.evaluate(() => {
    const game = window.__PHASER_GAME__;
    game.scene.stop('EndingScene');
    game.scene.start('EndingScene', { ending: 'beast_eternal' });
  });
  await new Promise(r => setTimeout(r, 1500));

  console.log('11. Capturing Ending B: The Hollow Heir screenshot...');
  await page.screenshot({ path: 'test_screenshots/test_p8_3_ending_beast_eternal.png' });

  // --- SECTION D: Test Ending C (Ash and Memory / Immolation) ---
  console.log('12. Transitioning to Ending C: Ash and Memory...');
  await page.evaluate(() => {
    const game = window.__PHASER_GAME__;
    game.scene.stop('EndingScene');
    game.scene.start('EndingScene', { ending: 'ash_memory' });
  });
  await new Promise(r => setTimeout(r, 1500));

  console.log('13. Capturing Ending C: Ash and Memory screenshot...');
  await page.screenshot({ path: 'test_screenshots/test_p8_4_ending_ash_memory.png' });

  // --- SECTION E: Return to Menu from Ending Scene ---
  console.log('14. Pressing Enter to return to Main Menu...');
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 1400));

  await page.waitForFunction(() => {
    const game = window.__PHASER_GAME__;
    return game && game.scene.isActive('MenuScene');
  }, { timeout: 10000 });

  console.log('15. Verifying Continue button is active in Main Menu after completion...');
  await page.screenshot({ path: 'test_screenshots/test_p8_5_menu_continue_active.png' });

  await browser.close();

  console.log('Phase 8 Verification Complete! Browser errors:', errors.length);
  if (errors.length > 0) {
    console.error('Errors encountered:', errors);
    process.exit(1);
  }
}

testPhase8().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
