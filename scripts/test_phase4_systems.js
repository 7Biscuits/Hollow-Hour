import puppeteer from 'puppeteer-core';

async function testPhase4() {
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
  await new Promise(r => setTimeout(r, 1400));

  // Advance past prologue into Entrance Hall
  console.log('3. Advancing past prologue into Entrance Hall...');
  await page.keyboard.press('Space');
  await new Promise(r => setTimeout(r, 800));

  // Screenshot 1: Entrance Hall with HUD bar
  await page.screenshot({ path: 'test_p4_1_entrance_hall_hud.png' });
  console.log('Saved test_p4_1_entrance_hall_hud.png');

  // Open Inventory with I key
  console.log('4. Opening Inventory with I key...');
  await page.keyboard.press('KeyI');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'test_p4_2_inventory_ui.png' });
  console.log('Saved test_p4_2_inventory_ui.png');

  // Close Inventory with I key
  console.log('5. Closing Inventory with I key...');
  await page.keyboard.press('KeyI');
  await new Promise(r => setTimeout(r, 400));

  // Open Notebook with N
  console.log('6. Opening Detective Notebook with N...');
  await page.keyboard.press('KeyN');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'test_p4_3_notebook_clues.png' });
  console.log('Saved test_p4_3_notebook_clues.png');

  // Switch to Suspects Tab (Press 2)
  console.log('7. Switching to Suspects Tab...');
  await page.keyboard.press('Digit2');
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'test_p4_4_notebook_suspects.png' });
  console.log('Saved test_p4_4_notebook_suspects.png');

  // Switch to Objectives Tab (Press 3)
  console.log('8. Switching to Objectives Tab...');
  await page.keyboard.press('Digit3');
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'test_p4_5_notebook_objectives.png' });
  console.log('Saved test_p4_5_notebook_objectives.png');

  // Switch to Mansion Map Tab (Press 4)
  console.log('9. Switching to Mansion Map Tab...');
  await page.keyboard.press('Digit4');
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'test_p4_6_notebook_map.png' });
  console.log('Saved test_p4_6_notebook_map.png');

  // Close Notebook with N key
  console.log('10. Closing Notebook with N key...');
  await page.keyboard.press('KeyN');
  await new Promise(r => setTimeout(r, 400));

  // Walk sequentially to Grandfather Clock: Left then Up
  console.log('11. Walking left then up towards Grandfather Clock...');
  await page.keyboard.down('ArrowLeft');
  await new Promise(r => setTimeout(r, 1800));
  await page.keyboard.up('ArrowLeft');
  await new Promise(r => setTimeout(r, 200));

  await page.keyboard.down('ArrowUp');
  await new Promise(r => setTimeout(r, 1400));
  await page.keyboard.up('ArrowUp');
  await new Promise(r => setTimeout(r, 400));

  // Open Clock Puzzle Modal with E
  console.log('12. Interacting with Grandfather Clock (E)...');
  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 600));

  // Turn hands in the clock puzzle
  await page.keyboard.press('ArrowRight');
  await new Promise(r => setTimeout(r, 200));
  await page.keyboard.press('ArrowUp');
  await new Promise(r => setTimeout(r, 300));

  await page.screenshot({ path: 'test_p4_7_clock_puzzle.png' });
  console.log('Saved test_p4_7_clock_puzzle.png');

  // Close Clock Puzzle with E
  console.log('13. Closing Clock Puzzle with E...');
  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 400));

  // Walk from Clock to North Door: Right then Up
  console.log('14. Walking to Main Hallway Door...');
  await page.keyboard.down('ArrowRight');
  await new Promise(r => setTimeout(r, 1800));
  await page.keyboard.up('ArrowRight');
  await new Promise(r => setTimeout(r, 200));

  await page.keyboard.down('ArrowUp');
  await new Promise(r => setTimeout(r, 600));
  await page.keyboard.up('ArrowUp');
  await new Promise(r => setTimeout(r, 400));

  // Enter Main Hallway
  console.log('15. Entering Main Hallway with E...');
  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 1000));

  // In Main Hallway, walk to Gothic Fireplace
  console.log('16. Walking left and up to Gothic Fireplace...');
  await page.keyboard.down('ArrowLeft');
  await new Promise(r => setTimeout(r, 1400));
  await page.keyboard.up('ArrowLeft');
  await new Promise(r => setTimeout(r, 200));

  await page.keyboard.down('ArrowUp');
  await new Promise(r => setTimeout(r, 1800));
  await page.keyboard.up('ArrowUp');
  await new Promise(r => setTimeout(r, 400));

  console.log('17. Inspecting Fireplace with E (collects charred diary note & clue)...');
  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'test_p4_8_fireplace_clue_modal.png' });
  console.log('Saved test_p4_8_fireplace_clue_modal.png');

  // Dismiss modal with E
  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 400));

  // Re-open Inventory to verify collected item
  console.log('18. Re-opening Inventory with I to verify Charred Diary item...');
  await page.keyboard.press('KeyI');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'test_p4_9_inventory_with_item.png' });
  console.log('Saved test_p4_9_inventory_with_item.png');

  // Close inventory with I key
  await page.keyboard.press('KeyI');
  await new Promise(r => setTimeout(r, 400));

  // Re-open Notebook to verify collected Clue
  console.log('19. Re-opening Notebook with N to verify recorded Clue...');
  await page.keyboard.press('KeyN');
  await new Promise(r => setTimeout(r, 600));
  await page.keyboard.press('Digit1');
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'test_p4_10_notebook_with_clue.png' });
  console.log('Saved test_p4_10_notebook_with_clue.png');

  await page.keyboard.press('KeyN');
  await new Promise(r => setTimeout(r, 300));

  console.log('Phase 4 systems verification suite completed successfully!');
  await browser.close();
}

testPhase4().catch(err => {
  console.error('Phase 4 test failed:', err);
  process.exit(1);
});
