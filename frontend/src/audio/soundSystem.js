// Procedural Web Audio API Sound Engine
// Zero external asset dependencies — native procedural synthesis

class SoundSystem {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  setMuted(isMuted) {
    this.muted = isMuted;
  }

  isMuted() {
    return this.muted;
  }

  // 1. Basic button tap: single soft, short plucked tone
  playButtonTap() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.045);

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.045);
    } catch (e) {}
  }

  // 2. Tab switch: quiet airy whoosh layered under soft rising chime
  playTabSwitch() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, t);
      osc.frequency.exponentialRampToValueAtTime(720, t + 0.12);

      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.14);

      // Noise buffer for airy whoosh
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.1);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, t);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.03, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(t);
      noise.stop(t + 0.1);
    } catch (e) {}
  }

  // 3. Theme toggle: two-note descending tone (signaling light change)
  playThemeToggle(toDivine = false) {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const notes = toDivine ? [523.25, 659.25] : [659.25, 440];

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const st = t + idx * 0.09;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, st);
        gain.gain.setValueAtTime(0.08, st);
        gain.gain.exponentialRampToValueAtTime(0.001, st + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(st);
        osc.stop(st + 0.15);
      });
    } catch (e) {}
  }

  // 4. Quest complete: brighter two-note bell chime (D5 -> A5)
  playQuestComplete() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const notes = [587.33, 880];

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const st = t + idx * 0.08;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, st);
        gain.gain.setValueAtTime(0.12, st);
        gain.gain.exponentialRampToValueAtTime(0.001, st + 0.28);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(st);
        osc.stop(st + 0.28);
      });
    } catch (e) {}
  }

  // 5. Battle win: short triumphant flourish
  playBattleWin() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880];

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const st = t + idx * 0.09;
        const dur = idx === 3 ? 0.45 : 0.2;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, st);
        gain.gain.setValueAtTime(0.14, st);
        gain.gain.exponentialRampToValueAtTime(0.001, st + dur);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(st);
        osc.stop(st + dur);
      });
    } catch (e) {}
  }

  // 6. Level Up: 4-note ascending fanfare with sub-bass depth
  playLevelUp() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const chord = [
        [329.63, 0],
        [440, 0.12],
        [554.37, 0.24],
        [659.25, 0.36],
        [880, 0.48]
      ];

      chord.forEach(([freq, delay]) => {
        const osc = this.ctx.createOscillator();
        const sub = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const st = t + delay;
        const dur = delay >= 0.48 ? 0.75 : 0.28;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, st);
        sub.type = 'sine';
        sub.frequency.setValueAtTime(freq * 0.5, st);

        gain.gain.setValueAtTime(0.18, st);
        gain.gain.exponentialRampToValueAtTime(0.001, st + dur);

        osc.connect(gain);
        sub.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(st);
        sub.start(st);
        osc.stop(st + dur);
        sub.stop(st + dur);
      });
    } catch (e) {}
  }

  // 7. Legendary drop: level-up fanfare with shimmering arpeggio
  playLegendaryDrop() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      this.playLevelUp();

      const t = this.ctx.currentTime + 0.22;
      const sparkles = [1318.51, 1760, 2093, 2637, 3520];

      sparkles.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const st = t + idx * 0.055;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, st);
        gain.gain.setValueAtTime(0.09, st);
        gain.gain.exponentialRampToValueAtTime(0.0001, st + 0.38);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(st);
        osc.stop(st + 0.38);
      });
    } catch (e) {}
  }
}

export const soundFx = new SoundSystem();
export default soundFx;

