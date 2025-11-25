
import React, { useState, useCallback } from 'react';
import SpaceScene from './components/SpaceScene';
import Controls from './components/Controls';
import { SphereConfig } from './types';

const App: React.FC = () => {
  const [resetTrigger, setResetTrigger] = useState<number>(0);
  
  const [config, setConfig] = useState<SphereConfig>({
    particleCount: 12000,
    particleSize: 0.1,
    moldRadius: 1.2,
    moldStrength: 0.5,
    colorA: '#00ffff', // Cyan
    colorB: '#ff00ff', // Magenta
    mode: 'solid',
    viscosity: 0.05,
    tension: 0.02,
    effect: 'none',
  });

  const handleReset = useCallback(() => {
    setResetTrigger(prev => prev + 1);
  }, []);

  return (
    <div className="w-full h-screen relative bg-black overflow-hidden select-none">
      <SpaceScene config={config} resetTrigger={resetTrigger} />
      <Controls 
        config={config} 
        setConfig={setConfig}
        onReset={handleReset}
      />
    </div>
  );
};

export default App;
