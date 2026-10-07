import { useState, useEffect, useRef, useCallback } from 'react';
import { AudioEngine } from '../audio/AudioEngine';

export function useMetronome() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [beatsPerBar, setBeatsPerBar] = useState(4);
  const [subdivision, setSubdivision] = useState(1);
  const [activeBeat, setActiveBeat] = useState<number | null>(null);

  const engineRef = useRef<AudioEngine | null>(null);

  // Initialize engine once
  useEffect(() => {
    engineRef.current = new AudioEngine();
    
    engineRef.current.onBeatCallback = (beatIndex) => {
      setActiveBeat(beatIndex);
    };

    return () => {
      engineRef.current?.stop();
    };
  }, []);

  // Synchronize state changes with audio engine
  useEffect(() => {
    engineRef.current?.setBpm(bpm);
  }, [bpm]);

  useEffect(() => {
    engineRef.current?.setBeatsPerBar(beatsPerBar);
  }, [beatsPerBar]);

  useEffect(() => {
    engineRef.current?.setSubdivision(subdivision);
  }, [subdivision]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      engineRef.current?.stop();
      setIsPlaying(false);
      setActiveBeat(null);
    } else {
      engineRef.current?.start();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  return {
    isPlaying,
    bpm,
    beatsPerBar,
    subdivision,
    activeBeat,
    setBpm,
    setBeatsPerBar,
    setSubdivision,
    togglePlay,
  };
}