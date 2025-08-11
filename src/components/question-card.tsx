"use client"

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, Brain, TrendingUp, AlertTriangle, Play, Pause } from 'lucide-react';
import { useTestStore } from '@/store/test-store';
import { formatTime } from '@/lib/utils';
import { Question, TaskType } from '@/types';
import { useTranslation } from 'react-i18next';
import { getLocalizedQuestion } from '@/lib/localized-questions';

// Import task components
import { MatrixReasoningTask } from './tasks/matrix-reasoning-task';
import { BlockDesignTask } from './tasks/block-design-task';
import { VisualPuzzleTask } from './tasks/visual-puzzle-task';
import { DigitSpanTask } from './tasks/digit-span-task';
import { SymbolCodingTask } from './tasks/symbol-coding-task';
import { SpatialRotationTask } from './tasks/spatial-rotation-task';
import { WorkingMemoryTask } from './tasks/working-memory-task';
import { ProcessingSpeedTask } from './tasks/processing-speed-task';
import { FigureWeightsTask } from './tasks/figure-weights-task';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
}

export function QuestionCard({ question, questionNumber, totalQuestions }: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [taskAnswer, setTaskAnswer] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taskStarted, setTaskStarted] = useState(false);
  const [isMasked, setIsMasked] = useState(false);

  const { i18n } = useTranslation();
  const { 
    submitAnswer, 
    currentSession, 
    pauseTest,
    resumeTest,
    config,
    activateCurrentQuestion
  } = useTestStore();

  // Force re-render when language changes
  const [, forceUpdate] = useState({});
  useEffect(() => {
    const handleLanguageChange = () => {
      forceUpdate({});
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    i18n.on('languageChanged', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  // Get localized question
  const getLocalizedQuestionForRender = () => {
    const currentLocale = i18n.language.split('-')[0];
    const localized = getLocalizedQuestion(question.id, currentLocale);
    return localized || question;
  };
  
  const localizedQuestion = getLocalizedQuestionForRender();

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setTaskAnswer(null);
    setIsSubmitting(false);
    setTaskStarted(false);
    if (config?.presentationMaskMs && config.presentationMaskMs > 0) {
      setIsMasked(true);
      const t = setTimeout(() => setIsMasked(false), config.presentationMaskMs);
      return () => clearTimeout(t);
    } else {
      setIsMasked(false);
    }
  }, [localizedQuestion.id, localizedQuestion.timeLimit, config?.presentationMaskMs]);

  // Auto-activate MCQ when gating is disabled and mask is cleared
  useEffect(() => {
    const gatingDisabled = !localizedQuestion.taskType && !(config?.requireStartForMCQ ?? false);
    if (gatingDisabled && !isMasked && !taskStarted) {
      setTaskStarted(true);
      activateCurrentQuestion();
    }
  }, [localizedQuestion.id, localizedQuestion.taskType, config?.requireStartForMCQ, isMasked, taskStarted, activateCurrentQuestion]);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    let finalAnswer: number;
    
    if (localizedQuestion.taskType && taskAnswer !== null) {
      // For interactive tasks, use task answer
      finalAnswer = taskAnswer;
    } else {
      // For multiple choice, use selected answer
      finalAnswer = selectedAnswer ?? -1;
    }
    
    submitAnswer(finalAnswer);
    
    // Small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setIsSubmitting(false);
  }, [isSubmitting, submitAnswer, selectedAnswer, taskAnswer, localizedQuestion.taskType]);

  const handlePauseToggle = () => {
    if (currentSession?.isPaused) {
      resumeTest();
    } else {
      pauseTest();
    }
  };

  // Timers centralized in store via page-level effect

  const progressPercentage = ((questionNumber - 1) / totalQuestions) * 100;
  const timeRemaining = currentSession?.questionTimeRemaining ?? localizedQuestion.timeLimit;
  const timeProgressPercentage = (timeRemaining / localizedQuestion.timeLimit) * 100;
  const globalTimeRemaining = currentSession?.globalTimeRemaining || 0;
  
  const isTimeWarning = timeRemaining <= 10;
  const isTimeCritical = timeRemaining <= 5;
  const isGlobalTimeWarning = globalTimeRemaining <= 300;

  const renderTaskComponent = () => {
    if (!localizedQuestion.taskType || !localizedQuestion.taskData) {
      return null;
    }

    const taskProps = {
      taskData: localizedQuestion.taskData,
      onAnswer: setTaskAnswer,
      isActive: taskStarted && !currentSession?.isPaused && !isMasked,
      timeRemaining
    };

    switch (localizedQuestion.taskType) {
      case TaskType.MATRIX_COMPLETION:
        return <MatrixReasoningTask {...taskProps} />;
      case TaskType.BLOCK_ASSEMBLY:
        return <BlockDesignTask {...taskProps} />;
      case TaskType.VISUAL_PUZZLE:
        return <VisualPuzzleTask {...taskProps} />;
      case TaskType.DIGIT_SPAN:
        return <DigitSpanTask {...taskProps} />;
      case TaskType.SYMBOL_CODING:
        return <SymbolCodingTask {...taskProps} />;
      case TaskType.SPATIAL_ROTATION:
        return <SpatialRotationTask {...taskProps} />;
      case TaskType.WORKING_MEMORY_NBACK:
        return <WorkingMemoryTask {...taskProps} />;
      case TaskType.PROCESSING_SPEED_SCAN:
        return <ProcessingSpeedTask {...taskProps} />;
      case TaskType.FIGURE_BALANCE:
        return <FigureWeightsTask {...taskProps} />;
      default:
        return null;
    }
  };

  const isTaskReady = localizedQuestion.taskType ? (taskAnswer !== null) : (selectedAnswer !== null);
  const shouldGateMCQ = !localizedQuestion.taskType && (config?.requireStartForMCQ ?? false);
  const isPaused = !!currentSession?.isPaused;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 test-secure">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl"
      >
        {/* Header with enhanced progress and controls */}
        <div className="mb-6 space-y-4">
          {/* Enhanced Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm text-white/90">
              <div className="flex items-center space-x-4">
                <span className="font-medium">Question {questionNumber} of {totalQuestions}</span>
                <span className="px-2 py-1 bg-white/10 rounded text-xs">
                  {localizedQuestion.category}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-white/70">
                  Ability: {currentSession?.abilityEstimate?.toFixed(1) || '0.0'}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePauseToggle}
                  className="bg-white/10 border-white/20 hover:bg-white/20"
                >
                  {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <Progress value={progressPercentage} className="h-3 bg-white/10" />
          </div>

          {/* Enhanced Timers */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <motion.div 
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                  isTimeWarning ? (isTimeCritical ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300') 
                  : 'bg-white/10 text-white/90'
                }`}
                animate={isTimeCritical ? { scale: [1, 1.05, 1] } : {}}
                transition={{ repeat: isTimeCritical ? Infinity : 0, duration: 1 }}
              >
                <Clock className="w-4 h-4" />
                <span className="font-mono text-sm font-medium">
                  {formatTime(timeRemaining)}
                </span>
              </motion.div>
              
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                isGlobalTimeWarning ? 'bg-orange-500/20 text-orange-300' : 'bg-white/10 text-white/90'
              }`}>
                <Brain className="w-4 h-4" />
                <span className="font-mono text-sm">
                  Total: {formatTime(globalTimeRemaining)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-white/70">
              <TrendingUp className="w-4 h-4" />
              <span>Level {localizedQuestion.difficulty}/10</span>
            </div>
          </div>

          {/* Enhanced Timer Progress */}
          <Progress 
            value={timeProgressPercentage} 
            className={`h-2 ${isTimeWarning ? 'bg-red-900/30' : 'bg-white/10'}`}
          />
        </div>

        {/* Enhanced Question Card */}
        <Card className="shadow-2xl border-0 bg-white/10 backdrop-blur-lg text-white">
          <CardHeader className="pb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="px-3 py-1 bg-purple-500/30 text-purple-200 text-sm font-medium rounded-full">
                    {localizedQuestion.category}
                  </span>
                  <span className="px-3 py-1 bg-white/10 text-white/80 text-sm rounded-full">
                    Difficulty {localizedQuestion.difficulty}
                  </span>
                  {localizedQuestion.taskType && (
                    <span className="px-3 py-1 bg-blue-500/30 text-blue-200 text-sm rounded-full">
                      Interactive Task
                    </span>
                  )}
                </div>
                <CardTitle className={`text-2xl leading-relaxed text-white ${isMasked ? 'blur-sm select-none' : ''}`}>
                  {localizedQuestion.question}
                </CardTitle>
              </div>
              {isTimeWarning && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex-shrink-0 ml-4"
                >
                  <AlertTriangle className={`w-7 h-7 ${isTimeCritical ? 'text-red-400' : 'text-yellow-400'}`} />
                </motion.div>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Interactive Task or Traditional Question */}
            {localizedQuestion.taskType ? (
              <div className="space-y-4">
                {!taskStarted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8"
                  >
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <h3 className="text-lg font-semibold mb-3">Ready to start?</h3>
                      <p className="text-white/70 mb-4">
                        This is an interactive cognitive task. Click start when you're ready to begin.
                      </p>
                      <Button
                        onClick={() => { setTaskStarted(true); activateCurrentQuestion(); }}
                        size="lg"
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Start Task
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderTaskComponent()}
                  </motion.div>
                )}
              </div>
            ) : (
              // Traditional multiple choice questions with enhanced UI
              <div className="space-y-4">
                {(shouldGateMCQ && !taskStarted) ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8"
                  >
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <h3 className="text-lg font-semibold mb-3">Ready to start?</h3>
                      <p className="text-white/70 mb-4">
                        Click start when you're ready. Options will be revealed.
                      </p>
                      <Button
                        onClick={() => { setTaskStarted(true); activateCurrentQuestion(); }}
                        size="lg"
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                        disabled={isMasked}
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Start
                      </Button>
                    </div>
                  </motion.div>
                ) : null}
                {/* Question Image */}
                {localizedQuestion.image && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center mb-6"
                  >
                    <div className="max-w-lg bg-white/5 rounded-lg p-4 border border-white/10">
                      <img 
                        src={localizedQuestion.image} 
                        alt="Question diagram" 
                        className={`w-full h-auto rounded-lg ${isMasked ? 'blur-sm select-none' : ''}`}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Enhanced Answer Options */}
                <div className="grid grid-cols-1 gap-4">
                  <AnimatePresence>
                    {localizedQuestion.options.map((option, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant={selectedAnswer === index ? "default" : "outline"}
                          className={`w-full p-6 h-auto text-left justify-start transition-all duration-300 ${
                            selectedAnswer === index 
                              ? 'bg-purple-600 hover:bg-purple-700 border-purple-500 shadow-lg shadow-purple-500/25' 
                              : 'bg-white/5 hover:bg-white/10 border-white/20 text-white'
                          }`}
                          onClick={() => setSelectedAnswer(index)}
                          disabled={isSubmitting || isPaused || isMasked || (shouldGateMCQ && !taskStarted)}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all ${
                              selectedAnswer === index 
                                ? 'bg-white text-purple-600 border-white' 
                                : 'border-white/40 text-white/70'
                            }`}>
                              {String.fromCharCode(65 + index)}
                            </div>
                            <span className={`text-base ${isMasked ? 'blur-sm select-none' : ''}`}>{option}</span>
                          </div>
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Enhanced Submit Button */}
            <div className="flex justify-center pt-6">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !isTaskReady || isPaused || isMasked || (shouldGateMCQ && !taskStarted)}
                size="lg"
                className="min-w-[250px] bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : isPaused ? (
                  <span>Test Paused</span>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>
                      {isTaskReady ? 'Submit Answer' : 'Select Answer to Continue'}
                    </span>
                    {isTaskReady && <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1 }}>→</motion.div>}
                  </div>
                )}
              </Button>
            </div>

            {/* Enhanced Help Text */}
            <div className="text-center text-sm text-white/60 pt-4">
              {isMasked ? (
                <p>Preparing your next item...</p>
              ) : isPaused ? (
                <p>Test is paused. Click the pause button to resume.</p>
              ) : !isTaskReady ? (
                <p>Complete the task or select an answer to continue</p>
              ) : (
                <p>Click "Submit Answer" to proceed to the next question</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 