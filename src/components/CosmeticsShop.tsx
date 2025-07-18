import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Coins, Check, Lock } from 'lucide-react';
import { cn } from '../lib/utils';
import type { Theme, Cosmetic } from '../types/sudoku';

interface CosmeticsShopProps {
  isOpen: boolean;
  onClose: () => void;
  cosmetics: Cosmetic[];
  currentTheme: Theme;
  coins: number;
  onPurchase: (themeId: Theme) => void;
  onApply: (themeId: Theme) => void;
}

export function CosmeticsShop({
  isOpen,
  onClose,
  cosmetics,
  currentTheme,
  coins,
  onPurchase,
  onApply
}: CosmeticsShopProps) {
  const getThemePreview = (theme: Theme) => {
    switch (theme) {
      case 'space':
        return 'bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900';
      case 'nature':
        return 'bg-gradient-to-br from-green-800 via-emerald-700 to-teal-800';
      case 'cyberpunk':
        return 'bg-gradient-to-br from-cyan-900 via-blue-900 to-slate-900';
      case 'inferno':
        return 'bg-gradient-to-br from-red-900 via-orange-800 to-yellow-700';
      case 'dubai':
        return 'bg-gradient-to-br from-amber-800 via-yellow-700 to-orange-600';
      case 'bahrain':
        return 'bg-gradient-to-br from-red-800 via-red-700 to-white';
      case 'clouds':
        return 'bg-gradient-to-br from-blue-300 via-white to-gray-200';
      case 'mars':
        return 'bg-gradient-to-br from-red-800 via-orange-700 to-amber-600';
    }
  };

  const getThemeAccent = (theme: Theme) => {
    switch (theme) {
      case 'space': return 'text-indigo-400 border-indigo-400';
      case 'nature': return 'text-green-400 border-green-400';
      case 'cyberpunk': return 'text-cyan-400 border-cyan-400';
      case 'inferno': return 'text-red-400 border-red-400';
      case 'dubai': return 'text-amber-400 border-amber-400';
      case 'bahrain': return 'text-red-400 border-red-400';
      case 'clouds': return 'text-blue-400 border-blue-400';
      case 'mars': return 'text-orange-400 border-orange-400';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            🛒 Cosmetics Shop
            <Badge variant="secondary" className="flex items-center gap-1">
              <Coins className="w-4 h-4 text-yellow-500" />
              {coins}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {cosmetics.map(cosmetic => (
            <Card 
              key={cosmetic.id} 
              className={cn(
                'bg-slate-800 border-slate-700 transition-all duration-300',
                currentTheme === cosmetic.id && 'ring-2 ring-indigo-500'
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-white">{cosmetic.name}</CardTitle>
                  {currentTheme === cosmetic.id && (
                    <Badge className="bg-indigo-600">
                      <Check className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-slate-400">
                  {cosmetic.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Theme Preview */}
                <div className={cn(
                  'h-24 rounded-lg p-4 flex items-center justify-center',
                  getThemePreview(cosmetic.id)
                )}>
                  <div className="grid grid-cols-3 gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                      <div
                        key={num}
                        className={cn(
                          'w-6 h-6 rounded border flex items-center justify-center text-xs font-bold',
                          cosmetic.id === 'space' && 'border-indigo-400 text-indigo-200 bg-indigo-900/30',
                          cosmetic.id === 'nature' && 'border-green-400 text-green-200 bg-green-900/30',
                          cosmetic.id === 'cyberpunk' && 'border-cyan-400 text-cyan-200 bg-cyan-900/30',
                          cosmetic.id === 'inferno' && 'border-red-400 text-red-200 bg-red-900/30',
                          cosmetic.id === 'dubai' && 'border-amber-400 text-amber-200 bg-amber-900/30',
                          cosmetic.id === 'bahrain' && 'border-red-400 text-red-200 bg-red-900/30',
                          cosmetic.id === 'clouds' && 'border-blue-400 text-blue-800 bg-blue-100/30',
                          cosmetic.id === 'mars' && 'border-orange-400 text-orange-200 bg-orange-900/30'
                        )}
                      >
                        {num <= 3 ? num : ''}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex items-center justify-between">
                  {cosmetic.unlocked ? (
                    <Button
                      variant={currentTheme === cosmetic.id ? 'secondary' : 'outline'}
                      className={cn(
                        'w-full',
                        currentTheme === cosmetic.id 
                          ? 'bg-indigo-600 hover:bg-indigo-500' 
                          : 'border-slate-600 hover:bg-slate-700'
                      )}
                      onClick={() => onApply(cosmetic.id)}
                      disabled={currentTheme === cosmetic.id}
                    >
                      {currentTheme === cosmetic.id ? 'Applied' : 'Apply Theme'}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full flex items-center gap-2',
                        coins >= cosmetic.cost 
                          ? 'border-yellow-600 text-yellow-400 hover:bg-yellow-600 hover:text-white'
                          : 'border-slate-600 text-slate-500 cursor-not-allowed'
                      )}
                      onClick={() => onPurchase(cosmetic.id)}
                      disabled={coins < cosmetic.cost}
                    >
                      {coins >= cosmetic.cost ? (
                        <>
                          <Coins className="w-4 h-4" />
                          Buy for {cosmetic.cost}
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          Need {cosmetic.cost} coins
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {/* Theme Features */}
                <div className="text-xs text-slate-400 space-y-1">
                  {cosmetic.id === 'space' && (
                    <ul className="list-disc list-inside space-y-1">
                      <li>Galaxy background with twinkling stars</li>
                      <li>Constellation-style numbers</li>
                      <li>Cosmic glow effects</li>
                    </ul>
                  )}
                  {cosmetic.id === 'nature' && (
                    <ul className="list-disc list-inside space-y-1">
                      <li>Organic vine borders</li>
                      <li>Handwritten-style numbers</li>
                      <li>Earth tone color palette</li>
                    </ul>
                  )}
                  {cosmetic.id === 'cyberpunk' && (
                    <ul className="list-disc list-inside space-y-1">
                      <li>Neon grid lines</li>
                      <li>Circuit board aesthetics</li>
                      <li>Glowing cyan effects</li>
                    </ul>
                  )}
                  {cosmetic.id === 'inferno' && (
                    <ul className="list-disc list-inside space-y-1">
                      <li>Blazing fire backgrounds</li>
                      <li>Molten lava cell borders</li>
                      <li>Fiery red-orange gradients</li>
                    </ul>
                  )}
                  {cosmetic.id === 'dubai' && (
                    <ul className="list-disc list-inside space-y-1">
                      <li>Golden desert aesthetics</li>
                      <li>Luxury gold accents</li>
                      <li>Arabian architectural elements</li>
                    </ul>
                  )}
                  {cosmetic.id === 'bahrain' && (
                    <ul className="list-disc list-inside space-y-1">
                      <li>Pearl diving inspired design</li>
                      <li>Red and white flag colors</li>
                      <li>Traditional Gulf patterns</li>
                    </ul>
                  )}
                  {cosmetic.id === 'clouds' && (
                    <ul className="list-disc list-inside space-y-1">
                      <li>Soft cloud backgrounds</li>
                      <li>Sky blue color palette</li>
                      <li>Dreamy floating effects</li>
                    </ul>
                  )}
                  {cosmetic.id === 'mars' && (
                    <ul className="list-disc list-inside space-y-1">
                      <li>Red planet surface texture</li>
                      <li>Martian landscape backgrounds</li>
                      <li>Space exploration theme</li>
                    </ul>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 text-center text-sm text-slate-400">
          Complete puzzles to earn coins and unlock new themes!
        </div>
      </DialogContent>
    </Dialog>
  );
}