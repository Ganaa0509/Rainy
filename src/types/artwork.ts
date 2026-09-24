export type AspectRatio = '3:4' | '16:9' | '9:16' | '1:1';

export type MoodPreset = 'teal-orange-signature' | 'misty-dawn' | 'twilight-rainfall' | 'storm-downpour' | 'golden-break';

export interface SceneSettings {
  rainIntensity: number; // 0 (dry) to 100 (heavy rain)
  mistDensity: number; // 0 to 100
  windSpeed: number; // 0 to 50
  tealHueDepth: number; // 0 to 100
  orangeGlowStrength: number; // 0 to 100
  wetReflectionGloss: number; // 0 to 100
  lampLuminance: number; // 0 to 100
  fallingLeavesSpeed: number; // 0 to 100
  showRipples: boolean;
  showRaindrops: boolean;
  showMistLayer: boolean;
  timePreset: MoodPreset;
}

export interface DetailHotspot {
  id: string;
  title: string;
  subtitle: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  zoomX: number;
  zoomY: number;
  zoomScale: number;
  description: string;
  artNote: string;
}

export interface PaletteColor {
  hex: string;
  name: string;
  role: string;
  percentage: string;
}
