import React, { useState } from 'react';
import { Download, X, Check, Image as ImageIcon, Sparkles, Monitor, Smartphone } from 'lucide-react';
import { SceneSettings, AspectRatio } from '../types/artwork';

interface WallpaperExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SceneSettings;
  currentAspectRatio: AspectRatio;
}

export const WallpaperExportModal: React.FC<WallpaperExportModalProps> = ({
  isOpen,
  onClose,
  settings,
  currentAspectRatio,
}) => {
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>(currentAspectRatio);
  const [resolution, setResolution] = useState<'4K' | '2K' | '1080p'>('4K');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleExport = () => {
    setIsExporting(true);
    setDownloadSuccess(false);

    setTimeout(() => {
      try {
        // Find existing canvas in DOM
        const sourceCanvas = document.querySelector('canvas') as HTMLCanvasElement | null;
        if (!sourceCanvas) throw new Error('Canvas not found');

        // Create high-resolution export canvas
        const exportCanvas = document.createElement('canvas');
        let outW = 3840;
        let outH = 2160;

        if (selectedRatio === '3:4') {
          outW = resolution === '4K' ? 2880 : resolution === '2K' ? 1920 : 1200;
          outH = resolution === '4K' ? 3840 : resolution === '2K' ? 2560 : 1600;
        } else if (selectedRatio === '16:9') {
          outW = resolution === '4K' ? 3840 : resolution === '2K' ? 2560 : 1920;
          outH = resolution === '4K' ? 2160 : resolution === '2K' ? 1440 : 1080;
        } else if (selectedRatio === '9:16') {
          outW = resolution === '4K' ? 2160 : resolution === '2K' ? 1440 : 1080;
          outH = resolution === '4K' ? 3840 : resolution === '2K' ? 2560 : 1920;
        } else {
          outW = resolution === '4K' ? 3000 : resolution === '2K' ? 2000 : 1200;
          outH = outW;
        }

        exportCanvas.width = outW;
        exportCanvas.height = outH;

        const ctx = exportCanvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(sourceCanvas, 0, 0, outW, outH);

          // Download image
          const dataUrl = exportCanvas.toDataURL('image/png', 1.0);
          const link = document.createElement('a');
          link.download = `autumn_rain_city_park_${selectedRatio.replace(':', 'x')}_${resolution}.png`;
          link.href = dataUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          setDownloadSuccess(true);
          setTimeout(() => {
            setDownloadSuccess(false);
          }, 3500);
        }
      } catch (err) {
        console.error('Export error:', err);
      } finally {
        setIsExporting(false);
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl text-slate-100 space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100">Export High-Res Artwork</h3>
            <p className="text-xs text-slate-400">Download crystal-clear digital art wallpaper (.PNG)</p>
          </div>
        </div>

        {/* Aspect Ratio Options */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-2">Target Format & Aspect Ratio</label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => setSelectedRatio('3:4')}
              className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                selectedRatio === '3:4'
                  ? 'bg-teal-950/70 border-teal-500 text-teal-200 ring-1 ring-teal-500/40'
                  : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-teal-400" />
              <div>
                <div className="font-semibold text-slate-200">Portrait (3:4)</div>
                <div className="text-[10px] text-slate-500">Matches photo framing</div>
              </div>
            </button>

            <button
              onClick={() => setSelectedRatio('16:9')}
              className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                selectedRatio === '16:9'
                  ? 'bg-teal-950/70 border-teal-500 text-teal-200 ring-1 ring-teal-500/40'
                  : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <Monitor className="w-4 h-4 text-amber-400" />
              <div>
                <div className="font-semibold text-slate-200">Cinematic (16:9)</div>
                <div className="text-[10px] text-slate-500">Desktop wallpaper</div>
              </div>
            </button>

            <button
              onClick={() => setSelectedRatio('9:16')}
              className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                selectedRatio === '9:16'
                  ? 'bg-teal-950/70 border-teal-500 text-teal-200 ring-1 ring-teal-500/40'
                  : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <Smartphone className="w-4 h-4 text-sky-400" />
              <div>
                <div className="font-semibold text-slate-200">Mobile (9:16)</div>
                <div className="text-[10px] text-slate-500">Phone lockscreen</div>
              </div>
            </button>

            <button
              onClick={() => setSelectedRatio('1:1')}
              className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                selectedRatio === '1:1'
                  ? 'bg-teal-950/70 border-teal-500 text-teal-200 ring-1 ring-teal-500/40'
                  : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="font-semibold text-slate-200">Square (1:1)</div>
                <div className="text-[10px] text-slate-500">Album / Print</div>
              </div>
            </button>
          </div>
        </div>

        {/* Resolution Options */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-2">Resolution Master</label>
          <div className="flex gap-2">
            {(['4K', '2K', '1080p'] as ('4K' | '2K' | '1080p')[]).map((res) => (
              <button
                key={res}
                onClick={() => setResolution(res)}
                className={`flex-1 py-2 rounded-xl text-xs font-mono font-semibold border transition-all ${
                  resolution === res
                    ? 'bg-teal-500/20 text-teal-300 border-teal-500/60 shadow-sm'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {res}
              </button>
            ))}
          </div>
        </div>

        {/* Download Action Button */}
        <div className="pt-2">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-amber-500 hover:from-teal-400 hover:to-amber-400 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Rendering High-Res Master...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <Check className="w-5 h-5 text-slate-950" />
                <span>Downloaded Successfully!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download {resolution} Artwork (.PNG)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
