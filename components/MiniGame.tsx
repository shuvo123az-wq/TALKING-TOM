
import React, { useState, useEffect, useCallback, useRef } from 'react';

interface MiniGameProps {
  onClose: (earnedCoins: number) => void;
}

export const MiniGame: React.FC<MiniGameProps> = ({ onClose }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [playerX, setPlayerX] = useState(50); // percentage
  const [stars, setStars] = useState<{ id: number; x: number; y: number }[]>([]);
  const gameRef = useRef<HTMLDivElement>(null);
  const nextStarId = useRef(0);

  const spawnStar = useCallback(() => {
    const newStar = {
      id: nextStarId.current++,
      x: Math.random() * 90 + 5,
      y: -10
    };
    setStars(prev => [...prev, newStar]);
  }, []);

  useEffect(() => {
    const starInterval = setInterval(spawnStar, 800);
    const timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(starInterval);
          clearInterval(timerInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(starInterval);
      clearInterval(timerInterval);
    };
  }, [spawnStar]);

  useEffect(() => {
    const moveStars = setInterval(() => {
      setStars(prev => {
        const updated = prev.map(s => ({ ...s, y: s.y + 2 }));
        
        // Catch check
        const caught = updated.filter(s => {
          const isCaught = s.y > 85 && s.y < 95 && Math.abs(s.x - playerX) < 15;
          if (isCaught) setScore(sc => sc + 10);
          return !isCaught && s.y < 100;
        });

        return caught;
      });
    }, 50);

    return () => clearInterval(moveStars);
  }, [playerX]);

  const handleTouch = (e: React.TouchEvent | React.MouseEvent) => {
    if (!gameRef.current) return;
    const rect = gameRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const relativeX = ((x - rect.left) / rect.width) * 100;
    setPlayerX(Math.max(10, Math.min(90, relativeX)));
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md h-[80vh] bg-indigo-900 rounded-3xl relative overflow-hidden shadow-2xl border-4 border-indigo-400"
           ref={gameRef}
           onMouseMove={handleTouch}
           onTouchMove={handleTouch}>
        
        {/* UI Overlay */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-full font-title">
            ⭐ {score}
          </div>
          <div className="bg-red-500 px-4 py-2 rounded-full font-title">
            ⏰ {timeLeft}s
          </div>
        </div>

        {/* Stars */}
        {stars.map(star => (
          <div key={star.id} 
               className="absolute text-2xl transition-all duration-50"
               style={{ left: `${star.x}%`, top: `${star.y}%` }}>
            ⭐
          </div>
        ))}

        {/* Player Bucket */}
        <div className="absolute bottom-10 transition-all duration-100 flex flex-col items-center"
             style={{ left: `${playerX}%`, transform: 'translateX(-50%)' }}>
          <div className="text-4xl">🛸</div>
          <div className="w-16 h-4 bg-blue-400/50 rounded-full blur-sm"></div>
        </div>

        {timeLeft === 0 && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
            <h2 className="font-title text-4xl mb-4 text-yellow-400">GAME OVER!</h2>
            <p className="text-xl mb-6">You earned {Math.floor(score / 5)} coins!</p>
            <button 
              onClick={() => onClose(Math.floor(score / 5))}
              className="bg-green-500 hover:bg-green-400 px-8 py-4 rounded-2xl font-title text-xl shadow-lg transform active:scale-95"
            >
              COLLECT COINS
            </button>
          </div>
        )}
      </div>
      <p className="mt-4 text-white/60">Drag to move your UFO and catch falling stars!</p>
    </div>
  );
};
