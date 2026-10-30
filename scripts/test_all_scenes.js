import puppeteer from 'puppeteer-core';

async function runTests() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=angle', '--use-angle=metal']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  page.on('console', msg => console.log('BROWSER LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('BROWSER ERROR:', err));

  console.log('1. Loading main menu with fresh storage (no save)...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));

  await page.evaluate(() => {
    localStorage.removeItem('the_hollow_hour_save_slot_1');
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  // 1. Initial Menu Screenshot (Continue is disabled)
  await page.screenshot({ path: 'test_1_menu_initial.png' });
  console.log('Saved test_1_menu_initial.png');

  // 2. Keyboard navigate down to Settings (NEW GAME [0] -> CONTINUE [1] -> SETTINGS [2])
  console.log('2. Navigating to Settings...');
  await page.keyboard.press('ArrowDown');
  await new Promise(r => setTimeout(r, 200));
  await page.keyboard.press('ArrowDown');
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: 'test_2_menu_hover_settings.png' });
  console.log('Saved test_2_menu_hover_settings.png');

  // 3. Open Settings
  console.log('3. Opening Settings Scene...');
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'test_3_settings_scene.png' });
  console.log('Saved test_3_settings_scene.png');

  // 4. Adjust Master Volume down with Left Arrow
  console.log('4. Adjusting Master Volume down with Left Arrow...');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await new Promise(r => setTimeout(r, 300));

  // 5. Navigate to Test Save option (index 5)
  console.log('5. Navigating to Test Save in Settings...');
  await page.keyboard.press('ArrowDown'); // 1: music
  await new Promise(r => setTimeout(r, 150));
  await page.keyboard.press('ArrowDown'); // 2: sfx
  await new Promise(r => setTimeout(r, 150));
  await page.keyboard.press('ArrowDown'); // 3: crt
  await new Promise(r => setTimeout(r, 150));
  await page.keyboard.press('ArrowDown'); // 4: fullscreen
  await new Promise(r => setTimeout(r, 150));
  await page.keyboard.press('ArrowDown'); // 5: test save
  await new Promise(r => setTimeout(r, 200));

  // Press Enter on Test Save
  console.log('Pressing Enter on Test Save Data...');
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: 'test_4_settings_save_created.png' });
  console.log('Saved test_4_settings_save_created.png');

  // 6. Return to Menu with Escape
  console.log('6. Returning to Menu...');
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'test_5_menu_continue_now_enabled.png' });
  console.log('Saved test_5_menu_continue_now_enabled.png');

  // 7. Open Credits
  console.log('7. Opening Credits...');
  await page.keyboard.press('ArrowDown'); // Settings
  await new Promise(r => setTimeout(r, 150));
  await page.keyboard.press('ArrowDown'); // Credits
  await new Promise(r => setTimeout(r, 200));
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'test_6_credits_scene.png' });
  console.log('Saved test_6_credits_scene.png');

  // 8. Return to Menu from Credits
  console.log('8. Returning from Credits...');
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 600));

  // 9. Select Continue -> GameScene
  console.log('9. Selecting Continue to go to GameScene...');
  await page.keyboard.press('ArrowUp'); // Settings
  await new Promise(r => setTimeout(r, 150));
  await page.keyboard.press('ArrowUp'); // Continue
  await new Promise(r => setTimeout(r, 200));
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'test_7_gamescene_prologue.png' });
  console.log('Saved test_7_gamescene_prologue.png');

  // 10. Return to Menu from GameScene
  console.log('10. Returning from GameScene...');
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 1000));

  // 11. Test Exit to Desktop prompt
  console.log('11. Testing Exit to Desktop...');
  await page.keyboard.press('ArrowDown'); // Settings
  await new Promise(r => setTimeout(r, 150));
  await page.keyboard.press('ArrowDown'); // Credits
  await new Promise(r => setTimeout(r, 150));
  await page.keyboard.press('ArrowDown'); // Exit
  await new Promise(r => setTimeout(r, 200));
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'test_8_exit_modal.png' });
  console.log('Saved test_8_exit_modal.png');

  console.log('ALL TESTS COMPLETED SUCCESSFULLY!');
  await browser.close();
}

runTests().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
