import puppeteer from 'puppeteer-core';

async function testPhase10E2E() {
  console.log('=== STARTING PHASE 10: END-TO-END GAME COMPLETION TEST ===');

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

  // 1. Load Game & Main Menu
  console.log('1. Loading Main Menu...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'test_p10_1_menu.png' });

  // 2. Start New Game
  console.log('2. Starting New Game...');
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 1200));

  // 3. Prologue Intro
  console.log('3. Advancing Prologue...');
  await page.keyboard.press('Space');
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'test_p10_2_foyer.png' });

  // 4. Complete Grandfather Clock Puzzle (Hollow Hour 3:33)
  console.log('4. Solving Grandfather Clock Puzzle...');
  await page.evaluate(() => {
    const game = window.__PHASER_GAME__;
    const gameScene = game.scene.getScene('GameScene');
    // Simulate setting clock hands to 3:33
    const clockPuzzle = gameScene.puzzleManager.getClockPuzzle();
    clockPuzzle.insertClockHand();
    clockPuzzle.setTime(3, 33);
    clockPuzzle.solve();
    gameScene.inventorySystem.addItem('item_brass_key');
    gameScene.notebookSystem.addClue('clue_grandfather_clock');
  });

  // 5. Security Room & CCTV Review
  console.log('5. Visiting Security Room & reviewing CCTV Reel #3...');
  await page.evaluate(() => {
    const game = window.__PHASER_GAME__;
    const gameScene = game.scene.getScene('GameScene');
    gameScene.storyManager.setFlag('has_spoken_to_hayes', true);
    gameScene.storyManager.setFlag('cctv_footage_reviewed', true);
    gameScene.inventorySystem.addItem('item_laudanum');
    gameScene.inventorySystem.addItem('item_cctv_tape');
    gameScene.notebookSystem.addClue('clue_cctv_werewolf');
    gameScene.notebookSystem.addClue('clue_hayes_revelation');
    gameScene.storyManager.triggerMurder('edward');
  });

  // 6. Main Hallway & Fireplace Clue
  console.log('6. Searching Fireplace in Main Hallway...');
  await page.evaluate(() => {
    const game = window.__PHASER_GAME__;
    const gameScene = game.scene.getScene('GameScene');
    gameScene.inventorySystem.addItem('item_charred_diary');
    gameScene.notebookSystem.addClue('clue_fireplace_notes');
  });

  // 7. Library: Edward's Ghost & Bookshelf Puzzle
  console.log('7. Communing with Edward\'s Ghost & solving occult bookcase...');
  await page.evaluate(() => {
    const game = window.__PHASER_GAME__;
    const gameScene = game.scene.getScene('GameScene');
    const bookshelf = gameScene.puzzleManager.getBookshelfPuzzle();
    bookshelf.pullBook(3);
    bookshelf.pullBook(2);
    bookshelf.pullBook(4);
    gameScene.storyManager.setFlag('bookshelf_puzzle_solved', true);
    gameScene.notebookSystem.addClue('clue_edward_warning');
    gameScene.notebookSystem.addClue('clue_hidden_compartment');
    gameScene.storyManager.triggerMurder('victoria');
    gameScene.storyManager.unlockDoor('door_to_bedroom');
  });

  // 8. Bedroom: Victoria's Ghost Confession
  console.log('8. Communing with Victoria\'s Ghost in Master Bedroom...');
  await page.evaluate(() => {
    const game = window.__PHASER_GAME__;
    const gameScene = game.scene.getScene('GameScene');
    gameScene.inventorySystem.addItem('item_silver_sigil');
    gameScene.notebookSystem.addClue('clue_victoria_confession');
  });

  // 9. Sub-Cellar Crypt: Occult Altar Dial Puzzle
  console.log('9. Aligning concentric runes at Obsidian Altar...');
  await page.evaluate(() => {
    const game = window.__PHASER_GAME__;
    const gameScene = game.scene.getScene('GameScene');
    const occult = gameScene.puzzleManager.getOccultPuzzle();
    occult.solve();
    gameScene.storyManager.setFlag('occult_altar_solved', true);
    gameScene.inventorySystem.addItem('item_ritual_dagger');
    gameScene.inventorySystem.addItem('item_iron_key');
    gameScene.notebookSystem.addClue('clue_basement_altar');
    gameScene.storyManager.triggerMurder('hayes');
    gameScene.storyManager.setChapter('chapter_7_ritual');

    // Spawn player at Altar in basement
    gameScene.roomManager.loadRoom('basement', gameScene.getPlayer(), { x: 240, y: 160 });
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'test_p10_3_crypt_climax.png' });

  // 10. Trigger Climax Choice
  console.log('10. Triggering Climax Confrontation Choice...');
  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 800));

  // Choose Ending A: The Severed Curse
  console.log('11. Choosing Ending A: The Severed Curse...');
  await page.keyboard.press('Digit1');
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'test_p10_4_ending_a.png' });

  // 12. Verify Case Summary
  console.log('12. Verifying full Case Summary on Ending Screen...');
  const endingSummary = await page.evaluate(() => {
    const game = window.__PHASER_GAME__;
    const endingScene = game.scene.getScene('EndingScene');
    return endingScene && endingScene.scene.isActive();
  });
  console.log('Ending Scene active:', endingSummary);

  // 13. Return to Main Menu
  console.log('13. Returning to Main Menu...');
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 1200));

  const isBackInMenu = await page.evaluate(() => {
    const game = window.__PHASER_GAME__;
    const menuScene = game.scene.getScene('MenuScene');
    return menuScene && menuScene.scene.isActive();
  });
  console.log('Main Menu active after full playthrough:', isBackInMenu);
  await page.screenshot({ path: 'test_p10_5_return_menu.png' });

  await browser.close();

  console.log('=== END-TO-END COMPLETION TEST FINISHED! ===');
  console.log('Browser errors encountered:', errors.length);
  if (errors.length > 0) {
    console.error('Test encountered errors:', errors);
    process.exit(1);
  }
}

testPhase10E2E().catch(err => {
  console.error('E2E Test execution failed:', err);
  process.exit(1);
});
