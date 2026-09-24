import React from 'react';
import {
  Sliders,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  Lightbulb,
  Sparkles,
  Layers,
  RotateCcw,
  Maximize2
} from 'lucide-react';
import { SceneSettings, MoodPreset, AspectRatio } from '../types/artwork';

interface ArtworkControlsProps {
  settings: SceneSettings;
  onChangeSettings: (newSettings: SceneSettings) => void;
  aspectRatio: AspectRatio;
  onChangeAspectRatio: (ratio: AspectRatio) => void;
  onReset: () => void;
}

export const MOOD_PRESETS: { id: MoodPreset; name: string; desc: string; icon: string }[] = [
  {
    id: 'teal-orange-signature',
    name: 'Teal & Orange Signature',
    desc: 'The prompt color harmony: deep slate-teal atmosphere against vibrant amber lanterns and golden leaves.',
    icon: '🍂',
  },
  {
    id: 'twilight-rainfall',
    name: 'Twilight Rain',
    desc: 'Deep nocturnal teal sky with high lamp bloom and glistening specular puddle reflections.',
    icon: '🌧️',
  },
  {
    id: 'misty-dawn',
    name: 'Misty Dawn',
    desc: 'Soft morning haze enveloping the skyscraper framework with gentle autumn drizzle.',
    icon: '🌫️',
  },
  {
    id: 'storm-downpour',
    name: 'Autumn Downpour',
    desc: 'Heavy wind-swept rain, rapid surface splashes, and dense atmospheric fog.',
    icon: '⛈️',
  },
  {
    id: 'golden-break',
    name: 'Golden Break',
    desc: 'Warm sunrays piercing the misty teal clouds, bathing wet stones in liquid gold.',
    icon: '⛅',
  },
];

