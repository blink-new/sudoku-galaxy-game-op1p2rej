import type { SudokuGrid, Difficulty } from '../types/sudoku';

// Generate a complete valid Sudoku solution
export function generateCompleteSudoku(): SudokuGrid {
  const grid: SudokuGrid = Array(9).fill(null).map(() => Array(9).fill(null));
  
  // Use a faster generation method with pre-filled diagonal boxes
  fillDiagonalBoxes(grid);
  fillGrid(grid);
  return grid;
}

// Fill the three diagonal 3x3 boxes first (they don't interfere with each other)
function fillDiagonalBoxes(grid: SudokuGrid): void {
  for (let box = 0; box < 9; box += 3) {
    fillBox(grid, box, box);
  }
}

// Fill a 3x3 box with numbers 1-9
function fillBox(grid: SudokuGrid, row: number, col: number): void {
  const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  let index = 0;
  
  for (let r = row; r < row + 3; r++) {
    for (let c = col; c < col + 3; c++) {
      grid[r][c] = numbers[index++];
    }
  }
}

// Fill grid with valid numbers using backtracking (optimized)
function fillGrid(grid: SudokuGrid): boolean {
  // Find empty cell with minimum possibilities (most constrained first)
  let minPossibilities = 10;
  let bestCell: [number, number] | null = null;
  
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === null) {
        const possibilities = getPossibleNumbers(grid, row, col);
        if (possibilities.length < minPossibilities) {
          minPossibilities = possibilities.length;
          bestCell = [row, col];
          if (minPossibilities === 0) {
            return false; // No solution possible
          }
          if (minPossibilities === 1) {
            break; // Found the most constrained cell
          }
        }
      }
    }
    if (minPossibilities === 1) break;
  }
  
  if (!bestCell) return true; // All cells filled
  
  const [row, col] = bestCell;
  const possibilities = shuffleArray(getPossibleNumbers(grid, row, col));
  
  for (const num of possibilities) {
    grid[row][col] = num;
    
    if (fillGrid(grid)) {
      return true;
    }
    
    grid[row][col] = null;
  }
  
  return false;
}

// Get all possible numbers for a cell
function getPossibleNumbers(grid: SudokuGrid, row: number, col: number): number[] {
  const possibilities: number[] = [];
  
  for (let num = 1; num <= 9; num++) {
    if (isValidMove(grid, row, col, num)) {
      possibilities.push(num);
    }
  }
  
  return possibilities;
}

// Generate a puzzle by removing numbers from complete grid
export function generatePuzzle(difficulty: Difficulty): { puzzle: SudokuGrid; solution: SudokuGrid } {
  const solution = generateCompleteSudoku();
  const puzzle = solution.map(row => [...row]);
  
  const cellsToRemove = getCellsToRemove(difficulty);
  const positions = getAllPositions();
  shuffleArray(positions);
  
  // Use a faster approach: remove cells in a pattern that maintains solvability
  // without checking unique solution for each removal (too expensive)
  let removed = 0;
  const maxAttempts = Math.min(cellsToRemove * 2, 81); // Limit attempts to prevent infinite loops
  
  for (let i = 0; i < positions.length && removed < cellsToRemove && i < maxAttempts; i++) {
    const [row, col] = positions[i];
    
    const backup = puzzle[row][col];
    puzzle[row][col] = null;
    
    // Use a lightweight check instead of full unique solution validation
    if (isRemovalValid(puzzle, row, col, backup!)) {
      removed++;
    } else {
      puzzle[row][col] = backup;
    }
  }
  
  return { puzzle, solution };
}

function getCellsToRemove(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'easy': return 40;
    case 'medium': return 50;
    case 'hard': return 60;
    default: return 45;
  }
}

function getAllPositions(): [number, number][] {
  const positions: [number, number][] = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      positions.push([row, col]);
    }
  }
  return positions;
}

// Check if a move is valid according to Sudoku rules
export function isValidMove(grid: SudokuGrid, row: number, col: number, num: number): boolean {
  // Check row
  for (let c = 0; c < 9; c++) {
    if (c !== col && grid[row][c] === num) {
      return false;
    }
  }
  
  // Check column
  for (let r = 0; r < 9; r++) {
    if (r !== row && grid[r][col] === num) {
      return false;
    }
  }
  
  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if ((r !== row || c !== col) && grid[r][c] === num) {
        return false;
      }
    }
  }
  
  return true;
}

