import { useEffect, useRef, useState, useCallback } from 'react';

// Synthétise en mémoire une boucle piano WAV 16-bit PCM de 24 secondes (zéro fichier audio externe requis)
function buildPianoLoopWavUrl() {
  const sampleRate = 22050;
  const durationSec = 24.0;
  const totalSamples = Math.floor(sampleRate * durationSec);
  const buffer = new Float32Array(totalSamples);

  const N = {
    D2: 73.42, F2: 87.31, G2: 98.0, A2: 110.0, Bb2: 116.54,
    D3: 146.83, F3: 174.61, G3: 196.0, A3: 220.0, Bb3: 233.08, C4: 261.63,
    D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, Bb4: 466.16, C5: 523.25, D5: 587.33,
  };

  const score = [
    { t: 0.0, f: N.D2, d: 3.8, v: 0.45 }, { t: 0.3, f: N.A3, d: 2.6, v: 0.32 }, { t: 0.7, f: N.D4, d: 2.6, v: 0.38 },
    { t: 1.2, f: N.F4, d: 2.4, v: 0.42 }, { t: 1.9, f: N.E4, d: 2.2, v: 0.36 }, { t: 2.7, f: N.D4, d: 2.8, v: 0.40 },
    { t: 4.0, f: N.Bb2, d: 3.8, v: 0.45 }, { t: 4.3, f: N.F3, d: 2.5, v: 0.30 }, { t: 4.7, f: N.D4, d: 2.4, v: 0.34 },
    { t: 5.3, f: N.A4, d: 2.8, v: 0.44 }, { t: 6.2, f: N.G4, d: 2.2, v: 0.36 }, { t: 7.0, f: N.F4, d: 2.6, v: 0.36 },
    { t: 8.2, f: N.G2, d: 3.8, v: 0.45 }, { t: 8.5, f: N.D3, d: 2.4, v: 0.30 }, { t: 8.9, f: N.Bb3, d: 2.4, v: 0.34 },
    { t: 9.5, f: N.G4, d: 2.6, v: 0.41 }, { t: 10.3, f: N.F4, d: 2.2, v: 0.36 }, { t: 11.1, f: N.E4, d: 2.5, v: 0.34 },
    { t: 12.3, f: N.A2, d: 3.8, v: 0.45 }, { t: 12.6, f: N.E4, d: 2.4, v: 0.34 }, { t: 13.2, f: N.A4, d: 2.8, v: 0.44 },
    { t: 14.1, f: N.Bb4, d: 2.2, v: 0.38 }, { t: 14.9, f: N.A4, d: 3.0, v: 0.41 },
    { t: 16.5, f: N.D2, d: 4.0, v: 0.46 }, { t: 16.8, f: N.A3, d: 2.6, v: 0.30 }, { t: 17.2, f: N.D5, d: 3.0, v: 0.42 },
    { t: 18.1, f: N.C5, d: 2.4, v: 0.36 }, { t: 18.9, f: N.A4, d: 2.6, v: 0.38 }, { t: 19.8, f: N.F4, d: 2.8, v: 0.34 },
    { t: 21.0, f: N.Bb2, d: 3.2, v: 0.38 }, { t: 21.4, f: N.E4, d: 2.6, v: 0.32 }, { t: 22.3, f: N.A3, d: 2.2, v: 0.30 },
  ];

  const TWO_PI = Math.PI * 2;
  for (let i = 0; i < score.length; i++) {
    const { t, f, d, v } = score[i];
    const startIdx = Math.floor(t * sampleRate);
    const lenSamples = Math.min(totalSamples - startIdx, Math.floor(d * sampleRate));
    const w1 = (TWO_PI * f) / sampleRate;
    const w2 = (TWO_PI * (f * 2)) / sampleRate;
    const w3 = (TWO_PI * (f * 3)) / sampleRate;

    for (let s = 0; s < lenSamples; s++) {
      const sec = s / sampleRate;
      const env = sec < 0.025 ? sec / 0.025 : Math.exp(-(sec - 0.025) * 1.45);
      const tone =
        Math.sin(w1 * s) * 0.72 +
        Math.sin(w2 * s) * 0.2 * Math.exp(-sec * 2.5) +
        Math.sin(w3 * s) * 0.08 * Math.exp(-sec * 4.0);
      buffer[startIdx + s] += tone * v * env * 0.32;
    }
  }

  const dataBytes = totalSamples * 2;
  const wavBuffer = new ArrayBuffer(44 + dataBytes);
  const view = new DataView(wavBuffer);
  const writeStr = (offset, str) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + dataBytes, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, 'data');
  view.setUint32(40, dataBytes, true);

  let offset = 44;
  for (let i = 0; i < totalSamples; i++) {
    const clamped = Math.max(-1, Math.min(1, buffer[i]));
    view.setInt16(offset, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
    offset += 2;
  }

  return URL.createObjectURL(new Blob([wavBuffer], { type: 'audio/wav' }));
}

