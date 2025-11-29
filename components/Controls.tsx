import React from 'react';
import { SphereConfig } from '../types';
import { Settings2, RotateCcw, MousePointer2, MousePointerClick, Droplets, Box, Flame, Zap, Skull, Waves } from 'lucide-react';

interface ControlsProps {
  config: SphereConfig;
  setConfig: React.Dispatch<React.SetStateAction<SphereConfig>>;
  onReset: () => void;
}

const Controls: React.FC<ControlsProps> = ({ config, setConfig, onReset }) => {

  const handleColorChange = (key: 'colorA' | 'colorB', value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSliderChange = (key: keyof SphereConfig, value: number) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const toggleMode = (mode: 'solid' | 'liquid') => {
    setConfig(prev => ({ ...prev, mode }));
  };

  const setEffect = (effect: SphereConfig['effect']) => {
    setConfig(prev => ({ ...prev, effect }));
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col justify-between p-6 z-10">

      {/* Header */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            DISCO<span className="text-cyan-400">SCULPTER</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1 max-w-xs leading-relaxed">
            <span className="flex items-center gap-2 mb-1">
              <MousePointerClick size={14} className="text-cyan-400" /> Left Click + Drag to Mold
            </span>
            <span className="flex items-center gap-2">
              <MousePointer2 size={14} className="text-purple-400" /> Right Click to Orbit
            </span>
          </p>
        </div>
      </div>

      {/* Reset Button (Bottom Center) */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <button
          onClick={() => { onReset(); }}
          className="group flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-black/40 backdrop-blur-md border border-cyan-500/30 hover:bg-cyan-900/20 transition-all duration-300 text-cyan-100 hover:text-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.1)] hover:shadow-[0_0_25px_rgba(0,255,255,0.3)]"
        >
          <RotateCcw size={18} className="group-hover:-rotate-180 transition-transform duration-500" />
          <span className="font-mono tracking-widest text-xs">RESET SYSTEM</span>
        </button>
      </div>

      {/* Configuration Panel */}
      <div className="pointer-events-auto bg-black/80 backdrop-blur-xl border border-white/10 p-5 rounded-sm w-80 absolute right-6 top-6 shadow-2xl transition-opacity duration-300 max-h-[85vh] overflow-y-auto custom-scrollbar ring-1 ring-white/5">
        <div className="flex items-center gap-2 mb-6 text-cyan-400 border-b border-cyan-900/50 pb-3">
          <Settings2 size={18} />
          <span className="font-mono font-bold tracking-wider text-sm">SYSTEM CONFIG</span>
        </div>

        <div className="space-y-8">

          {/* Mode Switcher */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 block font-bold">Physics Mode</label>
            <div className="bg-black/40 p-1 rounded-sm border border-white/10 flex gap-1">
              <button
                onClick={() => toggleMode('solid')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all ${config.mode === 'solid' ? 'bg-cyan-900/60 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(0,255,255,0.1)]' : 'hover:bg-white/5 text-gray-500'}`}
              >
                <Box size={12} /> Solid
              </button>
              <button
                onClick={() => toggleMode('liquid')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all ${config.mode === 'liquid' ? 'bg-purple-900/60 text-purple-400 border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.1)]' : 'hover:bg-white/5 text-gray-500'}`}
              >
                <Droplets size={12} /> Liquid
              </button>
            </div>
          </div>

          {/* Elemental Effects */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 block font-bold">Elemental Overlay</label>
            <div className="grid grid-cols-5 gap-1 bg-black/40 p-1 rounded-sm border border-white/10">
              <button
                onClick={() => setEffect('none')}
                title="None"
                className={`flex items-center justify-center py-2 rounded-sm transition-all ${config.effect === 'none' ? 'bg-gray-800 text-white border border-gray-600' : 'hover:bg-white/5 text-gray-600'}`}
              >
                <Box size={14} />
              </button>
              <button
                onClick={() => setEffect('fire')}
                title="Fire"
                className={`flex items-center justify-center py-2 rounded-sm transition-all ${config.effect === 'fire' ? 'bg-orange-900/60 text-orange-400 border border-orange-500/50 shadow-[0_0_10px_rgba(249,115,22,0.2)]' : 'hover:bg-white/5 text-gray-600'}`}
              >
                <Flame size={14} />
              </button>
              <button
                onClick={() => setEffect('water')}
                title="Water"
                className={`flex items-center justify-center py-2 rounded-sm transition-all ${config.effect === 'water' ? 'bg-blue-900/60 text-blue-400 border border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]' : 'hover:bg-white/5 text-gray-600'}`}
              >
                <Waves size={14} />
              </button>
              <button
                onClick={() => setEffect('toxic')}
                title="Toxic"
                className={`flex items-center justify-center py-2 rounded-sm transition-all ${config.effect === 'toxic' ? 'bg-lime-900/60 text-lime-400 border border-lime-500/50 shadow-[0_0_10px_rgba(132,204,22,0.2)]' : 'hover:bg-white/5 text-gray-600'}`}
              >
                <Skull size={14} />
              </button>
              <button
                onClick={() => setEffect('lightning')}
                title="Lightning"
                className={`flex items-center justify-center py-2 rounded-sm transition-all ${config.effect === 'lightning' ? 'bg-indigo-900/60 text-indigo-400 border border-indigo-500/50 shadow-[0_0_10px_rgba(99,102,241,0.2)]' : 'hover:bg-white/5 text-gray-600'}`}
              >
                <Zap size={14} />
              </button>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                <span>Particle Count</span>
                <span className="text-cyan-500 font-mono">{config.particleCount}</span>
              </div>
              <input
                type="range" min="1000" max="20000" step="1000"
                value={config.particleCount}
                onChange={(e) => handleSliderChange('particleCount', parseInt(e.target.value))}
                className="w-full accent-cyan-500 h-1 bg-gray-800 rounded-none appearance-none cursor-pointer hover:bg-gray-700 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                <span>Particle Size</span>
                <span className="text-cyan-500 font-mono">{config.particleSize.toFixed(2)}</span>
              </div>
              <input
                type="range" min="0.02" max="0.3" step="0.01"
                value={config.particleSize}
                onChange={(e) => handleSliderChange('particleSize', parseFloat(e.target.value))}
                className="w-full accent-cyan-500 h-1 bg-gray-800 rounded-none appearance-none cursor-pointer hover:bg-gray-700 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                <span>Mold Radius</span>
                <span className="text-purple-500 font-mono">{config.moldRadius.toFixed(1)}</span>
              </div>
              <input
                type="range" min="0.1" max="6.0" step="0.1"
                value={config.moldRadius}
                onChange={(e) => handleSliderChange('moldRadius', parseFloat(e.target.value))}
                className="w-full accent-purple-500 h-1 bg-gray-800 rounded-none appearance-none cursor-pointer hover:bg-gray-700 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                <span>Mold Force</span>
                <span className="text-green-500 font-mono">{config.moldStrength.toFixed(2)}</span>
              </div>
              <input
                type="range" min="0.01" max="1.0" step="0.01"
                value={config.moldStrength}
                onChange={(e) => handleSliderChange('moldStrength', parseFloat(e.target.value))}
                className="w-full accent-green-500 h-1 bg-gray-800 rounded-none appearance-none cursor-pointer hover:bg-gray-700 transition-colors"
              />
            </div>
          </div>

          {/* Liquid Specific Controls */}
          {config.mode === 'liquid' && (
            <div className="space-y-6 pt-4 border-t border-white/10 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                  <span>Viscosity</span>
                  <span className="text-blue-500 font-mono">{config.viscosity.toFixed(2)}</span>
                </div>
                <input
                  type="range" min="0.0" max="0.2" step="0.001"
                  value={config.viscosity}
                  onChange={(e) => handleSliderChange('viscosity', parseFloat(e.target.value))}
                  className="w-full accent-blue-500 h-1 bg-gray-800 rounded-none appearance-none cursor-pointer hover:bg-gray-700 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                  <span>Surface Tension</span>
                  <span className="text-blue-500 font-mono">{config.tension.toFixed(3)}</span>
                </div>
                <input
                  type="range" min="0.0" max="0.1" step="0.001"
                  value={config.tension}
                  onChange={(e) => handleSliderChange('tension', parseFloat(e.target.value))}
                  className="w-full accent-blue-500 h-1 bg-gray-800 rounded-none appearance-none cursor-pointer hover:bg-gray-700 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Colors (Only visible if no effect is selected) */}
          {config.effect === 'none' && (
            <div className="pt-4 grid grid-cols-2 gap-3 border-t border-white/10 mt-2 animate-in fade-in">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 block font-bold">Gradient Start</label>
                <div className="relative h-8 w-full rounded-sm overflow-hidden ring-1 ring-white/10">
                  <input
                    type="color"
                    value={config.colorA}
                    onChange={(e) => handleColorChange('colorA', e.target.value)}
                    className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer p-0 m-0 border-0"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 block font-bold">Gradient End</label>
                <div className="relative h-8 w-full rounded-sm overflow-hidden ring-1 ring-white/10">
                  <input
                    type="color"
                    value={config.colorB}
                    onChange={(e) => handleColorChange('colorB', e.target.value)}
                    className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer p-0 m-0 border-0"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Controls;
