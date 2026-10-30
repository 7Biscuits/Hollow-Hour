import puppeteer from 'puppeteer-core';

async function testPhase8() {
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

  // Set up story state for climax: transition to basement with required items
  console.log('4. Transitioning player to Sub-Cellar crypt with ritual items...');
  await page.evaluate(() => {
    const game = window.__PHASER_GAME__;
    const gameScene = game.scene.getScene('GameScene');

    // Add necessary quest items for Ending A
    gameScene.inventorySystem.addItem('item_ritual_dagger');
    gameScene.inventorySystem.addItem('item_silver_sigil');

    // Mark prior story milestones
    gameScene.storyManager.setFlag('cctv_footage_reviewed', true);
    gameScene.storyManager.setFlag('bookshelf_puzzle_solved', true);
    gameScene.storyManager.setFlag('edward_murdered', true);
    gameScene.storyManager.setFlag('victoria_murdered', true);
    gameScene.storyManager.setFlag('occult_altar_solved', true);
    gameScene.storyManager.setChapter('chapter_7_ritual');

    // Load Sub-Cellar crypt
    gameScene.roomManager.loadRoom('basement', gameScene.getPlayer(), { x: 240, y: 190 });
  });
  await new Promise(r => setTimeout(r, 1000));

  // Check prompt near altar (altar is at x=240, y=130 in basement)
  console.log('5. Walking north to Occult Altar...');
  await page.keyboard.down('ArrowUp');
  await new Promise(r => setTimeout(r, 800));
  await page.keyboard.up('ArrowUp');
  await new Promise(r => setTimeout(r, 500));

  const promptText = await page.evaluate(() => {
    const game = window.__PHASER_GAME__;
    const gameScene = game.scene.getScene('GameScene');
    return gameScene.ui && gameScene.ui.promptText ? gameScene.ui.promptText.text : null;
  });
  console.log('Altar Prompt near climax:', promptText);

  // Trigger Climax Choice Modal by pressing E
  console.log('6. Interacting with Altar to open Climax Choice Modal...');
  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 800));

  const isClimaxOpen = await page.evaluate(() => {
    const game = window.__PHASER_GAME__;
    const gameScene = game.scene.getScene('GameScene');
    return gameScene.climaxChoiceModal.getIsOpen();
  });
  console.log('Climax Choice Modal isOpen:', isClimaxOpen);

  await page.screenshot({ path: 'test_p8_1_climax_modal.png' });
  console.log('Captured test_p8_1_climax_modal.png');

  // Choose Option 1: Sever the Lunar Tether (Ending A)
  console.log('7. Pressing 1 to trigger Ending A: The Severed Curse...');
  await page.keyboard.press('Digit1');
  await new Promise(r => setTimeout(r, 1800));

  await page.screenshot({ path: 'test_p8_2_ending_a_severed_curse.png' });
  console.log('Captured test_p8_2_ending_a_severed_curse.png');

  // Verify Ending B: The Hollow Heir
  console.log('8. Testing Ending B: The Hollow Heir...');
  await page.evaluate(() => {
    const game = window.__PHASER_GAME__;
    game.scene.stop('EndingScene');
    game.scene.start('EndingScene', { ending: 'beast_eternal' });
  });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: 'test_p8_3_ending_b_hollow_heir.png' });
  console.log('Captured test_p8_3_ending_b_hollow_heir.png');

  // Verify Ending C: Ash and Memory
  console.log('9. Testing Ending C: Ash and Memory...');
  await page.evaluate(() => {
    const game = window.__PHASER_GAME__;
    game.scene.stop('EndingScene');
    game.scene.start('EndingScene', { ending: 'ash_memory' });
  });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: 'test_p8_4_ending_c_ash_memory.png' });
  console.log('Captured test_p8_4_ending_c_ash_memory.png');

  // Return to Main Menu
  console.log('10. Pressing Enter to return to Main Menu...');
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 1200));

  const activeScene = await page.evaluate(() => {
    const game = window.__PHASER_GAME__;
    const menuScene = game.scene.getScene('MenuScene');
    return menuScene && menuScene.scene.isActive() ? 'MenuScene' : 'Other';
  });
  console.log('Active Scene after return:', activeScene);

  await page.screenshot({ path: 'test_p8_5_return_to_menu.png' });
  console.log('Captured test_p8_5_return_to_menu.png');

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
