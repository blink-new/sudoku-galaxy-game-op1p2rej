import { useState, useEffect, useCallback } from 'react';
import type { GameState, Move, Difficulty, SudokuGrid, Notes, CompletionAnimation } from '../types/sudoku';
import { generatePuzzle, isValidMove, isPuzzleComplete, getDuplicateCells, isRowComplete, isColumnComplete, isBoxComplete, getBoxIndex } from '../utils/sudokuGenerator';

const INITIAL_GAME_STATE: GameState = {
  grid: Array(9).fill(null).map(() => Array(9).fill(null)),
  notes: Array(9).fill(null).map(() => Array(9).fill(null).map(() => new Set())),
  solution: Array(9).fill(null).map(() => Array(9).fill(null)),
  selectedCell: null,
  isNotesMode: false,
  hintsUsed: 0,
  maxHints: 3,
  timer: 0,
  isComplete: false,
  difficulty: 'medium',
  cellValidations: Array(9).fill(null).map(() => Array(9).fill(null).map(() => ({ isCorrect: false, isIncorrect: false, showFeedback: false }))),
  completionAnimations: [],
  points: 0
};

export function useSudokuGame() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [redoHistory, setRedoHistory] = useState<Move[]>([]);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Timer effect
  useEffect(() => {
    if (!isTimerRunning || gameState.isComplete) return;

    const interval = setInterval(() => {
      setGameState(prev => ({ ...prev, timer: prev.timer + 1 }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, gameState.isComplete]);

  // Start new game
  const startNewGame = useCallback(async (difficulty: Difficulty) => {
    setIsGenerating(true);
    setIsTimerRunning(false);
    
    try {
      // Use setTimeout to allow UI to update with loading state
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const { puzzle, solution } = generatePuzzle(difficulty);
      
      setGameState({
        ...INITIAL_GAME_STATE,
        grid: puzzle,
        solution,
        difficulty,
        notes: Array(9).fill(null).map(() => Array(9).fill(null).map(() => new Set())),
        cellValidations: Array(9).fill(null).map(() => Array(9).fill(null).map(() => ({ isCorrect: false, isIncorrect: false, showFeedback: false }))),
        completionAnimations: [],
        points: 0
      });
      
      setMoveHistory([]);
      setRedoHistory([]);
      setIsTimerRunning(true);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Select cell
  const selectCell = useCallback((row: number, col: number) => {
    setGameState(prev => ({
      ...prev,
      selectedCell: [row, col]
    }));
  }, []);

  // Toggle notes mode
  const toggleNotesMode = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isNotesMode: !prev.isNotesMode
    }));
  }, []);

  // Make a move
  const makeMove = useCallback((row: number, col: number, value: number | null) => {
    setGameState(prev => {
      // Prevent moves on cells that already have the correct value
      if (prev.grid[row][col] === prev.solution[row][col] && prev.grid[row][col] !== null) {
        return prev; // Cell is locked with correct value
      }

      const newGrid = prev.grid.map(r => [...r]);
      const newNotes = prev.notes.map(r => r.map(c => new Set(c)));
      const newCellValidations = prev.cellValidations.map(r => r.map(c => ({ ...c })));
      
      const previousValue = prev.grid[row][col];
      const previousNotes = new Set(prev.notes[row][col]);
      let pointsEarned = 0;
      const newCompletionAnimations: CompletionAnimation[] = [];

      if (prev.isNotesMode && value !== null) {
        // Toggle note
        if (newNotes[row][col].has(value)) {
          newNotes[row][col].delete(value);
        } else {
          newNotes[row][col].add(value);
        }
      } else {
        // Set number
        newGrid[row][col] = value;
        // Clear notes when placing a number
        if (value !== null) {
          newNotes[row][col].clear();
          
          // Validate the move
          const isCorrect = prev.solution[row][col] === value;
          const isIncorrect = !isCorrect;
          
          // Update cell validation
          newCellValidations[row][col] = {
            isCorrect,
            isIncorrect,
            showFeedback: true
          };
          
          // Award points for correct placement (only if cell was empty before)
          if (isCorrect && previousValue === null) {
            pointsEarned = 10;
            
            // Check for row/column/box completion
            if (isRowComplete(newGrid, row)) {
              newCompletionAnimations.push({
                type: 'row',
                index: row,
                timestamp: Date.now()
              });
              pointsEarned += 50; // Bonus for completing row
            }
            
            if (isColumnComplete(newGrid, col)) {
              newCompletionAnimations.push({
                type: 'column',
                index: col,
                timestamp: Date.now()
              });
              pointsEarned += 50; // Bonus for completing column
            }
            
            const boxIndex = getBoxIndex(row, col);
            if (isBoxComplete(newGrid, boxIndex)) {
              newCompletionAnimations.push({
                type: 'box',
                index: boxIndex,
                timestamp: Date.now()
              });
              pointsEarned += 100; // Bonus for completing box
            }
          }
          
          // Clear feedback after 2 seconds
          setTimeout(() => {
            setGameState(current => ({
              ...current,
              cellValidations: current.cellValidations.map((r, rIdx) =>
                r.map((c, cIdx) =>
                  rIdx === row && cIdx === col
                    ? { ...c, showFeedback: false }
                    : c
                )
              )
            }));
          }, 2000);
        }
      }

      // Record move for undo/redo
      const move: Move = {
        row,
        col,
        previousValue,
        newValue: newGrid[row][col],
        previousNotes,
        newNotes: new Set(newNotes[row][col]),
        type: prev.isNotesMode ? 'notes' : 'number'
      };

      setMoveHistory(history => [...history, move]);
      setRedoHistory([]); // Clear redo history on new move

      // Check if puzzle is complete
      const isComplete = isPuzzleComplete(newGrid);
      if (isComplete) {
        setIsTimerRunning(false);
        pointsEarned += 500; // Completion bonus
      }

      // Clear completion animations after 5 seconds
      if (newCompletionAnimations.length > 0) {
        setTimeout(() => {
          setGameState(current => ({
            ...current,
            completionAnimations: current.completionAnimations.filter(
              anim => Date.now() - anim.timestamp > 5000
            )
          }));
        }, 5000);
      }

      return {
        ...prev,
        grid: newGrid,
        notes: newNotes,
        cellValidations: newCellValidations,
        completionAnimations: [...prev.completionAnimations, ...newCompletionAnimations],
        points: prev.points + pointsEarned,
        isComplete
      };
    });
  }, []);

  // Undo move
  const undoMove = useCallback(() => {
    if (moveHistory.length === 0) return;

    const lastMove = moveHistory[moveHistory.length - 1];
    
    setGameState(prev => {
      const newGrid = prev.grid.map(r => [...r]);
      const newNotes = prev.notes.map(r => r.map(c => new Set(c)));
      
      if (lastMove.type === 'notes') {
        newNotes[lastMove.row][lastMove.col] = new Set(lastMove.previousNotes);
      } else {
        newGrid[lastMove.row][lastMove.col] = lastMove.previousValue;
      }

      return {
        ...prev,
        grid: newGrid,
        notes: newNotes,
        isComplete: false
      };
    });

    setRedoHistory(history => [...history, lastMove]);
    setMoveHistory(history => history.slice(0, -1));
    
    if (!isTimerRunning && !gameState.isComplete) {
      setIsTimerRunning(true);
    }
  }, [moveHistory, isTimerRunning, gameState.isComplete]);

  // Redo move
  const redoMove = useCallback(() => {
    if (redoHistory.length === 0) return;

    const moveToRedo = redoHistory[redoHistory.length - 1];
    
    setGameState(prev => {
      const newGrid = prev.grid.map(r => [...r]);
      const newNotes = prev.notes.map(r => r.map(c => new Set(c)));
      
      if (moveToRedo.type === 'notes') {
        newNotes[moveToRedo.row][moveToRedo.col] = new Set(moveToRedo.newNotes);
      } else {
        newGrid[moveToRedo.row][moveToRedo.col] = moveToRedo.newValue;
      }

      const isComplete = isPuzzleComplete(newGrid);
      if (isComplete) {
        setIsTimerRunning(false);
      }

      return {
        ...prev,
        grid: newGrid,
        notes: newNotes,
        isComplete
      };
    });

    setMoveHistory(history => [...history, moveToRedo]);
    setRedoHistory(history => history.slice(0, -1));
  }, [redoHistory]);

  // Use hint
  const useHint = useCallback(() => {
    if (gameState.hintsUsed >= gameState.maxHints) return;

    // Find an empty cell and fill it with the correct value
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (gameState.grid[row][col] === null) {
          const correctValue = gameState.solution[row][col];
          if (correctValue !== null) {
            makeMove(row, col, correctValue);
            setGameState(prev => ({
              ...prev,
              hintsUsed: prev.hintsUsed + 1
            }));
            return;
          }
        }
      }
    }
  }, [gameState.hintsUsed, gameState.maxHints, gameState.grid, gameState.solution, makeMove]);

  // Reset game
  const resetGame = useCallback(async () => {
    setIsGenerating(true);
    setIsTimerRunning(false);
    
    try {
      // Use setTimeout to allow UI to update with loading state
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const { puzzle, solution } = generatePuzzle(gameState.difficulty);
      
      setGameState(prev => ({
        ...prev,
        grid: puzzle,
        solution,
        selectedCell: null,
        hintsUsed: 0,
        timer: 0,
        isComplete: false,
        notes: Array(9).fill(null).map(() => Array(9).fill(null).map(() => new Set())),
        cellValidations: Array(9).fill(null).map(() => Array(9).fill(null).map(() => ({ isCorrect: false, isIncorrect: false, showFeedback: false }))),
        completionAnimations: [],
        points: prev.points // Keep existing points
      }));
      
      setMoveHistory([]);
      setRedoHistory([]);
      setIsTimerRunning(true);
    } finally {
      setIsGenerating(false);
    }
  }, [gameState.difficulty]);

  // Get duplicate cells for current selection
  const getDuplicates = useCallback(() => {
    if (!gameState.selectedCell) return [];
    const [row, col] = gameState.selectedCell;
    return getDuplicateCells(gameState.grid, row, col);
  }, [gameState.selectedCell, gameState.grid]);

  // Auto-solve the entire puzzle
  const autoSolve = useCallback(() => {
    setGameState(prev => {
      const newGrid = prev.solution.map(row => [...row]);
      const newCellValidations = Array(9).fill(null).map(() => 
        Array(9).fill(null).map(() => ({ 
          isCorrect: true, 
          isIncorrect: false, 
          showFeedback: false 
        }))
      );
      
      setIsTimerRunning(false);
      
      return {
        ...prev,
        grid: newGrid,
        notes: Array(9).fill(null).map(() => Array(9).fill(null).map(() => new Set())),
        cellValidations: newCellValidations,
        isComplete: true,
        points: prev.points + 100 // Small bonus for auto-solve
      };
    });
    
    // Clear move history since puzzle is solved
    setMoveHistory([]);
    setRedoHistory([]);
  }, []);

  // Check if a move is valid
  const isValidMoveCheck = useCallback((row: number, col: number, value: number) => {
    return isValidMove(gameState.grid, row, col, value);
  }, [gameState.grid]);

  return {
    gameState,
    moveHistory,
    redoHistory,
    isTimerRunning,
    isGenerating,
    startNewGame,
    selectCell,
    toggleNotesMode,
    makeMove,
    undoMove,
    redoMove,
    useHint,
    resetGame,
    autoSolve,
    getDuplicates,
    isValidMoveCheck
  };
}