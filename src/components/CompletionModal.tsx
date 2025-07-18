import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Trophy, Timer, Coins, Zap } from 'lucide-react';
import type { Difficulty } from '../types/sudoku';

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewGame: () => void;
  timer: number;
  difficulty: Difficulty;
  coinsEarned: number;
  hintsUsed: number;
  maxHints: number;
}

export function CompletionModal({
  isOpen,
  onClose,
  onNewGame,
  timer,
  difficulty,
  coinsEarned,
  hintsUsed,
  maxHints
}: CompletionModalProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case 'easy': return 'bg-green-600';
      case 'medium': return 'bg-yellow-600';
      case 'hard': return 'bg-red-600';
    }
  };

  const getPerformanceMessage = () => {
    const hintsRatio = hintsUsed / maxHints;
    if (hintsRatio === 0) return "Perfect! No hints needed! 🌟";
    if (hintsRatio <= 0.33) return "Excellent work! 🎉";
    if (hintsRatio <= 0.66) return "Good job! 👏";
    return "Well done! 👍";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-white flex items-center justify-center gap-2">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Puzzle Complete!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Celebration Message */}
          <div className="text-center">
            <p className="text-lg text-slate-300 mb-2">
              {getPerformanceMessage()}
            </p>
            <p className="text-sm text-slate-400">
              You've successfully solved this {difficulty} puzzle!
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800 rounded-lg p-4 text-center">
              <Timer className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{formatTime(timer)}</div>
              <div className="text-xs text-slate-400">Time</div>
            </div>

            <div className="bg-slate-800 rounded-lg p-4 text-center">
              <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{maxHints - hintsUsed}</div>
              <div className="text-xs text-slate-400">Hints Left</div>
            </div>
          </div>

          {/* Rewards */}
          <div className="bg-gradient-to-r from-yellow-600/20 to-yellow-500/20 rounded-lg p-4 border border-yellow-500/30">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Coins className="w-6 h-6 text-yellow-500" />
              <span className="text-xl font-bold text-yellow-400">+{coinsEarned} Coins</span>
            </div>
            <p className="text-center text-sm text-slate-300">
              Earned for completing a {difficulty} puzzle!
            </p>
          </div>

          {/* Difficulty Badge */}
          <div className="flex justify-center">
            <Badge className={`${getDifficultyColor(difficulty)} text-white px-4 py-2 text-sm capitalize`}>
              {difficulty} Difficulty
            </Badge>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
              onClick={onClose}
            >
              View Board
            </Button>
            <Button
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white"
              onClick={onNewGame}
            >
              New Game
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}