"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCw, RefreshCw, Eye } from 'lucide-react';
import { TaskData, PuzzlePiece } from '@/types';

interface VisualPuzzleTaskProps {
  taskData: TaskData;
  onAnswer: (answer: number) => void;
  isActive: boolean;
  timeRemaining: number;
}

interface PlacedPiece extends PuzzlePiece {
  isPlaced: boolean;
  currentRotation: number;
}

export function VisualPuzzleTask({ taskData, onAnswer, isActive, timeRemaining }: VisualPuzzleTaskProps) {
  const [selectedPieces, setSelectedPieces] = useState<string[]>([]);
  const [availablePieces, setAvailablePieces] = useState<PlacedPiece[]>([]);
  const [showTarget, setShowTarget] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  
  const visualPuzzle = taskData.visualPuzzle;

  useEffect(() => {
    if (!visualPuzzle) return;
    // Initialize available pieces
    const pieces: PlacedPiece[] = visualPuzzle.pieces.map(piece => ({
      ...piece,
      isPlaced: false,
      currentRotation: piece.rotation || 0
    }));
    setAvailablePieces(pieces);
  }, [visualPuzzle]);

  useEffect(() => {
    if (!visualPuzzle) return;
    if (!(isActive && showTarget)) return;
    // Show target for 5 seconds
    const timer = setTimeout(() => setShowTarget(false), 5000);
    return () => clearTimeout(timer);
  }, [isActive, showTarget, visualPuzzle]);

  useEffect(() => {
    if (!visualPuzzle) return;
    // Check if puzzle is complete (3 pieces selected for this example)
    if (selectedPieces.length === 3) {
      const isCorrect = checkSolution();
      setIsComplete(true);
      onAnswer(isCorrect ? 1 : 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPieces, onAnswer, visualPuzzle]);

  const checkSolution = (): boolean => {
    // Check if selected pieces match the correct combination
    if (!visualPuzzle) return false;
    const sortedSelected = [...selectedPieces].sort();
    const sortedCorrect = [...visualPuzzle.correctCombination].sort();
    return JSON.stringify(sortedSelected) === JSON.stringify(sortedCorrect);
  };

  const togglePieceSelection = (pieceId: string) => {
    if (!isActive || isComplete) return;

    setSelectedPieces(prev => {
      if (prev.includes(pieceId)) {
        return prev.filter(id => id !== pieceId);
      } else if (prev.length < 3) {
        return [...prev, pieceId];
      }
      return prev;
    });
  };

  const rotatePiece = (pieceId: string) => {
    setAvailablePieces(prev =>
      prev.map(piece =>
        piece.id === pieceId
          ? { ...piece, currentRotation: (piece.currentRotation + 90) % 360 }
          : piece
      )
    );
  };

  const resetPuzzle = () => {
    setSelectedPieces([]);
    setIsComplete(false);
  };

  const renderTargetImage = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="text-center space-y-4"
    >
      <h4 className="text-white/90 font-medium">Study this image</h4>
      <Card className="bg-white/10 border-white/20 p-6 mx-auto max-w-md">
        <CardContent className="p-0">
          <div className="aspect-square bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <div className="w-3/4 h-3/4 bg-white/20 rounded-lg border-2 border-white/30 flex items-center justify-center">
              <span className="text-white text-lg font-semibold">Target Shape</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <p className="text-white/60 text-sm">
        Memorize this shape. You’ll need to recreate it using the puzzle pieces.
      </p>
    </motion.div>
  );

  const renderPuzzlePieces = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h4 className="text-center text-white/90 font-medium">
        Select 3 pieces that recreate the target shape
      </h4>
      
      <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {availablePieces.map((piece) => {
          const isSelected = selectedPieces.includes(piece.id);
          
          return (
            <motion.div
              key={piece.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Card
                className={`
                  cursor-pointer transition-all duration-300 p-3
                  ${isSelected 
                    ? 'bg-purple-600/30 border-purple-400 shadow-lg shadow-purple-500/30' 
                    : 'bg-white/10 border-white/20 hover:bg-white/20'
                  }
                `}
                onClick={() => togglePieceSelection(piece.id)}
              >
                <CardContent className="p-0">
                  <div 
                    className="aspect-square rounded-lg flex items-center justify-center relative transition-transform duration-300"
                    style={{ transform: `rotate(${piece.currentRotation}deg)` }}
                  >
                    {/* Simplified piece visualization */}
                    <div className={`w-full h-full rounded-lg ${getPieceStyle(piece)}`}>
                      <div className="w-full h-full flex items-center justify-center text-white font-bold">
                        {piece.id}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Rotate button */}
              <Button
                size="sm"
                variant="ghost"
                className="absolute -top-2 -right-2 w-8 h-8 p-0 bg-white/20 hover:bg-white/30 border border-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  rotatePiece(piece.id);
                }}
              >
                <RotateCw className="w-4 h-4" />
              </Button>
              
              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -left-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center border-2 border-white"
                >
                  <span className="text-white text-xs font-bold">
                    {selectedPieces.indexOf(piece.id) + 1}
                  </span>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
      
      {/* Selection counter */}
      <div className="text-center">
        <span className="text-white/70 text-sm">
          Selected: {selectedPieces.length}/3 pieces
        </span>
      </div>
    </motion.div>
  );

  const getPieceStyle = (piece: PuzzlePiece): string => {
    const colors = [
      'bg-gradient-to-br from-red-500 to-red-600',
      'bg-gradient-to-br from-blue-500 to-blue-600',
      'bg-gradient-to-br from-green-500 to-green-600',
      'bg-gradient-to-br from-yellow-500 to-yellow-600',
      'bg-gradient-to-br from-purple-500 to-purple-600',
      'bg-gradient-to-br from-pink-500 to-pink-600',
    ];
    const hash = piece.id.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const renderCompletion = () => {
    const isCorrect = checkSolution();
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <div className={`p-6 rounded-lg ${isCorrect ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
          <h3 className={`text-2xl font-bold mb-2 ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
            {isCorrect ? 'Perfect!' : 'Not quite right'}
          </h3>
          <p className="text-white/70">
            {isCorrect 
              ? 'You correctly identified the pieces that form the target shape!'
              : 'The selected pieces don’t match the target shape. Try again!'
            }
          </p>
        </div>
        
        <div className="space-y-2">
          <p className="text-white/70 text-sm">Your selection:</p>
          <div className="flex justify-center gap-2">
            {selectedPieces.map((pieceId, index) => (
              <div key={pieceId} className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center text-white text-sm font-bold">
                {availablePieces.findIndex(p => p.id === pieceId) + 1}
              </div>
            ))}
          </div>
        </div>
        
        <Button
          variant="outline"
          onClick={resetPuzzle}
          className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h3 className="text-xl font-semibold text-white mb-2">Visual Puzzle</h3>
        <p className="text-white/70 text-sm">
          Study the target shape and select the pieces that would recreate it
        </p>
      </motion.div>

      {/* Main content */}
      <AnimatePresence mode="wait">
        {showTarget && (
          <motion.div key="target">
            {renderTargetImage()}
          </motion.div>
        )}
        
        {!showTarget && !isComplete && (
          <motion.div key="puzzle">
            {renderPuzzlePieces()}
          </motion.div>
        )}
        
        {isComplete && (
          <motion.div key="complete">
            {renderCompletion()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      {!showTarget && !isComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center gap-4"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTarget(true)}
            className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
          >
            <Eye className="w-4 h-4 mr-2" />
            Show Target Again
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={resetPuzzle}
            className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset Selection
          </Button>
        </motion.div>
      )}
    </div>
  );
} 