/**
 * Pure Web Audio API rain & autumn ambiance synthesizer.
 * Generates soothing pink/brown noise rain drops, filtered breeze, and gentle acoustic atmosphere.
 */

class RainAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private rainGainNode: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private masterGain: GainNode | null = null;
  private noiseBufferSource: AudioBufferSourceNode | null = null;
  private dropletInterval: number | null = null;
  private volume: number = 0.45;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Create pink/brownish noise for smooth rainfall
  private createRainNoiseBuffer(): AudioBuffer {
    if (!this.ctx) throw new Error('No audio context');
    const bufferSize = this.ctx.sampleRate * 4;
    const buffer = this.ctx.createBuffer(2, bufferSize, this.ctx.sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
        b6 = white * 0.115926;
      }
    }
    return buffer;
  }

  // Play random raindrop sound effect on pavement
  private playPuddleDrop() {
    if (!this.ctx || !this.isPlaying || !this.masterGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const dropGain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      // Realistic water droplet pitch glide
      const startFreq = 800 + Math.random() * 900;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(startFreq * 1.5, now + 0.04);
      osc.frequency.exponentialRampToValueAtTime(startFreq * 0.4, now + 0.08);

      const dropVol = (0.01 + Math.random() * 0.03) * this.volume;
      dropGain.gain.setValueAtTime(dropVol, now);
      dropGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

      osc.connect(dropGain);
      dropGain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // Audio node cleanup
    }
  }

  public start(intensityPercent: number = 65) {
    this.initContext();
    if (!this.ctx) return;
    if (this.isPlaying) return;

    this.isPlaying = true;

    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Continuous Rain Ambience Loop
    const noiseBuffer = this.createRainNoiseBuffer();
    this.noiseBufferSource = this.ctx.createBufferSource();
    this.noiseBufferSource.buffer = noiseBuffer;
    this.noiseBufferSource.loop = true;

    // Dual filter for soft rain hiss on asphalt/paving stones
    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    const cutoff = 800 + (intensityPercent / 100) * 2200;
    this.filterNode.frequency.setValueAtTime(cutoff, this.ctx.currentTime);
    this.filterNode.Q.setValueAtTime(0.8, this.ctx.currentTime);

    this.rainGainNode = this.ctx.createGain();
    const rainLevel = (intensityPercent / 100) * 0.6;
    this.rainGainNode.gain.setValueAtTime(rainLevel, this.ctx.currentTime);

    this.noiseBufferSource.connect(this.filterNode);
    this.filterNode.connect(this.rainGainNode);
    this.rainGainNode.connect(this.masterGain);

    this.noiseBufferSource.start();

    // Occasional discrete raindrop accents
    this.dropletInterval = window.setInterval(() => {
      if (Math.random() < (intensityPercent / 100) * 0.8) {
        this.playPuddleDrop();
      }
    }, 180);
  }

  public stop() {
    this.isPlaying = false;
    if (this.dropletInterval) {
      clearInterval(this.dropletInterval);
      this.dropletInterval = null;
    }
    if (this.noiseBufferSource) {
      try {
        this.noiseBufferSource.stop();
        this.noiseBufferSource.disconnect();
      } catch {
        // already stopped
      }
      this.noiseBufferSource = null;
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public updateIntensity(intensityPercent: number) {
    if (!this.ctx || !this.isPlaying) return;
    const cutoff = 600 + (intensityPercent / 100) * 2600;
    if (this.filterNode) {
      this.filterNode.frequency.setTargetAtTime(cutoff, this.ctx.currentTime, 0.1);
    }
    if (this.rainGainNode) {
      const rainLevel = (intensityPercent / 100) * 0.6;
      this.rainGainNode.gain.setTargetAtTime(rainLevel, this.ctx.currentTime, 0.1);
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const rainAudio = new RainAudioEngine();