export const ArtworkControls: React.FC<ArtworkControlsProps> = ({
  settings,
  onChangeSettings,
  aspectRatio,
  onChangeAspectRatio,
  onReset,
}) => {
  const updateSetting = <K extends keyof SceneSettings>(key: K, value: SceneSettings[K]) => {
    onChangeSettings({ ...settings, [key]: value });
  };

  const applyPreset = (presetId: MoodPreset) => {
    switch (presetId) {
      case 'teal-orange-signature':
        onChangeSettings({
          ...settings,
          timePreset: presetId,
          tealHueDepth: 85,
          orangeGlowStrength: 90,
          mistDensity: 55,
          rainIntensity: 65,
          wetReflectionGloss: 88,
          lampLuminance: 85,
          windSpeed: 18,
          fallingLeavesSpeed: 45,
          showRipples: true,
          showRaindrops: true,
          showMistLayer: true,
        });
        break;
      case 'twilight-rainfall':
        onChangeSettings({
          ...settings,
          timePreset: presetId,
          tealHueDepth: 98,
          orangeGlowStrength: 100,
          mistDensity: 70,
          rainIntensity: 80,
          wetReflectionGloss: 95,
          lampLuminance: 100,
          windSpeed: 22,
          fallingLeavesSpeed: 60,
          showRipples: true,
          showRaindrops: true,
          showMistLayer: true,
        });
        break;
      case 'misty-dawn':
        onChangeSettings({
          ...settings,
          timePreset: presetId,
          tealHueDepth: 60,
          orangeGlowStrength: 65,
          mistDensity: 85,
          rainIntensity: 35,
          wetReflectionGloss: 65,
          lampLuminance: 60,
          windSpeed: 10,
          fallingLeavesSpeed: 30,
          showRipples: true,
          showRaindrops: true,
          showMistLayer: true,
        });
        break;
      case 'storm-downpour':
        onChangeSettings({
          ...settings,
          timePreset: presetId,
          tealHueDepth: 95,
          orangeGlowStrength: 75,
          mistDensity: 90,
          rainIntensity: 100,
          wetReflectionGloss: 95,
          lampLuminance: 80,
          windSpeed: 40,
          fallingLeavesSpeed: 85,
          showRipples: true,
          showRaindrops: true,
          showMistLayer: true,
        });
        break;
      case 'golden-break':
        onChangeSettings({
          ...settings,
          timePreset: presetId,
          tealHueDepth: 50,
          orangeGlowStrength: 95,
          mistDensity: 40,
          rainIntensity: 25,
          wetReflectionGloss: 80,
          lampLuminance: 70,
          windSpeed: 12,
          fallingLeavesSpeed: 40,
          showRipples: true,
          showRaindrops: true,
          showMistLayer: true,
        });
        break;
    }
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl text-slate-200 space-y-6">
      {/* Top Header: Aspect Ratio & Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Atmosphere & Lighting Studio</h3>
            <p className="text-xs text-slate-400">Fine-tune color grading, weather physics and lighting</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Aspect Ratio Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            {(['3:4', '16:9', '9:16', '1:1'] as AspectRatio[]).map((ratio) => (
              <button
                key={ratio}
                onClick={() => onChangeAspectRatio(ratio)}
                className={`px-2.5 py-1 rounded-lg font-mono transition-all ${
                  aspectRatio === ratio
                    ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition-colors"
            title="Reset to default settings"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Mood Presets */}
      <div>
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Atmospheric Mood Presets
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {MOOD_PRESETS.map((p) => {
            const isActive = settings.timePreset === p.id;
            return (
              <button
                key={p.id}
                onClick={() => applyPreset(p.id)}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-teal-950/70 border-teal-500 text-teal-200 shadow-md ring-1 ring-teal-500/40'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">{p.icon}</span>
                  <span className="text-xs font-semibold text-slate-100 truncate">{p.name}</span>
                </div>
                <span className="text-[10px] text-slate-500 line-clamp-2 leading-tight">{p.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sliders Grid: Color Grading & Weather Physics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        {/* Color Grading Group */}
        <div className="space-y-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-300 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            Teal & Orange Color Grading
          </div>

          {/* Teal Depth */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300">Teal Atmospheric Depth</span>
              <span className="font-mono text-teal-400">{settings.tealHueDepth}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={settings.tealHueDepth}
              onChange={(e) => updateSetting('tealHueDepth', Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
            />
          </div>

          {/* Orange Glow */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300">Warm Amber / Orange Radiance</span>
              <span className="font-mono text-amber-400">{settings.orangeGlowStrength}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={settings.orangeGlowStrength}
              onChange={(e) => updateSetting('orangeGlowStrength', Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          {/* Lamp Luminance */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300">Street Lamp Bloom & Intensity</span>
              <span className="font-mono text-amber-300">{settings.lampLuminance}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={settings.lampLuminance}
              onChange={(e) => updateSetting('lampLuminance', Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-300"
            />
          </div>
        </div>

        {/* Rain & Surface Physics Group */}
        <div className="space-y-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-300 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            Rain & Surface Reflections
          </div>

          {/* Rain Intensity */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300">Rainfall Density</span>
              <span className="font-mono text-sky-400">{settings.rainIntensity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.rainIntensity}
              onChange={(e) => updateSetting('rainIntensity', Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
            />
          </div>

          {/* Wetness Gloss */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300">Pavement Wetness & Reflections</span>
              <span className="font-mono text-cyan-300">{settings.wetReflectionGloss}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={settings.wetReflectionGloss}
              onChange={(e) => updateSetting('wetReflectionGloss', Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Mist Density */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300">Background Mist & Fog Haze</span>
              <span className="font-mono text-slate-300">{settings.mistDensity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.mistDensity}
              onChange={(e) => updateSetting('mistDensity', Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-300"
            />
          </div>
        </div>
      </div>

      {/* Layer Toggles */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300 cursor-pointer hover:border-slate-700">
          <input
            type="checkbox"
            checked={settings.showRaindrops}
            onChange={(e) => updateSetting('showRaindrops', e.target.checked)}
            className="rounded accent-teal-400 cursor-pointer"
          />
          <span>Rain Streaks</span>
        </label>

        <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300 cursor-pointer hover:border-slate-700">
          <input
            type="checkbox"
            checked={settings.showRipples}
            onChange={(e) => updateSetting('showRipples', e.target.checked)}
            className="rounded accent-teal-400 cursor-pointer"
          />
          <span>Water Puddle Ripples</span>
        </label>

        <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300 cursor-pointer hover:border-slate-700">
          <input
            type="checkbox"
            checked={settings.showMistLayer}
            onChange={(e) => updateSetting('showMistLayer', e.target.checked)}
            className="rounded accent-teal-400 cursor-pointer"
          />
          <span>Atmospheric Mist Drift</span>
        </label>
      </div>
    </div>
  );
};
