import { Question, QuestionCategory, TaskType, MatrixPattern, BlockDesignTask, VisualPuzzleTask, TaskData } from '@/types';

// Helper function to generate IRT parameters based on difficulty
const generateIRTParams = (difficulty: number) => {
  // Map difficulty (1-10) to IRT parameters
  const difficultyToB = (diff: number) => (diff - 5.5) * 0.6; // Maps 1-10 to roughly -2.7 to +2.7
  const difficultyToA = (diff: number) => 0.8 + (diff / 10) * 1.4; // Maps 1-10 to 0.8-2.2 discrimination
  
  return {
    a: Number((difficultyToA(difficulty)).toFixed(2)), // discrimination
    b: Number((difficultyToB(difficulty)).toFixed(2)), // difficulty in logits
    c: 0.25, // guessing parameter for 4-option MCQ
    timesAnswered: Math.floor(Math.random() * 1000) + 100, // Simulated calibration data
    timesCorrect: 0, // Will be calculated
    averageResponseTime: 30000 + (difficulty * 5000), // Harder questions take longer
    lastCalibrated: new Date()
  };
};

export const questions: Question[] = [
  // MATRIX REASONING INTERACTIVE TASKS
  {
    id: 'mx_001',
    category: QuestionCategory.MATRIX_REASONING,
    difficulty: 2,
    question: 'Complete the matrix by finding the missing pattern',
    options: [], // Not used for interactive tasks
    correctAnswer: 0,
    timeLimit: 90,
    explanation: 'Look for numerical sequences across rows and columns',
    taskType: TaskType.MATRIX_COMPLETION,
    taskData: {
      matrixPattern: {
        grid: [
          ['1', '2', '3'],
          ['4', '5', '6'],
          ['7', '8', null]
        ],
        missingIndex: [2, 2],
        options: ['9', '0', '7', '6'],
        correctOption: 0,
        pattern: 'sequence'
      }
    },
    ...generateIRTParams(2)
  },
  {
    id: 'mx_003',
    category: QuestionCategory.MATRIX_REASONING,
    difficulty: 5,
    question: 'Complete the matrix based on addition across rows',
    options: [],
    correctAnswer: 2,
    timeLimit: 120,
    explanation: 'Each cell equals the sum of the two previous cells in the row',
    taskType: TaskType.MATRIX_COMPLETION,
    taskData: {
      matrixPattern: {
        grid: [
          ['1', '2', '3'],
          ['2', '3', '5'],
          ['3', '5', null]
        ],
        missingIndex: [2, 2],
        options: ['5', '6', '8', '9'],
        correctOption: 2,
        pattern: 'addition'
      }
    },
    ...generateIRTParams(5)
  },
  {
    id: 'vp_002',
    category: QuestionCategory.VISUAL_PUZZLES,
    difficulty: 5,
    question: 'Select pieces to form a symmetric target',
    options: [],
    correctAnswer: 1,
    timeLimit: 120,
    explanation: 'Identify symmetrical components',
    taskType: TaskType.VISUAL_PUZZLE,
    taskData: {
      visualPuzzle: {
        completedImage: 'data:image/svg+xml;base64,PHN2Zy8+',
        pieces: [
          { id: 'A', shape: 'triangle', rotation: 0 },
          { id: 'B', shape: 'square', rotation: 0 },
          { id: 'C', shape: 'triangle', rotation: 0 },
          { id: 'D', shape: 'circle', rotation: 0 },
          { id: 'E', shape: 'square', rotation: 0 },
          { id: 'F', shape: 'pentagon', rotation: 0 }
        ],
        correctCombination: ['A', 'C', 'E'],
        gridSize: [3, 3]
      }
    },
    ...generateIRTParams(5)
  },
  {
    id: 'fw_002',
    category: QuestionCategory.FIGURE_WEIGHTS,
    difficulty: 5,
    question: 'Balance with composite weights',
    options: [],
    correctAnswer: 1,
    timeLimit: 150,
    explanation: 'Consider both sides and choose correct mass',
    taskType: TaskType.FIGURE_BALANCE,
    taskData: {
      scaleData: {
        leftSide: [
          { id: '1', value: 4, shape: 'square', color: '#3B82F6' },
          { id: '2', value: 7, shape: 'triangle', color: '#10B981' }
        ],
        rightSide: [
          { id: '3', value: 6, shape: 'circle', color: '#EF4444' }
        ],
        missingWeight: 'right',
        availableWeights: [
          { id: 'opt1', value: 3, shape: 'circle', color: '#F59E0B' },
          { id: 'opt2', value: 5, shape: 'square', color: '#8B5CF6' },
          { id: 'opt3', value: 7, shape: 'triangle', color: '#EC4899' }
        ],
        correctWeight: '5'
      }
    },
    ...generateIRTParams(5)
  },
  {
    id: 'nb_002',
    category: QuestionCategory.WORKING_MEMORY,
    difficulty: 6,
    question: '3-back spatial positions',
    options: [],
    correctAnswer: 1,
    timeLimit: 180,
    explanation: 'Compare with 3 trials back',
    taskType: TaskType.WORKING_MEMORY_NBACK,
    taskData: {
      nBackLevel: 3,
      memoryItems: []
    },
    ...generateIRTParams(6)
  },
  {
    id: 'mx_002',
    category: QuestionCategory.MATRIX_REASONING,
    difficulty: 4,
    question: 'Find the missing element in this rotation pattern',
    options: [],
    correctAnswer: 1,
    timeLimit: 120,
    explanation: 'Each row rotates the previous pattern by 90 degrees',
    taskType: TaskType.MATRIX_COMPLETION,
    taskData: {
      matrixPattern: {
        grid: [
          ['▲', '▶', '▼'],
          ['◀', '▲', '▶'],
          ['▼', '◀', null]
        ],
        missingIndex: [2, 2],
        options: ['▲', '▶', '▼', '◀'],
        correctOption: 1,
        pattern: 'rotation'
      }
    },
    ...generateIRTParams(4)
  },

  // BLOCK DESIGN INTERACTIVE TASKS
  {
    id: 'bd_001',
    category: QuestionCategory.BLOCK_DESIGN,
    difficulty: 3,
    question: 'Recreate the target design using the colored blocks',
    options: [],
    correctAnswer: 1,
    timeLimit: 180,
    explanation: 'Use the red and blue blocks to match the target pattern',
    taskType: TaskType.BLOCK_ASSEMBLY,
    taskData: {
      blockDesign: {
        targetPattern: [
          [1, 2],
          [2, 1]
        ],
        blockCount: 4,
        blockTypes: [
          { id: 'red', faces: ['red', 'red', 'red', 'red', 'red', 'red'], rotations: [0, 90, 180, 270] },
          { id: 'blue', faces: ['blue', 'blue', 'blue', 'blue', 'blue', 'blue'], rotations: [0, 90, 180, 270] }
        ],
        rotationAllowed: true,
        timeLimit: 180
      }
    },
    ...generateIRTParams(3)
  },

  // VISUAL PUZZLES INTERACTIVE TASKS
  {
    id: 'vp_001',
    category: QuestionCategory.VISUAL_PUZZLES,
    difficulty: 3,
    question: 'Select the three pieces that would complete this visual puzzle',
    options: [],
    correctAnswer: 1,
    timeLimit: 120,
    explanation: 'Look for pieces that fit together to form the target shape',
    taskType: TaskType.VISUAL_PUZZLE,
    taskData: {
      visualPuzzle: {
        completedImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiM4QjVDRjYiLz48L3N2Zz4=',
        pieces: [
          { id: 'A', shape: 'triangle', rotation: 0 },
          { id: 'B', shape: 'square', rotation: 0 },
          { id: 'C', shape: 'circle', rotation: 0 },
          { id: 'D', shape: 'rectangle', rotation: 0 },
          { id: 'E', shape: 'pentagon', rotation: 0 },
          { id: 'F', shape: 'hexagon', rotation: 0 }
        ],
        correctCombination: ['A', 'B', 'C'],
        gridSize: [3, 3]
      }
    },
    ...generateIRTParams(3)
  },

  // DIGIT SPAN WORKING MEMORY TASKS
  {
    id: 'ds_001',
    category: QuestionCategory.WORKING_MEMORY,
    difficulty: 2,
    question: 'Remember the sequence of digits in the exact order',
    options: [],
    correctAnswer: 1,
    timeLimit: 90,
    explanation: 'Focus on the order and replay the sequence mentally',
    taskType: TaskType.DIGIT_SPAN,
    taskData: {
      digitSequence: [3, 7, 2, 9, 1]
    },
    ...generateIRTParams(2)
  },
  {
    id: 'ds_002',
    category: QuestionCategory.WORKING_MEMORY,
    difficulty: 4,
    question: 'Remember this longer sequence of digits',
    options: [],
    correctAnswer: 1,
    timeLimit: 120,
    explanation: 'Use chunking strategies to remember longer sequences',
    taskType: TaskType.DIGIT_SPAN,
    taskData: {
      digitSequence: [8, 4, 1, 6, 9, 3, 7, 2]
    },
    ...generateIRTParams(4)
  },

  // SYMBOL CODING PROCESSING SPEED TASKS
  {
    id: 'sc_001',
    category: QuestionCategory.CODING_TASK,
    difficulty: 2,
    question: 'Match each symbol with its corresponding number using the reference key',
    options: [],
    correctAnswer: 1,
    timeLimit: 90,
    explanation: 'Work quickly but accurately using the symbol-number key',
    taskType: TaskType.SYMBOL_CODING,
    taskData: {
      symbolPairs: [
        { symbol: '◆', code: '1' },
        { symbol: '◇', code: '2' },
        { symbol: '▲', code: '3' },
        { symbol: '▼', code: '4' },
        { symbol: '●', code: '5' },
        { symbol: '○', code: '6' },
        { symbol: '■', code: '7' },
        { symbol: '□', code: '8' }
      ]
    },
    ...generateIRTParams(2)
  },

  // N-BACK WORKING MEMORY TASKS
  {
    id: 'nb_001',
    category: QuestionCategory.WORKING_MEMORY,
    difficulty: 5,
    question: 'Identify when the current position matches the position from 2 trials ago',
    options: [],
    correctAnswer: 1,
    timeLimit: 180,
    explanation: 'Focus on spatial positions and compare with 2 trials back',
    taskType: TaskType.WORKING_MEMORY_NBACK,
    taskData: {
      nBackLevel: 2,
      memoryItems: [
        { id: '1', content: '🔵', position: [0, 0] },
        { id: '2', content: '🔴', position: [0, 1] },
        { id: '3', content: '🟢', position: [0, 0] }, // Match with item 1
        { id: '4', content: '🟡', position: [1, 1] },
        { id: '5', content: '🔵', position: [0, 1] }, // Match with item 2
        { id: '6', content: '🔴', position: [1, 0] }
      ]
    },
    ...generateIRTParams(5)
  },

  // PROCESSING SPEED SCANNING TASKS
  {
    id: 'ps_001',
    category: QuestionCategory.PROCESSING_SPEED,
    difficulty: 3,
    question: 'Find all target symbols as quickly as possible',
    options: [],
    correctAnswer: 1,
    timeLimit: 120,
    explanation: 'Scan systematically and click on target symbols only',
    taskType: TaskType.PROCESSING_SPEED_SCAN,
    taskData: {
      targetSymbols: ['★', '♦'],
      searchArray: [] // Will be generated in component
    },
    ...generateIRTParams(3)
  },

  // SPATIAL ROTATION TASKS
  {
    id: 'sr_001',
    category: QuestionCategory.SPATIAL_REASONING,
    difficulty: 4,
    question: 'Rotate the 3D object to match the target orientation',
    options: [],
    correctAnswer: 1,
    timeLimit: 180,
    explanation: 'Use the rotation controls to match the target 3D orientation',
    taskType: TaskType.SPATIAL_ROTATION,
    taskData: {
      spatialObjects: [
        {
          id: 'target',
          shape: '3d_cube',
          rotation: [45, 90, 0],
          color: '#8B5CF6'
        },
        {
          id: 'task',
          shape: '3d_cube',
          rotation: [0, 0, 0],
          color: '#8B5CF6'
        }
      ],
      rotationAngles: [45, 90, 135, 180]
    },
    ...generateIRTParams(4)
  },

  // FIGURE WEIGHTS REASONING TASKS
  {
    id: 'fw_001',
    category: QuestionCategory.FIGURE_WEIGHTS,
    difficulty: 3,
    question: 'Balance the scale by selecting the correct weight',
    options: [],
    correctAnswer: 1,
    timeLimit: 120,
    explanation: 'Calculate the total weight needed to balance both sides',
    taskType: TaskType.FIGURE_BALANCE,
    taskData: {
      scaleData: {
        leftSide: [
          { id: '1', value: 3, shape: 'circle', color: '#EF4444' },
          { id: '2', value: 5, shape: 'square', color: '#3B82F6' }
        ],
        rightSide: [
          { id: '3', value: 4, shape: 'triangle', color: '#10B981' }
        ],
        missingWeight: 'right',
        availableWeights: [
          { id: 'opt1', value: 2, shape: 'circle', color: '#F59E0B' },
          { id: 'opt2', value: 4, shape: 'square', color: '#8B5CF6' },
          { id: 'opt3', value: 6, shape: 'triangle', color: '#EC4899' }
        ],
        correctWeight: '4'
      }
    },
    ...generateIRTParams(3)
  },

  // TRADITIONAL ENHANCED QUESTIONS
  {
    id: 'pr_001',
    category: QuestionCategory.PATTERN_RECOGNITION,
    difficulty: 1,
    question: 'What comes next in this sequence: 2, 4, 6, 8, ?',
    options: ['9', '10', '11', '12'],
    correctAnswer: 1,
    timeLimit: 45,
    explanation: 'The sequence increases by 2 each time: 2+2=4, 4+2=6, 6+2=8, 8+2=10',
    ...generateIRTParams(1)
  },
  {
    id: 'vc_001',
    category: QuestionCategory.VERBAL_COMPREHENSION,
    difficulty: 2,
    question: 'What do these words have in common: Apple, Orange, Banana?',
    options: ['They are round', 'They are fruits', 'They are sweet', 'They are colorful'],
    correctAnswer: 1,
    timeLimit: 60,
    explanation: 'All three items are types of fruit',
    ...generateIRTParams(2)
  },
  {
    id: 'nr_001',
    category: QuestionCategory.NUMERICAL_REASONING,
    difficulty: 3,
    question: 'If a train travels 120 miles in 2 hours, what is its average speed?',
    options: ['40 mph', '50 mph', '60 mph', '80 mph'],
    correctAnswer: 2,
    timeLimit: 90,
    explanation: 'Speed = Distance ÷ Time = 120 ÷ 2 = 60 mph',
    ...generateIRTParams(3)
  },
  {
    id: 'lg_001',
    category: QuestionCategory.LOGICAL_DEDUCTION,
    difficulty: 3,
    question: 'All roses are flowers. Some flowers are red. Therefore:',
    options: ['All roses are red', 'Some roses are red', 'No roses are red', 'We cannot determine the color of roses from this information'],
    correctAnswer: 3,
    timeLimit: 90,
    explanation: 'The premises do not provide enough information to determine rose colors definitively',
    ...generateIRTParams(3)
  }
];

// Calculate timesCorrect based on difficulty for realistic calibration
questions.forEach(question => {
  const expectedAccuracy = Math.max(0.1, Math.min(0.9, 0.8 - (question.difficulty - 1) * 0.07));
  question.timesCorrect = Math.floor(question.timesAnswered * expectedAccuracy);
});

export function getQuestionsByDifficulty(difficulty: number): Question[] {
  return questions.filter(q => q.difficulty === difficulty);
}

export function getQuestionsByCategory(category: QuestionCategory): Question[] {
  return questions.filter(q => q.category === category);
}

export function organizeQuestionPools(): Record<number, Question[]> {
  const pools: Record<number, Question[]> = {};
  for (let i = 1; i <= 10; i++) {
    pools[i] = getQuestionsByDifficulty(i);
  }
  return pools;
}

// Export for backward compatibility
export const questionDatabase = questions; 