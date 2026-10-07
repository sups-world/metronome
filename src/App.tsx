import React from 'react';
import { useMetronome } from './hooks/useMetronome';

export default function App() {
  const {
    isPlaying,
    bpm,
    beatsPerBar,
    activeBeat,
    setBpm,
    togglePlay,
  } = useMetronome();

  const handleBpmChange = (delta: number) => {
    setBpm(Math.min(280, Math.max(30, bpm + delta)));
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <span style={styles.logoBadge}>PRO</span>
        <h1 style={styles.title}>METRONOME</h1>
      </header>

      {/* Visualizer Dots */}
      <div style={styles.visualizerContainer}>
        {Array.from({ length: beatsPerBar }).map((_, i) => {
          const isActive = activeBeat === i;
          const isDownbeat = i === 0;

          return (
            <div
              key={i}
              style={{
                ...styles.beatDot,
                backgroundColor: isActive
                  ? isDownbeat
                    ? 'var(--accent-downbeat)'
                    : 'var(--accent-active)'
                  : 'var(--bg-card-hover)',
                boxShadow: isActive
                  ? isDownbeat
                    ? '0 0 20px rgba(244, 63, 94, 0.8)'
                    : 'var(--glow-active)'
                  : 'none',
                transform: isActive ? 'scale(1.15)' : 'scale(1)',
              }}
            />
          );
        })}
      </div>

      {/* Large BPM Display */}
      <div style={styles.bpmDisplay}>
        <div style={styles.bpmNumber}>{bpm}</div>
        <div style={styles.bpmLabel}>BPM</div>
      </div>

      {/* Incremental Steppers */}
      <div style={styles.stepperRow}>
        <button style={styles.stepperBtn} onClick={() => handleBpmChange(-5)}>-5</button>
        <button style={styles.stepperBtn} onClick={() => handleBpmChange(-1)}>-1</button>
        <button style={styles.stepperBtn} onClick={() => handleBpmChange(1)}>+1</button>
        <button style={styles.stepperBtn} onClick={() => handleBpmChange(5)}>+5</button>
      </div>

      {/* Dark Slider */}
      <div style={styles.sliderContainer}>
        <input
          type="range"
          min="30"
          max="280"
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
          style={styles.slider}
        />
      </div>

      {/* Big Play Button */}
      <button
        onClick={togglePlay}
        style={{
          ...styles.playButton,
          backgroundColor: isPlaying ? 'var(--accent-downbeat)' : 'var(--accent-primary)',
          boxShadow: isPlaying ? '0 0 25px rgba(244, 63, 94, 0.4)' : 'var(--glow-primary)',
        }}
      >
        {isPlaying ? 'STOP' : 'START'}
      </button>
    </div>
  );
}

// Inline Styles Object for sleek dark components
const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '24px',
    padding: '32px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logoBadge: {
    backgroundColor: 'var(--accent-primary)',
    color: '#fff',
    fontSize: '10px',
    fontWeight: '800',
    padding: '2px 6px',
    borderRadius: '4px',
    letterSpacing: '1px',
  },
  title: {
    fontSize: '14px',
    fontWeight: '700',
    letterSpacing: '2px',
    color: 'var(--text-secondary)',
  },
  visualizerContainer: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    justifyContent: 'center',
    height: '40px',
  },
  beatDot: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    transition: 'all 0.08s ease-out',
    border: '1px solid var(--border-subtle)',
  },
  bpmDisplay: {
    textAlign: 'center',
    margin: '8px 0',
  },
  bpmNumber: {
    fontSize: '84px',
    fontWeight: '800',
    lineHeight: '1',
    letterSpacing: '-2px',
    color: 'var(--text-primary)',
    fontVariantNumeric: 'tabular-nums',
  },
  bpmLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '3px',
    color: 'var(--text-muted)',
    marginTop: '4px',
  },
  stepperRow: {
    display: 'flex',
    gap: '8px',
    width: '100%',
  },
  stepperBtn: {
    flex: 1,
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-subtle)',
    color: 'var(--text-primary)',
    padding: '10px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
  },
  sliderContainer: {
    width: '100%',
    padding: '0 8px',
  },
  slider: {
    width: '100%',
    accentColor: 'var(--accent-primary)',
    cursor: 'pointer',
  },
  playButton: {
    width: '100%',
    padding: '18px',
    borderRadius: '16px',
    border: 'none',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '800',
    letterSpacing: '2px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};