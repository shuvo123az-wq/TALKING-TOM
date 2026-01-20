
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
        <path d="M 30 50 Q 40 45 50 50" stroke="black" strokeWidth="3" fill="none" />
        <path d="M 70 50 Q 80 45 90 50" stroke="black" strokeWidth="3" fill="none" />
      </g>
    );
    
    switch (mood) {
      case PetMood.ANGRY:
        return (
          <g>
            <path d="M 30 40 L 50 50" stroke="black" strokeWidth="4" />
            <path d="M 90 40 L 70 50" stroke="black" strokeWidth="4" />
            <circle cx="40" cy="55" r="4" fill="black" />
            <circle cx="80" cy="55" r="4" fill="black" />
          </g>
        );
      case PetMood.SAD:
        return (
          <g>
            <circle cx="40" cy="55" r="6" fill="black" />
            <circle cx="80" cy="55" r="6" fill="black" />
            <path d="M 35 60 Q 30 65 35 70" stroke="blue" strokeWidth="2" className="animate-pulse" />
          </g>
        );
      case PetMood.LISTENING:
        return (
          <g>
            <circle cx="40" cy="55" r="8" fill="black">
              <animate attributeName="r" values="8;10;8" dur="1s" repeatCount="indefinite" />
            </circle>
            <circle cx="80" cy="55" r="8" fill="black">
              <animate attributeName="r" values="8;10;8" dur="1s" repeatCount="indefinite" />
            </circle>
          </g>
        );
      default:
        return (
          <g>
            <circle cx="40" cy="55" r="7" fill="black" />
            <circle cx="80" cy="55" r="7" fill="black" />
            <circle cx="37" cy="52" r="2" fill="white" />
            <circle cx="77" cy="52" r="2" fill="white" />
          </g>
        );
    }
  };

  const getMouthExpression = () => {
    if (isSleeping) return <path d="M 50 75 Q 60 80 70 75" stroke="black" strokeWidth="2" fill="none" />;
    
    switch (mood) {
      case PetMood.HAPPY:
      case PetMood.WASHING:
        return <path d="M 40 75 Q 60 90 80 75" stroke="black" strokeWidth="4" fill="none" strokeLinecap="round" />;
      case PetMood.SAD:
      case PetMood.ANGRY:
        return <path d="M 40 85 Q 60 70 80 85" stroke="black" strokeWidth="4" fill="none" strokeLinecap="round" />;
      case PetMood.EATING:
        return <circle cx="60" cy="80" r="8" fill="black"><animate attributeName="r" values="8;4;8" dur="0.4s" repeatCount="indefinite" /></circle>;
      case PetMood.LISTENING:
        return <rect x="55" y="78" width="10" height="4" rx="2" fill="black" />;
      default:
        return <path d="M 50 80 L 70 80" stroke="black" strokeWidth="3" strokeLinecap="round" />;
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
        {/* Blob Body */}
        <path 
          d="M 60 10 Q 110 10 110 60 Q 110 110 60 110 Q 10 110 10 60 Q 10 10 60 10" 
          fill={isWashing ? "#93C5FD" : "#4F46E5"} 
          className="transition-colors duration-1000"
        />
        
        {/* Antenna */}
        <line x1="60" y1="10" x2="60" y2="-10" stroke={isWashing ? "#93C5FD" : "#4F46E5"} strokeWidth="4" />
        <circle cx="60" cy="-15" r="5" fill="#FACC15" className={mood === PetMood.LISTENING ? 'animate-ping' : ''} />

        {/* Face Elements */}
        {getEyeExpression()}
        {getMouthExpression()}

        {/* Blush */}
        {mood === PetMood.HAPPY && !isSleeping && (
          <g opacity="0.4">
            <circle cx="30" cy="70" r="5" fill="#F87171" />
            <circle cx="90" cy="70" r="5" fill="#F87171" />
          </g>
        )}
      </svg>
    </div>
  );
};
