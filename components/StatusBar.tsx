
import React from 'react';
import { PetStats } from '../types';

interface StatusBarProps {
  stats: PetStats;
  coins: number;
  level: number;
}

const ProgressBar: React.FC<{ value: number; color: string; icon: string }> = ({ value, color, icon }) => (
  <div className="flex items-center gap-1 w-full bg-black/30 rounded-full px-2 py-0.5">
    <span className="text-sm">{icon}</span>
    <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
      <div 
        className={`h-full ${color} transition-all duration-500`} 
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  </div>
);

export const StatusBar: React.FC<StatusBarProps> = ({ stats, coins, level }) => {
  return (
    <div className="fixed top-0 left-0 right-0 p-4 z-50 pointer-events-none">
      <div className="max-w-md mx-auto flex flex-col gap-2">
        <div className="flex justify-between items-center bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 pointer-events-auto shadow-xl">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center font-title text-indigo-900 border-2 border-white">
              {level}
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase font-bold tracking-wider opacity-70">Bloop</span>
              <span className="text-sm font-bold">Lvl {level} Alien</span>
            </div>
          </div>
          
          <div className="bg-indigo-600/50 px-3 py-1 rounded-full border border-indigo-400/30 flex items-center gap-2">
            <span className="text-yellow-400 text-lg">🪙</span>
            <span className="font-title text-lg">{coins}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pointer-events-auto">
          <ProgressBar value={stats.hunger} color="bg-orange-400" icon="🍗" />
          <ProgressBar value={stats.energy} color="bg-yellow-400" icon="⚡" />
          <ProgressBar value={stats.happiness} color="bg-pink-400" icon="❤️" />
          <ProgressBar value={stats.hygiene} color="bg-blue-400" icon="🧼" />
        </div>
      </div>
    </div>
  );
};
