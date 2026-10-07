import { useRef, useCallback } from 'react';

interface TapTempoOptions {
  onBpmCalculated: (bpm: number) => void;
  minBpm?: number;
  maxBpm?: number;
  timeoutMs?: number; // Reset taps after this duration of inactivity
  maxTaps?: number;   // Keep only the N most recent taps for average
}

export function useTapTempo({
  onBpmCalculated,
  minBpm = 30,
  maxBpm = 280,
  timeoutMs = 2000,
  maxTaps = 5,
}: TapTempoOptions) {
  const tapsRef = useRef<number[]>([]);

  const registerTap = useCallback(() => {
    const now = performance.now();
    const taps = tapsRef.current;

    // Reset if the user waited too long between taps
    if (taps.length > 0 && now - taps[taps.length - 1] > timeoutMs) {
      tapsRef.current = [now];
      return;
    }

    taps.push(now);

    // Keep only the last N taps for a responsive moving average
    if (taps.length > maxTaps) {
      taps.shift();
    }

    // Need at least 2 taps to calculate intervals
    if (taps.length >= 2) {
      const intervals: number[] = [];
      for (let i = 1; i < taps.length; i++) {
        intervals.push(taps[i] - taps[i - 1]);
      }

      // Average interval in milliseconds
      const avgInterval = intervals.reduce((sum, val) => sum + val, 0) / intervals.length;
      
      // Convert ms to BPM (60,000 ms per minute)
      const calculatedBpm = Math.round(60000 / avgInterval);

      // Clamp within min and max BPM limits
      const clampedBpm = Math.min(maxBpm, Math.max(minBpm, calculatedBpm));
      onBpmCalculated(clampedBpm);
    }
  }, [onBpmCalculated, minBpm, maxBpm, timeoutMs, maxTaps]);

  return { registerTap };
}