export type CellValue = number | null;
export type Notes = Set<number>;
export type SudokuGrid = CellValue[][];
export type NotesGrid = Notes[][];

export interface CellValidation {
  isCorrect: boolean;
  isIncorrect: boolean;
  showFeedback: boolean;
}

export interface CompletionAnimation {
  type: 'row' | 'column' | 'box';
  index: number;
  timestamp: number;
}

export interface GameState {
  grid: SudokuGrid;
  notes: NotesGrid;
  solution: SudokuGrid;
  selectedCell: [number, number] | null;
  isNotesMode: boolean;
  hintsUsed: number;
  maxHints: number;
  timer: number;
  isComplete: boolean;
  difficulty: Difficulty;
  cellValidations: CellValidation[][];
  completionAnimations: CompletionAnimation[];
  points: number;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Move {
  row: number;
  col: number;
  previousValue: CellValue;
  newValue: CellValue;
  previousNotes: Notes;
  newNotes: Notes;
  type: 'number' | 'notes';
}

export type Theme = 'space' | 'nature' | 'cyberpunk';

export interface Cosmetic {
  id: Theme;
  name: string;
  description: string;
  cost: number;
  unlocked: boolean;
  preview: string;
}

export interface GameStats {
  coins: number;
  gamesCompleted: number;
  totalTime: number;
  bestTimes: Record<Difficulty, number>;
  unlockedCosmetics: Theme[];
  currentTheme: Theme;
}