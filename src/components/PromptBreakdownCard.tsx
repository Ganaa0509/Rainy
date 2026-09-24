import React from 'react';
import { FileText, CheckCircle2, Sparkles, Compass, Eye, ShieldCheck } from 'lucide-react';

export const PromptBreakdownCard: React.FC = () => {
  const elements = [
    {
      title: 'Wet City Park Sidewalk',
      desc: '1-point converging granite perspective grid with wet bevels and surface puddles.',
      status: 'Implemented',
    },
    {
      title: 'Autumn Trees & Canopy',
      desc: 'Mature birch/elm trunks with arching branches and thousands of golden, amber, and lime leaves.',
      status: 'Implemented',
    },
    {
      title: 'Black Minimalist Street Lamps',
      desc: 'Nordic/Japanese cylindrical black lanterns with horizontal louvers & warm diffused glow.',
      status: 'Implemented',
    },
    {
      title: 'Building Under Construction in Mist',
      desc: 'Lattice tower cranes with blinking red aviation lights and exposed structural framework.',
      status: 'Implemented',
    },
    {
      title: 'Teal & Orange Color Harmony',
      desc: 'Complimentary chromatic grade: deep slate-teal atmosphere balanced with warm amber illumination.',
      status: 'Implemented',
    },
    {
      title: 'Detailed Rain Reflections',
      desc: 'Fresnel water sheen mirroring lamps, trees, and sky with dynamic ripple physics.',
      status: 'Implemented',
    },
  ];

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl text-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
              <span>Artistic Direction & Prompt Execution</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">Translating photographic composition into modern concept art</p>
          </div>
        </div>

        <span className="text-xs font-mono text-teal-300 bg-teal-950/60 border border-teal-800/40 px-2.5 py-1 rounded-full flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          6/6 Elements Rendered
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {elements.map((el, i) => (
          <div
            key={i}
            className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-200">{el.title}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">{el.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
