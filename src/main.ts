import Phaser from 'phaser';
import { gameConfig } from './config';
import { AudioManager } from './audio/AudioManager';

window.addEventListener('DOMContentLoaded', () => {
  // Initialize AudioManager visual settings (like CRT filter)
  const audioManager = AudioManager.getInstance();
  audioManager.applyVisualSettings();

  // Create the Phaser game instance
  const game = new Phaser.Game(gameConfig);
  (window as any).__PHASER_GAME__ = game;

  // Global handler to unlock audio context on first user interaction
  const unlockAudio = () => {
    audioManager.initAudioContext();
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  };

  window.addEventListener('click', unlockAudio);
  window.addEventListener('keydown', unlockAudio);
  window.addEventListener('touchstart', unlockAudio);

  // Prevent Tab from cycling browser focus outside canvas
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
    }
  });

  // Handle window resizing cleanly
  window.addEventListener('resize', () => {
    game.scale.refresh();
  });
});
