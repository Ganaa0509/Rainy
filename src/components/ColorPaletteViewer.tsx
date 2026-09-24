import React, { useState } from 'react';
import { Palette, Check, Copy, Sparkles } from 'lucide-react';
import { PaletteColor } from '../types/artwork';

export const ColorPaletteViewer: React.FC = () => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const palette: PaletteColor[] = [
    {
      hex: '#0d2b35',
      name: 'Abyssal Slate Teal',
      role: 'Moody overcast sky, distant fog shadows',
      percentage: '35%',
    },
    {
      hex: '#1e4a58',
      name: 'Atmospheric Teal',
      role: 'Skyscraper steel framework & rain mist',
      percentage: '20%',
    },
    {
      hex: '#3b6f7e',
      name: 'Wet Pavement Teal',
      role: 'Specular stone highlights & puddle reflections',
      percentage: '15%',
    },
    {
      hex: '#f59e0b',
      name: 'Vibrant Autumn Gold',
      role: 'Golden birch canopy foliage clusters',
      percentage: '15%',
    },
    {
      hex: '#d97706',
      name: 'Amber Honey Glow',
      role: 'Frosted street lantern bloom & wet stone reflections',
      percentage: '8%',
    },
    {
      hex: '#ea580c',
      name: 'Burnt Autumn Orange',
      role: 'Warm accent shrubbery & falling leaves',
      percentage: '4%',
    },
    {
      hex: '#121619',
      name: 'Matte Charcoal Black',
      role: 'Architectural street lamp poles & tree trunks',
      percentage: '3%',
    },
  ];

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl text-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
              <span>Modern Teal & Orange Harmony</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">Complementary chromatic balance: cool rain mist vs. warm autumnal radiance</p>
          </div>
        </div>
        <span className="text-xs font-mono text-teal-400/80 bg-teal-950/50 px-2.5 py-1 rounded-full border border-teal-800/40">
          7 Harmonized Values
        </span>
      </div>

      {/* Proportional Color Ribbon Bar */}
      <div className="flex h-5 w-full rounded-lg overflow-hidden mb-4 border border-slate-700/60 shadow-inner">
        {palette.map((c) => (
          <div
            key={c.hex}
            style={{ width: c.percentage, backgroundColor: c.hex }}
            className="h-full relative group cursor-pointer transition-transform hover:scale-y-110"
            title={`${c.name} (${c.hex}) - ${c.percentage}`}
            onClick={() => copyToClipboard(c.hex)}
          />
        ))}
      </div>

      {/* Swatches Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {palette.map((color) => (
          <button
            key={color.hex}
            onClick={() => copyToClipboard(color.hex)}
            className="flex items-center gap-3 p-2 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all text-left group"
          >
            <div
              className="w-9 h-9 rounded-lg shadow-md border border-white/10 shrink-0 flex items-center justify-center transition-transform group-hover:scale-105"
              style={{ backgroundColor: color.hex }}
            >
              {copiedHex === color.hex ? (
                <Check className="w-4 h-4 text-white drop-shadow-md" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-white/0 group-hover:text-white/80 transition-opacity" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200 truncate">{color.name}</span>
                <span className="text-[10px] font-mono text-slate-400">{color.percentage}</span>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-[11px] font-mono text-teal-300/90">{color.hex}</span>
                <span className="text-[10px] text-slate-500 truncate max-w-[80px]">
                  {copiedHex === color.hex ? 'Copied!' : 'Click to copy'}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Theory Insight */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-400 leading-relaxed">
        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
        <p>
          <strong className="text-slate-300">Chromatic Temperature Contrast:</strong> Placing deep overcast slate-teal background tones against warm amber-orange lantern illumination creates powerful volumetric depth, causing the wet pavement puddles and glistening birch leaves to pop with three-dimensional brilliance.
        </p>
      </div>
    </div>
  );
};
