import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  TestSession, 
  UserAnswer, 
  TestResult, 
  Question, 
  QuestionCategory, 
  IQClassification, 
  AdaptiveTestConfig,
  DomainAnalysis,
  SecurityMetrics,
  IRTParameters
} from '@/types';
import { questions } from '@/data/questions';
import { irtEngine } from '@/lib/irt-engine';
import { getLocalizedQuestions } from '@/lib/localized-questions';
import i18n from '@/lib/i18n';
import { questionService } from '@/services/question-service';
import { getCurrentLocale } from '@/lib/i18n';

interface TestStore {
  // Current test session
  currentSession: TestSession | null;
  testResult: TestResult | null;
  
  // Configuration
  config: AdaptiveTestConfig;
  
  // Security and analytics
  securityMetrics: SecurityMetrics;
  
  // Actions
  startTest: () => void;
  submitAnswer: (answer: number) => void;
  pauseTest: () => void;
  resumeTest: () => void;
  endTest: () => void;
  resetTest: () => void;
  updateTimer: () => void;
  
  // Advanced analytics
  calculateAdvancedResults: () => TestResult;
  getDomainAnalysis: (category: QuestionCategory) => DomainAnalysis;
  getSecurityAnalysis: () => SecurityMetrics;
  
  // IRT-based methods
  updateAbilityEstimate: () => void;
  selectNextQuestion: () => Question | null;
  calculateFinalIQ: () => number;
  
  // Helper methods
  updateSecurityMetrics: (answer: UserAnswer) => void;
}

const defaultConfig: AdaptiveTestConfig = {
  totalQuestions: 30,
  globalTimeLimit: 1800, // 30 minutes
  questionTimeLimit: 60, // 60 seconds per question
  startingAbility: 0.0, // Average ability
  minAbility: -3.0,
  maxAbility: 3.0,
  targetStandardError: 0.3,
  maxStandardError: 1.0,
  selectionMethod: 'MaxInfo',
  exposureControl: true,
  contentBalancing: true,
  priorMean: 0.0,
  priorVariance: 1.0,
  penalizeSlowAnswers: true,
  penalizeFastAnswers: true,
  timeWeightFactor: 0.1
};

const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const getIQClassification = (iq: number): IQClassification => {
  if (iq >= 160) return IQClassification.EXTREMELY_GIFTED;
  if (iq >= 145) return IQClassification.HIGHLY_GIFTED;
  if (iq >= 130) return IQClassification.MODERATELY_GIFTED;
  if (iq >= 120) return IQClassification.SUPERIOR;
  if (iq >= 110) return IQClassification.HIGH_AVERAGE;
  if (iq >= 90) return IQClassification.AVERAGE;
  if (iq >= 80) return IQClassification.LOW_AVERAGE;
  if (iq >= 70) return IQClassification.BORDERLINE;
  return IQClassification.EXTREMELY_LOW;
};

