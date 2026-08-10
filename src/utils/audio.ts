type Listener = (enabled: boolean, volume: number) => void;

class SoundEffects {
  private ctx: AudioContext | null = null;
  public enabled: boolean = false;
  public ambientVolume: number = 0.025; // Subtle, non-intrusive ambient drone volume
  private listeners: Set<Listener> = new Set();

  private ambientMasterGain: GainNode | null = null;
  private ambientOscillators: OscillatorNode[] = [];
  private lfoOsc: OscillatorNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private isAmbientRunning: boolean = false;

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.enabled, this.ambientVolume));
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.ambientVolume = Math.max(0.005, Math.min(0.08, vol));
    if (this.ambientMasterGain && this.ctx) {
      this.ambientMasterGain.gain.setTargetAtTime(
        this.ambientVolume,
        this.ctx.currentTime,
        0.1
      );
    }
    this.notify();
  }

  public toggleSound(forceState?: boolean): boolean {
    const newState = forceState !== undefined ? forceState : !this.enabled;
    this.enabled = newState;

    if (this.enabled) {
      this.startAmbient();
      this.playSuccess();
    } else {
      this.stopAmbient();
    }

    this.notify();
    return this.enabled;
  }

  public startAmbient() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      // Avoid creating multiple ambient instances
      if (this.isAmbientRunning) return;

      const now = this.ctx.currentTime;

      // Master Ambient Gain Node
      this.ambientMasterGain = this.ctx.createGain();
      this.ambientMasterGain.gain.setValueAtTime(0.0001, now);
      this.ambientMasterGain.gain.exponentialRampToValueAtTime(this.ambientVolume, now + 1.2);

      // Lowpass Filter Node to cut off high frequencies for warm sci-fi drone
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(420, now);
      this.filterNode.Q.setValueAtTime(1.5, now);

      // Harmonic Osc 1: Deep Fundamental Drone (110Hz - A2)
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(110, now);

      // Harmonic Osc 2: Cosmic Fifth Pad (164.81Hz - E3)
      const osc2 = this.ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(164.81, now);

      // Harmonic Osc 3: Sub Warmth (55Hz - A1)
      const osc3 = this.ctx.createOscillator();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(55, now);

      // LFO for subtle breathing filter movement
      this.lfoOsc = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      this.lfoOsc.frequency.setValueAtTime(0.12, now); // Slow 8-second breathing cycle
      lfoGain.gain.setValueAtTime(80, now); // Filter sweep depth
      this.lfoOsc.connect(lfoGain);
      lfoGain.connect(this.filterNode.frequency);

      // Connect nodes
      osc1.connect(this.filterNode);
      osc2.connect(this.filterNode);
      osc3.connect(this.filterNode);

      this.filterNode.connect(this.ambientMasterGain);
      this.ambientMasterGain.connect(this.ctx.destination);

      // Start oscillators
      osc1.start(now);
      osc2.start(now);
      osc3.start(now);
      this.lfoOsc.start(now);

      this.ambientOscillators = [osc1, osc2, osc3];
      this.isAmbientRunning = true;
    } catch {
      // Ignore web audio browser limits
    }
  }

  public stopAmbient() {
    if (!this.isAmbientRunning || !this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      if (this.ambientMasterGain) {
        this.ambientMasterGain.gain.setTargetAtTime(0.0001, now, 0.2);
      }

      setTimeout(() => {
        try {
          this.ambientOscillators.forEach((osc) => {
            try { osc.stop(); osc.disconnect(); } catch {}
          });
          if (this.lfoOsc) {
            try { this.lfoOsc.stop(); this.lfoOsc.disconnect(); } catch {}
          }
          if (this.ambientMasterGain) {
            this.ambientMasterGain.disconnect();
          }
          this.ambientOscillators = [];
          this.lfoOsc = null;
          this.ambientMasterGain = null;
          this.filterNode = null;
          this.isAmbientRunning = false;
        } catch {}
      }, 300);
    } catch {
      this.isAmbientRunning = false;
    }
  }

  public playHover() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Ignore audio context errors
    }
  }

  public playClick() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // Ignore
    }
  }

  public playSuccess() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0.03, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.15);
      });
    } catch {
      // Ignore
    }
  }
}

export const soundFx = new SoundEffects();