/*
  HOOK AUDIO NON-BLOQUANT :
  - Utilise `preload="metadata"` et diffère la synthèse WAV via `requestIdleCallback`
    pour ne jamais ralentir le premier affichage (First Contentful Paint).
  - Gère proprement les politiques d'autoplay des navigateurs (Brave, Chrome, Safari)
    et débloque la lecture au premier geste utilisateur ou au clic sur l'égaliseur.
*/
export function usePianoAudio() {
  const audioRef = useRef(null);
  const blobUrlRef = useRef(null);
  const mutedByUserRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const ensureAudioInstance = useCallback(() => {
    if (audioRef.current) return audioRef.current;

    const url = buildPianoLoopWavUrl();
    blobUrlRef.current = url;

    const audio = document.createElement('audio');
    audio.src = url;
    audio.loop = true;
    audio.preload = 'metadata';
    audio.playsInline = true;
    audio.volume = 0.22;

    const syncState = () => setIsPlaying(!audio.paused && !audio.muted && audio.volume > 0);
    audio.addEventListener('play', syncState);
    audio.addEventListener('playing', syncState);
    audio.addEventListener('pause', syncState);
    audio.addEventListener('volumechange', syncState);

    audioRef.current = audio;
    return audio;
  }, []);

  useEffect(() => {
    let cancelled = false;

    const tryAutoplay = () => {
      if (cancelled || mutedByUserRef.current) return;
      const audio = ensureAudioInstance();
      audio.muted = false;
      audio.volume = 0.22;
      const p = audio.play();
      if (p && typeof p.then === 'function') {
        p.then(() => {
          if (!cancelled) setIsPlaying(true);
        }).catch(() => {
          // Autoplay bloqué par la politique du navigateur : en attente du premier geste utilisateur
        });
      }
    };

    // Diffère l'initialisation audio après le premier rendu critique
    const idleId =
      typeof window.requestIdleCallback === 'function'
        ? window.requestIdleCallback(tryAutoplay, { timeout: 600 })
        : window.setTimeout(tryAutoplay, 150);

    const unlockEvents = ['pointerdown', 'touchstart', 'keydown', 'click'];
    const onUnlock = () => {
      if (mutedByUserRef.current) return;
      const audio = ensureAudioInstance();
      if (audio.paused || audio.muted) {
        tryAutoplay();
      }
      if (!audio.paused && !audio.muted) {
        unlockEvents.forEach((evt) => window.removeEventListener(evt, onUnlock));
      }
    };
    unlockEvents.forEach((evt) => window.addEventListener(evt, onUnlock, { passive: true }));

    return () => {
      cancelled = true;
      if (typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleId);
      } else {
        clearTimeout(idleId);
      }
      unlockEvents.forEach((evt) => window.removeEventListener(evt, onUnlock));
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [ensureAudioInstance]);

  const toggle = useCallback(() => {
    const audio = ensureAudioInstance();
    if (audio.paused || audio.muted) {
      mutedByUserRef.current = false;
      audio.muted = false;
      audio.volume = 0.22;
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      mutedByUserRef.current = true;
      audio.pause();
      setIsPlaying(false);
    }
  }, [ensureAudioInstance]);

  return { isPlaying, toggle };
}
