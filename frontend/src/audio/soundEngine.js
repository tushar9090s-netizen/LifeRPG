// Web Audio API Procedural Sound Engine for "Arise" (Solo Leveling Edition)
// Implements all 8 ceremonial sound signatures defined in Part 9 of the Master AI Build Prompt.
// Zero external assets, 100% offline, ultra-low latency, and instant response.

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.volume = 0.65;
  }

  // Lazy-initialize audio context on first user gesture
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.muted = muted;
  }

  isMuted() {
    return this.muted;
  }

  // 1. Basic button tap: Single soft, short plucked tone
  playButtonTap() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(480, t);
    osc.frequency.exponentialRampToValueAtTime(240, t + 0.07);

    gain.gain.setValueAtTime(this.volume * 0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.08);
  }

  // 2. Tab switch: Quiet airy whoosh under a soft rising chime
  playTabSwitch() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Airy noise burst
    const bufferSize = this.ctx.sampleRate * 0.18;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, t);
    filter.frequency.exponentialRampToValueAtTime(1600, t + 0.18);
    filter.Q.value = 1.8;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(this.volume * 0.12, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(t);

    // Rising soft sine chime
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(540, t);
    osc.frequency.exponentialRampToValueAtTime(720, t + 0.15);

    oscGain.gain.setValueAtTime(this.volume * 0.15, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.17);
  }

  // 3. Theme toggle: Two-note descending tone, one note per theme's color
  playThemeToggle(isDivine = false) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const f1 = isDivine ? 659.25 : 587.33; // E5 or D5
    const f2 = isDivine ? 523.25 : 440.0;  // C5 or A4

    [
      { freq: f1, start: 0, dur: 0.14, vol: 0.25 },
      { freq: f2, start: 0.11, dur: 0.22, vol: 0.28 }
    ].forEach(note => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.freq, t + note.start);

      gain.gain.setValueAtTime(this.volume * note.vol, t + note.start);
      gain.gain.exponentialRampToValueAtTime(0.001, t + note.start + note.dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + note.start);
      osc.stop(t + note.start + note.dur);
    });
  }

  // 4. Quest complete: Brighter two-note bell chime (pleasant on repeat #100)
  playQuestComplete() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [
      { freq: 523.25, time: 0, dur: 0.25 },    // C5
      { freq: 783.99, time: 0.09, dur: 0.45 }  // G5
    ];

    notes.forEach(n => {
      // fundamental
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(n.freq, t + n.time);

      gain.gain.setValueAtTime(this.volume * 0.32, t + n.time);
      gain.gain.exponentialRampToValueAtTime(0.001, t + n.time + n.dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + n.time);
      osc.stop(t + n.time + n.dur);

      // overtone harmonic
      const overtone = this.ctx.createOscillator();
      const overGain = this.ctx.createGain();
      overtone.type = 'sine';
      overtone.frequency.setValueAtTime(n.freq * 2.75, t + n.time); // bell shimmer

      overGain.gain.setValueAtTime(this.volume * 0.08, t + n.time);
      overGain.gain.exponentialRampToValueAtTime(0.001, t + n.time + n.dur * 0.6);

      overtone.connect(overGain);
      overGain.connect(this.ctx.destination);
      overtone.start(t + n.time);
      overtone.stop(t + n.time + n.dur);
    });
  }

  // 5. Battle Challenge Received: Tense, lower-register chime (signals stakes)
  playChallengeReceived() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const baseFreq = 164.81; // E3 lower tense root
    const minorThird = 196.00; // G3 minor tension

    [baseFreq, minorThird].forEach(freq => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, t);
      filter.frequency.exponentialRampToValueAtTime(120, t + 0.6);

      gain.gain.setValueAtTime(this.volume * 0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.65);

      osc.frequency.setValueAtTime(freq, t);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.7);
    });
  }

  // 6. Battle result (win): Short triumphant flourish, longer/richer than quest chime
  playBattleWin() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const chord = [261.63, 329.63, 392.00, 523.25, 659.25]; // C4, E4, G4, C5, E5

    chord.forEach((freq, idx) => {
      const startTime = t + idx * 0.06;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(this.volume * 0.28, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.65);
    });
  }

  // 7. Level Up: Four-note ascending fanfare — richest, longest sound
  playLevelUp() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [
      { freq: 261.63, time: 0, dur: 0.22 },     // C4
      { freq: 392.00, time: 0.16, dur: 0.24 },    // G4
      { freq: 523.25, time: 0.32, dur: 0.35 },    // C5
      { freq: 659.25, time: 0.52, dur: 0.85 }     // E5
    ];

    notes.forEach(n => {
      const osc = this.ctx.createOscillator();
      const sub = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(n.freq, t + n.time);

      sub.type = 'triangle';
      sub.frequency.setValueAtTime(n.freq * 0.5, t + n.time);

      gain.gain.setValueAtTime(this.volume * 0.38, t + n.time);
      gain.gain.exponentialRampToValueAtTime(0.001, t + n.time + n.dur);

      osc.connect(gain);
      sub.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + n.time);
      sub.start(t + n.time);
      osc.stop(t + n.time + n.dur);
      sub.stop(t + n.time + n.dur);
    });
  }

  // 8. Legendary/Rare drop: Fanfare family + shimmering texture
  playLegendaryDrop() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    // First trigger the fanfare
    this.playLevelUp();

    const t = this.ctx.currentTime;
    // Add shimmering crystal bells
    const shimmerFreqs = [1046.50, 1318.51, 1567.98, 2093.00, 2637.02];
    for (let i = 0; i < 14; i++) {
      const st = t + 0.2 + i * 0.045;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const freq = shimmerFreqs[i % shimmerFreqs.length] * (1 + (Math.random() * 0.1 - 0.05));
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, st);

      gain.gain.setValueAtTime(this.volume * 0.12, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(st);
      osc.stop(st + 0.16);
    }
  }
}

export const soundEngine = new SoundEngine();