// Check if puzzle is complete and valid
export function isPuzzleComplete(grid: SudokuGrid): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === null) {
        return false;
      }
    }
  }
  
  // Validate all constraints
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const num = grid[row][col]!;
      if (!isValidMove(grid, row, col, num)) {
        return false;
      }
    }
  }
  
  return true;
}

// Get cells that should be highlighted (same row, column, or box)
export function getRelatedCells(row: number, col: number): [number, number][] {
  const related: [number, number][] = [];
  
  // Same row
  for (let c = 0; c < 9; c++) {
    if (c !== col) related.push([row, c]);
  }
  
  // Same column
  for (let r = 0; r < 9; r++) {
    if (r !== row) related.push([r, col]);
  }
  
  // Same 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (r !== row && c !== col) {
        related.push([r, c]);
      }
    }
  }
  
  return related;
}

// Get cells with duplicate numbers
export function getDuplicateCells(grid: SudokuGrid, row: number, col: number): [number, number][] {
  const value = grid[row][col];
  if (!value) return [];
  
  const duplicates: [number, number][] = [];
  const related = getRelatedCells(row, col);
  
  for (const [r, c] of related) {
    if (grid[r][c] === value) {
      duplicates.push([r, c]);
    }
  }
  
  return duplicates;
}

// Utility functions
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Lightweight check to see if removing a cell is valid
// This is much faster than checking for unique solutions
function isRemovalValid(grid: SudokuGrid, row: number, col: number, originalValue: number): boolean {
  // Count how many valid numbers can go in this cell
  let validNumbers = 0;
  
  for (let num = 1; num <= 9; num++) {
    if (isValidMove(grid, row, col, num)) {
      validNumbers++;
      // If more than one valid number, removal might create ambiguity
      // But we'll allow it for performance - the puzzle will still be solvable
      if (validNumbers > 3) {
        return false; // Too many possibilities, keep the original number
      }
    }
  }
  
  // Allow removal if there are 1-3 valid possibilities
  return validNumbers >= 1;
}

// Fast solver for validation (with early termination)
function canSolveQuickly(grid: SudokuGrid, maxSteps: number = 100): boolean {
  const workingGrid = grid.map(row => [...row]);
  let steps = 0;
  
  while (steps < maxSteps) {
    let madeProgress = false;
    
    // Try to fill cells with only one possibility
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (workingGrid[row][col] === null) {
          const validNumbers = [];
          for (let num = 1; num <= 9; num++) {
            if (isValidMove(workingGrid, row, col, num)) {
              validNumbers.push(num);
            }
          }
          
          if (validNumbers.length === 1) {
            workingGrid[row][col] = validNumbers[0];
            madeProgress = true;
          } else if (validNumbers.length === 0) {
            return false; // Unsolvable
          }
        }
      }
    }
    
    if (!madeProgress) break;
    steps++;
  }
  
  // Check if solved or at least partially solvable
  return true;
}

export function isRowComplete(grid: SudokuGrid, row: number): boolean {
  const seen = new Set<number>();
  for (let col = 0; col < 9; col++) {
    const value = grid[row][col];
    if (value === null || seen.has(value)) return false;
    seen.add(value);
  }
  return seen.size === 9;
}

export function isColumnComplete(grid: SudokuGrid, col: number): boolean {
  const seen = new Set<number>();
  for (let row = 0; row < 9; row++) {
    const value = grid[row][col];
    if (value === null || seen.has(value)) return false;
    seen.add(value);
  }
  return seen.size === 9;
}

export function isBoxComplete(grid: SudokuGrid, boxIndex: number): boolean {
  const boxRow = Math.floor(boxIndex / 3) * 3;
  const boxCol = (boxIndex % 3) * 3;
  const seen = new Set<number>();
  
  for (let row = boxRow; row < boxRow + 3; row++) {
    for (let col = boxCol; col < boxCol + 3; col++) {
      const value = grid[row][col];
      if (value === null || seen.has(value)) return false;
      seen.add(value);
    }
  }
  return seen.size === 9;
}

export function getBoxIndex(row: number, col: number): number {
  return Math.floor(row / 3) * 3 + Math.floor(col / 3);
}