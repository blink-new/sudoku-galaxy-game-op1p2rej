import React, { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { SudokuGrid } from './components/SudokuGrid';
import { NumberInput } from './components/NumberInput';
import { GameControls } from './components/GameControls';
import { CosmeticsShop } from './components/CosmeticsShop';
import { CompletionModal } from './components/CompletionModal';
import { ThemeSelector } from './components/ThemeSelector';
import { Button } from './components/ui/button';
import { useSudokuGame } from './hooks/useSudokuGame';
import { useGameStats } from './hooks/useGameStats';
import { ShoppingBag, Sparkles } from 'lucide-react';
import { cn } from './lib/utils';
import type { Difficulty } from './types/sudoku';
import './App.css';

function App() {
  const {
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
  } = useSudokuGame();

  const { stats, cosmetics, completeGame, purchaseCosmetic, applyTheme } = useGameStats();

  const [currentView, setCurrentView] = useState<'home' | 'game'>('home');
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);
  const [pendingDifficulty, setPendingDifficulty] = useState<Difficulty | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [coinsEarned, setCoinsEarned] = useState(0);


  // Handle game completion
  useEffect(() => {
    if (gameState.isComplete && !isCompletionModalOpen) {
      const earned = completeGame(gameState.difficulty, gameState.timer);
      setCoinsEarned(earned);
      setIsCompletionModalOpen(true);
      
      // Play completion sound
      if (soundEnabled) {
        // You could add actual sound effects here
        console.log('🎉 Puzzle completed!');
      }
    }
  }, [gameState.isComplete, gameState.difficulty, gameState.timer, completeGame, soundEnabled, isCompletionModalOpen]);

  // No initial game - start from home page

  const handleCellClick = (row: number, col: number) => {
    selectCell(row, col);
    
    if (soundEnabled) {
      // You could add click sound here
      console.log('🔊 Cell selected');
    }
  };

  const handleNumberInput = (number: number) => {
    if (!gameState.selectedCell) return;
    
    const [row, col] = gameState.selectedCell;
    makeMove(row, col, number);
    
    if (soundEnabled) {
      console.log('🔊 Number placed');
    }
  };

  const handleClear = () => {
    if (!gameState.selectedCell) return;
    
    const [row, col] = gameState.selectedCell;
    makeMove(row, col, null);
    
    if (soundEnabled) {
      console.log('🔊 Cell cleared');
    }
  };

  const handleStartGame = (difficulty: Difficulty) => {
    setPendingDifficulty(difficulty);
    setIsThemeSelectorOpen(true);
  };

  const handleStartGameWithTheme = async (theme: typeof stats.currentTheme) => {
    if (pendingDifficulty) {
      await startNewGame(pendingDifficulty);
      setCurrentView('game');
      setPendingDifficulty(null);
    }
  };

  const handleNewGame = async () => {
    await startNewGame(gameState.difficulty);
    setIsCompletionModalOpen(false);
  };

  const handleGoHome = () => {
    setCurrentView('home');
  };

  const handleAutoSolve = () => {
    autoSolve();
    if (soundEnabled) {
      console.log('🔊 Puzzle auto-solved!');
    }
  };

  const handlePurchaseCosmetic = (themeId: typeof stats.currentTheme) => {
    const success = purchaseCosmetic(themeId);
    if (success && soundEnabled) {
      console.log('🔊 Cosmetic purchased!');
    }
  };

  const handleApplyTheme = (themeId: typeof stats.currentTheme) => {
    const success = applyTheme(themeId);
    if (success && soundEnabled) {
      console.log('🔊 Theme applied!');
    }
  };

  // Show home page or game based on current view
  if (currentView === 'home') {
    return (
      <>
        <HomePage 
          stats={stats} 
          onStartGame={handleStartGame} 
          onOpenShop={() => setIsShopOpen(true)}
        />
        
        {/* Cosmetics Shop */}
        <CosmeticsShop
          isOpen={isShopOpen}
          onClose={() => setIsShopOpen(false)}
          coins={stats.coins}
          cosmetics={cosmetics}
          currentTheme={stats.currentTheme}
          onPurchase={handlePurchaseCosmetic}
          onApply={handleApplyTheme}
        />

        {/* Theme Selector */}
        <ThemeSelector
          isOpen={isThemeSelectorOpen}
          onClose={() => {
            setIsThemeSelectorOpen(false);
            setPendingDifficulty(null);
          }}
          cosmetics={cosmetics}
          currentTheme={stats.currentTheme}
          difficulty={pendingDifficulty || 'easy'}
          onStartGame={handleStartGameWithTheme}
          onApplyTheme={handleApplyTheme}
        />
      </>
    );
  }

  return (
    <div className={cn('min-h-screen', `theme-${stats.currentTheme}`)}>
      {/* Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-slate-800 rounded-lg p-8 text-center border border-slate-600">
            <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-white mb-2">Generating Puzzle</h3>
            <p className="text-slate-300">Creating your cosmic challenge...</p>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-4 max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="text-yellow-500 font-bold text-sm">
              💰 {stats.coins}
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-400" />
              Sudoku Galaxy
            </h1>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsShopOpen(true)}
            className="flex items-center gap-2 border-slate-600"
          >
            <ShoppingBag className="w-4 h-4" />
            Shop
          </Button>
        </div>

        {/* Game Controls */}
        <div className="mb-6">
          <GameControls
            timer={gameState.timer}
            hintsUsed={gameState.hintsUsed}
            maxHints={gameState.maxHints}
            points={gameState.points}
            difficulty={gameState.difficulty}
            isNotesMode={gameState.isNotesMode}
            canUndo={moveHistory.length > 0}
            canRedo={redoHistory.length > 0}
            soundEnabled={soundEnabled}
            onHint={useHint}
            onUndo={undoMove}
            onRedo={redoMove}
            onReset={resetGame}
            onToggleNotes={toggleNotesMode}
            onToggleSound={() => setSoundEnabled(!soundEnabled)}
            onAutoSolve={handleAutoSolve}
            onGoHome={handleGoHome}
          />
        </div>

        {/* Game Board */}
        <div className="flex flex-col items-center gap-6 mb-6">
          <SudokuGrid
            grid={gameState.grid}
            notes={gameState.notes}
            solution={gameState.solution}
            selectedCell={gameState.selectedCell}
            duplicateCells={getDuplicates()}
            cellValidations={gameState.cellValidations}
            completionAnimations={gameState.completionAnimations}
            theme={stats.currentTheme}
            onCellClick={handleCellClick}
          />

          <NumberInput
            onNumberClick={handleNumberInput}
            onClear={handleClear}
            isNotesMode={gameState.isNotesMode}
            selectedCell={gameState.selectedCell}
          />
        </div>

        {/* Game Completion Celebration */}
        {gameState.isComplete && (
          <div className="text-center mb-6">
            <div className="celebrate inline-block">
              <div className="text-4xl mb-2">🎉</div>
              <h2 className="text-xl font-bold text-white mb-1">Congratulations!</h2>
              <p className="text-slate-300 text-sm">You've mastered this cosmic puzzle!</p>
            </div>
          </div>
        )}
      </div>

      {/* Completion Modal */}
      <CompletionModal
        isOpen={isCompletionModalOpen}
        onClose={() => setIsCompletionModalOpen(false)}
        onNewGame={handleNewGame}
        onGoHome={() => {
          setIsCompletionModalOpen(false);
          handleGoHome();
        }}
        timer={gameState.timer}
        difficulty={gameState.difficulty}
        coinsEarned={coinsEarned}
        hintsUsed={gameState.hintsUsed}
        maxHints={gameState.maxHints}
      />

      {/* Cosmetics Shop */}
      <CosmeticsShop
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        coins={stats.coins}
        cosmetics={cosmetics}
        currentTheme={stats.currentTheme}
        onPurchase={handlePurchaseCosmetic}
        onApply={handleApplyTheme}
      />
    </div>
  );
}

export default App;