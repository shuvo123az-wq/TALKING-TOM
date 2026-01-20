
import React from 'react';
import { PetMood } from '../types';

interface PetCharacterProps {
  mood: PetMood;
  isSleeping: boolean;
  isWashing: boolean;
  onClick: () => void;
}

export const PetCharacter: React.FC<PetCharacterProps> = ({ mood, isSleeping, isWashing, onClick }) => {
  const getEyeExpression = () => {
    if (isSleeping) return (
      <g className="translate-y-2">
        <path d="M 35 55 Q 42 50 50 55" stroke="black" strokeWidth="3" fill="none" />
        <path d="M 70 55 Q 78 50 85 55" stroke="black" strokeWidth="3" fill="none" />
      </g>
    );
    
    switch (mood) {
      case PetMood.ANGRY:
        return (
          <g>
            <path d="M 35 45 L 50 55" stroke="black" strokeWidth="4" />
            <path d="M 85 45 L 70 55" stroke="black" strokeWidth="4" />
            <circle cx="42" cy="58" r="4" fill="black" />
            <circle cx="78" cy="58" r="4" fill="black" />
          </g>
        );
      case PetMood.SAD:
        return (
          <g>
            <circle cx="42" cy="58" r="6" fill="black" />
            <circle cx="78" cy="58" r="6" fill="black" />
            <path d="M 38 65 Q 32 70 38 75" stroke="blue" strokeWidth="2" className="animate-pulse" />
          </g>
        );
      case PetMood.LISTENING:
        return (
          <g>
            <circle cx="42" cy="58" r="8" fill="black">
              <animate attributeName="r" values="8;10;8" dur="1s" repeatCount="indefinite" />
            </circle>
            <circle cx="78" cy="58" r="8" fill="black">
              <animate attributeName="r" values="8;10;8" dur="1s" repeatCount="indefinite" />
            </circle>
          </g>
        );
      default:
        return (
          <g>
            <circle cx="42" cy="58" r="7" fill="black" />
            <circle cx="78" cy="58" r="7" fill="black" />
            <circle cx="40" cy="56" r="2" fill="white" />
            <circle cx="76" cy="56" r="2" fill="white" />
          </g>
        );
    }
  };

  const getMouthExpression = () => {
    if (isSleeping) return <path d="M 55 80 Q 60 85 65 80" stroke="black" strokeWidth="2" fill="none" />;
    
    switch (mood) {
      case PetMood.HAPPY:
      case PetMood.WASHING:
        return <path d="M 45 78 Q 60 92 75 78" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />;
      case PetMood.SAD:
      case PetMood.ANGRY:
        return <path d="M 50 85 Q 60 75 70 85" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />;
      case PetMood.EATING:
        return <circle cx="60" cy="82" r="7" fill="black"><animate attributeName="r" values="7;3;7" dur="0.4s" repeatCount="indefinite" /></circle>;
      case PetMood.LISTENING:
        return <rect x="56" y="80" width="8" height="3" rx="1.5" fill="black" />;
      default:
        return <path d="M 55 82 L 65 82" stroke="black" strokeWidth="2" strokeLinecap="round" />;
    }
  };

  return (
    <div className="relative w-64 h-64 cursor-pointer select-none" onClick={onClick}>
      {isWashing && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className="absolute bg-white/60 rounded-full animate-pulse border border-white"
              style={{
                width: Math.random() * 20 + 10 + 'px',
                height: Math.random() * 20 + 10 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: i * 0.2 + 's'
              }}
            />
          ))}
        </div>
      )}
      
      {isSleeping && (
        <div className="absolute -right-4 top-0 font-title text-3xl text-white/50 animate-bounce">
          Zzz
        </div>
      )}

      <svg viewBox="0 0 120 120" className={`w-full h-full drop-shadow-2xl transition-transform duration-300 ${isSleeping ? 'opacity-80 scale-95 translate-y-4' : 'animate-bounce-slow'}`}>
        {/* Cat Tail */}
        <path 
          d="M 100 100 Q 130 80 110 50" 
          stroke={isWashing ? "#93C5FD" : "#4F46E5"} 
          strokeWidth="8" 
          fill="none" 
          strokeLinecap="round"
          className={mood === PetMood.HAPPY ? 'animate-wobble' : ''}
        />

        {/* Cat Body/Face Base */}
        <path 
          d="M 60 20 Q 100 20 100 65 Q 100 110 60 110 Q 20 110 20 65 Q 20 20 60 20" 
          fill={isWashing ? "#93C5FD" : "#4F46E5"} 
          className="transition-colors duration-1000"
        />
        
        {/* Cat Ears */}
        <path 
          d="M 30 25 L 20 0 L 50 22 Z" 
          fill={isWashing ? "#93C5FD" : "#4F46E5"} 
          className={mood === PetMood.LISTENING ? 'animate-pulse' : ''}
        />
        <path 
          d="M 90 25 L 100 0 L 70 22 Z" 
          fill={isWashing ? "#93C5FD" : "#4F46E5"} 
          className={mood === PetMood.LISTENING ? 'animate-pulse' : ''}
        />

        {/* Nose */}
        <path d="M 57 72 L 63 72 L 60 76 Z" fill="#FF9999" />

        {/* Whiskers */}
        <g stroke="white" strokeWidth="1" opacity="0.6">
          <line x1="25" y1="75" x2="10" y2="72" />
          <line x1="25" y1="80" x2="10" y2="82" />
          <line x1="95" y1="75" x2="110" y2="72" />
          <line x1="95" y1="80" x2="110" y2="82" />
        </g>

        {/* Face Elements */}
        {getEyeExpression()}
        {getMouthExpression()}

        {/* Blush */}
        {mood === PetMood.HAPPY && !isSleeping && (
          <g opacity="0.4">
            <circle cx="35" cy="75" r="4" fill="#F87171" />
            <circle cx="85" cy="75" r="4" fill="#F87171" />
          </g>
        )}
      </svg>
    </div>
  );
};
