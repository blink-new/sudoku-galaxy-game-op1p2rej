import React from 'react';
import { SudokuCell } from './SudokuCell';
import { getRelatedCells } from '../utils/sudokuGenerator';
import { cn } from '../lib/utils';
import type { SudokuGrid as GridType, NotesGrid, Theme, CellValidation, CompletionAnimation } from '../types/sudoku';

interface SudokuGridProps {
  grid: GridType;
  notes: NotesGrid;
  solution: GridType;
  selectedCell: [number, number] | null;
  duplicateCells: [number, number][];
  cellValidations: CellValidation[][];
  completionAnimations: CompletionAnimation[];
  theme: Theme;
  onCellClick: (row: number, col: number) => void;
}

export function SudokuGrid({
  grid,
  notes,
  solution,
  selectedCell,
  duplicateCells,
  cellValidations,
  completionAnimations,
  theme,
  onCellClick
}: SudokuGridProps) {
  const relatedCells = selectedCell ? getRelatedCells(selectedCell[0], selectedCell[1]) : [];
  
  const isRelated = (row: number, col: number) => {
    return relatedCells.some(([r, c]) => r === row && c === col);
  };

  const isDuplicate = (row: number, col: number) => {
    return duplicateCells.some(([r, c]) => r === row && c === col);
  };

  const isGiven = (row: number, col: number) => {
    return solution[row][col] !== null && grid[row][col] === solution[row][col];
  };

  const isInCompletionAnimation = (row: number, col: number) => {
    return completionAnimations.some(anim => {
      if (anim.type === 'row') {
        return anim.index === row;
      } else if (anim.type === 'column') {
        return anim.index === col;
      } else if (anim.type === 'box') {
        const boxRow = Math.floor(anim.index / 3) * 3;
        const boxCol = (anim.index % 3) * 3;
        return row >= boxRow && row < boxRow + 3 && col >= boxCol && col < boxCol + 3;
      }
      return false;
    });
  };

  const getCellBorderClasses = (row: number, col: number) => {
    const classes = [];
    
    // Top border for first row and every 3rd row
    if (row === 0 || row % 3 === 0) {
      classes.push('border-t-2 border-slate-400');
    } else {
      classes.push('border-t border-slate-600');
    }
    
    // Bottom border for last row and before every 3rd row
    if (row === 8 || (row + 1) % 3 === 0) {
      classes.push('border-b-2 border-slate-400');
    } else {
      classes.push('border-b border-slate-600');
    }
    
    // Left border for first column and every 3rd column
    if (col === 0 || col % 3 === 0) {
      classes.push('border-l-2 border-slate-400');
    } else {
      classes.push('border-l border-slate-600');
    }
    
    // Right border for last column and before every 3rd column
    if (col === 8 || (col + 1) % 3 === 0) {
      classes.push('border-r-2 border-slate-400');
    } else {
      classes.push('border-r border-slate-600');
    }
    
    return classes.join(' ');
  };

  return (
    <div className="sudoku-grid inline-block bg-slate-800 p-2 rounded-lg shadow-2xl">
      <div className="grid grid-cols-9">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cn(
                getCellBorderClasses(rowIndex, colIndex),
                {
                  'animate-pulse bg-blue-400/30 border-blue-400': isInCompletionAnimation(rowIndex, colIndex)
                }
              )}
            >
              <SudokuCell
                value={cell}
                notes={notes[rowIndex][colIndex]}
                row={rowIndex}
                col={colIndex}
                isSelected={selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex}
                isRelated={isRelated(rowIndex, colIndex)}
                isDuplicate={isDuplicate(rowIndex, colIndex)}
                isGiven={isGiven(rowIndex, colIndex)}
                validation={cellValidations[rowIndex][colIndex]}
                theme={theme}
                onClick={() => onCellClick(rowIndex, colIndex)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}