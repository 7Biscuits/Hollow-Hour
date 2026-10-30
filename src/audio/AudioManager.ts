import { GameSettings } from '../types';

const SETTINGS_KEY = 'the_hollow_hour_settings';

export class AudioManager {
  private static instance: AudioManager;
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  private isDronePlaying = false;
  private droneOscillators: OscillatorNode[] = [];
  private ambientNoiseNode: AudioNode | null = null;
  private droneTimer: number | null = null;

  public settings: GameSettings = {
    masterVolume: 0.8,
    musicVolume: 0.7,
    sfxVolume: 0.8,
    fullscreen: false,
    crtFilter: true,
    displayMode: 'pixel-fit'
  };

  private constructor() {
    this.loadSettings();
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  private loadSettings(): void {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Could not load audio settings', e);
    }
  }

  public saveSettings(): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
      this.applyGains();
      this.applyVisualSettings();
    } catch (e) {
      console.error('Could not save settings', e);
    }
  }

  public initAudioContext(): void {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);

      // Music Gain
      this.musicGain = this.ctx.createGain();
      this.musicGain.connect(this.masterGain);

      // SFX Gain
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.connect(this.masterGain);

      this.applyGains();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public applyGains(): void {
    if (!this.masterGain || !this.musicGain || !this.sfxGain || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.masterGain.gain.setValueAtTime(this.settings.masterVolume, now);
    this.musicGain.gain.setValueAtTime(this.settings.musicVolume * 0.7, now);
    this.sfxGain.gain.setValueAtTime(this.settings.sfxVolume * 0.8, now);
  }

  public applyVisualSettings(): void {
    const crtElement = document.getElementById('crt');
    if (crtElement) {
      crtElement.style.opacity = this.settings.crtFilter ? '0.6' : '0';
    }
  }

  public setMasterVolume(val: number): void {
    this.settings.masterVolume = Math.max(0, Math.min(1, val));
    this.applyGains();
    this.saveSettings();
  }

  public setMusicVolume(val: number): void {
    this.settings.musicVolume = Math.max(0, Math.min(1, val));
    this.applyGains();
    this.saveSettings();
  }

  public setSfxVolume(val: number): void {
    this.settings.sfxVolume = Math.max(0, Math.min(1, val));
    this.applyGains();
    this.saveSettings();
  }

  public toggleCrt(): boolean {
    this.settings.crtFilter = !this.settings.crtFilter;
    this.applyVisualSettings();
    this.saveSettings();
    return this.settings.crtFilter;
  }

  /**
   * Starts the gothic survival horror drone ambience.
   * Consists of low sub-drones, an unsettling diminished interval,
   * soft wind hiss, and sparse eerie music box / piano bells.
   */
  public startHorrorAmbience(): void {
    this.initAudioContext();
    if (!this.ctx || !this.musicGain || this.isDronePlaying) return;

    this.isDronePlaying = true;
    const ctx = this.ctx;
    const dest = this.musicGain;

    // Sub Bass Drone (D1 / 36.7Hz + A1 / 55Hz)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const oscTension = ctx.createOscillator();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(36.7, ctx.currentTime); // D1

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(55.0, ctx.currentTime); // A1

    // Creepy dissonance (G#2 / 103.8Hz, tritone)
    oscTension.type = 'sine';
    oscTension.frequency.setValueAtTime(103.8, ctx.currentTime);

    // Low Pass Filter to keep it dark and oppressive
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(160, ctx.currentTime);
    filter.Q.setValueAtTime(3, ctx.currentTime);

    // LFO for slow breathing atmospheric pulsation
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // 8 second cycle
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(50, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    // Drone Gain
    const droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(0.001, ctx.currentTime);
    droneGain.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 3);

    // Tension Gain (quiet and wavering)
    const tensionGain = ctx.createGain();
    tensionGain.gain.setValueAtTime(0.04, ctx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(droneGain);
    droneGain.connect(dest);

    oscTension.connect(tensionGain);
    tensionGain.connect(dest);

    osc1.start();
    osc2.start();
    oscTension.start();

    this.droneOscillators.push(osc1, osc2, oscTension, lfo);

    // Wind / Rain noise layer
    this.createWindHiss(dest);

    // Periodic sparse horror chime / grandfather clock toll
    this.scheduleEerieChimes();
  }

  private createWindHiss(dest: AudioNode): void {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(320, ctx.currentTime);
    noiseFilter.Q.setValueAtTime(1.8, ctx.currentTime);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 2);

    // LFO to make wind rise and fall
    const windLfo = ctx.createOscillator();
    windLfo.frequency.setValueAtTime(0.08, ctx.currentTime);
    const windLfoGain = ctx.createGain();
    windLfoGain.gain.setValueAtTime(0.02, ctx.currentTime);
    windLfo.connect(windLfoGain);
    windLfoGain.connect(noiseGain.gain);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(dest);

    whiteNoise.start();
    windLfo.start();

    this.ambientNoiseNode = whiteNoise;
  }

  private scheduleEerieChimes(): void {
    const playNextChime = () => {
      if (!this.isDronePlaying || !this.ctx) return;
      const delay = 8000 + Math.random() * 9000;
      this.droneTimer = window.setTimeout(() => {
        this.playHorrorChime();
        playNextChime();
      }, delay);
    };
    playNextChime();
  }

  private playHorrorChime(): void {
    if (!this.ctx || !this.musicGain) return;
    const ctx = this.ctx;
    const notes = [146.83, 155.56, 174.61, 220.0, 233.08]; // D3, Eb3, F3, A3, Bb3
    const freq = notes[Math.floor(Math.random() * notes.length)];

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.09, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 4.5);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start();
    osc.stop(ctx.currentTime + 4.6);
  }

  public stopHorrorAmbience(): void {
    if (!this.isDronePlaying) return;
    this.isDronePlaying = false;
    if (this.droneTimer) {
      clearTimeout(this.droneTimer);
      this.droneTimer = null;
    }
    this.droneOscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });
    this.droneOscillators = [];
  }

  // --- UI Sound Effects ---

  /**
   * Hover sound: eerie wooden/metallic tick with high frequency overtone
   */
  public playHover(): void {
    this.initAudioContext();
    if (!this.ctx || !this.sfxGain) return;
    const ctx = this.ctx;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(380, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  }

  /**
   * Select sound: deep gothic gong / hollow brass resonance
   */
  public playSelect(): void {
    this.initAudioContext();
    if (!this.ctx || !this.sfxGain) return;
    const ctx = this.ctx;

    // Fundamental low strike
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(110, ctx.currentTime); // A2
    osc1.frequency.exponentialRampToValueAtTime(73.4, ctx.currentTime + 0.6); // drop to D2

    gain1.gain.setValueAtTime(0.35, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);

    // Ominous bell harmonic
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(293.66, ctx.currentTime); // D4
    gain2.gain.setValueAtTime(0.18, ctx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

    osc1.connect(gain1);
    gain1.connect(this.sfxGain);

    osc2.connect(gain2);
    gain2.connect(this.sfxGain);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 1.0);
    osc2.stop(ctx.currentTime + 1.3);
  }

  /**
   * Cancel / Back sound: soft low wooden release
   */
  public playBack(): void {
    this.initAudioContext();
    if (!this.ctx || !this.sfxGain) return;
    const ctx = this.ctx;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  }

  /**
   * Disabled option sound: muffled low thud
   */
  public playDisabled(): void {
    this.initAudioContext();
    if (!this.ctx || !this.sfxGain) return;
    const ctx = this.ctx;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(65, ctx.currentTime);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }

  /**
   * Thunder rumble sound effect
   */
  public playThunder(): void {
    this.initAudioContext();
    if (!this.ctx || !this.sfxGain) return;
    const ctx = this.ctx;

    const bufferSize = ctx.sampleRate * 2.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02; // brown noise
      lastOut = data[i];
      data[i] *= 3.5;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(120, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 2.5);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.28, ctx.currentTime + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start();
    noise.stop(ctx.currentTime + 2.6);
  }
}
