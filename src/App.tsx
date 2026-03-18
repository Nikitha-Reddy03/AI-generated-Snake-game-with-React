import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white font-vt relative overflow-hidden flex flex-col screen-tear">
      {/* Glitch Overlays */}
      <div className="scanlines" />
      <div className="static-noise" />
      
      <header className="w-full py-6 text-center relative z-10 border-b-4 border-cyan-500 bg-black">
        <h1 className="text-4xl md:text-6xl font-pixel tracking-widest uppercase mb-2">
          <span className="text-cyan-400 glitch-text" data-text="NEON">NEON</span>
          <span className="text-magenta-500 glitch-text text-[#FF00FF]" data-text="SNAKE">SNAKE</span>
        </h1>
        <p className="text-[#00FFFF] tracking-[0.3em] text-lg mt-2 uppercase">SYS.OP.TERMINAL // V.9.0.1</p>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 p-6 relative z-10 max-w-7xl mx-auto w-full">
        <div className="w-full lg:w-1/2 flex justify-center">
          <SnakeGame />
        </div>
        
        <div className="w-full lg:w-1/2 flex flex-col justify-center gap-8">
          <div className="max-w-md mx-auto w-full text-center lg:text-left border-l-4 border-[#FF00FF] pl-4">
            <h2 className="text-3xl font-pixel text-[#00FFFF] tracking-widest mb-4 uppercase glitch-text" data-text="AUDIO_LINK">
              AUDIO_LINK
            </h2>
            <p className="text-zinc-300 text-xl leading-relaxed mb-2 uppercase">
              &gt; ESTABLISHING NEURAL CONNECTION...
            </p>
            <p className="text-zinc-400 text-lg leading-relaxed mb-8 uppercase">
              &gt; WARNING: SYNTHETIC FREQUENCIES MAY CAUSE COGNITIVE DISSONANCE. PROCEED WITH CAUTION.
            </p>
          </div>
          <MusicPlayer />
        </div>
      </main>
    </div>
  );
}
