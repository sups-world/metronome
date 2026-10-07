export class AudioEngine {
  private audioCtx: AudioContext | null = null;
  private isPlaying: boolean = false;
  
  private bpm: number = 120;
  private beatsPerBar: number = 4;
  private subdivision: number = 1; // 1 = quarter, 2 = 8ths, 3 = triplets, 4 = 16ths
  
  private currentSubdivisionNote: number = 0; // Tracks total subdivision steps
  private nextNoteTime: number = 0.0; // Time when next note is due
  private timerID: number | null = null;
  
  // Lookahead settings in seconds
  private lookahead: number = 25.0; // How frequently to call scheduler (ms)
  private scheduleAheadTime: number = 0.1; // How far ahead to schedule audio (s)
  
  // Event callback for visual beats
  public onBeatCallback?: (beatIndex: number, isSubdivision: boolean) => void;

  private initAudioContext() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public setBpm(newBpm: number) {
    this.bpm = newBpm;
  }

  public setBeatsPerBar(beats: number) {
    this.beatsPerBar = beats;
  }

  public setSubdivision(sub: number) {
    this.subdivision = sub;
  }

  public start() {
    if (this.isPlaying) return;
    this.initAudioContext();
    
    this.isPlaying = true;
    this.currentSubdivisionNote = 0;
    this.nextNoteTime = this.audioCtx!.currentTime + 0.05;
    
    this.timerID = window.setInterval(() => this.scheduler(), this.lookahead);
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerID !== null) {
      clearInterval(this.timerID);
      this.timerID = null;
    }
  }

  private scheduler() {
    while (this.nextNoteTime < this.audioCtx!.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.currentSubdivisionNote, this.nextNoteTime);
      this.nextNote();
    }
  }

  private nextNote() {
    // Calculate duration of one quarter note beat in seconds
    const secondsPerBeat = 60.0 / this.bpm;
    // Calculate duration of a subdivision step
    const secondsPerSubdivision = secondsPerBeat / this.subdivision;
    
    this.nextNoteTime += secondsPerSubdivision;
    this.currentSubdivisionNote++;
  }

  private scheduleNote(subdivisionIndex: number, time: number) {
    const totalSubdivisionsPerBar = this.beatsPerBar * this.subdivision;
    const barSubdivisionIndex = subdivisionIndex % totalSubdivisionsPerBar;
    
    const isMainBeat = barSubdivisionIndex % this.subdivision === 0;
    const beatIndex = Math.floor(barSubdivisionIndex / this.subdivision);
    const isAccent = isMainBeat && beatIndex === 0;

    // Trigger visual callback close to actual playback time
    if (this.onBeatCallback) {
      const timeUntilBeat = Math.max(0, (time - this.audioCtx!.currentTime) * 1000);
      setTimeout(() => {
        if (this.isPlaying && this.onBeatCallback) {
          this.onBeatCallback(beatIndex, !isMainBeat);
        }
      }, timeUntilBeat);
    }

    // Audio synthesis for click tone
    const osc = this.audioCtx!.createOscillator();
    const gain = this.audioCtx!.createGain();

    osc.connect(gain);
    gain.connect(this.audioCtx!.destination);

    if (isAccent) {
      osc.frequency.value = 1000; // Accent beat 1 (High pitch)
      gain.gain.value = 1.0;
    } else if (isMainBeat) {
      osc.frequency.value = 800;  // Regular beats (Medium pitch)
      gain.gain.value = 0.7;
    } else {
      osc.frequency.value = 600;  // Subdivisions (Low pitch)
      gain.gain.value = 0.3;
    }

    osc.start(time);
    osc.stop(time + 0.04); // Short tick sound
  }
}