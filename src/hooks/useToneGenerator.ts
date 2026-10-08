import { useState, useEffect, useRef, useCallback } from 'react';
import { ToneGeneratorEngine } from '../audio/ToneGeneratorEngine';

export function useToneGenerator() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [frequency, setFrequency] = useState(440); // Standard A440 tuning
  const [waveType, setWaveType] = useState<OscillatorType>('sine');

  const engineRef = useRef<ToneGeneratorEngine | null>(null);

  useEffect(() => {
    engineRef.current = new ToneGeneratorEngine();
    return () => {
      engineRef.current?.stop();
    };
  }, []);

  const toggleTone = useCallback(() => {
    if (isPlaying) {
      engineRef.current?.stop();
      setIsPlaying(false);
    } else {
      engineRef.current?.start(frequency, waveType);
      setIsPlaying(true);
    }
  }, [isPlaying, frequency, waveType]);

  const updateFrequency = (newFreq: number) => {
    setFrequency(newFreq);
    engineRef.current?.setFrequency(newFreq);
  };

  const updateWaveType = (type: OscillatorType) => {
    setWaveType(type);
    engineRef.current?.setType(type);
  };

  return {
    isPlaying,
    frequency,
    waveType,
    toggleTone,
    updateFrequency,
    updateWaveType,
  };
}