export const useTestStore = create<TestStore>()(
  persist(
    (set, get) => ({
      currentSession: null,
      testResult: null,
      config: defaultConfig,
      securityMetrics: {
        suspiciousPatterns: [],
        responseTimeAnomalies: [],
        accuracyAnomalies: [],
        possibleCheatingIndicators: {
          tooFastResponses: 0,
          perfectAccuracyStreak: 0,
          unusualPatterns: []
        }
      },

      startTest: () => {
        const sessionId = generateSessionId();
        // Get localized questions based on current language
        const currentLocale = i18n.language || 'en';
        const localizedQuestions = getLocalizedQuestions(currentLocale);
        const shuffledQuestions = shuffleArray(localizedQuestions);
        
        // Initialize domain coverage tracking
        const domainCoverage: Record<QuestionCategory, number> = {
          [QuestionCategory.PATTERN_RECOGNITION]: 0,
          [QuestionCategory.SPATIAL_REASONING]: 0,
          [QuestionCategory.LOGICAL_DEDUCTION]: 0,
          [QuestionCategory.SHORT_TERM_MEMORY]: 0,
          [QuestionCategory.NUMERICAL_REASONING]: 0
        };
        
        const targetDomainBalance: Record<QuestionCategory, number> = {
          [QuestionCategory.PATTERN_RECOGNITION]: 6,
          [QuestionCategory.SPATIAL_REASONING]: 6,
          [QuestionCategory.LOGICAL_DEDUCTION]: 6,
          [QuestionCategory.SHORT_TERM_MEMORY]: 6,
          [QuestionCategory.NUMERICAL_REASONING]: 6
        };

        const newSession: TestSession = {
          id: sessionId,
          startTime: new Date(),
          currentQuestionIndex: 0,
          questions: shuffledQuestions,
          answers: [],
          globalTimeRemaining: get().config.globalTimeLimit,
          abilityEstimate: get().config.startingAbility,
          abilityHistory: [get().config.startingAbility],
          standardError: 1.0, // Initial high uncertainty
          isCompleted: false,
          isPaused: false,
          domainCoverage,
          targetDomainBalance
        };

        set({ 
          currentSession: newSession, 
          testResult: null,
          securityMetrics: {
            suspiciousPatterns: [],
            responseTimeAnomalies: [],
            accuracyAnomalies: [],
            possibleCheatingIndicators: {
              tooFastResponses: 0,
              perfectAccuracyStreak: 0,
              unusualPatterns: []
            }
          }
        });
      },

      submitAnswer: (answer: number) => {
        const { currentSession, config } = get();
        if (!currentSession || currentSession.isCompleted) return;

        const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex];
        if (!currentQuestion) return;

        const responseTime = Date.now() - (currentSession.startTime.getTime() + 
          (currentSession.currentQuestionIndex * config.questionTimeLimit * 1000));
        
        const isCorrect = answer === currentQuestion.correctAnswer;
        
        // Calculate IRT parameters for current question
        const irtParams: IRTParameters = {
          discrimination: currentQuestion.a,
          difficulty: currentQuestion.b,
          guessing: currentQuestion.c
        };
        
        // Calculate probability of correct response given current ability
        const probabilityCorrect = irtEngine.calculateProbability(
          currentSession.abilityEstimate, 
          irtParams
        );
        
        // Calculate information value
        const informationValue = irtEngine.calculateInformation(
          currentSession.abilityEstimate,
          irtParams
        );

        const userAnswer: UserAnswer = {
          questionId: currentQuestion.id,
          selectedAnswer: answer,
          isCorrect,
          responseTime,
          timestamp: new Date(),
          difficulty: currentQuestion.difficulty,
          abilityBeforeAnswer: currentSession.abilityEstimate,
          abilityAfterAnswer: currentSession.abilityEstimate, // Will be updated below
          probabilityCorrect,
          informationValue,
          standardErrorBefore: currentSession.standardError,
          standardErrorAfter: currentSession.standardError // Will be updated below
        };

        // Update ability estimate using Bayesian method
        const responses = [...currentSession.answers, userAnswer].map(ans => ({
          item: {
            discrimination: currentSession.questions.find(q => q.id === ans.questionId)?.a || 1.0,
            difficulty: currentSession.questions.find(q => q.id === ans.questionId)?.b || 0.0,
            guessing: currentSession.questions.find(q => q.id === ans.questionId)?.c || 0.25
          },
          correct: ans.isCorrect
        }));

        const bayesianEstimate = irtEngine.estimateAbilityBayesian(responses);
        
        // Update answer with new ability estimates
        userAnswer.abilityAfterAnswer = bayesianEstimate.ability;
        userAnswer.standardErrorAfter = bayesianEstimate.standardError;

        // Update domain coverage
        const updatedDomainCoverage = { ...currentSession.domainCoverage };
        updatedDomainCoverage[currentQuestion.category]++;

        const updatedSession: TestSession = {
          ...currentSession,
          currentQuestionIndex: currentSession.currentQuestionIndex + 1,
          answers: [...currentSession.answers, userAnswer],
          abilityEstimate: bayesianEstimate.ability,
          abilityHistory: [...currentSession.abilityHistory, bayesianEstimate.ability],
          standardError: bayesianEstimate.standardError,
          domainCoverage: updatedDomainCoverage,
          isCompleted: currentSession.currentQuestionIndex + 1 >= config.totalQuestions ||
                      bayesianEstimate.standardError <= config.targetStandardError
        };

        set({ currentSession: updatedSession });

        // Update security metrics
        get().updateSecurityMetrics(userAnswer);

        // End test if completed
        if (updatedSession.isCompleted) {
          get().endTest();
        }
      },

      updateAbilityEstimate: () => {
        // This method is handled internally by submitAnswer
        // Kept for interface compatibility
        // TODO: Implement this method if needed for future updates (not used in the current implementation) 
      },

      selectNextQuestion: (): Question | null => {
        const { currentSession } = get();
        if (!currentSession) return null;

        const answeredQuestionIds = new Set(currentSession.answers.map(a => a.questionId));
        
        // Calculate remaining domain requirements
        const domainConstraints: Record<string, number> = {};
        Object.entries(currentSession.targetDomainBalance).forEach(([category, target]) => {
          const current = currentSession.domainCoverage[category as QuestionCategory];
          domainConstraints[category] = Math.max(0, target - current);
        });

        return irtEngine.selectNextQuestion(
          currentSession.abilityEstimate,
          currentSession.questions,
          answeredQuestionIds,
          domainConstraints
        );
      },

      calculateFinalIQ: (): number => {
        const { currentSession } = get();
        if (!currentSession) return 100;
        
        return irtEngine.abilityToIQ(currentSession.abilityEstimate);
      },

      pauseTest: () => {
        set(state => ({
          currentSession: state.currentSession ? {
            ...state.currentSession,
            isPaused: true
          } : null
        }));
      },

      resumeTest: () => {
        set(state => ({
          currentSession: state.currentSession ? {
            ...state.currentSession,
            isPaused: false
          } : null
        }));
      },

      endTest: () => {
        const { currentSession } = get();
        if (!currentSession) return;

        const endTime = new Date();
        const result = get().calculateAdvancedResults();
        
        set({
          currentSession: {
            ...currentSession,
            endTime,
            isCompleted: true
          },
          testResult: result
        });
      },

      resetTest: () => {
        set({
          currentSession: null,
          testResult: null,
          securityMetrics: {
            suspiciousPatterns: [],
            responseTimeAnomalies: [],
            accuracyAnomalies: [],
            possibleCheatingIndicators: {
              tooFastResponses: 0,
              perfectAccuracyStreak: 0,
              unusualPatterns: []
            }
          }
        });
      },

      updateTimer: () => {
        set(state => {
          if (!state.currentSession || state.currentSession.isPaused || state.currentSession.isCompleted) {
            return state;
          }

          const newTimeRemaining = Math.max(0, state.currentSession.globalTimeRemaining - 1);
          
          if (newTimeRemaining === 0) {
            // Time's up - end the test
            setTimeout(() => get().endTest(), 100);
          }

          return {
            currentSession: {
              ...state.currentSession,
              globalTimeRemaining: newTimeRemaining
            }
          };
        });
      },

      calculateAdvancedResults: (): TestResult => {
        const { currentSession } = get();
        if (!currentSession) throw new Error('No active session');

        const answers = currentSession.answers;
        const correctAnswers = answers.filter(a => a.isCorrect).length;
        const accuracy = answers.length > 0 ? (correctAnswers / answers.length) * 100 : 0;
        const averageResponseTime = answers.length > 0 
          ? answers.reduce((sum, a) => sum + a.responseTime, 0) / answers.length 
          : 0;

        // Calculate category scores with IRT-based analysis
        const categoryScores = Object.values(QuestionCategory).map(category => {
          const categoryAnswers = answers.filter(a => {
            const question = currentSession.questions.find(q => q.id === a.questionId);
            return question?.category === category;
          });

          if (categoryAnswers.length === 0) {
            return {
              category,
              correct: 0,
              total: 0,
              accuracy: 0,
              averageResponseTime: 0,
              averageDifficulty: 0,
              abilityEstimate: 0,
              standardError: 1.0,
              informationGained: 0
            };
          }

          const categoryCorrect = categoryAnswers.filter(a => a.isCorrect).length;
          const categoryAccuracy = (categoryCorrect / categoryAnswers.length) * 100;
          const categoryAvgTime = categoryAnswers.reduce((sum, a) => sum + a.responseTime, 0) / categoryAnswers.length;
          const categoryAvgDifficulty = categoryAnswers.reduce((sum, a) => sum + a.difficulty, 0) / categoryAnswers.length;
          
          // Calculate domain-specific ability estimate
          const domainResponses = categoryAnswers.map(ans => ({
            item: {
              discrimination: currentSession.questions.find(q => q.id === ans.questionId)?.a || 1.0,
              difficulty: currentSession.questions.find(q => q.id === ans.questionId)?.b || 0.0,
              guessing: currentSession.questions.find(q => q.id === ans.questionId)?.c || 0.25
            },
            correct: ans.isCorrect
          }));

          const domainEstimate = irtEngine.estimateAbilityBayesian(domainResponses);
          const informationGained = categoryAnswers.reduce((sum, a) => sum + a.informationValue, 0);

          return {
            category,
            correct: categoryCorrect,
            total: categoryAnswers.length,
            accuracy: categoryAccuracy,
            averageResponseTime: categoryAvgTime,
            averageDifficulty: categoryAvgDifficulty,
            abilityEstimate: domainEstimate.ability,
            standardError: domainEstimate.standardError,
            informationGained
          };
        });

        // Calculate final IQ and related metrics
        const finalAbilityEstimate = currentSession.abilityEstimate;
        const estimatedIQ = irtEngine.abilityToIQ(finalAbilityEstimate);
        const percentileRank = irtEngine.abilityToPercentile(finalAbilityEstimate);
        const classification = getIQClassification(estimatedIQ);
        const confidenceInterval = irtEngine.calculateConfidenceInterval(
          finalAbilityEstimate, 
          currentSession.standardError
        );
        const confidenceIntervalIQ: [number, number] = [
          irtEngine.abilityToIQ(confidenceInterval[0]),
          irtEngine.abilityToIQ(confidenceInterval[1])
        ];

        // Calculate reliability metrics
        const cronbachAlpha = irtEngine.calculateCronbachAlpha(answers);
        const measurementPrecision = 1 / currentSession.standardError;
        const testReliability = Math.max(0, 1 - (currentSession.standardError * currentSession.standardError));

        // Generate domain mastery analysis
        const domainMastery: Record<QuestionCategory, DomainAnalysis> = {
          [QuestionCategory.PATTERN_RECOGNITION]: get().getDomainAnalysis(QuestionCategory.PATTERN_RECOGNITION),
          [QuestionCategory.SPATIAL_REASONING]: get().getDomainAnalysis(QuestionCategory.SPATIAL_REASONING),
          [QuestionCategory.LOGICAL_DEDUCTION]: get().getDomainAnalysis(QuestionCategory.LOGICAL_DEDUCTION),
          [QuestionCategory.SHORT_TERM_MEMORY]: get().getDomainAnalysis(QuestionCategory.SHORT_TERM_MEMORY),
          [QuestionCategory.NUMERICAL_REASONING]: get().getDomainAnalysis(QuestionCategory.NUMERICAL_REASONING)
        };

        const completionTime = currentSession.endTime 
          ? (currentSession.endTime.getTime() - currentSession.startTime.getTime()) / 1000
          : (Date.now() - currentSession.startTime.getTime()) / 1000;

        return {
          sessionId: currentSession.id,
          totalQuestions: answers.length,
          correctAnswers,
          accuracy,
          averageResponseTime,
          categoryScores,
          estimatedIQ,
          finalAbilityEstimate,
          standardError: currentSession.standardError,
          confidenceInterval: confidenceIntervalIQ,
          percentileRank,
          classification,
          difficultyProgression: answers.map(a => a.difficulty),
          abilityProgression: currentSession.abilityHistory,
          responseTimeProgression: answers.map(a => a.responseTime),
          informationCurve: answers.map(a => a.informationValue),
          domainMastery,
          completionTime,
          cronbachAlpha,
          measurementPrecision,
          testReliability
        };
      },

      getDomainAnalysis: (category: QuestionCategory): DomainAnalysis => {
        const { currentSession } = get();
        if (!currentSession) {
          return {
            abilityEstimate: 0,
            standardError: 1.0,
            questionsAnswered: 0,
            averageInformation: 0,
            masteryLevel: 'Novice',
            strengthAreas: [],
            improvementAreas: []
          };
        }

        const categoryAnswers = currentSession.answers.filter(a => {
          const question = currentSession.questions.find(q => q.id === a.questionId);
          return question?.category === category;
        });

        if (categoryAnswers.length === 0) {
          return {
            abilityEstimate: 0,
            standardError: 1.0,
            questionsAnswered: 0,
            averageInformation: 0,
            masteryLevel: 'Novice',
            strengthAreas: [],
            improvementAreas: []
          };
        }

        const domainResponses = categoryAnswers.map(ans => ({
          item: {
            discrimination: currentSession.questions.find(q => q.id === ans.questionId)?.a || 1.0,
            difficulty: currentSession.questions.find(q => q.id === ans.questionId)?.b || 0.0,
            guessing: currentSession.questions.find(q => q.id === ans.questionId)?.c || 0.25
          },
          correct: ans.isCorrect
        }));

        const domainEstimate = irtEngine.estimateAbilityBayesian(domainResponses);
        const averageInformation = categoryAnswers.reduce((sum, a) => sum + a.informationValue, 0) / categoryAnswers.length;
        
        // Determine mastery level based on ability estimate
        let masteryLevel: 'Novice' | 'Developing' | 'Proficient' | 'Advanced' | 'Expert';
        if (domainEstimate.ability >= 2.0) masteryLevel = 'Expert';
        else if (domainEstimate.ability >= 1.0) masteryLevel = 'Advanced';
        else if (domainEstimate.ability >= 0.0) masteryLevel = 'Proficient';
        else if (domainEstimate.ability >= -1.0) masteryLevel = 'Developing';
        else masteryLevel = 'Novice';

        // Generate strength and improvement areas based on performance patterns
        const strengthAreas: string[] = [];
        const improvementAreas: string[] = [];

        const accuracy = categoryAnswers.filter(a => a.isCorrect).length / categoryAnswers.length;
        const avgResponseTime = categoryAnswers.reduce((sum, a) => sum + a.responseTime, 0) / categoryAnswers.length;

        if (accuracy >= 0.8) strengthAreas.push('High accuracy');
        if (avgResponseTime < 30000) strengthAreas.push('Quick response time');
        if (domainEstimate.standardError < 0.5) strengthAreas.push('Consistent performance');

        if (accuracy < 0.6) improvementAreas.push('Accuracy needs improvement');
        if (avgResponseTime > 45000) improvementAreas.push('Response time could be faster');
        if (domainEstimate.standardError > 0.8) improvementAreas.push('Performance consistency');

        return {
          abilityEstimate: domainEstimate.ability,
          standardError: domainEstimate.standardError,
          questionsAnswered: categoryAnswers.length,
          averageInformation,
          masteryLevel,
          strengthAreas,
          improvementAreas
        };
      },

      getSecurityAnalysis: (): SecurityMetrics => {
        const { currentSession } = get();
        if (!currentSession) {
          return {
            suspiciousPatterns: [],
            responseTimeAnomalies: [],
            accuracyAnomalies: [],
            possibleCheatingIndicators: {
              tooFastResponses: 0,
              perfectAccuracyStreak: 0,
              unusualPatterns: []
            }
          };
        }

        const suspiciousPatterns = irtEngine.detectCheatingPatterns(currentSession.answers);
        
        // Analyze response time anomalies
        const responseTimes = currentSession.answers.map(a => a.responseTime);
        const avgTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
        const responseTimeAnomalies = responseTimes.filter(time => 
          time < avgTime * 0.2 || time > avgTime * 3
        );

        // Analyze accuracy anomalies
        const accuracyAnomalies: number[] = [];
        let perfectStreak = 0;
        let maxPerfectStreak = 0;

        currentSession.answers.forEach((answer, index) => {
          if (answer.isCorrect) {
            perfectStreak++;
            maxPerfectStreak = Math.max(maxPerfectStreak, perfectStreak);
          } else {
            perfectStreak = 0;
          }

          // Check for accuracy anomalies (correct answers on very difficult questions)
          if (answer.isCorrect && answer.difficulty > 8) {
            accuracyAnomalies.push(index);
          }
        });

        const tooFastResponses = responseTimes.filter(time => time < 2000).length;

        return {
          suspiciousPatterns,
          responseTimeAnomalies,
          accuracyAnomalies,
          possibleCheatingIndicators: {
            tooFastResponses,
            perfectAccuracyStreak: maxPerfectStreak,
            unusualPatterns: suspiciousPatterns
          }
        };
      },

      // Helper method to update security metrics
      updateSecurityMetrics: (answer: UserAnswer) => {
        set(state => {
          const newMetrics = { ...state.securityMetrics };
          
          // Check for fast responses
          if (answer.responseTime < 2000) {
            newMetrics.possibleCheatingIndicators.tooFastResponses++;
          }

          // Update perfect accuracy streak
          if (answer.isCorrect) {
            newMetrics.possibleCheatingIndicators.perfectAccuracyStreak++;
          } else {
            newMetrics.possibleCheatingIndicators.perfectAccuracyStreak = 0;
          }

          return { securityMetrics: newMetrics };
        });
      }
    }),
    {
      name: 'iq-test-storage',
      partialize: (state) => ({
        testResult: state.testResult,
        config: state.config
      })
    }
  )
); 