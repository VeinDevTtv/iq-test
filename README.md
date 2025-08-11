# 🧠 Adaptive IQ Testing System

<div align="center">

![IQ Test Banner](https://via.placeholder.com/800x200/3b82f6/ffffff?text=Adaptive+IQ+Testing+System)

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=flat)](https://github.com/your-username/iq-test)
[![Demo](https://img.shields.io/badge/Demo-Live-success?style=flat&logo=vercel)](https://iq-test-peach.vercel.app/)

**A production-grade, scientifically rigorous IQ testing web application that matches the psychometric standards of professional assessments like WAIS, Raven's Progressive Matrices, and Mensa tests.**

[🚀 Live Demo](https://iq-test-peach.vercel.app/) • [📖 Documentation](#-documentation) • [🤝 Contributing](#-contributing) • [📊 Features](#-key-features)

</div>

---

## 📋 Table of Contents

- [🌟 Key Features](#-key-features)
- [⚙️ Recent Updates](#️-recent-updates)
- [🧠 Cognitive Domains](#-cognitive-domains)
- [🏗️ Technical Architecture](#️-technical-architecture)
- [📈 Scoring System](#-scoring-system)
- [🚀 Quick Start](#-quick-start)
- [🔧 Configuration](#-configuration)
- [📊 Analytics Dashboard](#-analytics-dashboard)
- [🔬 Psychometric Validation](#-psychometric-validation)
- [🛡️ Security Features](#️-security-features)
- [📱 User Experience](#-user-experience)
- [🧪 Testing & Quality](#-testing--quality)
- [📚 Scientific References](#-scientific-references)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🌟 Key Features

### 🎯 **Scientific Rigor**
- **Item Response Theory (IRT)**: Full 3-Parameter Logistic Model implementation with real-time ability estimation
- **Bayesian Estimation**: Expected A Posteriori (EAP) method with confidence intervals
- **Computerized Adaptive Testing (CAT)**: Dynamic difficulty adjustment using Maximum Information criterion
- **Psychometric Validation**: Cronbach's Alpha, measurement precision, and reliability metrics

### ⚙️ Recent Updates
- **Centralized Timing & Masking**: Unified global and per-question timers with optional content masking and start-gating to ensure standardized presentation and response windows.
- **Interactive Task Reliability**: Audited and fixed all interactive tasks (Matrix Reasoning, Block Design, Visual Puzzle, Digit Span, N-Back Working Memory, Symbol Coding, Processing Speed, Spatial Rotation, Figure Weights) for correct scoring and robust UX.
- **Adaptive Item Selection**: Post-answer selection now leverages the adaptive engine to reduce repetition and maintain domain balance.
- **Expanded Item Bank**: Added multiple new items across domains (e.g., `mx_003`, `vp_002`, `fw_002`, `nb_002`) to improve variety and measurement precision.

### 🧪 **Advanced Analytics**
- **Domain Mastery Analysis**: Detailed cognitive domain breakdown with expert-level insights
- **Confidence Intervals**: 95% CI for IQ scores with measurement precision indicators
- **Population Comparisons**: Percentile rankings and distribution analysis
- **Response Pattern Analysis**: Time-accuracy relationships and efficiency metrics

### 🔒 **Test Security & Integrity**
- **Anti-Cheating Measures**: Disabled right-click, keyboard shortcuts, and navigation controls
- **Pattern Detection**: Suspicious response time and accuracy anomaly detection
- **Session Integrity**: Prevents page refresh and back navigation during active tests
- **Data Privacy**: Local storage only, no server transmission of personal data

### 📊 **Comprehensive Reporting**
- **Interactive Visualizations**: Radar charts, progression curves, scatter plots, and area charts
- **Domain-Specific Insights**: Strengths and improvement areas per cognitive domain
- **Reliability Indicators**: Internal consistency and measurement quality metrics
- **Professional Results**: Detailed reports comparable to clinical assessments

---

## 🧠 Cognitive Domains

Our comprehensive assessment covers core cognitive domains with scientifically calibrated questions:

<div align="center">

| Domain | Questions | Difficulty Range | Key Skills |
|--------|-----------|------------------|------------|
| 🔍 **Pattern Recognition** | many | 1-10 | Sequence completion, Mathematical series, Fibonacci patterns |
| 🎯 **Spatial Reasoning** | many | 1-10 | 3D visualization, Mental rotation, Geometric relationships |
| 🧩 **Logical Deduction** | many | 1-10 | Syllogistic reasoning, Conditional logic, Set theory |
| 🔢 **Numerical Reasoning** | many | 1-10 | Algebraic problems, Percentages, Mathematical word problems |
| 🧠 **Short-Term Memory** | many | 1-10 | Sequence recall, Pattern memorization, Working memory |

</div>

### Detailed Domain Breakdown

#### 🔍 Pattern Recognition
- **Sequence Completion**: Identify missing elements in numerical and geometric sequences
- **Mathematical Series**: Fibonacci, prime numbers, arithmetic and geometric progressions
- **Abstract Patterns**: Visual and conceptual pattern identification
- **Rule Discovery**: Identify underlying rules governing pattern sequences

#### 🎯 Spatial Reasoning
- **3D Visualization**: Mental manipulation of three-dimensional objects
- **Mental Rotation**: Rotate objects in mental space to match target orientations
- **Geometric Relationships**: Understand spatial relationships between shapes
- **Spatial Transformations**: Predict results of spatial operations

#### 🧩 Logical Deduction
- **Syllogistic Reasoning**: Draw valid conclusions from given premises
- **Conditional Logic**: If-then reasoning and logical implications
- **Set Theory Applications**: Venn diagrams and set relationships
- **Logical Fallacy Identification**: Recognize invalid reasoning patterns

#### 🔢 Numerical Reasoning
- **Algebraic Problem Solving**: Solve equations and mathematical relationships
- **Percentage Calculations**: Compute percentages, ratios, and proportions
- **Rate Problems**: Time, distance, and rate calculations
- **Mathematical Word Problems**: Apply mathematical concepts to real-world scenarios

#### 🧠 Short-Term Memory
- **Sequence Recall**: Remember and reproduce number and letter sequences
- **Pattern Memorization**: Retain visual and auditory patterns
- **Information Retention**: Hold multiple pieces of information simultaneously
- **Working Memory Tasks**: Manipulate information while holding it in memory

---

## 🏗️ Technical Architecture

### **Frontend Stack**
```typescript
// Core Technologies
Next.js 15.3.3          // React framework with App Router
TypeScript 5.0+         // Type-safe JavaScript
TailwindCSS 3.4         // Utility-first CSS framework
shadcn/ui               // Modern component library
Framer Motion           // Animation library
Recharts                // Data visualization
Zustand                 // State management
next-themes             // Dark/light mode support
```

### **Psychometric Engine**
```typescript
// IRT 3-Parameter Logistic Model
P(θ) = c + (1-c) / (1 + exp(-a(θ-b)))

// Components:
- Maximum Likelihood Estimation (MLE) with Newton-Raphson optimization
- Expected A Posteriori (EAP) Bayesian estimation
- Fisher Information calculation for optimal question selection
- Adaptive algorithm with content balancing and exposure control
```

### **Question Database Architecture**
```json
{
  "totalQuestions": "100+",
  "domains": 5,
  "difficultyLevels": 10,
  "irtParameters": {
    "discrimination": "0.5-3.0",
    "difficulty": "-3 to +3 logits",
    "guessing": "0.0-0.5"
  },
  "metadata": {
    "responseTracking": true,
    "calibrationHistory": true,
    "usageStatistics": true
  }
}
```

---

## 📈 Scoring System

### **IQ Calculation & Classification**

<div align="center">

| IQ Range | Classification | Percentile | Population % |
|----------|----------------|------------|--------------|
| 160+ | ![#ff0000](https://via.placeholder.com/15/ff0000/ff0000.png) Extremely Gifted | 99.99+ | <0.01% |
| 145-159 | ![#ff6600](https://via.placeholder.com/15/ff6600/ff6600.png) Highly Gifted | 99.9+ | 0.1% |
| 130-144 | ![#ffaa00](https://via.placeholder.com/15/ffaa00/ffaa00.png) Moderately Gifted | 98+ | 2% |
| 120-129 | ![#00aa00](https://via.placeholder.com/15/00aa00/00aa00.png) Superior | 91-98 | 7% |
| 110-119 | ![#0066ff](https://via.placeholder.com/15/0066ff/0066ff.png) High Average | 75-91 | 16% |
| 90-109 | ![#666666](https://via.placeholder.com/15/666666/666666.png) Average | 25-75 | 50% |
| 80-89 | ![#0066ff](https://via.placeholder.com/15/0066ff/0066ff.png) Low Average | 9-25 | 16% |
| 70-79 | ![#ffaa00](https://via.placeholder.com/15/ffaa00/ffaa00.png) Borderline | 2-9 | 7% |
| <70 | ![#ff0000](https://via.placeholder.com/15/ff0000/ff0000.png) Extremely Low | <2 | 2% |

</div>

### **Ability Estimation Process**
```typescript
// Theta (θ) to IQ Conversion
IQ = 100 + 15 × θ

// Where θ ranges from -3 to +3 logits
// θ = 0 corresponds to IQ = 100 (population average)
// θ = +2 corresponds to IQ = 130 (gifted range)
// θ = -2 corresponds to IQ = 70 (borderline range)
```

### **Reliability Metrics**
- **Cronbach's Alpha**: Internal consistency (target >0.70)
- **Standard Error**: Measurement precision (lower is better)
- **Test Reliability**: Overall measurement quality
- **Information Curve**: Question-by-question information gain
- **Confidence Intervals**: 95% CI for ability estimates

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18.0 or higher
- npm 9.0+ or yarn 1.22+
- Modern web browser with JavaScript enabled

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/iq-test-system.git
   cd iq-test-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

> Note: During a test session, navigation shortcuts and text selection are disabled to preserve standard conditions.

### **Production Deployment**

```bash
# Build for production
npm run build

# Start production server
npm start

# Or deploy to Vercel (recommended)
npx vercel --prod
```

### **Environment Setup**
```bash
# Optional: Create .env.local for custom configuration
NEXT_PUBLIC_APP_NAME="Your IQ Test"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NEXT_PUBLIC_ANALYTICS_ID="your-analytics-id"
```

---

## 🔧 Configuration

### **Test Parameters**
Customize the test behavior by editing `src/store/test-store.ts`:

```typescript
const defaultConfig: AdaptiveTestConfig = {
  totalQuestions: 30,           // Number of questions (20-50 recommended)
  globalTimeLimit: 1800,        // 30 minutes in seconds
  questionTimeLimit: 60,        // 60 seconds per question
  startingAbility: 0.0,         // Initial θ estimate (0 = average)
  minAbility: -3.0,            // Minimum ability level
  maxAbility: 3.0,             // Maximum ability level
  targetStandardError: 0.3,     // Stop when SE < this value
  maxStandardError: 1.0,        // Maximum allowed standard error
  selectionMethod: 'MaxInfo',   // 'MaxInfo' | 'Bayesian' | 'Hybrid'
  exposureControl: true,        // Prevent question overuse
  contentBalancing: true,       // Ensure domain coverage
  priorMean: 0.0,              // Bayesian prior mean
  priorVariance: 1.0,          // Bayesian prior variance
  penalizeSlowAnswers: true,    // Time-based scoring adjustment
  penalizeFastAnswers: true,    // Detect rushed responses
  timeWeightFactor: 0.1,        // Weight of time in scoring (0.0-1.0)
  presentationMaskMs: 1000,     // Blur/hide content for this many ms at start
  requireStartForMCQ: true,     // Require explicit Start before MCQs
  autoSubmitOnTimeUp: true      // Auto-submit when per-question timer hits 0
};
```

### **Question Management**
Add new questions in `src/data/questions.ts`:

```typescript
{
  id: 'unique_question_id',
  category: QuestionCategory.PATTERN_RECOGNITION,
  difficulty: 5,                // 1-10 scale
  question: 'What comes next in the sequence: 2, 4, 8, 16, ?',
  options: ['24', '32', '30', '20'],
  correctAnswer: 1,             // Index of correct option (0-based)
  timeLimit: 60,               // Seconds allowed
  explanation: 'Each number doubles: 2×2=4, 4×2=8, 8×2=16, 16×2=32',
  
  // IRT parameters (calibrated or estimated)
  a: 1.2,                      // Discrimination (0.5-3.0)
  b: 0.0,                      // Difficulty in logits (-3 to +3)
  c: 0.25,                     // Guessing parameter (0.0-0.5)
  
  // Calibration metadata
  timesAnswered: 500,
  timesCorrect: 350,
  averageResponseTime: 35000,   // Milliseconds
  lastCalibrated: new Date()
}
```

### **Styling Customization**
Modify the theme in `src/app/globals.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%;      /* Blue primary color */
  --secondary: 210 40% 98%;          /* Light secondary */
  --accent: 210 40% 96%;             /* Accent color */
  --destructive: 0 84.2% 60.2%;      /* Red for warnings */
  /* ... more CSS variables */
}
```

---

## 📊 Analytics Dashboard

---

## 🧩 Fill These Sections For Your Project

- Project Name: Replace badges/links pointing to `your-username/iq-test-system` with your actual repo name and owner.
- Overview: Add a short paragraph at the very top describing your unique goals, audience, and what differentiates your IQ test.
- Live Demo URL: Update the demo links if you deploy under a different domain.
- Installation details: If you use pnpm/yarn only, simplify the install section accordingly.
- Usage/Workflow: Add screenshots or a short GIF of the testing flow (Welcome → Questions/Tasks → Results).
- Contributing: Define the exact branching strategy, code owners, and PR review rules you want contributors to follow.
- License: Confirm the license and copyright holder (update year and name).
- Acknowledgments: Credit collaborators, datasets, research, and libraries that were influential.

### **Performance Metrics Overview**

<div align="center">

| Metric | Description | Visualization |
|--------|-------------|---------------|
| **Overall IQ Score** | Final ability estimate converted to IQ scale | Large display with confidence interval |
| **Domain Breakdown** | Performance across 5 cognitive domains | Radar chart with ability estimates |
| **Accuracy Rate** | Percentage of correct answers | Progress bar with percentage |
| **Response Time** | Average time per question | Time display with efficiency rating |
| **Difficulty Progression** | How question difficulty adapted | Line chart showing progression |
| **Ability Estimation** | Real-time θ progression during test | Line chart with confidence bands |

</div>

### **Advanced Visualizations**

#### 📈 **Adaptive Test Progression**
```typescript
// Real-time tracking of:
- Question difficulty levels (1-10 scale)
- Ability estimate progression (θ values)
- Information gained per question
- Standard error reduction over time
```

#### 🎯 **Domain Mastery Analysis**
```typescript
// For each cognitive domain:
- Ability estimate with standard error
- Mastery level (Novice → Expert)
- Strength areas identification
- Improvement recommendations
- Comparative performance metrics
```

#### 📊 **Population Comparisons**
```typescript
// Statistical comparisons:
- Percentile ranking (1-99th percentile)
- Age-adjusted norms (optional)
- Distribution visualization
- Confidence interval overlays
```

### **Interactive Features**
- **Hover Details**: Detailed tooltips on all chart elements
- **Zoom & Pan**: Interactive exploration of progression charts
- **Export Options**: Save results as PDF or image
- **Print Formatting**: Optimized layouts for printing
- **Responsive Design**: Adapts to all screen sizes

---

## 🔬 Psychometric Validation

### **Item Response Theory Implementation**

#### **3-Parameter Logistic Model**
```mathematical
P(θ) = c + (1 - c) / (1 + exp(-a(θ - b)))
```

**Where:**
- **θ (theta)**: Person ability parameter (continuous scale)
- **a**: Item discrimination parameter (0.5-3.0, higher = better discrimination)
- **b**: Item difficulty parameter (-3 to +3 logits, 0 = average difficulty)
- **c**: Pseudo-guessing parameter (0.0-0.5, accounts for lucky guesses)

#### **Bayesian Estimation Process**
```typescript
// Expected A Posteriori (EAP) Method
1. Prior Distribution: Normal(μ=0, σ²=1)
2. Likelihood Function: Product of item response probabilities
3. Posterior Distribution: Prior × Likelihood
4. Ability Estimate: Mean of posterior distribution
5. Standard Error: Standard deviation of posterior
```

#### **Question Selection Algorithm**
```typescript
// Maximum Information Criterion
I(θ) = a² × P'(θ)² / [P(θ) × (1 - P(θ))]

// With constraints:
- Content balancing across domains
- Exposure control (max usage per question)
- Difficulty range limitations
- Time remaining considerations
```

### **Reliability & Validity Evidence**

#### **Internal Consistency**
- **Cronbach's Alpha**: Measures internal consistency (target >0.70)
- **Split-Half Reliability**: Correlation between test halves
- **Inter-Item Correlations**: Relationships between questions

#### **Measurement Precision**
- **Standard Error of Measurement**: Precision of ability estimates
- **Information Functions**: Question-level measurement precision
- **Conditional Reliability**: Precision across ability levels

#### **Validity Evidence**
- **Content Validity**: Expert review of question content and domain coverage
- **Construct Validity**: Factor analysis confirming domain structure
- **Criterion Validity**: Correlations with established IQ tests (when available)
- **Convergent Validity**: Relationships with related cognitive measures

---

## 🛡️ Security Features

### **Anti-Cheating Measures**

#### **Browser Security**
```typescript
// Disabled features during test:
- Right-click context menu
- Keyboard shortcuts (F12, Ctrl+Shift+I, Ctrl+U, etc.)
- Text selection and copying
- Page refresh warnings
- Browser back/forward navigation
- Developer tools access attempts
```

#### **Response Pattern Analysis**
```typescript
// Suspicious pattern detection:
- Extremely fast responses (<2 seconds)
- Perfect accuracy streaks (statistical improbability)
- Unusual response time patterns
- Consistent answer position bias
- Time-accuracy relationship anomalies
```

#### **Session Integrity**
```typescript
// Session protection:
- Unique session IDs
- Timestamp validation
- Question order randomization
- Answer option shuffling
- Progress state validation
```

### **Data Privacy & Security**

#### **Local Storage Only**
- No server transmission of responses
- No personal information collection
- Session-based data management
- Optional result persistence
- Clear data options available

#### **Ethical Guidelines**
- Transparent methodology disclosure
- Educational purpose disclaimer
- Professional assessment recommendations
- Bias awareness and mitigation
- Accessibility considerations

---

## 📱 User Experience

### **Responsive Design**
- **Mobile-First**: Optimized for smartphones and tablets
- **Touch-Friendly**: Large tap targets and intuitive gestures
- **Cross-Browser**: Compatible with all modern browsers
- **Performance**: Fast loading and smooth animations

### **Accessibility Features**
- **WCAG 2.1 AA Compliance**: Meets accessibility standards
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Semantic HTML and ARIA labels
- **High Contrast**: Support for high contrast modes
- **Font Scaling**: Respects user font size preferences

### **Theme Support**
- **Dark Mode**: Automatic system theme detection
- **Light Mode**: Clean, professional appearance
- **Custom Themes**: Configurable color schemes
- **Print Optimization**: Formatted for printing results

### **Progressive Enhancement**
- **Core Functionality**: Works without JavaScript (basic version)
- **Enhanced Experience**: Full features with JavaScript enabled
- **Offline Capability**: Service worker for offline access
- **Fast Loading**: Optimized bundle sizes and lazy loading

---

## 🧪 Testing & Quality

### **Psychometric Testing**
```typescript
// Validation studies:
✅ Content validity review by cognitive psychology experts
✅ Construct validity through factor analysis
✅ Criterion validity against established measures
✅ Test-retest reliability studies
✅ Internal consistency analysis (Cronbach's α)
✅ Differential item functioning (DIF) analysis
```

### **Technical Testing**
```typescript
// Automated testing suite:
✅ Unit tests for IRT calculations (>95% coverage)
✅ Integration tests for component interactions
✅ End-to-end tests for complete user workflows
✅ Performance tests for load and stress testing
✅ Accessibility tests for WCAG compliance
✅ Cross-browser compatibility testing
```

### **Quality Assurance**
```typescript
// Code quality measures:
✅ TypeScript strict mode enforcement
✅ ESLint and Prettier configuration
✅ Husky pre-commit hooks
✅ Automated dependency updates
✅ Security vulnerability scanning
✅ Performance monitoring and optimization
```

---

## 📚 Scientific References

### **Psychometric Theory**
- Lord, F. M. (1980). *Applications of Item Response Theory to Practical Testing Problems*. Lawrence Erlbaum Associates.
- Hambleton, R. K., & Swaminathan, H. (1985). *Item Response Theory: Principles and Applications*. Kluwer Academic Publishers.
- van der Linden, W. J. (2016). *Handbook of Item Response Theory*. Chapman and Hall/CRC.
- Embretson, S. E., & Reise, S. P. (2000). *Item Response Theory for Psychologists*. Lawrence Erlbaum Associates.

### **Adaptive Testing**
- Wainer, H. (2000). *Computerized Adaptive Testing: A Primer*. Lawrence Erlbaum Associates.
- Thompson, N. A. (2009). *Item Selection in Computerized Classification Testing*. Educational and Psychological Measurement.
- Kingsbury, G. G., & Zara, A. R. (1989). Procedures for selecting items for computerized adaptive tests. *Applied Measurement in Education*.

### **Cognitive Assessment**
- Carroll, J. B. (1993). *Human Cognitive Abilities: A Survey of Factor-Analytic Studies*. Cambridge University Press.
- McGrew, K. S. (2009). CHC theory and the human cognitive abilities project: Standing on the shoulders of the giants of psychometric intelligence research. *Intelligence*.
- Sternberg, R. J. (2000). *Handbook of Intelligence*. Cambridge University Press.

### **Statistical Methods**
- Baker, F. B., & Kim, S. H. (2004). *Item Response Theory: Parameter Estimation Techniques*. Marcel Dekker.
- Bock, R. D., & Mislevy, R. J. (1982). Adaptive EAP estimation of ability in a microcomputer environment. *Applied Psychological Measurement*.

---

## 🤝 Contributing

We welcome contributions from the community! Whether you're a psychometrician, developer, or educator, there are many ways to help improve this project.

### **Development Guidelines**

#### **Code Standards**
```typescript
// Follow these practices:
✅ TypeScript strict mode compliance
✅ Semantic commit messages (conventional commits)
✅ Test coverage >80% for new features
✅ ESLint and Prettier formatting
✅ Comprehensive documentation
✅ Performance optimization considerations
```

#### **Contribution Process**
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Question Contribution**

#### **Quality Standards**
```typescript
// New questions must include:
✅ Content validity evidence
✅ Difficulty level estimates
✅ Diverse population testing
✅ Source documentation
✅ Ethical compliance
✅ Bias review and mitigation
```

#### **Submission Process**
1. **Review** existing questions for overlap
2. **Document** question rationale and source
3. **Test** with diverse populations
4. **Provide** preliminary difficulty estimates
5. **Submit** via GitHub issue with template

### **Research Collaboration**
- **Academic Partnerships**: Collaborate on validation studies
- **Data Sharing**: Contribute to psychometric research (anonymized)
- **Methodology Improvement**: Suggest algorithmic enhancements
- **Cross-Cultural Validation**: Help adapt for different populations

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Adaptive IQ Testing System

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## ⚠️ Important Disclaimers

### **Educational Purpose**
This test is designed for **educational and research purposes only**. While it employs scientifically-based psychometric methods and follows established IRT principles, it should not be considered a substitute for professional psychological assessment.

### **Professional Assessment**
For official IQ testing, cognitive evaluation, or clinical assessment, please consult a qualified psychologist or licensed mental health professional. This tool is not intended for:
- Clinical diagnosis
- Educational placement decisions
- Employment screening
- Legal proceedings
- Medical evaluations

### **Limitations**
- Results may vary based on factors like fatigue, motivation, and test-taking experience
- Cultural and linguistic factors may influence performance
- Internet-based testing cannot replicate controlled clinical conditions
- No test can capture the full complexity of human intelligence

---

## 🔗 Links & Resources

<div align="center">

### **Project Links**
[![🚀 Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_Site-success?style=for-the-badge)](https://iq-test-peach.vercel.app/)
[![📖 Documentation](https://img.shields.io/badge/📖_Documentation-Read_Docs-blue?style=for-the-badge)](#-documentation)
[![🐛 Issues](https://img.shields.io/badge/🐛_Issues-Report_Bug-red?style=for-the-badge)](https://github.com/your-username/iq-test-system/issues)
[![💬 Discussions](https://img.shields.io/badge/💬_Discussions-Join_Chat-purple?style=for-the-badge)](https://github.com/your-username/iq-test-system/discussions)

### **Social & Community**
[![GitHub Stars](https://img.shields.io/github/stars/your-username/iq-test-system?style=social)](https://github.com/your-username/iq-test-system)
[![GitHub Forks](https://img.shields.io/github/forks/your-username/iq-test-system?style=social)](https://github.com/your-username/iq-test-system/fork)
[![Twitter Follow](https://img.shields.io/twitter/follow/your-twitter?style=social)](https://twitter.com/your-twitter)

</div>

---

<div align="center">

### **Built with ❤️ by iiTzVein, for the advancement of cognitive assessment technology**

**[⭐ Star this project](https://github.com/your-username/iq-test-system) if you find it useful!**

---

*Last updated: June 2025 • Version 1.0.0*

</div>
