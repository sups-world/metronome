export class ToneGeneratorEngine {
  private audioCtx: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;

  private initAudioContext() {
    if (!this.audioCtx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public start(frequency: number = 440, type: OscillatorType = 'sine') {
    this.initAudioContext();
    if (this.isPlaying) this.stop();

    this.oscillator = this.audioCtx!.createOscillator();
    this.gainNode = this.audioCtx!.createGain();

    this.oscillator.type = type;
    this.oscillator.frequency.setValueAtTime(frequency, this.audioCtx!.currentTime);

    // Fade in to prevent click/pop audio artifacts
    this.gainNode.gain.setValueAtTime(0, this.audioCtx!.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(0.3, this.audioCtx!.currentTime + 0.05);

    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.audioCtx!.destination);

    this.oscillator.start();
    this.isPlaying = true;
  }

  public setFrequency(frequency: number) {
    if (this.oscillator && this.audioCtx) {
      this.oscillator.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);
    }
  }

  public setType(type: OscillatorType) {
    if (this.oscillator) {
      this.oscillator.type = type;
    }
  }

  public stop() {
    if (!this.isPlaying || !this.oscillator || !this.gainNode || !this.audioCtx) return;

    // Fade out smoothly
    this.gainNode.gain.linearRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.05);
    setTimeout(() => {
      this.oscillator?.stop();
      this.oscillator?.disconnect();
      this.isPlaying = false;
    }, 50);
  }
}