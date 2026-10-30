import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function testPhase7() {
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
  await new Promise(r => setTimeout(r, 1200));

  // Press Enter on NEW GAME
  console.log('2. Starting New Game...');
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 1500));

  // Wait for GameScene to be active
  await page.waitForFunction(() => {
    const game = window.__PHASER_GAME__;
    return game && game.scene.isActive('GameScene');
  }, { timeout: 10000 });

  // Advance past prologue into Entrance Hall
  console.log('3. Advancing past prologue into Entrance Hall...');
  await page.keyboard.press('Space');
  await new Promise(r => setTimeout(r, 1000));

  // Walk up to Main Hallway Archway (x=240, y=50 from spawn 240, 250)
  console.log('4. Walking north into Main Hallway...');
  await page.keyboard.down('ArrowUp');
  await new Promise(r => setTimeout(r, 2200));
  await page.keyboard.up('ArrowUp');
  await new Promise(r => setTimeout(r, 300));

  // Press E to enter Main Hallway
  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 1000));

  // In Main Hallway, wardrobe is at x: 350, y: 80 (player spawns at 240, 260)
  console.log('5. Walking towards carved wardrobe in Main Hallway...');
  await page.keyboard.down('ArrowRight');
  await new Promise(r => setTimeout(r, 1200));
  await page.keyboard.up('ArrowRight');
  await new Promise(r => setTimeout(r, 200));

  await page.keyboard.down('ArrowUp');
  await new Promise(r => setTimeout(r, 1800));
  await page.keyboard.up('ArrowUp');
  await new Promise(r => setTimeout(r, 600));

  console.log('6. Inspecting wardrobe prompt...');
  await page.screenshot({ path: 'test_screenshots/test_p7_1_wardrobe_prompt.png' });

  // Hide in Wardrobe
  console.log('7. Hiding inside wardrobe (E)...');
  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'test_screenshots/test_p7_2_wardrobe_hidden.png' });

  // Spawn Werewolf patrolling nearby while player is hidden
  console.log('8. Spawning Werewolf patrol in Main Hallway...');
  await page.evaluate(() => {
    const game = window.__PHASER_GAME__;
    const gameScene = game.scene.getScene('GameScene');
    // Spawn werewolf patrolling near the wardrobe
    gameScene.spawnScriptedWerewolf(280, 150, [
      { x: 260, y: 150 },
      { x: 370, y: 150 },
      { x: 300, y: 180 }
    ]);
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'test_screenshots/test_p7_3_werewolf_patrol.png' });

  // Step out of wardrobe into the hallway
  console.log('9. Stepping out of wardrobe into the hallway (Space)...');
  await page.keyboard.press('Space');
  await new Promise(r => setTimeout(r, 500));

  // Run left making footstep noise to trigger Werewolf detection
  console.log('10. Running to trigger werewolf hearing detection...');
  await page.keyboard.down('Shift');
  await page.keyboard.down('ArrowLeft');
  await new Promise(r => setTimeout(r, 800));
  await page.keyboard.up('ArrowLeft');
  await page.keyboard.up('Shift');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'test_screenshots/test_p7_4_werewolf_chase.png' });

  // Let Werewolf catch up and attack Detective
  console.log('11. Waiting for werewolf strike & laceration...');
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'test_screenshots/test_p7_5_damage_and_vignette.png' });

  // Verify damage received
  const playerStats = await page.evaluate(() => {
    const game = window.__PHASER_GAME__;
    const gameScene = game.scene.getScene('GameScene');
    const player = gameScene.getPlayer();
    return {
      health: player.getHealth(),
      maxHealth: player.getMaxHealth()
    };
  });
  console.log('Detective Vitality after werewolf strike:', playerStats);

  // Give player laudanum and consume it
  console.log('12. Consuming Laudanum to heal vitality...');
  await page.evaluate(() => {
    const game = window.__PHASER_GAME__;
    const gameScene = game.scene.getScene('GameScene');
    gameScene.inventorySystem.addItem('item_laudanum');
  });

  // Open inventory [TAB]
  await page.keyboard.press('Tab');
  await new Promise(r => setTimeout(r, 600));

  // Press U to use selected item (laudanum)
  await page.keyboard.press('u');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'test_screenshots/test_p7_6_healed_with_laudanum.png' });

  // Close modal [Space]
  await page.keyboard.press('Space');
  await new Promise(r => setTimeout(r, 500));

  const healedStats = await page.evaluate(() => {
    const game = window.__PHASER_GAME__;
    const gameScene = game.scene.getScene('GameScene');
    const player = gameScene.getPlayer();
    return {
      health: player.getHealth()
    };
  });
  console.log('Detective Vitality after Laudanum:', healedStats);

  await browser.close();

  console.log('Phase 7 Verification Complete! Browser errors:', errors.length);
  if (errors.length > 0) {
    console.error('Errors encountered:', errors);
    process.exit(1);
  }
}

testPhase7().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
