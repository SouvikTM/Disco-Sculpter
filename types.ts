
export interface SphereConfig {
  particleCount: number;
  particleSize: number;
  moldRadius: number;
  moldStrength: number;
  colorA: string;
  colorB: string;
  mode: 'solid' | 'liquid';
  viscosity: number;
  tension: number;
  effect: 'none' | 'fire' | 'water' | 'toxic' | 'lightning';
}
