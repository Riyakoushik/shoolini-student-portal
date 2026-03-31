export interface StudyTask {
  subject: string;
  abbr: string;
  goalHours: number;
  topic: string;
  done: boolean;
  progress: number;
}

export interface StudyDay {
  day: string;
  date: string;
  fullDate: string;
  isToday: boolean;
  isPast: boolean;
  tasks: StudyTask[];
}

export interface SubjectWeeklySummary {
  subject: string;
  abbr: string;
  color: string;
  targetHours: number;
  studiedHours: number;
}

export const weeklyGoalHours = 42;

export const studyWeek: StudyDay[] = [
  {
    day: "Mon",
    date: "Mar 23",
    fullDate: "Monday, Mar 23, 2026",
    isToday: false,
    isPast: true,
    tasks: [
      { subject: "Advanced Machine Learning", abbr: "AML", goalHours: 2, topic: "Backpropagation & Gradient Flow", done: true, progress: 100 },
      { subject: "Deep Learning",             abbr: "DL",  goalHours: 2, topic: "LSTM & GRU Architectures",        done: true, progress: 100 },
      { subject: "Cloud Computing",           abbr: "CC",  goalHours: 1, topic: "AWS Lambda & Serverless",         done: true, progress: 100 },
      { subject: "Advanced Algorithms",       abbr: "AA",  goalHours: 1, topic: "Dynamic Programming Review",      done: true, progress: 100 },
      { subject: "Computer Vision",           abbr: "CV",  goalHours: 1, topic: "Feature Extraction with CNN",     done: true, progress: 100 },
      { subject: "Data Analytics",            abbr: "DA",  goalHours: 1, topic: "PCA & Dimensionality Reduction",  done: true, progress: 100 },
      { subject: "Natural Language Processing", abbr: "NLP", goalHours: 1, topic: "Tokenisation & Word Embeddings", done: true, progress: 100 },
    ],
  },
  {
    day: "Tue",
    date: "Mar 24",
    fullDate: "Tuesday, Mar 24, 2026",
    isToday: false,
    isPast: true,
    tasks: [
      { subject: "Advanced Machine Learning", abbr: "AML", goalHours: 1, topic: "Regularisation Techniques",              done: true, progress: 100 },
      { subject: "Deep Learning",             abbr: "DL",  goalHours: 2, topic: "Transformer Architecture Deep Dive",     done: true, progress: 100 },
      { subject: "Cloud Computing",           abbr: "CC",  goalHours: 1, topic: "Docker & Kubernetes Basics",             done: true, progress: 100 },
      { subject: "Advanced Algorithms",       abbr: "AA",  goalHours: 2, topic: "Graph Algorithms — Dijkstra & Floyd",    done: true, progress: 100 },
      { subject: "Computer Vision",           abbr: "CV",  goalHours: 1, topic: "Object Detection — YOLO Architecture",  done: true, progress: 100 },
      { subject: "Data Analytics",            abbr: "DA",  goalHours: 1, topic: "Correlation Analysis & Visualisation",  done: false, progress: 80 },
      { subject: "Natural Language Processing", abbr: "NLP", goalHours: 1, topic: "Attention Mechanism & BERT",          done: true, progress: 100 },
    ],
  },
  {
    day: "Wed",
    date: "Mar 25",
    fullDate: "Wednesday, Mar 25, 2026",
    isToday: false,
    isPast: true,
    tasks: [
      { subject: "Advanced Machine Learning", abbr: "AML", goalHours: 2, topic: "Ensemble Methods — Boosting & Bagging", done: true, progress: 100 },
      { subject: "Deep Learning",             abbr: "DL",  goalHours: 1, topic: "Generative Adversarial Networks",       done: true, progress: 100 },
      { subject: "Cloud Computing",           abbr: "CC",  goalHours: 2, topic: "Cloud Security & IAM Policies",         done: true, progress: 100 },
      { subject: "Advanced Algorithms",       abbr: "AA",  goalHours: 1, topic: "NP-Completeness & Approximation",       done: true, progress: 100 },
      { subject: "Computer Vision",           abbr: "CV",  goalHours: 1, topic: "Semantic Segmentation Methods",         done: false, progress: 60 },
      { subject: "Data Analytics",            abbr: "DA",  goalHours: 1, topic: "Regression Modelling with Sklearn",     done: true, progress: 100 },
      { subject: "Natural Language Processing", abbr: "NLP", goalHours: 1, topic: "Named Entity Recognition",            done: true, progress: 100 },
    ],
  },
  {
    day: "Thu",
    date: "Mar 26",
    fullDate: "Thursday, Mar 26, 2026",
    isToday: true,
    isPast: false,
    tasks: [
      { subject: "Advanced Machine Learning", abbr: "AML", goalHours: 2, topic: "Multi-task Learning Framework",         done: true, progress: 100 },
      { subject: "Deep Learning",             abbr: "DL",  goalHours: 1, topic: "Diffusion Models Overview",             done: true, progress: 100 },
      { subject: "Cloud Computing",           abbr: "CC",  goalHours: 1, topic: "SHAP & Explainable AI on Cloud",        done: false, progress: 50 },
      { subject: "Advanced Algorithms",       abbr: "AA",  goalHours: 2, topic: "Federated Learning Concepts",           done: false, progress: 30 },
      { subject: "Computer Vision",           abbr: "CV",  goalHours: 1, topic: "Lane Detection with OpenCV",            done: false, progress: 0 },
      { subject: "Data Analytics",            abbr: "DA",  goalHours: 1, topic: "Time Series Analysis",                  done: false, progress: 0 },
      { subject: "Natural Language Processing", abbr: "NLP", goalHours: 1, topic: "Zero-Shot Classification Techniques", done: false, progress: 0 },
    ],
  },
  {
    day: "Fri",
    date: "Mar 27",
    fullDate: "Friday, Mar 27, 2026",
    isToday: false,
    isPast: false,
    tasks: [
      { subject: "Advanced Machine Learning", abbr: "AML", goalHours: 1, topic: "Adversarial Attacks & Defences",        done: false, progress: 0 },
      { subject: "Deep Learning",             abbr: "DL",  goalHours: 2, topic: "Graph Neural Networks",                 done: false, progress: 0 },
      { subject: "Cloud Computing",           abbr: "CC",  goalHours: 1, topic: "Edge AI Deployment Strategies",         done: false, progress: 0 },
      { subject: "Advanced Algorithms",       abbr: "AA",  goalHours: 2, topic: "Approximation Algorithms Practice",     done: false, progress: 0 },
      { subject: "Computer Vision",           abbr: "CV",  goalHours: 1, topic: "3D Reconstruction Techniques",          done: false, progress: 0 },
      { subject: "Data Analytics",            abbr: "DA",  goalHours: 1, topic: "Clustering — K-Means & DBSCAN",         done: false, progress: 0 },
      { subject: "Natural Language Processing", abbr: "NLP", goalHours: 1, topic: "Sequence-to-Sequence Models",         done: false, progress: 0 },
    ],
  },
  {
    day: "Sat",
    date: "Mar 28",
    fullDate: "Saturday, Mar 28, 2026",
    isToday: false,
    isPast: false,
    tasks: [
      { subject: "Advanced Machine Learning", abbr: "AML", goalHours: 1, topic: "Assignment 9 Prep — Adversarial Attack", done: false, progress: 0 },
      { subject: "Deep Learning",             abbr: "DL",  goalHours: 2, topic: "Revision — Mid-term to Pre-final",       done: false, progress: 0 },
      { subject: "Cloud Computing",           abbr: "CC",  goalHours: 1, topic: "Lab 7 SHAP — Revision",                  done: false, progress: 0 },
      { subject: "Advanced Algorithms",       abbr: "AA",  goalHours: 1, topic: "Assignment 8 Prep — Federated Learning", done: false, progress: 0 },
      { subject: "Computer Vision",           abbr: "CV",  goalHours: 1, topic: "Assignment 6 Review — Lane Detection",   done: false, progress: 0 },
      { subject: "Data Analytics",            abbr: "DA",  goalHours: 1, topic: "Weekly Summary & Practice Problems",     done: false, progress: 0 },
      { subject: "Natural Language Processing", abbr: "NLP", goalHours: 1, topic: "Weekly Revision — NLP Pipelines",      done: false, progress: 0 },
    ],
  },
];

export const subjectSummaries: SubjectWeeklySummary[] = [
  { subject: "Advanced Machine Learning", abbr: "AML", color: "#2563eb", targetHours: 9, studiedHours: 7 },
  { subject: "Deep Learning",             abbr: "DL",  color: "#16a34a", targetHours: 10, studiedHours: 8 },
  { subject: "Cloud Computing",           abbr: "CC",  color: "#dc2626", targetHours: 7, studiedHours: 5 },
  { subject: "Advanced Algorithms",       abbr: "AA",  color: "#d97706", targetHours: 9, studiedHours: 6 },
  { subject: "Computer Vision",           abbr: "CV",  color: "#7c3aed", targetHours: 5, studiedHours: 3 },
  { subject: "Data Analytics",            abbr: "DA",  color: "#0891b2", targetHours: 5, studiedHours: 4 },
  { subject: "Natural Language Processing", abbr: "NLP", color: "#c8a84b", targetHours: 7, studiedHours: 5 },
];
