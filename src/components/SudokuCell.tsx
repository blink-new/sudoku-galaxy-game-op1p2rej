import React from 'react';
import { cn } from '../lib/utils';
import type { CellValue, Notes, Theme, CellValidation } from '../types/sudoku';

interface SudokuCellProps {
  value: CellValue;
  notes: Notes;
  row: number;
  col: number;
  isSelected: boolean;
  isRelated: boolean;
  isDuplicate: boolean;
  isGiven: boolean;
  theme: Theme;
  validation: CellValidation;
  onClick: () => void;
}

export function SudokuCell({
  value,
  notes,
  row,
  col,
  isSelected,
  isRelated,
  isDuplicate,
  isGiven,
  theme,
  validation,
  onClick
}: SudokuCellProps) {
  const cellClasses = cn(
    'sudoku-cell',
    `theme-${theme}`,
    'w-10 h-10 cursor-pointer',
    'flex items-center justify-center relative',
    'transition-all duration-200 hover:bg-opacity-80',
    {
      'unsolved': value === null, // Add unsolved class for empty cells
      'cell-highlight': isSelected,
      'cell-related': isRelated && !isSelected,
      'cell-duplicate': isDuplicate,
      'bg-slate-700': isGiven && !isSelected && !isRelated,
      'bg-blue-500/20': validation.isCorrect && !validation.showFeedback, // Subtle blue for correct answers
      'bg-green-500/30 border-green-400': validation.showFeedback && validation.isCorrect,
      'bg-red-500/30 border-red-400': validation.showFeedback && validation.isIncorrect,
      'animate-pulse': validation.showFeedback,
    }
  );

  const numberClasses = cn(
    'sudoku-number number-input',
    'text-sm font-bold select-none',
    {
      'text-slate-300': isGiven,
      'text-white': !isGiven,
    }
  );

  const notesArray = Array.from(notes).sort();

  return (
    <div className={cellClasses} onClick={onClick}>
      {value ? (
        <span className={numberClasses}>{value}</span>
      ) : notes.size > 0 ? (
        <div className="grid grid-cols-3 gap-0 w-full h-full p-0.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <div
              key={num}
              className="flex items-center justify-center text-xs notes-text text-slate-400"
              style={{ fontSize: '8px' }}
            >
              {notes.has(num) ? num : ''}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}