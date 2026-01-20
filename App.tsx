
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PetMood, GameState, PetStats, InventoryItem } from './types';
import { INITIAL_STATS, DECAY_RATES, FOOD_ITEMS, HATS } from './constants';
import { StatusBar } from './components/StatusBar';
import { PetCharacter } from './components/PetCharacter';
import { MiniGame } from './components/MiniGame';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('bloop_save');
    if (saved) return JSON.parse(saved);
    return {
      stats: INITIAL_STATS,
      coins: 100,
      level: 1,
      experience: 0,
      isSleeping: false,
      isWashing: false,
      lastUpdate: Date.now()
    };
  });

  const [mood, setMood] = useState<PetMood>(PetMood.HAPPY);
  const [activeMenu, setActiveMenu] = useState<'none' | 'food' | 'store'>('none');
  const [showGame, setShowGame] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // Audio context for pitch shifted repetition
  const recognitionRef = useRef<any>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('bloop_save', JSON.stringify(gameState));
  }, [gameState]);

  // Game Loop - Decay stats
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        if (prev.isSleeping) {
          return {
            ...prev,
            stats: {
              ...prev.stats,
              energy: Math.min(100, prev.stats.energy + 5),
              hunger: Math.max(0, prev.stats.hunger - 0.5),
            }
          };
        }

        const newStats = {
          hunger: Math.max(0, prev.stats.hunger - (DECAY_RATES.hunger / 60)),
          energy: Math.max(0, prev.stats.energy - (DECAY_RATES.energy / 60)),
          happiness: Math.max(0, prev.stats.happiness - (DECAY_RATES.happiness / 60)),
          hygiene: Math.max(0, prev.stats.hygiene - (DECAY_RATES.hygiene / 60)),
        };

        return { ...prev, stats: newStats };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Mood determination
  useEffect(() => {
    if (gameState.isSleeping) return;
    if (gameState.isWashing) {
      setMood(PetMood.WASHING);
      return;
    }

    const { hunger, energy, happiness, hygiene } = gameState.stats;
    if (hunger < 20 || energy < 20) setMood(PetMood.SAD);
    else if (hygiene < 20) setMood(PetMood.ANGRY);
    else if (energy < 40) setMood(PetMood.SLEEPY);
    else if (isListening) setMood(PetMood.LISTENING);
    else setMood(PetMood.HAPPY);
  }, [gameState.stats, gameState.isSleeping, gameState.isWashing, isListening]);

  // Talking logic using Web Speech API
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      repeatBack(transcript);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const repeatBack = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    // Bloop's high pitched alien voice
    utterance.pitch = 2.0; 
    utterance.rate = 1.2;
    window.speechSynthesis.speak(utterance);
  };

  const handleFeed = (item: InventoryItem) => {
    if (gameState.coins < item.cost) return;
    setGameState(prev => ({
      ...prev,
      coins: prev.coins - item.cost,
      stats: {
        ...prev.stats,
        hunger: Math.min(100, prev.stats.hunger + (item.effect?.hunger || 0)),
        happiness: Math.min(100, prev.stats.happiness + (item.effect?.happiness || 0)),
      }
    }));
    setMood(PetMood.EATING);
    setTimeout(() => setMood(PetMood.HAPPY), 2000);
  };

  const toggleSleep = () => {
    setGameState(prev => ({ ...prev, isSleeping: !prev.isSleeping }));
  };

  const startWash = () => {
    if (gameState.isWashing) return;
    setGameState(prev => ({ ...prev, isWashing: true }));
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        isWashing: false,
        stats: { ...prev.stats, hygiene: 100 }
      }));
    }, 3000);
  };

  const onGameFinished = (earnedCoins: number) => {
    setGameState(prev => ({
      ...prev,
      coins: prev.coins + earnedCoins,
      experience: prev.experience + (earnedCoins * 2),
      level: Math.floor((prev.experience + earnedCoins * 2) / 100) + 1,
      stats: {
        ...prev.stats,
        energy: Math.max(0, prev.stats.energy - 10),
        happiness: Math.min(100, prev.stats.happiness + 20)
      }
    }));
    setShowGame(false);
  };

  return (
    <div className={`min-h-screen relative transition-colors duration-1000 overflow-hidden ${gameState.isSleeping ? 'bg-indigo-950' : 'bg-gradient-to-b from-indigo-800 to-purple-900'}`}>
      <StatusBar stats={gameState.stats} coins={gameState.coins} level={gameState.level} />

      {/* Main Play Area */}
      <div className="h-screen flex flex-col items-center justify-center pb-32">
        <PetCharacter 
          mood={mood} 
          isSleeping={gameState.isSleeping} 
          isWashing={gameState.isWashing}
          onClick={startListening}
        />
        
        {!gameState.isSleeping && (
          <div className="mt-8 bg-white/10 backdrop-blur px-6 py-2 rounded-full border border-white/20 animate-bounce cursor-pointer"
               onClick={startListening}>
            <span className="text-sm font-bold uppercase tracking-widest">
              {isListening ? "Listening..." : "Tap Bloop to talk!"}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-6 flex justify-around items-end bg-gradient-to-t from-black/50 to-transparent">
        <ActionButton icon="🍎" label="Feed" active={activeMenu === 'food'} onClick={() => setActiveMenu(activeMenu === 'food' ? 'none' : 'food')} />
        <ActionButton icon="🚿" label="Wash" onClick={startWash} disabled={gameState.isWashing} />
        <ActionButton icon="🎮" label="Play" onClick={() => setShowGame(true)} />
        <ActionButton icon={gameState.isSleeping ? "☀️" : "🌙"} label={gameState.isSleeping ? "Wake" : "Sleep"} onClick={toggleSleep} />
        <ActionButton icon="🛒" label="Store" active={activeMenu === 'store'} onClick={() => setActiveMenu(activeMenu === 'store' ? 'none' : 'store')} />
      </div>

      {/* Menus */}
      {activeMenu === 'food' && (
        <MenuOverlay title="Cosmic Kitchen" onClose={() => setActiveMenu('none')}>
          <div className="grid grid-cols-2 gap-3">
            {FOOD_ITEMS.map(item => (
              <button key={item.id} 
                      onClick={() => handleFeed(item)}
                      disabled={gameState.coins < item.cost}
                      className="bg-indigo-800/50 p-4 rounded-2xl border border-indigo-400/30 flex flex-col items-center gap-2 active:scale-95 disabled:opacity-50 transition-all">
                <span className="text-3xl">{item.name.split(' ')[0]}</span>
                <span className="text-xs font-bold">{item.name.split(' ').slice(1).join(' ')}</span>
                <span className="text-yellow-400 font-title">🪙 {item.cost}</span>
              </button>
            ))}
          </div>
        </MenuOverlay>
      )}

      {activeMenu === 'store' && (
        <MenuOverlay title="Alien Boutique" onClose={() => setActiveMenu('none')}>
          <div className="grid grid-cols-1 gap-3">
            {HATS.map(item => (
              <button key={item.id} 
                      disabled={gameState.coins < item.cost}
                      className="bg-indigo-800/50 p-4 rounded-2xl border border-indigo-400/30 flex justify-between items-center active:scale-95 disabled:opacity-50 transition-all">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{item.name.split(' ')[0]}</span>
                  <span className="font-bold">{item.name.split(' ').slice(1).join(' ')}</span>
                </div>
                <span className="text-yellow-400 font-title">🪙 {item.cost}</span>
              </button>
            ))}
          </div>
          <p className="text-center text-white/40 text-xs mt-4 italic">Accessories coming soon in the next nebula update!</p>
        </MenuOverlay>
      )}

      {showGame && <MiniGame onClose={onGameFinished} />}
    </div>
  );
};

const ActionButton: React.FC<{ icon: string; label: string; onClick: () => void; active?: boolean; disabled?: boolean }> = ({ icon, label, onClick, active, disabled }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`flex flex-col items-center gap-1 transition-all ${active ? 'scale-125 mb-4' : 'hover:scale-110'} ${disabled ? 'opacity-50 grayscale' : ''}`}
  >
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg border-2 ${active ? 'bg-indigo-500 border-white' : 'bg-white/20 border-white/20 backdrop-blur'}`}>
      {icon}
    </div>
    <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
  </button>
);

const MenuOverlay: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
    <div className="w-full max-w-md bg-indigo-900 rounded-t-3xl sm:rounded-3xl p-6 border-t-4 sm:border-4 border-indigo-400 shadow-2xl animate-slide-up">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-title text-2xl text-yellow-400">{title}</h3>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold">✕</button>
      </div>
      {children}
    </div>
  </div>
);

export default App;
