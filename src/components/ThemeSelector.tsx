import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Check, Lock, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import type { Theme, Cosmetic, Difficulty } from '../types/sudoku';

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  cosmetics: Cosmetic[];
  currentTheme: Theme;
  difficulty: Difficulty;
  onStartGame: (theme: Theme) => void;
  onApplyTheme: (themeId: Theme) => void;
}

export function ThemeSelector({
  isOpen,
  onClose,
  cosmetics,
  currentTheme,
  difficulty,
  onStartGame,
  onApplyTheme
}: ThemeSelectorProps) {
  const getThemePreview = (theme: Theme) => {
    switch (theme) {
      case 'space':
        return 'bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900';
      case 'nature':
        return 'bg-gradient-to-br from-green-800 via-emerald-700 to-teal-800';
      case 'cyberpunk':
        return 'bg-gradient-to-br from-cyan-900 via-blue-900 to-slate-900';
    }
  };

  const getDifficultyInfo = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'easy':
        return { icon: '🌱', color: 'text-green-400' };
      case 'medium':
        return { icon: '⚡', color: 'text-yellow-400' };
      case 'hard':
        return { icon: '🔥', color: 'text-red-400' };
    }
  };

  const difficultyInfo = getDifficultyInfo(difficulty);

  const handleStartWithTheme = (theme: Theme) => {
    if (theme !== currentTheme) {
      onApplyTheme(theme);
    }
    onStartGame(theme);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-400" />
            Choose Your Theme
          </DialogTitle>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-lg">{difficultyInfo.icon}</span>
            <span className={`font-medium capitalize ${difficultyInfo.color}`}>
              {difficulty} Difficulty
            </span>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {cosmetics.map(cosmetic => (
            <Card 
              key={cosmetic.id} 
              className={cn(
                'bg-slate-800 border-slate-700 transition-all duration-300 cursor-pointer hover:border-slate-500',
                currentTheme === cosmetic.id && 'ring-2 ring-indigo-500',
                !cosmetic.unlocked && 'opacity-60'
              )}
              onClick={() => cosmetic.unlocked && handleStartWithTheme(cosmetic.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-white">{cosmetic.name}</CardTitle>
                  {currentTheme === cosmetic.id && (
                    <Badge className="bg-indigo-600">
                      <Check className="w-3 h-3 mr-1" />
                      Current
                    </Badge>
                  )}
                  {!cosmetic.unlocked && (
                    <Badge variant="secondary" className="bg-slate-700">
                      <Lock className="w-3 h-3 mr-1" />
                      Locked
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-slate-400 text-sm">
                  {cosmetic.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Theme Preview */}
                <div className={cn(
                  'h-20 rounded-lg p-3 flex items-center justify-center',
                  getThemePreview(cosmetic.id)
                )}>
                  <div className="grid grid-cols-3 gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                      <div
                        key={num}
                        className={cn(
                          'w-5 h-5 rounded border flex items-center justify-center text-xs font-bold',
                          cosmetic.id === 'space' && 'border-indigo-400 text-indigo-200 bg-indigo-900/30',
                          cosmetic.id === 'nature' && 'border-green-400 text-green-200 bg-green-900/30',
                          cosmetic.id === 'cyberpunk' && 'border-cyan-400 text-cyan-200 bg-cyan-900/30'
                        )}
                      >
                        {num <= 3 ? num : ''}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                {cosmetic.unlocked ? (
                  <Button
                    className={cn(
                      'w-full',
                      currentTheme === cosmetic.id 
                        ? 'bg-indigo-600 hover:bg-indigo-500' 
                        : 'bg-slate-700 hover:bg-slate-600'
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartWithTheme(cosmetic.id);
                    }}
                  >
                    {currentTheme === cosmetic.id ? 'Start Game' : 'Select & Start'}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full border-slate-600 text-slate-500 cursor-not-allowed"
                    disabled
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Need {cosmetic.cost} coins
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-slate-600 text-slate-300 hover:text-white"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}