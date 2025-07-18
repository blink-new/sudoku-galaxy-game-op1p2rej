import React from 'react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

interface NumberInputProps {
  onNumberClick: (number: number) => void;
  onClear: () => void;
  isNotesMode: boolean;
  selectedCell: [number, number] | null;
}

export function NumberInput({ onNumberClick, onClear, isNotesMode, selectedCell }: NumberInputProps) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
        {numbers.map(number => (
          <Button
            key={number}
            variant="outline"
            size="sm"
            className={cn(
              'number-input text-sm font-bold h-10 w-10',
              'bg-slate-700 border-slate-600 hover:bg-slate-600',
              'text-white hover:text-white',
              {
                'bg-indigo-600 hover:bg-indigo-500': isNotesMode,
              }
            )}
            onClick={() => onNumberClick(number)}
            disabled={!selectedCell}
          >
            {number}
          </Button>
        ))}
      </div>
      
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          className="bg-red-600 hover:bg-red-500 border-red-500 text-white hover:text-white px-6 text-xs"
          onClick={onClear}
          disabled={!selectedCell}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}