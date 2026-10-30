import puppeteer from 'puppeteer-core';

async function testPhase6() {
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

  // --- SECTION A: SECURITY ROOM & DR. ROBERT HAYES ---
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

  // Walk up to Dr. Robert Hayes (spawn x=70, y=180; Hayes is at x=180, y=85)
  console.log('6. Walking to Dr. Robert Hayes...');
  await page.keyboard.down('ArrowRight');
  await new Promise(r => setTimeout(r, 1000));
  await page.keyboard.up('ArrowRight');
  await new Promise(r => setTimeout(r, 200));

  await page.keyboard.down('ArrowUp');
  await new Promise(r => setTimeout(r, 800));
  await page.keyboard.up('ArrowUp');
  await new Promise(r => setTimeout(r, 500));

  console.log('7. Speaking with Dr. Robert Hayes (E)...');
  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 800));

  // Screenshot 1: Living Dr. Hayes Dialogue
  await page.screenshot({ path: 'test_p6_1_hayes_living_dialogue.png' });
  console.log('Saved test_p6_1_hayes_living_dialogue.png');

  // Advance dialogue and select Prescriptions branch
  await page.keyboard.press('Space');
  await new Promise(r => setTimeout(r, 300));
  await page.keyboard.press('Space');
  await new Promise(r => setTimeout(r, 300));
  await page.keyboard.press('Space');
  await new Promise(r => setTimeout(r, 400));

  // Select Choice 1 (Prescriptions)
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 600));
  await page.keyboard.press('Space');
  await new Promise(r => setTimeout(r, 300));
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 500));

  // Access CCTV Console to view tape and trigger Edward's murder
  console.log('8. Walking slightly right to CCTV Console...');
  await page.keyboard.down('ArrowRight');
  await new Promise(r => setTimeout(r, 600));
  await page.keyboard.up('ArrowRight');
  await new Promise(r => setTimeout(r, 400));

  console.log('9. Accessing CCTV Console and playing reel to trigger story event...');
  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 800));
  await page.keyboard.press('KeyT');
  await new Promise(r => setTimeout(r, 600));
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 600));

  // Exit Security Room back to Entrance Hall
  console.log('10. Exiting Security Room to Entrance Hall...');
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

  // --- SECTION B: LIBRARY & EDWARD'S GHOST ---
  console.log('11. Walking to Main Corridor...');
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
  console.log('12. Entering Library...');
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

  // In Library: Living Edward is gone; Edward's Ghost stands near bookcase!
  console.log('13. Walking towards Edward\'s Ghost in the Library...');
  await page.keyboard.down('ArrowLeft');
  await new Promise(r => setTimeout(r, 2700));
  await page.keyboard.up('ArrowLeft');
  await new Promise(r => setTimeout(r, 200));

  await page.keyboard.down('ArrowUp');
  await new Promise(r => setTimeout(r, 800));
  await page.keyboard.up('ArrowUp');
  await new Promise(r => setTimeout(r, 500));

  // Screenshot 2: Edward's Ghost in the Library
  await page.screenshot({ path: 'test_p6_2_edward_ghost_library.png' });
  console.log('Saved test_p6_2_edward_ghost_library.png');

  // Interact with Edward's Ghost
  console.log('14. Communing with Edward\'s Ghost (E)...');
  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 800));

  // Screenshot 3: Spectral Edward Dialogue Box
  await page.screenshot({ path: 'test_p6_3_edward_ghost_dialogue.png' });
  console.log('Saved test_p6_3_edward_ghost_dialogue.png');

  // Dismiss Edward's ghost dialogue
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 500));

  // Solve the Bookcase sequence to trigger Victoria's murder
  console.log('15. Solving Bookcase sequence to trigger next story milestone...');
  await page.keyboard.down('ArrowLeft');
  await new Promise(r => setTimeout(r, 300));
  await page.keyboard.up('ArrowLeft');
  await new Promise(r => setTimeout(r, 200));

  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 600));
  await page.keyboard.press('Digit3');
  await new Promise(r => setTimeout(r, 300));
  await page.keyboard.press('Digit2');
  await new Promise(r => setTimeout(r, 300));
  await page.keyboard.press('Digit4');
  await new Promise(r => setTimeout(r, 600));
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 600));

  // --- SECTION C: MASTER BEDROOM & VICTORIA'S GHOST ---
  console.log('16. Exiting Library back to Main Corridor...');
  await page.keyboard.down('ArrowRight');
  await new Promise(r => setTimeout(r, 3200));
  await page.keyboard.up('ArrowRight');
  await new Promise(r => setTimeout(r, 400));

  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 1000));

  // In Corridor, walk East to Master Bedroom Door
  console.log('17. Walking East to Master Bedroom door...');
  await page.keyboard.down('ArrowRight');
  await new Promise(r => setTimeout(r, 3200));
  await page.keyboard.up('ArrowRight');
  await new Promise(r => setTimeout(r, 400));

  // Unlock and enter Master Bedroom
  console.log('18. Unlocking Master Bedroom with Brass Key (E)...');
  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 600));
  // Dismiss door unlocked modal
  await page.keyboard.press('Space');
  await new Promise(r => setTimeout(r, 1200));

  // In Bedroom: Victoria is slain; Victoria's Ghost stands near canopy bed!
  console.log('19. Walking to Victoria\'s Ghost in Master Bedroom...');
  await page.keyboard.down('ArrowRight');
  await new Promise(r => setTimeout(r, 2200));
  await page.keyboard.up('ArrowRight');
  await new Promise(r => setTimeout(r, 200));

  await page.keyboard.down('ArrowUp');
  await new Promise(r => setTimeout(r, 500));
  await page.keyboard.up('ArrowUp');
  await new Promise(r => setTimeout(r, 500));

  // Screenshot 4: Victoria's Ghost in the Bedroom
  await page.screenshot({ path: 'test_p6_4_victoria_ghost_bedroom.png' });
  console.log('Saved test_p6_4_victoria_ghost_bedroom.png');

  // Interact with Victoria's Ghost
  console.log('20. Communing with Victoria\'s Ghost (E)...');
  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 800));

  // Screenshot 5: Spectral Victoria Dialogue Box
  await page.screenshot({ path: 'test_p6_5_victoria_ghost_dialogue.png' });
  console.log('Saved test_p6_5_victoria_ghost_dialogue.png');

  // Dismiss Victoria's dialogue
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 500));

  // --- SECTION D: ENTRANCE HALL & ALISTAIR'S GHOST ---
  console.log('21. Returning to Entrance Hall...');
  await page.keyboard.down('ArrowLeft');
  await new Promise(r => setTimeout(r, 2600));
  await page.keyboard.up('ArrowLeft');
  await new Promise(r => setTimeout(r, 400));

  // Exit Bedroom to Corridor
  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 1000));

  // Corridor to Entrance Hall
  await page.keyboard.down('ArrowLeft');
  await new Promise(r => setTimeout(r, 1500));
  await page.keyboard.up('ArrowLeft');
  await new Promise(r => setTimeout(r, 200));

  await page.keyboard.down('ArrowDown');
  await new Promise(r => setTimeout(r, 1400));
  await page.keyboard.up('ArrowDown');
  await new Promise(r => setTimeout(r, 400));

  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 1000));

  // In Entrance Hall: Alistair's Ghost manifests beside the Grandfather Clock!
  console.log('22. Walking to Alistair\'s Ghost beside Grandfather Clock...');
  await page.keyboard.down('ArrowLeft');
  await new Promise(r => setTimeout(r, 1400));
  await page.keyboard.up('ArrowLeft');
  await new Promise(r => setTimeout(r, 200));

  await page.keyboard.down('ArrowUp');
  await new Promise(r => setTimeout(r, 1400));
  await page.keyboard.up('ArrowUp');
  await new Promise(r => setTimeout(r, 500));

  // Screenshot 6: Alistair's Ghost in Entrance Hall
  await page.screenshot({ path: 'test_p6_6_alistair_ghost_entrance_hall.png' });
  console.log('Saved test_p6_6_alistair_ghost_entrance_hall.png');

  // Interact with Alistair's Ghost
  console.log('23. Communing with Alistair\'s Ghost (E)...');
  await page.keyboard.press('KeyE');
  await new Promise(r => setTimeout(r, 800));

  // Screenshot 7: Alistair's Ghost Dialogue
  await page.screenshot({ path: 'test_p6_7_alistair_ghost_dialogue.png' });
  console.log('Saved test_p6_7_alistair_ghost_dialogue.png');

  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 500));

  // --- SECTION E: DETECTIVE NOTEBOOK VERIFICATION ---
  console.log('24. Opening Detective Notebook (N)...');
  await page.keyboard.press('KeyN');
  await new Promise(r => setTimeout(r, 600));

  // Suspects Tab: verify updated profiles (deceased, notes)
  console.log('25. Viewing Suspects Tab [2]...');
  await page.keyboard.press('Digit2');
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'test_p6_8_notebook_deceased_suspects.png' });
  console.log('Saved test_p6_8_notebook_deceased_suspects.png');

  // Clues Tab: verify spectral clues gathered
  console.log('26. Viewing Clues Tab [1]...');
  await page.keyboard.press('Digit1');
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'test_p6_9_notebook_spectral_clues.png' });
  console.log('Saved test_p6_9_notebook_spectral_clues.png');

  await page.keyboard.press('KeyN');
  await new Promise(r => setTimeout(r, 400));

  console.log('Phase 6 Characters, Ghosts and Dialogue verification suite completed successfully!');
  await browser.close();
}

testPhase6().catch(err => {
  console.error('Phase 6 test failed:', err);
  process.exit(1);
});
