import React, { useEffect, useState, useCallback } from 'react';
import { useMetronome } from './hooks/useMetronome';
import { useTapTempo } from './hooks/useTapTempo';
import { useToneGenerator } from './hooks/useToneGenerator';

// Pitch presets for tuning
const NOTE_PRESETS = [
  { name: 'A4', freq: 440 },
  { name: 'C4', freq: 261.63 },
  { name: 'D4', freq: 293.66 },
  { name: 'G4', freq: 392.00 },
  { name: 'E4', freq: 329.63 },
];

export default function App() {
  const {
    isPlaying,
    bpm,
    beatsPerBar,
    subdivision,
    activeBeat,
    setBpm,
    setBeatsPerBar,
    setSubdivision,
    togglePlay,
  } = useMetronome();

  const {
    isPlaying: isTonePlaying,
    frequency,
    toggleTone,
    updateFrequency,
  } = useToneGenerator();

  const [isTapping, setIsTapping] = useState(false);
  const [activeTab, setActiveTab] = useState<'metronome' | 'tuner'>('metronome');

  const handleBpmCalculated = useCallback(
    (newBpm: number) => {
      setBpm(newBpm);
    },
    [setBpm]
  );

  const { registerTap } = useTapTempo({
    onBpmCalculated: handleBpmCalculated,
  });

  const handleTap = () => {
    registerTap();
    setIsTapping(true);
    setTimeout(() => setIsTapping(false), 120);
  };

  const handleBpmChange = (delta: number) => {
    setBpm(Math.min(280, Math.max(30, bpm + delta)));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'KeyT') {
        e.preventDefault();
        handleTap();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, registerTap]);

  return (
    <div style={styles.container}>
      {/* Navigation Tabs */}
      <div style={styles.tabBar}>
        <button
          onClick={() => setActiveTab('metronome')}
          style={{
            ...styles.tabBtn,
            backgroundColor: activeTab === 'metronome' ? 'var(--bg-card)' : 'transparent',
            color: activeTab === 'metronome' ? 'var(--text-primary)' : 'var(--text-muted)',
          }}
        >
          METRONOME
        </button>
        <button
          onClick={() => setActiveTab('tuner')}
          style={{
            ...styles.tabBtn,
            backgroundColor: activeTab === 'tuner' ? 'var(--bg-card)' : 'transparent',
            color: activeTab === 'tuner' ? 'var(--text-primary)' : 'var(--text-muted)',
          }}
        >
          TONE GENERATOR
        </button>
      </div>

      {activeTab === 'metronome' ? (
        <>
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

          {/* Time Signature Picker */}
          <div style={styles.sectionBlock}>
            <span style={styles.sectionLabel}>TIME SIGNATURE</span>
            <div style={styles.buttonGrid}>
              {[2, 3, 4, 5, 6, 7].map((beats) => (
                <button
                  key={beats}
                  onClick={() => setBeatsPerBar(beats)}
                  style={{
                    ...styles.gridBtn,
                    backgroundColor: beatsPerBar === beats ? 'var(--accent-primary)' : 'var(--bg-card)',
                    borderColor: beatsPerBar === beats ? 'var(--accent-primary)' : 'var(--border-subtle)',
                  }}
                >
                  {beats}/4
                </button>
              ))}
            </div>
          </div>

          {/* Subdivision Picker */}
          <div style={styles.sectionBlock}>
            <span style={styles.sectionLabel}>SUBDIVISION</span>
            <div style={styles.buttonGrid}>
              {[
                { label: '♩ 1/1', value: 1 },
                { label: '♫ 1/2', value: 2 },
                { label: '3-let', value: 3 },
                { label: '♬ 1/4', value: 4 },
              ].map((sub) => (
                <button
                  key={sub.value}
                  onClick={() => setSubdivision(sub.value)}
                  style={{
                    ...styles.gridBtn,
                    backgroundColor: subdivision === sub.value ? 'var(--accent-primary)' : 'var(--bg-card)',
                    borderColor: subdivision === sub.value ? 'var(--accent-primary)' : 'var(--border-subtle)',
                  }}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stepper Controls */}
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

          {/* Action Row */}
          <div style={styles.actionRow}>
            <button
              onClick={handleTap}
              style={{
                ...styles.tapButton,
                backgroundColor: isTapping ? 'var(--accent-primary)' : 'var(--bg-card)',
                borderColor: isTapping ? 'var(--accent-primary)' : 'var(--border-subtle)',
              }}
            >
              TAP <span style={styles.shortcutHint}>(T)</span>
            </button>

            <button
              onClick={togglePlay}
              style={{
                ...styles.playButton,
                backgroundColor: isPlaying ? 'var(--accent-downbeat)' : 'var(--accent-primary)',
                boxShadow: isPlaying ? '0 0 25px rgba(244, 63, 94, 0.4)' : 'var(--glow-primary)',
              }}
            >
              {isPlaying ? 'STOP' : 'START'} <span style={styles.shortcutHint}>(Space)</span>
            </button>
          </div>
        </>
      ) : (
        /* TONE GENERATOR TAB */
        <div style={styles.tonePanel}>
          <div style={styles.bpmDisplay}>
            <div style={styles.bpmNumber}>{Math.round(frequency)}</div>
            <div style={styles.bpmLabel}>Hz</div>
          </div>

          {/* Pitch Preset Buttons */}
          <div style={styles.sectionBlock}>
            <span style={styles.sectionLabel}>TUNING PRESETS</span>
            <div style={styles.buttonGrid}>
              {NOTE_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => updateFrequency(preset.freq)}
                  style={{
                    ...styles.gridBtn,
                    backgroundColor: frequency === preset.freq ? 'var(--accent-primary)' : 'var(--bg-card)',
                    borderColor: frequency === preset.freq ? 'var(--accent-primary)' : 'var(--border-subtle)',
                  }}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Fine-tune Frequency Slider */}
          <div style={styles.sliderContainer}>
            <input
              type="range"
              min="100"
              max="1000"
              value={frequency}
              onChange={(e) => updateFrequency(Number(e.target.value))}
              style={styles.slider}
            />
          </div>

          {/* Toggle Pitch Sound */}
          <button
            onClick={toggleTone}
            style={{
              ...styles.playButton,
              marginTop: '16px',
              backgroundColor: isTonePlaying ? 'var(--accent-downbeat)' : 'var(--accent-primary)',
              boxShadow: isTonePlaying ? '0 0 25px rgba(244, 63, 94, 0.4)' : 'var(--glow-primary)',
            }}
          >
            {isTonePlaying ? 'MUTE TONE' : 'PLAY TONE'}
          </button>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '24px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
  },
  tabBar: {
    display: 'flex',
    backgroundColor: 'var(--bg-primary)',
    padding: '4px',
    borderRadius: '12px',
    width: '100%',
    border: '1px solid var(--border-subtle)',
  },
  tabBtn: {
    flex: 1,
    padding: '8px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '1px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  visualizerContainer: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    justifyContent: 'center',
    height: '32px',
  },
  beatDot: {
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    transition: 'all 0.08s ease-out',
    border: '1px solid var(--border-subtle)',
  },
  bpmDisplay: {
    textAlign: 'center',
  },
  bpmNumber: {
    fontSize: '72px',
    fontWeight: '800',
    lineHeight: '1',
    letterSpacing: '-2px',
    color: 'var(--text-primary)',
    fontVariantNumeric: 'tabular-nums',
  },
  bpmLabel: {
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '3px',
    color: 'var(--text-muted)',
    marginTop: '4px',
  },
  sectionBlock: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sectionLabel: {
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '1.5px',
    color: 'var(--text-muted)',
  },
  buttonGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(50px, 1fr))',
    gap: '6px',
    width: '100%',
  },
  gridBtn: {
    padding: '8px 4px',
    borderRadius: '8px',
    border: '1px solid var(--border-subtle)',
    color: 'var(--text-primary)',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.12s ease',
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
    padding: '8px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  sliderContainer: {
    width: '100%',
  },
  slider: {
    width: '100%',
    accentColor: 'var(--accent-primary)',
    cursor: 'pointer',
  },
  actionRow: {
    display: 'flex',
    gap: '10px',
    width: '100%',
  },
  tapButton: {
    flex: '1',
    padding: '16px',
    borderRadius: '14px',
    border: '1px solid var(--border-subtle)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  playButton: {
    flex: '2',
    padding: '16px',
    borderRadius: '14px',
    border: 'none',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '800',
    letterSpacing: '1px',
    cursor: 'pointer',
  },
  shortcutHint: {
    fontSize: '10px',
    fontWeight: '500',
    opacity: 0.6,
  },
  tonePanel: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    alignItems: 'center',
  },
};