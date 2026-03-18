import React, { useEffect, useRef, useState } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;
const GAME_SPEED = 100;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }]);
  const dirRef = useRef<Point>({ x: 0, y: -1 });
  const nextDirRef = useRef<Point>({ x: 0, y: -1 });
  const foodRef = useRef<Point>({ x: 15, y: 5 });
  const gameLoopRef = useRef<number | null>(null);

  const resetGame = () => {
    snakeRef.current = [{ x: 10, y: 10 }];
    dirRef.current = { x: 0, y: -1 };
    nextDirRef.current = { x: 0, y: -1 };
    setScore(0);
    setGameOver(false);
    spawnFood();
    setIsPlaying(true);
  };

  const spawnFood = () => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!snakeRef.current.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    foodRef.current = newFood;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault();
      }

      if (!isPlaying && !gameOver && e.key === 'Enter') {
        setIsPlaying(true);
        return;
      }
      if (gameOver && e.key === 'Enter') {
        resetGame();
        return;
      }

      const { x, y } = dirRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (y !== 1) nextDirRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (y !== -1) nextDirRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (x !== 1) nextDirRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (x !== -1) nextDirRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const update = () => {
      dirRef.current = nextDirRef.current;
      const head = snakeRef.current[0];
      const newHead = {
        x: head.x + dirRef.current.x,
        y: head.y + dirRef.current.y,
      };

      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        handleGameOver();
        return;
      }

      if (snakeRef.current.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        handleGameOver();
        return;
      }

      const newSnake = [newHead, ...snakeRef.current];

      if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
        setScore(s => {
          const newScore = s + 10;
          if (newScore > highScore) setHighScore(newScore);
          return newScore;
        });
        spawnFood();
      } else {
        newSnake.pop();
      }

      snakeRef.current = newSnake;
      draw();
    };

    const handleGameOver = () => {
      setGameOver(true);
      setIsPlaying(false);
    };

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas with harsh black
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Draw harsh grid
      ctx.strokeStyle = '#111111';
      ctx.lineWidth = 1;
      for (let i = 0; i <= CANVAS_SIZE; i += CELL_SIZE) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, CANVAS_SIZE);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(CANVAS_SIZE, i);
        ctx.stroke();
      }

      // Draw Food (Magenta)
      ctx.fillStyle = '#FF00FF';
      ctx.fillRect(
        foodRef.current.x * CELL_SIZE,
        foodRef.current.y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );

      // Draw Snake (Cyan)
      snakeRef.current.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#FFFFFF' : '#00FFFF';
        ctx.fillRect(
          segment.x * CELL_SIZE,
          segment.y * CELL_SIZE,
          CELL_SIZE - 1,
          CELL_SIZE - 1
        );
      });
    };

    gameLoopRef.current = window.setInterval(update, GAME_SPEED);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPlaying, gameOver, highScore]);

  // Initial draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    ctx.fillStyle = '#00FFFF';
    ctx.fillRect(10 * CELL_SIZE, 10 * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);
    
    ctx.fillStyle = '#FF00FF';
    ctx.fillRect(15 * CELL_SIZE, 5 * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      <div className="flex justify-between w-full px-2 font-pixel tracking-widest uppercase">
        <div className="flex flex-col">
          <span className="text-xs text-[#FF00FF] mb-2">SCORE_</span>
          <span className="text-2xl text-[#00FFFF] glitch-text" data-text={score.toString().padStart(4, '0')}>
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-[#FF00FF] mb-2">HI_SCORE_</span>
          <span className="text-2xl text-[#00FFFF] glitch-text" data-text={highScore.toString().padStart(4, '0')}>
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      <div className="relative p-2 border-4 border-[#00FFFF] bg-black shadow-[8px_8px_0px_#FF00FF]">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="bg-black block"
        />
        
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
            <button 
              onClick={() => setIsPlaying(true)}
              className="px-6 py-4 border-2 border-[#00FFFF] text-[#00FFFF] font-pixel text-sm uppercase hover:bg-[#00FFFF] hover:text-black transition-colors glitch-text"
              data-text="[PRESS ENTER]"
            >
              [PRESS ENTER]
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20 gap-8 border-4 border-[#FF00FF]">
            <div className="text-center">
              <h2 className="text-3xl font-pixel text-[#FF00FF] glitch-text uppercase" data-text="SYS_FAIL">SYS_FAIL</h2>
            </div>
            <div className="text-center">
              <p className="text-xl font-pixel text-[#00FFFF] uppercase">SCORE: {score}</p>
            </div>
            <button 
              onClick={resetGame}
              className="px-6 py-3 border-2 border-[#FF00FF] text-[#FF00FF] font-pixel text-xs uppercase hover:bg-[#FF00FF] hover:text-black transition-colors"
            >
              &gt; REBOOT_
            </button>
          </div>
        )}
      </div>
      
      <div className="text-[#00FFFF] text-lg font-vt uppercase tracking-widest">
        INPUT: [W A S D] OR [ARROWS]
      </div>
    </div>
  );
}
