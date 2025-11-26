import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { SphereConfig } from '../types';

interface SoundContextType {
  playSfx: (name: 'click' | 'hover' | 'switch' | 'error') => void;
  setEffectMode: (effect: SphereConfig['effect']) => void;
  setPhysicsMode: (mode: SphereConfig['mode']) => void;
}

const SoundContext = createContext<SoundContextType | null>(null);

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) throw new Error('useSound must be used within a SoundProvider');
  return context;
};

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientNodeRef = useRef<AudioScheduledSourceNode | null>(null);
  const effectNodeRef = useRef<AudioScheduledSourceNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  
  // Initialize Audio Context
  useEffect(() => {
    const initAudio = () => {
      if (!audioCtxRef.current) {
        const Ctx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new Ctx();
        
        masterGainRef.current = audioCtxRef.current!.createGain();
        masterGainRef.current.gain.value = 0.3; // Master volume
        masterGainRef.current.connect(audioCtxRef.current!.destination);

        // Start Space Ambient
        startSpaceAmbient();
      } else if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    };

    const handleInteraction = () => {
      initAudio();
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      audioCtxRef.current?.close();
    };
  }, []);

  // --- Generators ---

  const createNoiseBuffer = () => {
    if (!audioCtxRef.current) return null;
    const bufferSize = audioCtxRef.current.sampleRate * 2; // 2 seconds
    const buffer = audioCtxRef.current.createBuffer(1, bufferSize, audioCtxRef.current.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  };

  const startSpaceAmbient = () => {
    if (!audioCtxRef.current || !masterGainRef.current) return;
    
    // Brown Noise-ish for Space Rumble
    const buffer = createNoiseBuffer();
    if (!buffer) return;

    const noise = audioCtxRef.current.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = audioCtxRef.current.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 120; // Deep rumble

    const gain = audioCtxRef.current.createGain();
    gain.gain.value = 0.5;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGainRef.current);
    
    noise.start();
    ambientNodeRef.current = noise;
  };

  const playSfx = (name: 'click' | 'hover' | 'switch' | 'error') => {
    if (!audioCtxRef.current || !masterGainRef.current) return;
    const ctx = audioCtxRef.current;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(masterGainRef.current);

    const now = ctx.currentTime;

    if (name === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (name === 'hover') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (name === 'switch') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.linearRampToValueAtTime(600, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    }
  };

  const setEffectMode = (effect: SphereConfig['effect']) => {
    if (!audioCtxRef.current || !masterGainRef.current) return;
    
    // Stop previous effect
    if (effectNodeRef.current) {
      try { effectNodeRef.current.stop(); } catch (e) {}
      effectNodeRef.current = null;
    }

    if (effect === 'none') return;

    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    if (effect === 'fire') {
      // Crackling Noise
      const buffer = createNoiseBuffer();
      if (!buffer) return;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 800;

      const gain = ctx.createGain();
      gain.gain.value = 0.15;

      // Amplitude Modulation for crackle
      const amOsc = ctx.createOscillator();
      amOsc.type = 'square';
      amOsc.frequency.value = 15; // Fast flicker
      const amGain = ctx.createGain();
      amGain.gain.value = 0.5;
      
      amOsc.connect(amGain);
      amGain.connect(gain.gain);
      amOsc.start();

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(masterGainRef.current);
      noise.start();
      effectNodeRef.current = noise;
    } 
    else if (effect === 'water') {
      // Pinkish noise with LFO filter
      const buffer = createNoiseBuffer();
      if (!buffer) return;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400;

      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.5; // Slow waves
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 200; // Modulate filter freq by +/- 200Hz

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      const gain = ctx.createGain();
      gain.gain.value = 0.2;

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(masterGainRef.current);
      noise.start();
      effectNodeRef.current = noise;
    }
    else if (effect === 'lightning') {
       // Occasional bursts - handled by loop or random trigger?
       // For simplicity, continuous electric hum
       const osc = ctx.createOscillator();
       osc.type = 'sawtooth';
       osc.frequency.value = 50; // Mains hum
       
       const gain = ctx.createGain();
       gain.gain.value = 0.05;

       osc.connect(gain);
       gain.connect(masterGainRef.current);
       osc.start();
       effectNodeRef.current = osc;
    }
    else if (effect === 'toxic') {
        // Bubbling?
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 200;
        
        const lfo = ctx.createOscillator();
        lfo.type = 'sawtooth';
        lfo.frequency.value = 8;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 100;

        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();

        const gain = ctx.createGain();
        gain.gain.value = 0.1;

        osc.connect(gain);
        gain.connect(masterGainRef.current);
        osc.start();
        effectNodeRef.current = osc;
    }
  };

  const setPhysicsMode = (mode: SphereConfig['mode']) => {
      // Just play a sound for now
      playSfx('switch');
  };

  return (
    <SoundContext.Provider value={{ playSfx, setEffectMode, setPhysicsMode }}>
      {children}
    </SoundContext.Provider>
  );
};
