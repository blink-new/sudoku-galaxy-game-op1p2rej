import { useState, useEffect } from 'react';
import type { GameStats, Theme, Difficulty, Cosmetic } from '../types/sudoku';

const INITIAL_STATS: GameStats = {
  coins: 50, // Start with some coins
  gamesCompleted: 0,
  totalTime: 0,
  bestTimes: {
    easy: Infinity,
    medium: Infinity,
    hard: Infinity
  },
  unlockedCosmetics: ['space'], // Space theme is free
  currentTheme: 'space'
};

const COSMETICS: Cosmetic[] = [
  {
    id: 'space',
    name: 'Space Galaxy',
    description: 'Journey through the cosmos with twinkling stars and constellation numbers',
    cost: 0,
    unlocked: true,
    preview: 'Galaxy background with cosmic effects'
  },
  {
    id: 'nature',
    name: 'Nature Vines',
    description: 'Embrace the earth with organic borders and handwritten numbers',
    cost: 100,
    unlocked: false,
    preview: 'Organic theme with vine decorations'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    description: 'Enter the digital realm with glowing circuits and neon effects',
    cost: 150,
    unlocked: false,
    preview: 'Futuristic theme with neon highlights'
  },
  {
    id: 'clouds',
    name: 'Sky Clouds',
    description: 'Float among the clouds with dreamy sky blue aesthetics',
    cost: 300,
    unlocked: false,
    preview: 'Soft cloud backgrounds with sky blue palette'
  },
  {
    id: 'inferno',
    name: 'Inferno Blaze',
    description: 'Feel the heat with blazing fire backgrounds and molten effects',
    cost: 500,
    unlocked: false,
    preview: 'Fiery theme with red-orange gradients'
  },
  {
    id: 'dubai',
    name: 'Dubai Gold',
    description: 'Experience luxury with golden desert aesthetics and Arabian elements',
    cost: 800,
    unlocked: false,
    preview: 'Golden theme with luxury accents'
  },
  {
    id: 'bahrain',
    name: 'Bahrain Pearl',
    description: 'Dive into tradition with pearl-inspired design and Gulf patterns',
    cost: 1000,
    unlocked: false,
    preview: 'Traditional Gulf theme with red and white colors'
  },
  {
    id: 'mars',
    name: 'Mars Explorer',
    description: 'Explore the red planet with Martian landscapes and space exploration vibes',
    cost: 2000,
    unlocked: false,
    preview: 'Red planet theme with space exploration elements'
  }
];

export function useGameStats() {
  const [stats, setStats] = useState<GameStats>(INITIAL_STATS);
  const [cosmetics, setCosmetics] = useState<Cosmetic[]>(COSMETICS);

  // Load stats from localStorage on mount
  useEffect(() => {
    const savedStats = localStorage.getItem('sudoku-galaxy-stats');
    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats);
        setStats(parsed);
        
        // Update cosmetics unlock status
        setCosmetics(prev => prev.map(cosmetic => ({
          ...cosmetic,
          unlocked: parsed.unlockedCosmetics.includes(cosmetic.id)
        })));
      } catch (error) {
        console.error('Failed to load stats:', error);
      }
    }
  }, []);

  // Save stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('sudoku-galaxy-stats', JSON.stringify(stats));
  }, [stats]);

  const completeGame = (difficulty: Difficulty, time: number) => {
    const coinsEarned = getCoinsForDifficulty(difficulty);
    
    setStats(prev => ({
      ...prev,
      coins: prev.coins + coinsEarned,
      gamesCompleted: prev.gamesCompleted + 1,
      totalTime: prev.totalTime + time,
      bestTimes: {
        ...prev.bestTimes,
        [difficulty]: Math.min(prev.bestTimes[difficulty], time)
      }
    }));

    return coinsEarned;
  };

  const purchaseCosmetic = (themeId: Theme) => {
    const cosmetic = cosmetics.find(c => c.id === themeId);
    if (!cosmetic || cosmetic.unlocked || stats.coins < cosmetic.cost) {
      return false;
    }

    setStats(prev => ({
      ...prev,
      coins: prev.coins - cosmetic.cost,
      unlockedCosmetics: [...prev.unlockedCosmetics, themeId]
    }));

    setCosmetics(prev => prev.map(c => 
      c.id === themeId ? { ...c, unlocked: true } : c
    ));

    return true;
  };

  const applyTheme = (themeId: Theme) => {
    if (!stats.unlockedCosmetics.includes(themeId)) {
      return false;
    }

    setStats(prev => ({
      ...prev,
      currentTheme: themeId
    }));

    return true;
  };

  const getCoinsForDifficulty = (difficulty: Difficulty): number => {
    switch (difficulty) {
      case 'easy': return 20;
      case 'medium': return 50;
      case 'hard': return 100;
      default: return 20;
    }
  };

  return {
    stats,
    cosmetics,
    completeGame,
    purchaseCosmetic,
    applyTheme
  };
}