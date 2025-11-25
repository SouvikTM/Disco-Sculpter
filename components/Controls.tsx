
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
            onClick={onReset}
            className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 text-gray-300 hover:text-white shadow-lg hover:shadow-cyan-500/20"
          >
            <RotateCcw size={18} className="group-hover:-rotate-180 transition-transform duration-500" />
            <span className="font-medium tracking-wide text-sm">RESET SPHERE</span>
          </button>
      </div>

      {/* Configuration Panel */}
      <div className="pointer-events-auto bg-black/60 backdrop-blur-xl border border-white/10 p-5 rounded-2xl w-80 absolute right-6 top-6 shadow-2xl transition-opacity duration-300 max-h-[85vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-2 mb-4 text-white/90 border-b border-white/10 pb-3">
          <Settings2 size={18} />
          <span className="font-semibold">Configuration</span>
        </div>
        
        <div className="space-y-6">
          
          {/* Mode Switcher */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block font-medium">Physics Mode</label>
            <div className="bg-white/5 p-1 rounded-lg flex gap-1">
              <button 
                onClick={() => toggleMode('solid')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${config.mode === 'solid' ? 'bg-cyan-600/80 text-white shadow-lg' : 'hover:bg-white/5 text-gray-400'}`}
              >
                <Box size={14} /> Solid
              </button>
               <button 
                onClick={() => toggleMode('liquid')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${config.mode === 'liquid' ? 'bg-purple-600/80 text-white shadow-lg' : 'hover:bg-white/5 text-gray-400'}`}
              >
                <Droplets size={14} /> Liquid
              </button>
            </div>
          </div>

          {/* Elemental Effects */}
           <div>
            <label className="text-xs text-gray-400 mb-2 block font-medium">Elemental Overlay</label>
            <div className="grid grid-cols-5 gap-1 bg-white/5 p-1 rounded-lg">
               <button 
                onClick={() => setEffect('none')}
                title="None"
                className={`flex items-center justify-center py-2 rounded-md transition-all ${config.effect === 'none' ? 'bg-gray-600 text-white' : 'hover:bg-white/10 text-gray-400'}`}
              >
                <Box size={16} />
              </button>
              <button 
                onClick={() => setEffect('fire')}
                 title="Fire"
                className={`flex items-center justify-center py-2 rounded-md transition-all ${config.effect === 'fire' ? 'bg-orange-600 text-white' : 'hover:bg-white/10 text-gray-400'}`}
              >
                <Flame size={16} />
              </button>
              <button 
                onClick={() => setEffect('water')}
                 title="Water"
                className={`flex items-center justify-center py-2 rounded-md transition-all ${config.effect === 'water' ? 'bg-blue-600 text-white' : 'hover:bg-white/10 text-gray-400'}`}
              >
                <Waves size={16} />
              </button>
              <button 
                onClick={() => setEffect('toxic')}
                 title="Toxic"
                className={`flex items-center justify-center py-2 rounded-md transition-all ${config.effect === 'toxic' ? 'bg-lime-600 text-white' : 'hover:bg-white/10 text-gray-400'}`}
              >
                <Skull size={16} />
              </button>
               <button 
                onClick={() => setEffect('lightning')}
                 title="Lightning"
                className={`flex items-center justify-center py-2 rounded-md transition-all ${config.effect === 'lightning' ? 'bg-indigo-600 text-white' : 'hover:bg-white/10 text-gray-400'}`}
              >
                <Zap size={16} />
              </button>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-400 font-medium">
                <span>Particle Count</span>
                <span>{config.particleCount}</span>
              </div>
              <input 
                type="range" min="1000" max="20000" step="1000"
                value={config.particleCount}
                onChange={(e) => handleSliderChange('particleCount', parseInt(e.target.value))}
                className="w-full accent-cyan-500 h-1 bg-gray-700/50 rounded-lg appearance-none cursor-pointer hover:bg-gray-600 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-400 font-medium">
                <span>Particle Size</span>
                <span>{config.particleSize.toFixed(2)}</span>
              </div>
              <input 
                type="range" min="0.02" max="0.3" step="0.01"
                value={config.particleSize}
                onChange={(e) => handleSliderChange('particleSize', parseFloat(e.target.value))}
                className="w-full accent-cyan-500 h-1 bg-gray-700/50 rounded-lg appearance-none cursor-pointer hover:bg-gray-600 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-400 font-medium">
                <span>Mold Radius</span>
                <span>{config.moldRadius.toFixed(1)}</span>
              </div>
              <input 
                type="range" min="0.5" max="4.0" step="0.1"
                value={config.moldRadius}
                onChange={(e) => handleSliderChange('moldRadius', parseFloat(e.target.value))}
                className="w-full accent-purple-500 h-1 bg-gray-700/50 rounded-lg appearance-none cursor-pointer hover:bg-gray-600 transition-colors"
              />
            </div>

            <div className="space-y-2">
               <div className="flex justify-between text-xs text-gray-400 font-medium">
                <span>Mold Force</span>
                <span>{config.moldStrength.toFixed(2)}</span>
              </div>
              <input 
                type="range" min="0.01" max="1.0" step="0.01"
                value={config.moldStrength}
                onChange={(e) => handleSliderChange('moldStrength', parseFloat(e.target.value))}
                className="w-full accent-green-500 h-1 bg-gray-700/50 rounded-lg appearance-none cursor-pointer hover:bg-gray-600 transition-colors"
              />
            </div>
          </div>

          {/* Liquid Specific Controls */}
          {config.mode === 'liquid' && (
            <div className="space-y-4 pt-4 border-t border-white/10 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-400 font-medium">
                  <span>Viscosity (Damping)</span>
                  <span>{config.viscosity.toFixed(2)}</span>
                </div>
                <input 
                  type="range" min="0.0" max="0.2" step="0.001"
                  value={config.viscosity}
                  onChange={(e) => handleSliderChange('viscosity', parseFloat(e.target.value))}
                  className="w-full accent-blue-500 h-1 bg-gray-700/50 rounded-lg appearance-none cursor-pointer hover:bg-gray-600 transition-colors"
                />
              </div>

               <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-400 font-medium">
                  <span>Surface Tension</span>
                  <span>{config.tension.toFixed(3)}</span>
                </div>
                <input 
                  type="range" min="0.0" max="0.1" step="0.001"
                  value={config.tension}
                  onChange={(e) => handleSliderChange('tension', parseFloat(e.target.value))}
                  className="w-full accent-blue-500 h-1 bg-gray-700/50 rounded-lg appearance-none cursor-pointer hover:bg-gray-600 transition-colors"
                />
              </div>
            </div>
          )}
          
          {/* Colors (Only visible if no effect is selected) */}
          {config.effect === 'none' && (
             <div className="pt-4 grid grid-cols-2 gap-3 border-t border-white/10 mt-2 animate-in fade-in">
              <div>
                <label className="text-xs text-gray-400 mb-2 block font-medium">Gradient Start</label>
                <div className="relative h-8 w-full rounded-md overflow-hidden ring-1 ring-white/20">
                   <input 
                    type="color" 
                    value={config.colorA}
                    onChange={(e) => handleColorChange('colorA', e.target.value)}
                    className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer p-0 m-0 border-0"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-2 block font-medium">Gradient End</label>
                 <div className="relative h-8 w-full rounded-md overflow-hidden ring-1 ring-white/20">
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
