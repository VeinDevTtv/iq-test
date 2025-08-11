"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCw, RotateCcw, RefreshCw } from 'lucide-react';
import { TaskData, BlockType } from '@/types';

interface BlockDesignTaskProps {
  taskData: TaskData;
  onAnswer: (answer: number) => void;
  isActive: boolean;
  timeRemaining: number;
}

interface PlacedBlock {
  id: string;
  position: [number, number];
  rotation: number;
  blockType: BlockType;
}

export function BlockDesignTask({ taskData, onAnswer, isActive, timeRemaining }: BlockDesignTaskProps) {
  const [placedBlocks, setPlacedBlocks] = useState<PlacedBlock[]>([]);
  const [selectedBlockType, setSelectedBlockType] = useState<BlockType | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showTarget, setShowTarget] = useState(true);
  
  const blockDesign = taskData.blockDesign;

  useEffect(() => {
    if (!blockDesign) return;
    if (!(isActive && showTarget)) return;
    // Show target for 3 seconds then hide
    const timer = setTimeout(() => setShowTarget(false), 3000);
    return () => clearTimeout(timer);
  }, [isActive, showTarget, blockDesign]);

  useEffect(() => {
    if (!blockDesign) return;
    // Check if design is complete
    if (placedBlocks.length === blockDesign.blockCount) {
      const isCorrect = checkDesignCorrectness();
      setIsComplete(isCorrect);
      onAnswer(isCorrect ? 1 : 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placedBlocks, blockDesign, onAnswer]);

  const checkDesignCorrectness = (): boolean => {
    // Simplified correctness check - in a real implementation, 
    // this would compare the actual pattern matching
    if (!blockDesign) return false;
    return placedBlocks.length === blockDesign.blockCount;
  };

  const handleGridClick = (row: number, col: number) => {
    if (!selectedBlockType || !isActive) return;

    const existingBlockIndex = placedBlocks.findIndex(
      block => block.position[0] === row && block.position[1] === col
    );

    if (existingBlockIndex >= 0) {
      // Remove existing block
      setPlacedBlocks(blocks => blocks.filter((_, index) => index !== existingBlockIndex));
    } else {
      // Place new block
      const newBlock: PlacedBlock = {
        id: `block-${Date.now()}`,
        position: [row, col],
        rotation: 0,
        blockType: selectedBlockType
      };
      setPlacedBlocks(blocks => [...blocks, newBlock]);
    }
  };

  const rotateBlock = (blockId: string, direction: 'cw' | 'ccw') => {
    setPlacedBlocks(blocks =>
      blocks.map(block =>
        block.id === blockId
          ? {
              ...block,
              rotation: direction === 'cw' 
                ? (block.rotation + 90) % 360 
                : (block.rotation - 90 + 360) % 360
            }
          : block
      )
    );
  };

  const resetDesign = () => {
    setPlacedBlocks([]);
    setIsComplete(false);
  };

  const renderTargetPattern = () => (
    <div className="space-y-2">
      <h4 className="text-center text-white/90 font-medium">Target Design</h4>
      <Card className="bg-white/10 border-white/20 p-4">
        <div className="grid grid-cols-2 gap-1 max-w-24 mx-auto">
          {blockDesign?.targetPattern.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`target-${rowIndex}-${colIndex}`}
                className={`aspect-square rounded border ${
                  cell === 1 
                    ? 'bg-red-500 border-red-400' 
                    : cell === 2 
                    ? 'bg-blue-500 border-blue-400'
                    : cell === 3
                    ? 'bg-yellow-500 border-yellow-400'
                    : 'bg-white/10 border-white/20'
                }`}
              />
            ))
          )}
        </div>
      </Card>
    </div>
  );

  const renderWorkspace = () => (
    <div className="space-y-4">
      <h4 className="text-center text-white/90 font-medium">Your Design</h4>
      <Card className="bg-white/5 border-white/10 p-6">
        <div className="grid grid-cols-2 gap-2 max-w-32 mx-auto">
          {Array.from({ length: 4 }, (_, index) => {
            const row = Math.floor(index / 2);
            const col = index % 2;
            const placedBlock = placedBlocks.find(
              block => block.position[0] === row && block.position[1] === col
            );

            return (
              <motion.div
                key={`workspace-${row}-${col}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  aspect-square rounded-lg border-2 border-dashed cursor-pointer
                  flex items-center justify-center relative
                  ${placedBlock 
                    ? 'border-green-400 bg-green-500/20' 
                    : 'border-white/30 bg-white/5 hover:bg-white/10'
                  }
                `}
                onClick={() => handleGridClick(row, col)}
              >
                {placedBlock && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`
                      w-full h-full rounded-lg flex items-center justify-center
                      transform transition-transform duration-200
                      ${placedBlock.blockType.id === 'red' ? 'bg-red-500' :
                        placedBlock.blockType.id === 'blue' ? 'bg-blue-500' :
                        placedBlock.blockType.id === 'yellow' ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }
                    `}
                    style={{ transform: `rotate(${placedBlock.rotation}deg)` }}
                  >
                    {blockDesign?.rotationAllowed && (
                      <div className="absolute -top-2 -right-2 flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-6 h-6 p-0 bg-white/20 hover:bg-white/30"
                          onClick={(e) => {
                            e.stopPropagation();
                            rotateBlock(placedBlock.id, 'ccw');
                          }}
                        >
                          <RotateCcw className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-6 h-6 p-0 bg-white/20 hover:bg-white/30"
                          onClick={(e) => {
                            e.stopPropagation();
                            rotateBlock(placedBlock.id, 'cw');
                          }}
                        >
                          <RotateCw className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );

  const renderBlockPalette = () => (
    <div className="space-y-3">
      <h4 className="text-center text-white/90 font-medium">Available Blocks</h4>
      <div className="flex justify-center gap-3">
        {blockDesign?.blockTypes.map((blockType) => (
          <motion.div
            key={blockType.id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant={selectedBlockType?.id === blockType.id ? "default" : "outline"}
              className={`
                w-12 h-12 p-0 transition-all duration-200
                ${selectedBlockType?.id === blockType.id
                  ? 'bg-purple-600 border-purple-500 shadow-lg shadow-purple-500/30'
                  : 'bg-white/5 border-white/20 hover:bg-white/10'
                }
              `}
              onClick={() => setSelectedBlockType(blockType)}
            >
              <div 
                className={`w-8 h-8 rounded ${
                  blockType.id === 'red' ? 'bg-red-500' :
                  blockType.id === 'blue' ? 'bg-blue-500' :
                  blockType.id === 'yellow' ? 'bg-yellow-500' :
                  'bg-gray-500'
                }`}
              />
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {!blockDesign ? null : (
        <>
      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h3 className="text-xl font-semibold text-white mb-2">Block Design</h3>
        <p className="text-white/70 text-sm">
          Recreate the target pattern using the available blocks
        </p>
      </motion.div>

      {/* Target pattern */}
      <AnimatePresence>
        {(showTarget || isComplete) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            {renderTargetPattern()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Block palette */}
      {!showTarget && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {renderBlockPalette()}
        </motion.div>
      )}

      {/* Workspace */}
      {!showTarget && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {renderWorkspace()}
        </motion.div>
      )}

      {/* Controls */}
      {!showTarget && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center gap-4"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={resetDesign}
            className="bg-white/5 border-white/20 hover:bg-white/10 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </motion.div>
      )}

      {/* Completion indicator */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-500/20 text-green-300 rounded-lg border border-green-500/30">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Design completed!</span>
          </div>
        </motion.div>
      )}
      </>
      )}
    </div>
  );
} 