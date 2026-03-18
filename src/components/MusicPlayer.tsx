import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "ERR_0x001",
    artist: "SYS.OP",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "6:12"
  },
  {
    id: 2,
    title: "NULL_POINTER",
    artist: "MEM_LEAK",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "7:05"
  },
  {
    id: 3,
    title: "STACK_OVERFLOW",
    artist: "KERNEL_PANIC",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: "5:44"
  }
];

export default function MusicPlayer() {
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIdx];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.error("Audio play failed:", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIdx]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIdx((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIdx((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
      setProgress(percentage * 100);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 border-4 border-[#FF00FF] bg-black shadow-[-8px_8px_0px_#00FFFF] relative">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />
      
      <div className="absolute top-0 right-0 bg-[#FF00FF] text-black text-xs font-pixel px-2 py-1 uppercase">
        STREAM_ACTIVE
      </div>

      <div className="flex items-center justify-between mb-8 mt-4">
        <div>
          <h3 className="text-[#00FFFF] font-pixel text-sm uppercase mb-2 glitch-text" data-text={currentTrack.title}>
            {currentTrack.title}
          </h3>
          <p className="text-[#FF00FF] text-lg font-vt uppercase">&gt; {currentTrack.artist}</p>
        </div>
        
        {/* Raw visualizer bars */}
        <div className="flex items-end gap-1 h-10">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="w-3 bg-[#00FFFF] transition-all duration-75"
              style={{ 
                height: isPlaying ? `${Math.random() * 80 + 20}%` : '10%',
                opacity: isPlaying ? 1 : 0.3
              }}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div 
        className="h-4 w-full bg-zinc-900 border-2 border-[#00FFFF] mb-8 cursor-pointer relative"
        onClick={handleProgressClick}
      >
        <div 
          className="h-full bg-[#FF00FF]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={handlePrev}
            className="text-[#00FFFF] hover:text-[#FF00FF] transition-colors"
          >
            <SkipBack size={28} strokeWidth={1.5} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-14 h-14 flex items-center justify-center border-4 border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black transition-all"
          >
            {isPlaying ? <Pause size={28} className="fill-current" /> : <Play size={28} className="fill-current ml-1" />}
          </button>
          
          <button 
            onClick={handleNext}
            className="text-[#00FFFF] hover:text-[#FF00FF] transition-colors"
          >
            <SkipForward size={28} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="text-[#FF00FF] hover:text-[#00FFFF] transition-colors"
          >
            {isMuted || volume === 0 ? <VolumeX size={24} strokeWidth={1.5} /> : <Volume2 size={24} strokeWidth={1.5} />}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-24 h-2 bg-zinc-900 border border-[#FF00FF] appearance-none cursor-pointer accent-[#00FFFF]"
          />
        </div>
      </div>
    </div>
  );
}
