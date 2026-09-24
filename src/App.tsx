/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import {
  Sparkles,
  Download,
  Sliders,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Palette,
  Compass,
  RotateCcw,
  CloudRain,
  Eye,
  Layers
} from 'lucide-react';
import { DigitalArtworkCanvas } from './components/DigitalArtworkCanvas';
import { ArtworkControls } from './components/ArtworkControls';
import { DetailInspector } from './components/DetailInspector';
import { ColorPaletteViewer } from './components/ColorPaletteViewer';
import { PromptBreakdownCard } from './components/PromptBreakdownCard';
import { AudioAtmosphere } from './components/AudioAtmosphere';
import { WallpaperExportModal } from './components/WallpaperExportModal';
import { SceneSettings, AspectRatio, DetailHotspot } from './types/artwork';

const DEFAULT_SETTINGS: SceneSettings = {
  rainIntensity: 65,
  mistDensity: 55,
  windSpeed: 18,
  tealHueDepth: 85,
  orangeGlowStrength: 90,
  wetReflectionGloss: 88,
  lampLuminance: 85,
  fallingLeavesSpeed: 45,
  showRipples: true,
  showRaindrops: true,
  showMistLayer: true,
  timePreset: 'teal-orange-signature',
};

export default function App() {
  const [settings, setSettings] = useState<SceneSettings>(DEFAULT_SETTINGS);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('3:4');
  const [zoom, setZoom] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeHotspot, setActiveHotspot] = useState<DetailHotspot | null>(null);
  const [activeTab, setActiveTab] = useState<'controls' | 'inspector' | 'palette' | 'concept'>('controls');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Hotspot selection triggers smooth zoom and pan to the region
  const handleSelectHotspot = useCallback((spot: DetailHotspot | null) => {
    setActiveHotspot(spot);
    if (spot) {
      setZoom(spot.zoomScale);
      setPanOffset({ x: spot.zoomX, y: spot.zoomY });
      setActiveTab('inspector');
    } else {
      setZoom(1);
      setPanOffset({ x: 0, y: 0 });
    }
  }, []);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.35, 3.5));
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(prev - 0.35, 1);
      if (next === 1) {
        setPanOffset({ x: 0, y: 0 });
        setActiveHotspot(null);
      }
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
    setActiveHotspot(null);
  };

  const handleResetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
    setActiveHotspot(null);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-teal-500/30 selection:text-teal-200">
      {/* Top Gallery Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Title & Concept Badge */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-amber-500 p-0.5 shadow-lg shadow-teal-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <CloudRain className="w-5 h-5 text-teal-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-slate-100 tracking-tight">
                Autumn Rain: City Park Sidewalk
              </h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-teal-950/70 border border-teal-500/40 text-teal-300">
                Digital Illustration
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Modern Teal & Orange harmony • Misty skyscraper • Rain reflections on wet paving stones
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Audio Synthesizer */}
          <AudioAtmosphere rainIntensity={settings.rainIntensity} />

          {/* Export Wallpaper / PNG */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-amber-500 hover:from-teal-400 hover:to-amber-400 text-slate-950 font-semibold text-xs shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export High-Res</span>
            <span className="sm:hidden">Export</span>
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Artwork Experience Container */}
      <main className="flex-1 flex flex-col p-4 lg:p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Canvas Display Stage */}
        <div className="relative w-full rounded-2xl bg-slate-900/40 border border-slate-800/80 p-2 sm:p-4 backdrop-blur-md flex flex-col items-center justify-center min-h-[580px] lg:min-h-[640px] shadow-2xl overflow-hidden">
          {/* Floating Zoom & Inspect Controls */}
          <div className="absolute top-6 right-6 z-20 flex flex-col gap-1.5 p-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-700/80 shadow-xl">
            <button
              onClick={handleZoomIn}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-slate-100 transition-colors"
              title="Zoom In (Inspect 8K Details)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-slate-100 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            {zoom !== 1 && (
              <button
                onClick={handleResetZoom}
                className="p-2 rounded-lg hover:bg-teal-950/50 text-teal-400 hover:text-teal-300 border border-teal-800/40 transition-colors"
                title="Reset View"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Current Zoom Indicator */}
          {zoom !== 1 && (
            <div className="absolute bottom-6 left-6 z-20 px-3 py-1.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-teal-500/40 text-teal-300 font-mono text-xs flex items-center gap-2 shadow-xl">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span>Inspection Zoom: {zoom.toFixed(1)}x</span>
              <button
                onClick={handleResetZoom}
                className="underline hover:text-teal-200 ml-1 text-[11px]"
              >
                Reset
              </button>
            </div>
          )}

          {/* The Core Dynamic Artwork Canvas */}
          <DigitalArtworkCanvas
            settings={settings}
            aspectRatio={aspectRatio}
            zoom={zoom}
            panOffset={panOffset}
            onResetZoom={handleResetZoom}
            isInspecting={zoom > 1}
          />
        </div>

        {/* Tab Navigation for Artwork Controls, Detail Inspector, Palette, & Concept */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('controls')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'controls'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4 text-teal-400" />
            <span>Atmosphere & Lighting Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('inspector')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'inspector'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Eye className="w-4 h-4 text-amber-400" />
            <span>8K Detail Inspector</span>
            {activeHotspot && (
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('palette')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'palette'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Palette className="w-4 h-4 text-sky-400" />
            <span>Teal & Orange Palette</span>
          </button>

          <button
            onClick={() => setActiveTab('concept')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'concept'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Art Direction Breakdown</span>
          </button>
        </div>

        {/* Active Tab Content Panel */}
        <div className="transition-all duration-300">
          {activeTab === 'controls' && (
            <ArtworkControls
              settings={settings}
              onChangeSettings={setSettings}
              aspectRatio={aspectRatio}
              onChangeAspectRatio={setAspectRatio}
              onReset={handleResetSettings}
            />
          )}

          {activeTab === 'inspector' && (
            <DetailInspector
              activeHotspot={activeHotspot}
              onSelectHotspot={handleSelectHotspot}
              onZoomReset={handleResetZoom}
            />
          )}

          {activeTab === 'palette' && <ColorPaletteViewer />}

          {activeTab === 'concept' && <PromptBreakdownCard />}
        </div>
      </main>

      {/* Wallpaper & High-Res PNG Export Modal */}
      <WallpaperExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        settings={settings}
        currentAspectRatio={aspectRatio}
      />
    </div>
  );
}
