/**
 * audio-fx.js - Web Audio Procedural Sound Synthesizer
 * Generates dynamic audio for all elemental visual effects:
 * Lightning thunder, fire crackle, smoke hiss, plasma hum, water splash, and ice freeze.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.masterGain = null;
  }

  initContext() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.65, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.65, this.ctx.currentTime);
    }
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  _checkContext() {
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx && !this.muted;
  }

  // 1. Lightning Thunder Crack
  playThunderCrack(intensity = 1.0) {
    if (!this._checkContext()) return;
    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 1.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800 * intensity, t);
    filter.frequency.exponentialRampToValueAtTime(80, t + 1.2);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.9 * intensity, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 1.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(t);
    noise.stop(t + 1.5);
  }

  // 2. Fire Combustion & Crackle
  playFireCrackle(intensity = 1.0) {
    if (!this._checkContext()) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.5);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450 * intensity, t);
    filter.Q.setValueAtTime(3.0, t);

    gain.gain.setValueAtTime(0.5 * intensity, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.6);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.6);
  }

  // 3. Smoke Gas Hiss & Poof
  playSmokeHiss(intensity = 1.0) {
    if (!this._checkContext()) return;
    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.8;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.4;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200 * intensity, t);
    filter.frequency.linearRampToValueAtTime(400, t + 0.7);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4 * intensity, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.7);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(t);
    noise.stop(t + 0.8);
  }

  // 4. Plasma Electromagnetic Hum & Discharge
  playPlasmaHum(intensity = 1.0) {
    if (!this._checkContext()) return;
    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(320 * intensity, t);
    osc1.frequency.exponentialRampToValueAtTime(180, t + 0.6);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(328 * intensity, t); // Slight detune for pulsing beat
    osc2.frequency.exponentialRampToValueAtTime(182, t + 0.6);

    gain.gain.setValueAtTime(0.45 * intensity, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.7);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.7);
    osc2.stop(t + 0.7);
  }

  // 5. Water Splash & Fluid Ripple
  playWaterSplash(intensity = 1.0) {
    if (!this._checkContext()) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(550 * intensity, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.35);

    gain.gain.setValueAtTime(0.6 * intensity, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.4);
  }

  // 6. Sub-Zero Ice Freeze & Crystalline Shatter
  playIceFreeze(intensity = 1.0) {
    if (!this._checkContext()) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(1800 * intensity, t);
    osc.frequency.exponentialRampToValueAtTime(4200, t + 0.15);
    osc.frequency.exponentialRampToValueAtTime(900, t + 0.4);

    gain.gain.setValueAtTime(0.25 * intensity, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.45);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.45);
  }

  // 7. Warp Spiral Plunge (Station 0 -> Station 1)
  playHyperWarp() {
    if (!this._checkContext()) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(70, t);
    osc.frequency.exponentialRampToValueAtTime(950, t + 1.8);
    osc.frequency.exponentialRampToValueAtTime(120, t + 2.4);

    gain.gain.setValueAtTime(0.05, t);
    gain.gain.linearRampToValueAtTime(0.7, t + 1.8);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 2.5);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 2.5);
  }

  // 8. Hydraulic Sub-Bass Slam
  playSlamImpact() {
    if (!this._checkContext()) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.6);

    gain.gain.setValueAtTime(1.0, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.8);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.85);
  }

  playWhoosh() {
    if (!this._checkContext()) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, t);
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.35);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.45);
  }
}

window.soundEngine = new SoundEngine();
