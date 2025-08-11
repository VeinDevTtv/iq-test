"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import { TaskData, SpatialObject } from '@/types';

interface SpatialRotationTaskProps {
  taskData: TaskData;
  onAnswer: (answer: number) => void;
  isActive: boolean;
  timeRemaining: number;
}

export function SpatialRotationTask({ taskData, onAnswer, isActive, timeRemaining }: SpatialRotationTaskProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [currentRotation, setCurrentRotation] = useState<[number, number, number]>([0, 0, 0]);
  const [showTarget, setShowTarget] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  const spatialObjects = taskData.spatialObjects || [];
  const rotationAngles = taskData.rotationAngles || [45, 90, 135, 180];

  useEffect(() => {
    if (isActive && showTarget) {
      // Show target for 4 seconds
      const timer = setTimeout(() => setShowTarget(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [isActive, showTarget]);

  useEffect(() => {
    if (selectedAnswer !== null) {
      setIsComplete(true);
      onAnswer(selectedAnswer);
    }
  }, [selectedAnswer, onAnswer]);

  const rotateObject = (axis: 'x' | 'y' | 'z', direction: 1 | -1) => {
    setCurrentRotation(prev => {
      const newRotation: [number, number, number] = [...prev];
      const axisIndex = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;
      newRotation[axisIndex] = (newRotation[axisIndex] + (45 * direction) + 360) % 360;
      return newRotation;
    });
  };

  const render3DObject = (obj: SpatialObject, rotation: [number, number, number]) => {
    const transform = `rotateX(${rotation[0]}deg) rotateY(${rotation[1]}deg) rotateZ(${rotation[2]}deg)`;
    
    return (
      <div 
        className="w-32 h-32 mx-auto perspective-1000"
        style={{ perspective: '1000px' }}
      >
        <div 
          className="w-full h-full relative transform-style-preserve-3d transition-transform duration-500"
          style={{ transform }}
        >
          {obj.shape === '3d_cube' && renderCube(obj.color || '#8B5CF6')}
          {obj.shape === '3d_pyramid' && renderPyramid(obj.color || '#8B5CF6')}
          {obj.shape === '3d_cylinder' && renderCylinder(obj.color || '#8B5CF6')}
        </div>
      </div>
    );
  };

  const renderCube = (color: string) => (
    <>
      {/* Front face */}
      <div 
        className="absolute w-24 h-24 border-2 border-white/30 flex items-center justify-center text-white font-bold"
        style={{ 
          backgroundColor: color,
          transform: 'translateZ(48px)',
          left: '50%',
          top: '50%',
          marginLeft: '-48px',
          marginTop: '-48px'
        }}
      >
        F
      </div>
      {/* Back face */}
      <div 
        className="absolute w-24 h-24 border-2 border-white/30 flex items-center justify-center text-white font-bold"
        style={{ 
          backgroundColor: `${color}CC`,
          transform: 'rotateY(180deg) translateZ(48px)',
          left: '50%',
          top: '50%',
          marginLeft: '-48px',
          marginTop: '-48px'
        }}
      >
        B
      </div>
      {/* Right face */}
      <div 
        className="absolute w-24 h-24 border-2 border-white/30 flex items-center justify-center text-white font-bold"
        style={{ 
          backgroundColor: `${color}99`,
          transform: 'rotateY(90deg) translateZ(48px)',
          left: '50%',
          top: '50%',
          marginLeft: '-48px',
          marginTop: '-48px'
        }}
      >
        R
      </div>
      {/* Left face */}
      <div 
        className="absolute w-24 h-24 border-2 border-white/30 flex items-center justify-center text-white font-bold"
        style={{ 
          backgroundColor: `${color}99`,
          transform: 'rotateY(-90deg) translateZ(48px)',
          left: '50%',
          top: '50%',
          marginLeft: '-48px',
          marginTop: '-48px'
        }}
      >
        L
      </div>
      {/* Top face */}
      <div 
        className="absolute w-24 h-24 border-2 border-white/30 flex items-center justify-center text-white font-bold"
        style={{ 
          backgroundColor: `${color}77`,
          transform: 'rotateX(90deg) translateZ(48px)',
          left: '50%',
          top: '50%',
          marginLeft: '-48px',
          marginTop: '-48px'
        }}
      >
        T
      </div>
      {/* Bottom face */}
      <div 
        className="absolute w-24 h-24 border-2 border-white/30 flex items-center justify-center text-white font-bold"
        style={{ 
          backgroundColor: `${color}77`,
          transform: 'rotateX(-90deg) translateZ(48px)',
          left: '50%',
          top: '50%',
          marginLeft: '-48px',
          marginTop: '-48px'
        }}
      >
        B
      </div>
    </>
  );

  const renderPyramid = (color: string) => (
    <div className="relative">
      <div 
        className="w-0 h-0 mx-auto"
        style={{
          borderLeft: '48px solid transparent',
          borderRight: '48px solid transparent',
          borderBottom: `48px solid ${color}`,
          transform: 'translateY(-24px)'
        }}
      />
      <div 
        className="w-24 h-24 mx-auto"
        style={{
          backgroundColor: `${color}77`,
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          transform: 'translateY(-48px)'
        }}
      />
    </div>
  );

  const renderCylinder = (color: string) => (
    <div className="relative">
      <div 
        className="w-24 h-8 mx-auto rounded-full border-2 border-white/30"
        style={{ backgroundColor: color }}
      />
      <div 
        className="w-24 h-16 mx-auto border-l-2 border-r-2 border-white/30"
        style={{ backgroundColor: `${color}CC` }}
      />
      <div 
        className="w-24 h-8 mx-auto rounded-full border-2 border-white/30"
        style={{ backgroundColor: `${color}99` }}
      />
    </div>
  );

  const renderTarget = () => {
    const targetObject = spatialObjects[0];
    if (!targetObject) return null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="text-center space-y-4"
      >
        <h4 className="text-white/90 font-medium">Study this object</h4>
        <Card className="bg-white/10 border-white/20 p-6 mx-auto max-w-md">
          <CardContent className="p-0">
            {render3DObject(targetObject, targetObject.rotation)}
          </CardContent>
        </Card>
        <p className="text-white/60 text-sm">
          Memorize its orientation. You'll need to rotate another object to match it.
        </p>
      </motion.div>
    );
  };

  const renderRotationTask = () => {
    const taskObject = spatialObjects[1] || spatialObjects[0];
    if (!taskObject) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center">
          <h4 className="text-white/90 font-medium mb-2">
            Rotate this object to match the target orientation
          </h4>
        </div>

        {/* Object display */}
        <Card className="bg-white/10 border-white/20 p-8 mx-auto max-w-md">
          <CardContent className="p-0">
            {render3DObject(taskObject, currentRotation)}
          </CardContent>
        </Card>

        {/* Rotation controls */}
        <div className="space-y-4">
          <div className="text-center text-white/70 text-sm mb-4">
            Current rotation: X: {currentRotation[0]}° Y: {currentRotation[1]}° Z: {currentRotation[2]}°
          </div>
          
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {/* X-axis rotation */}
            <div className="text-center space-y-2">
              <div className="text-white/70 text-sm font-medium">X-Axis</div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => rotateObject('x', 1)}
                  className="bg-red-500/20 border-red-500/30 hover:bg-red-500/30 text-red-300"
                  disabled={!isActive || isComplete}
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => rotateObject('x', -1)}
                  className="bg-red-500/20 border-red-500/30 hover:bg-red-500/30 text-red-300"
                  disabled={!isActive || isComplete}
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Y-axis rotation */}
            <div className="text-center space-y-2">
              <div className="text-white/70 text-sm font-medium">Y-Axis</div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => rotateObject('y', 1)}
                  className="bg-green-500/20 border-green-500/30 hover:bg-green-500/30 text-green-300"
                  disabled={!isActive || isComplete}
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => rotateObject('y', -1)}
                  className="bg-green-500/20 border-green-500/30 hover:bg-green-500/30 text-green-300"
                  disabled={!isActive || isComplete}
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Z-axis rotation */}
            <div className="text-center space-y-2">
              <div className="text-white/70 text-sm font-medium">Z-Axis</div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => rotateObject('z', 1)}
                  className="bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30 text-blue-300"
                  disabled={!isActive || isComplete}
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => rotateObject('z', -1)}
                  className="bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30 text-blue-300"
                  disabled={!isActive || isComplete}
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Submit when ready */}
        <div className="text-center">
          <Button
            onClick={() => setSelectedAnswer(1)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2"
            disabled={!isActive || isComplete}
          >
            This orientation matches the target
          </Button>
        </div>
      </motion.div>
    );
  };

  const renderCompletion = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      <Card className="bg-white/10 border-white/20 p-6">
        <CardContent className="p-0 space-y-4">
          <h3 className="text-2xl font-bold text-white">Task Complete!</h3>
          <p className="text-white/70">
            You submitted your spatial rotation answer.
          </p>
          
          <div className="space-y-2">
            <div className="text-white/90 font-medium">Final Rotation:</div>
            <div className="text-white/70 text-sm">
              X: {currentRotation[0]}° | Y: {currentRotation[1]}° | Z: {currentRotation[2]}°
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h3 className="text-xl font-semibold text-white mb-2">Spatial Rotation</h3>
        <p className="text-white/70 text-sm">
          Rotate the 3D object to match the target orientation
        </p>
      </motion.div>

      {/* Main content */}
      <AnimatePresence mode="wait">
        {showTarget && (
          <motion.div key="target">
            {renderTarget()}
          </motion.div>
        )}
        
        {!showTarget && !isComplete && (
          <motion.div key="task">
            {renderRotationTask()}
          </motion.div>
        )}
        
        {isComplete && (
          <motion.div key="complete">
            {renderCompletion()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 