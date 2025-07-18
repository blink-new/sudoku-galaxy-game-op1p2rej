import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Lightbulb, 
  Undo2, 
  Redo2, 
  RotateCcw, 
  Edit3, 
  Timer,
  Star,
  Volume2,
  VolumeX,
  Zap,
  Home
} from 'lucide-react';
import { cn } from '../lib/utils';
import type { Difficulty } from '../types/sudoku';

interface GameControlsProps {
  timer: number;
  hintsUsed: number;
  maxHints: number;
  points: number;
  difficulty: Difficulty;
  isNotesMode: boolean;
  canUndo: boolean;
  canRedo: boolean;
  soundEnabled: boolean;
  onHint: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  onToggleNotes: () => void;
  onToggleSound: () => void;
  onAutoSolve: () => void;
  onGoHome: () => void;
}

export function GameControls({
  timer,
  hintsUsed,
  maxHints,
  points,
  difficulty,
  isNotesMode,
  canUndo,
  canRedo,
  soundEnabled,
  onHint,
  onUndo,
  onRedo,
  onReset,
  onToggleNotes,
  onToggleSound,
  onAutoSolve,
  onGoHome
}: GameControlsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyBadgeColor = (diff: Difficulty) => {
    switch (diff) {
      case 'easy': return 'bg-green-600';
      case 'medium': return 'bg-yellow-600';
      case 'hard': return 'bg-red-600';
    }
  };

  return (
    <div className="space-y-4">
      {/* Stats Row */}
      <div className="flex items-center justify-between text-xs">
        <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1">
          <Timer className="w-3 h-3" />
          {formatTime(timer)}
        </Badge>
        
        <Badge className={cn("flex items-center gap-1 px-2 py-1 text-white capitalize", getDifficultyBadgeColor(difficulty))}>
          {difficulty}
        </Badge>
        
        <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1">
          <Star className="w-3 h-3 text-yellow-500" />
          {points}
        </Badge>
        
        <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1">
          <Lightbulb className="w-3 h-3 text-yellow-500" />
          {maxHints - hintsUsed}
        </Badge>
      </div>

      {/* Main Controls - Two Rows */}
      <div className="space-y-2">
        {/* First Row */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'flex items-center gap-1 text-xs px-3',
              isNotesMode ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'border-slate-600'
            )}
            onClick={onToggleNotes}
          >
            <Edit3 className="w-3 h-3" />
            Notes
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 border-slate-600 text-xs px-3"
            onClick={onHint}
            disabled={hintsUsed >= maxHints}
          >
            <Lightbulb className="w-3 h-3" />
            Hint
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 border-slate-600 text-xs px-3"
            onClick={onUndo}
            disabled={!canUndo}
          >
            <Undo2 className="w-3 h-3" />
            Undo
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 border-slate-600 text-xs px-3"
            onClick={onRedo}
            disabled={!canRedo}
          >
            <Redo2 className="w-3 h-3" />
            Redo
          </Button>
        </div>

        {/* Second Row */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 border-slate-600 text-xs px-3"
            onClick={onGoHome}
          >
            <Home className="w-3 h-3" />
            Home
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white text-xs px-3"
            onClick={onAutoSolve}
          >
            <Zap className="w-3 h-3" />
            Auto-Solve
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="border-slate-600 px-2"
            onClick={onToggleSound}
          >
            {soundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white px-2"
            onClick={onReset}
          >
            <RotateCcw className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}