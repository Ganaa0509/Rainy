import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, CloudRain, Wind } from 'lucide-react';
import { rainAudio } from '../utils/rainAudio';

interface AudioAtmosphereProps {
  rainIntensity: number;
}

export const AudioAtmosphere: React.FC<AudioAtmosphereProps> = ({ rainIntensity }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);

  useEffect(() => {
    rainAudio.updateIntensity(rainIntensity);
  }, [rainIntensity]);

  const togglePlayback = () => {
    if (isPlaying) {
      rainAudio.stop();
      setIsPlaying(false);
    } else {
      rainAudio.start(rainIntensity);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    rainAudio.setVolume(val);
  };

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 shadow-lg text-slate-200">
      <button
        onClick={togglePlayback}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
          isPlaying
            ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm shadow-teal-500/20'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
        }`}
        title={isPlaying ? 'Pause rain soundscape' : 'Play ambient rain soundscape'}
      >
        <CloudRain className={`w-3.5 h-3.5 ${isPlaying ? 'text-teal-400 animate-pulse' : 'text-slate-400'}`} />
        <span>{isPlaying ? 'Rain Audio Active' : 'Enable Rain Audio'}</span>
      </button>

      {isPlaying && (
        <div className="flex items-center gap-2 pl-2 border-l border-slate-700/60 animate-in fade-in duration-300">
          <button
            onClick={() => {
              const newVol = volume === 0 ? 0.5 : 0;
              setVolume(newVol);
              rainAudio.setVolume(newVol);
            }}
            className="text-slate-400 hover:text-slate-200"
            title={volume === 0 ? 'Unmute' : 'Mute'}
          >
            {volume === 0 ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-teal-400" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            className="w-16 h-1 accent-teal-400 bg-slate-700 rounded-lg cursor-pointer"
            title={`Volume: ${Math.round(volume * 100)}%`}
          />
        </div>
      )}
    </div>
  );
};
