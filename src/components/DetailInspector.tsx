import React from 'react';
import { ZoomIn, Eye, Sparkles, Navigation, Layers } from 'lucide-react';
import { DetailHotspot } from '../types/artwork';

interface DetailInspectorProps {
  activeHotspot: DetailHotspot | null;
  onSelectHotspot: (hotspot: DetailHotspot | null) => void;
  onZoomReset: () => void;
}

export const HOTSPOTS: DetailHotspot[] = [
  {
    id: 'skyscraper-cranes',
    title: 'Misty Skyscraper & Tower Cranes',
    subtitle: 'Atmospheric Perspective & Structural Geometry',
    x: 18,
    y: 22,
    zoomX: 520,
    zoomY: 420,
    zoomScale: 2.4,
    description:
      'Towering skyscraper under construction partially occluded by overcast rain mist. Features exposed concrete deck plates, steel framework grid, and two lattice tower cranes with blinking red aviation warning beacons.',
    artNote:
      'Teal atmospheric Rayleigh scattering reduces structural contrast with altitude, creating an expansive illusion of scale and rainy gloom.',
  },
  {
    id: 'black-street-lamp',
    title: 'Minimalist Black Street Lamp',
    subtitle: 'Nordic/Japanese Architectural Lighting',
    x: 88,
    y: 52,
    zoomX: -650,
    zoomY: 100,
    zoomScale: 2.1,
    description:
      'Iconic black cylindrical lantern post with horizontal louvers housing a frosted warm diffuser. Casts volumetric amber bloom across the wet foliage and path.',
    artNote:
      'Specular rain highlights line the top disc rim while warm radial gradients bleed into the surrounding cool teal atmosphere.',
  },
  {
    id: 'wet-pavement-reflections',
    title: 'Wet Paving Stones & Puddle Ripples',
    subtitle: 'Fresnel Reflections & Dynamic Fluid Physics',
    x: 52,
    y: 84,
    zoomX: -80,
    zoomY: -720,
    zoomScale: 2.2,
    description:
      'Wet rectangular granite paving slabs converging towards the vanishing point. Glossy water film mirrors the warm amber street lamps and the cool teal sky.',
    artNote:
      'Ground water ripples expand rhythmically as raindrops strike, creating interactive physical feedback across the reflective stone tiles.',
  },
  {
    id: 'golden-canopy',
    title: 'Autumn Golden & Lime Canopy',
    subtitle: 'Organic Foliage Layering & Wet Leaves',
    x: 62,
    y: 26,
    zoomX: -260,
    zoomY: 480,
    zoomScale: 2.0,
    description:
      'Lush canopy of golden birch and elm leaves framing the path, interspersed with vibrant chartreuse lime and ember-orange accents.',
    artNote:
      'Subtle leaf swaying and specular highlights on wet leaf surfaces simulate fresh rainwater clinging to the foliage.',
  },
  {
    id: 'granite-curb-hedge',
    title: 'Granite Curb & Manicured Hedge',
    subtitle: 'Urban Park Boundary & Foliage Contrast',
    x: 14,
    y: 75,
    zoomX: 620,
    zoomY: -550,
    zoomScale: 2.2,
    description:
      'Linear granite border separating the sidewalk from the raised garden bed. Topped with a sculpted deep-green hedge dotted with fallen amber leaves.',
    artNote:
      'Crisp wet highlight lines define the polished granite bevel, providing a grounding architectural anchor to the composition.',
  },
];

export const DetailInspector: React.FC<DetailInspectorProps> = ({
  activeHotspot,
  onSelectHotspot,
  onZoomReset,
}) => {
  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl text-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400">
            <ZoomIn className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
              <span>8K Detail Inspector</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">Examine macro details, lighting techniques & composition hotspots</p>
          </div>
        </div>

        {activeHotspot && (
          <button
            onClick={onZoomReset}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            <Navigation className="w-3 h-3 text-teal-400 rotate-45" />
            <span>Reset View</span>
          </button>
        )}
      </div>

      {/* Hotspots Quick Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mb-4">
        {HOTSPOTS.map((spot) => {
          const isSelected = activeHotspot?.id === spot.id;
          return (
            <button
              key={spot.id}
              onClick={() => onSelectHotspot(isSelected ? null : spot)}
              className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-teal-950/60 border-teal-500 text-teal-200 ring-2 ring-teal-500/20 shadow-lg'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-teal-400 animate-ping' : 'bg-amber-400'}`} />
                  {spot.title}
                </span>
                <Eye className={`w-3.5 h-3.5 ${isSelected ? 'text-teal-400' : 'text-slate-500'}`} />
              </div>
              <span className="text-[11px] text-slate-400 line-clamp-1">{spot.subtitle}</span>
            </button>
          );
        })}
      </div>

      {/* Active Detail Breakdown Card */}
      {activeHotspot ? (
        <div className="p-4 rounded-xl bg-slate-950/70 border border-teal-500/30 text-xs space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-teal-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Focus: {activeHotspot.title}
            </span>
            <span className="font-mono text-[10px] text-teal-400/80 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800/40">
              {activeHotspot.zoomScale}x Optical Zoom
            </span>
          </div>
          <p className="text-slate-300 leading-relaxed">{activeHotspot.description}</p>
          <div className="p-2.5 rounded-lg bg-teal-950/40 border border-teal-800/30 text-teal-200/90 flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span className="leading-snug">
              <strong className="text-amber-300">Art Concept:</strong> {activeHotspot.artNote}
            </span>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs text-slate-400 text-center">
          Click any hotspot button above to zoom directly into that region of the digital illustration.
        </div>
      )}
    </div>
  );
};
