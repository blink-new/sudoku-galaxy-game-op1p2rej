import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Sparkles, Star, Trophy, Clock, ShoppingBag, Palette } from 'lucide-react';
import type { Difficulty, GameStats } from '../types/sudoku';

interface HomePageProps {
  stats: GameStats;
  onStartGame: (difficulty: Difficulty) => void;
  onOpenShop: () => void;
}

export function HomePage({ stats, onStartGame, onOpenShop }: HomePageProps) {
  const getDifficultyInfo = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'easy':
        return {
          color: 'bg-green-600 hover:bg-green-500',
          description: 'Perfect for beginners',
          cells: '45-50 filled cells',
          icon: '🌱'
        };
      case 'medium':
        return {
          color: 'bg-yellow-600 hover:bg-yellow-500',
          description: 'Balanced challenge',
          cells: '35-40 filled cells',
          icon: '⚡'
        };
      case 'hard':
        return {
          color: 'bg-red-600 hover:bg-red-500',
          description: 'For puzzle masters',
          cells: '25-30 filled cells',
          icon: '🔥'
        };
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds === 0) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`min-h-screen space-bg theme-${stats.currentTheme}`}>
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10"></div> {/* Spacer */}
            <div className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-indigo-400" />
              <h1 className="text-3xl font-bold text-white">Sudoku Galaxy</h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenShop}
              className="flex items-center gap-2 border-slate-600 text-slate-300 hover:text-white"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Shop</span>
            </Button>
          </div>
          <p className="text-slate-300">Choose your cosmic challenge</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <Card className="bg-slate-800/50 border-slate-600">
            <CardContent className="p-3 text-center">
              <div className="text-yellow-500 text-lg font-bold">💰 {stats.coins}</div>
              <div className="text-xs text-slate-400">Coins</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-600">
            <CardContent className="p-3 text-center">
              <div className="text-indigo-400 text-lg font-bold flex items-center justify-center gap-1">
                <Trophy className="w-4 h-4" />
                {stats.gamesCompleted}
              </div>
              <div className="text-xs text-slate-400">Completed</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-600">
            <CardContent className="p-3 text-center">
              <div className="text-green-400 text-lg font-bold flex items-center justify-center gap-1">
                <Clock className="w-4 h-4" />
                {formatTime(stats.bestTimes.easy || 0)}
              </div>
              <div className="text-xs text-slate-400">Best Time</div>
            </CardContent>
          </Card>
        </div>

        {/* Current Theme Display */}
        <Card className="bg-slate-800/50 border-slate-600 mb-8">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Palette className="w-5 h-5 text-indigo-400" />
                <div>
                  <div className="text-white font-medium">Current Theme</div>
                  <div className="text-slate-400 text-sm capitalize">{stats.currentTheme}</div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenShop}
                className="border-slate-600 text-slate-300 hover:text-white"
              >
                Change Theme
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Difficulty Selection */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-white text-center mb-4">Select Difficulty</h2>
          
          {(['easy', 'medium', 'hard'] as Difficulty[]).map(difficulty => {
            const info = getDifficultyInfo(difficulty);
            const bestTime = stats.bestTimes[difficulty];
            
            return (
              <Card key={difficulty} className="bg-slate-800/50 border-slate-600 hover:border-slate-500 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{info.icon}</div>
                      <div>
                        <CardTitle className="text-white capitalize text-lg">{difficulty}</CardTitle>
                        <CardDescription className="text-slate-400 text-sm">{info.description}</CardDescription>
                      </div>
                    </div>
                    {bestTime > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTime(bestTime)}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-400">{info.cells}</div>
                    <Button
                      className={`${info.color} text-white font-medium px-6`}
                      onClick={() => onStartGame(difficulty)}
                    >
                      Start Game
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Stats */}
        <Card className="bg-slate-800/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white text-center flex items-center justify-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-green-400 font-bold">{stats.bestTimes.easy > 0 ? formatTime(stats.bestTimes.easy) : '--:--'}</div>
                <div className="text-xs text-slate-400">Easy Best</div>
              </div>
              <div>
                <div className="text-yellow-400 font-bold">{stats.bestTimes.medium > 0 ? formatTime(stats.bestTimes.medium) : '--:--'}</div>
                <div className="text-xs text-slate-400">Medium Best</div>
              </div>
              <div>
                <div className="text-red-400 font-bold">{stats.bestTimes.hard > 0 ? formatTime(stats.bestTimes.hard) : '--:--'}</div>
                <div className="text-xs text-slate-400">Hard Best</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}