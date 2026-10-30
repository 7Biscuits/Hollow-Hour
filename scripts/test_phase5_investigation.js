import puppeteer from 'puppeteer-core';

async function testPhase5() {
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

  // --- SECTION A: SECURITY ROOM & SURVEILLANCE CCTV ---
  console.log('4. Walking right to Security Room door...');
  await page.keyboard.down('ArrowRight');
  await new Promise(r => setTimeout(r, 1800));
  await page.keyboard.up('ArrowRight');
  await new Promise(r => setTimeout(r, 200));

  await page.keyboard.down('ArrowUp');
  await new Promise(r => setTimeout(r, 600));
  await page.keyboard.up('ArrowUp');
  await new Promise(r => setTimeout(r, 400));

  console.log('5. Entering Security Room (E)...');
  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 1000));

  // In Security Room, walk to CCTV console (center north)
  console.log('6. Walking to CCTV console...');
  await page.keyboard.down('ArrowRight');
  await new Promise(r => setTimeout(r, 1500));
  await page.keyboard.up('ArrowRight');
  await new Promise(r => setTimeout(r, 200));

  await page.keyboard.down('ArrowUp');
  await new Promise(r => setTimeout(r, 900));
  await page.keyboard.up('ArrowUp');
  await new Promise(r => setTimeout(r, 400));

  console.log('7. Accessing CCTV Console (E)...');
  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 800));

  // Screenshot 1: CCTV Console showing CAM 01 (Foyer)
  await page.screenshot({ path: 'test_p5_1_cctv_foyer.png' });
  console.log('Saved test_p5_1_cctv_foyer.png');

  // Switch to CAM 4 (Courtyard with rain & lightning)
  console.log('8. Switching to CAM 4 (Courtyard)...');
  await page.keyboard.press('Digit4');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'test_p5_2_cctv_courtyard.png' });
  console.log('Saved test_p5_2_cctv_courtyard.png');

  // Switch to CAM 5 without tape inserted
  console.log('9. Switching to CAM 5 (Sub-Cellar Lab - locked feed)...');
  await page.keyboard.press('Digit5');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'test_p5_3_cctv_no_reel.png' });
  console.log('Saved test_p5_3_cctv_no_reel.png');

  // Insert tape with [T]
  console.log('10. Inserting Surveillance Reel #3 (T)...');
  await page.keyboard.press('KeyT');
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'test_p5_4_cctv_werewolf_reel.png' });
  console.log('Saved test_p5_4_cctv_werewolf_reel.png');

  // Step away from CCTV console
  console.log('11. Stepping away from CCTV Console (Escape)...');
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 500));

  // Exit Security Room back to Entrance Hall
  console.log('12. Exiting Security Room to Entrance Hall...');
  await page.keyboard.down('ArrowLeft');
  await new Promise(r => setTimeout(r, 1800));
  await page.keyboard.up('ArrowLeft');
  await new Promise(r => setTimeout(r, 200));

  await page.keyboard.down('ArrowDown');
  await new Promise(r => setTimeout(r, 800));
  await page.keyboard.up('ArrowDown');
  await new Promise(r => setTimeout(r, 400));

  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 1000));

  // --- SECTION B: MAIN CORRIDOR & LIBRARY BOOKSHELF PUZZLE ---
  console.log('13. Walking from Entrance Hall to Main Corridor door...');
  await page.keyboard.down('ArrowLeft');
  await new Promise(r => setTimeout(r, 1600));
  await page.keyboard.up('ArrowLeft');
  await new Promise(r => setTimeout(r, 200));

  await page.keyboard.down('ArrowUp');
  await new Promise(r => setTimeout(r, 1300));
  await page.keyboard.up('ArrowUp');
  await new Promise(r => setTimeout(r, 400));

  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 1000));

  // In Main Corridor, walk to Library Door (West)
  console.log('14. Walking to Library archway in Main Corridor...');
  await page.keyboard.down('ArrowLeft');
  await new Promise(r => setTimeout(r, 1800));
  await page.keyboard.up('ArrowLeft');
  await new Promise(r => setTimeout(r, 200));

  await page.keyboard.down('ArrowUp');
  await new Promise(r => setTimeout(r, 900));
  await page.keyboard.up('ArrowUp');
  await new Promise(r => setTimeout(r, 400));

  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 1000));

  // In Library, walk west and up to Occult Bookshelf (x=90, y=70)
  console.log('15. Walking to Occult Bookcase in Library...');
  await page.keyboard.down('ArrowLeft');
  await new Promise(r => setTimeout(r, 2900));
  await page.keyboard.up('ArrowLeft');
  await new Promise(r => setTimeout(r, 200));

  await page.keyboard.down('ArrowUp');
  await new Promise(r => setTimeout(r, 900));
  await page.keyboard.up('ArrowUp');
  await new Promise(r => setTimeout(r, 500));

  console.log('16. Interacting with Occult Bookcase (E)...');
  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 800));

  // Screenshot: Bookshelf Puzzle Modal
  await page.screenshot({ path: 'test_p5_5_bookshelf_puzzle.png' });
  console.log('Saved test_p5_5_bookshelf_puzzle.png');

  // Pull books in order: [3] Lycanthropica, [2] De Vermis, [4] The Hollow Hour
  console.log('17. Solving Bookshelf sequence (3, 2, 4)...');
  await page.keyboard.press('Digit3');
  await new Promise(r => setTimeout(r, 400));
  await page.keyboard.press('Digit2');
  await new Promise(r => setTimeout(r, 400));
  await page.keyboard.press('Digit4');
  await new Promise(r => setTimeout(r, 800));

  // Screenshot: Solved Bookshelf
  await page.screenshot({ path: 'test_p5_6_bookshelf_solved.png' });
  console.log('Saved test_p5_6_bookshelf_solved.png');

  // Close Bookshelf modal
  console.log('18. Stepping away from Bookshelf (Escape)...');
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 800));

  // Screenshot: Secret Passage revealed in the Library!
  await page.screenshot({ path: 'test_p5_7_secret_passage_world.png' });
  console.log('Saved test_p5_7_secret_passage_world.png');

  // --- SECTION C: ENTER SECRET PASSAGE & SOLVE OCCULT ALTAR ---
  console.log('19. Walking to the revealed Secret Passage (left)...');
  await page.keyboard.down('ArrowLeft');
  await new Promise(r => setTimeout(r, 600));
  await page.keyboard.up('ArrowLeft');
  await new Promise(r => setTimeout(r, 300));

  console.log('20. Entering Secret Passage (E)...');
  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 1200));

  // Screenshot: Inside Sub-Cellar Crypt
  await page.screenshot({ path: 'test_p5_8_subcellar_crypt.png' });
  console.log('Saved test_p5_8_subcellar_crypt.png');

  // In Sub-Cellar, walk up to Ritual Altar (spawn is x=240, y=240; altar is at x=240, y=130)
  console.log('21. Walking up to Ritual Altar...');
  await page.keyboard.down('ArrowUp');
  await new Promise(r => setTimeout(r, 1000));
  await page.keyboard.up('ArrowUp');
  await new Promise(r => setTimeout(r, 400));

  console.log('22. Accessing Alchemical Dial at Ritual Altar (E)...');
  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 800));

  // Screenshot: Occult Altar Dial
  await page.screenshot({ path: 'test_p5_9_occult_altar_dial.png' });
  console.log('Saved test_p5_9_occult_altar_dial.png');

  // Rotate Rings to celestial alignment [0, 3, 4]
  console.log('23. Aligning concentric stone rings...');
  // Outer Ring (active 0, current 4): rotate +4
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press('KeyD');
    await new Promise(r => setTimeout(r, 200));
  }

  // Middle Ring (select 2, current 7): rotate +4
  await page.keyboard.press('Digit2');
  await new Promise(r => setTimeout(r, 200));
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press('KeyD');
    await new Promise(r => setTimeout(r, 200));
  }

  // Inner Ring (select 3, current 1): rotate +3
  await page.keyboard.press('Digit3');
  await new Promise(r => setTimeout(r, 200));
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press('KeyD');
    await new Promise(r => setTimeout(r, 200));
  }
  await new Promise(r => setTimeout(r, 800));

  // Screenshot: Occult Altar Solved!
  await page.screenshot({ path: 'test_p5_10_occult_altar_solved.png' });
  console.log('Saved test_p5_10_occult_altar_solved.png');

  // Step away from Altar
  console.log('24. Stepping away from Altar (Escape)...');
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 500));

  // --- SECTION D: NOTEBOOK & INVENTORY VERIFICATION ---
  console.log('25. Opening Detective Notebook (N)...');
  await page.keyboard.press('KeyN');
  await new Promise(r => setTimeout(r, 600));

  // Clues Tab
  await page.keyboard.press('Digit1');
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'test_p5_11_notebook_clues.png' });
  console.log('Saved test_p5_11_notebook_clues.png');

  // Objectives Tab
  await page.keyboard.press('Digit3');
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'test_p5_12_notebook_objectives.png' });
  console.log('Saved test_p5_12_notebook_objectives.png');

  // Close notebook
  await page.keyboard.press('KeyN');
  await new Promise(r => setTimeout(r, 400));

  // Inventory Verification
  console.log('26. Opening Inventory (Tab) to verify items collected...');
  await page.keyboard.press('Tab');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'test_p5_13_inventory_solved_items.png' });
  console.log('Saved test_p5_13_inventory_solved_items.png');

  await page.keyboard.press('Tab');
  await new Promise(r => setTimeout(r, 300));

  console.log('Phase 5 Investigation & Puzzle verification suite completed successfully!');
  await browser.close();
}

testPhase5().catch(err => {
  console.error('Phase 5 test failed:', err);
  process.exit(1);
});
