// ── TypeScript Interfaces ──────────────────────────────────────────────────────

export interface SemesterTimelineEntry {
  sem: number;
  label: string;
  period: string;
  start: string;
  end: string;
  status: "Completed" | "Active" | "Upcoming";
  subjects: number;
  credits: number;
  result: string;
  sgpa: number | null;
  cgpa: number | null;
  attendance: string | null;
}

export interface DailyAttendanceRecord {
  date: string;
  dayName: string;
  displayDate: string;
  status: "Present" | "Absent" | "Holiday" | "Sunday";
  holidayName?: string;
  subject?: string;
}

export interface ProjectMilestone {
  title: string;
  due: string;
  status: string;
}

export interface ProjectData {
  projectCode: string;
  projectTitle: string;
  description: string;
  guide: string;
  coGuide?: string;
  externalExaminer?: string;
  credits: number;
  startDate: string;
  submissionDate: string;
  vivaDate: string;
  targetPublication?: string;
  milestones: ProjectMilestone[];
  techStack: string[];
}

export interface Sem3Subject {
  code: string;
  name: string;
  faculty: string;
  credits: number;
  type: "Theory" | "Practical";
  day: string;
  time: string;
  room: string;
  syllabus: string[];
}

export interface MidtermResult {
  subject: string;
  faculty: string;
  date: string;
  score: number;
  grade: string;
}

export interface IASubjectScore {
  name: string;
  score: number;
}

export interface IAAssessment {
  label: string;
  period: string;
  maxMarks: number;
  subjects: IASubjectScore[];
  average: number;
}

export interface ExamScheduleEntry {
  date: string;
  day: string;
  subject: string;
  type: "Theory" | "Practical";
}

export interface SubjectResult {
  slNo: number;
  courseCode: string;
  courseName: string;
  maxMarks: number;
  minMarks: number;
  seeMarks: number;      // Semester End Exam marks
  iaMarks: number;       // Internal Assessment marks
  marksScored: number;   // total
  credits: number;
  grade: number;         // grade point (e.g 9.5, 9, 8)
  creditPoints: number;  // credits x grade
  letterGrade: string;   // A+, A, B+ etc
  status: string;        // Pass / Fail
  isPractical?: boolean;
}

export interface SemesterResultSummary {
  result: string;        // PASS / FAIL
  sgpa: number;
  cgpa: number;
  termGrade: string;     // A+ (Excellent)
  class: string;         // First Class Exemplary
  totalCredits: number;
  totalCreditPoints: number;
}

export interface FeeStructureRow {
  type: string;
  sem1: string;
  sem2: string;
  sem3: string;
  sem4: string;
}

export interface FeesData {
  kpis: { totalPaid: string; outstanding: string; nextDue: string };
  feeStructure: FeeStructureRow[];
  feeStructureTotals: { sem1: string; sem2: string; sem3: string; sem4: string; program: string };
  payments: FeeRecord[];
  pendingDues: FeeRecord[];
  upcomingDues: { desc: string; amount: string; due: string }[];
}

export interface Language {
  name: string;
  level: string;
}

export interface EducationHistoryEntry {
  institution: string;
  degree: string;
  period: string;
  score: string;
  location: string;
}

export interface Training {
  company: string;
  program: string;
  period: string;
  track: string;
  mode: string;
  highlights: string[];
}

export interface Project {
  title: string;
  period: string;
  description: string;
  techStack: string[];
  status: "Active" | "Completed";
}

export interface Competencies {
  productManagement: string[];
  userResearch: string[];
  analyticsTools: string[];
  aiml: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
  type: string;
}

export interface Student {
  name: string;
  initials: string;
  rollNo: string;
  enrollmentNo: string;
  collegeAdminNo: string;
  registrationNo: string;
  program: string;
  university: string;
  department: string;
  specialization: string;
  batch: string;
  totalSemesters: number;
  currentSemester: number;
  academicYear: string;
  email: string;
  advisor: string;
  personalEmail: string;
  phone: string;
  linkedin: string;
  github: string;
  website: string;
  location: string;
  objective: string;
  languages: Language[];
  educationHistory: EducationHistoryEntry[];
  training: Training[];
  projects: Project[];
  competencies: Competencies;
  certifications: Certification[];
  availability: string;
}

export interface Subject {
  name: string;
  faculty?: string;
  room: string;
  color: string;
}

export interface Assignment {
  no?: number;
  subject: string;
  title: string;
  due: string;
  type?: string;
  dueDate?: Date;
  status: "Submitted" | "Pending" | "Overdue";
  marks?: string;
}

export interface SubjectAttendance {
  name: string;
  present: number;
  total: number;
}

export interface SemesterAttendance {
  totalDays: number;
  present: number;
  absent: number;
  percentage: number;
  subjects: SubjectAttendance[];
}

export interface FeeItem {
  label: string;
  amount: string;
  amountNum: number;
}

export interface FeeRecord {
  id?: string;
  desc: string;
  amount: string;
  date?: string;
  due?: string;
  status?: string;
  receiptNo?: string;
  paymentMode?: string;
  txnId?: string;
  semester?: string;
  feeItems?: FeeItem[];
}

// ── Student ───────────────────────────────────────────────────────────────────

export const student: Student = {
  name: "Koushik Thalari",
  initials: "KT",
  rollNo: "2520MCA0087",
  enrollmentNo: "SU/2025/MCA/AI/0087",
  collegeAdminNo: "SCSE/MCA/2025/087",
  registrationNo: "SU25MCA087",
  program: "MCA (AI/ML Specialization)",
  university: "Shoolini University, Solan, Himachal Pradesh — 173229",
  department: "Computer Science & Engineering",
  specialization: "Artificial Intelligence & Learning",
  batch: "2025–2027",
  totalSemesters: 4,
  currentSemester: 2,
  academicYear: "2025–2026",
  email: "koushik.thalari@shooliniuniversity.com",
  advisor: "Dr. Priya Sharma",
  personalEmail: "tkjs.koushik@gmail.com",
  phone: "+91-7901490871",
  linkedin: "https://linkedin.com/in/tkoushik",
  github: "https://github.com/Riyakoushik",
  website: "https://thalarikoushik.in",
  location: "Kurnool, Andhra Pradesh, India",
  objective: "BCA graduate on a mission to build impactful tech products and grow into a world-class Product Manager. Driven by execution-first thinking, deep AI curiosity, and a relentless hunger to solve real problems at scale.",
  languages: [
    { name: "English", level: "Fluent" },
    { name: "Telugu",  level: "Native" },
    { name: "Hindi",   level: "Conversational" },
  ],
  educationHistory: [
    {
      institution: "Sunstone, Bangalore",
      degree: "Bachelor of Computer Applications (BCA)",
      period: "May 2022 – May 2025",
      score: "CGPA: 8.56 / 10",
      location: "Bangalore, Karnataka",
    },
    {
      institution: "Sri Chaitanya College of Education",
      degree: "Intermediate (MPC)",
      period: "June 2019 – April 2021",
      score: "78%",
      location: "Vijayawada, Andhra Pradesh",
    },
    {
      institution: "Sri Chaitanya Techno School",
      degree: "SSC (Class X)",
      period: "June 2018 – March 2019",
      score: "CGPA: 9.5 / 10",
      location: "Vijayawada, Andhra Pradesh",
    },
  ],
  training: [
    {
      company: "McKinsey & Company",
      program: "Forward Program",
      period: "July 2025 – December 2025",
      track: "Product Strategy Track",
      mode: "Global (Remote)",
      highlights: [
        "Selected from 10,000+ global applicants",
        "Applied MECE frameworks and quantitative modeling — 3 strategic recommendations adopted by program leadership",
        "Delivered 15+ executive-level presentations",
      ],
    },
  ],
  projects: [
    {
      title: "RIYA – Emotionally Intelligent AI Companion",
      period: "Jan 2025 – Present",
      description: "Building an emotionally intelligent AI companion with long-term memory and short-term context buffers to provide meaningful emotional support and reduce loneliness. Architecting multi-layered memory systems and conversational state management through iterative AI research.",
      techStack: ["Python", "OpenAI APIs", "LLMs", "Agentic Workflows", "Voice Recognition"],
      status: "Active",
    },
    {
      title: "AI Research Automation System",
      period: "Jul 2024 – Sep 2024",
      description: "Developed an autonomous no-code agentic workflow in Notion using Claude AI and Manus AI to harvest, synthesize, and report deep-web market intelligence — eliminating 80% of manual research time through intelligent agent orchestration and automated summarization pipelines.",
      techStack: ["Notion", "Claude AI", "Manus AI", "AI Agents", "NLP", "Web Scraping"],
      status: "Completed",
    },
    {
      title: "Apna Teardown – AI Product Case Studies",
      period: "Oct 2024 – Present",
      description: "Authored in-depth UX teardowns and product analyses of high-growth AI products, delivering actionable PM insights covering go-to-market strategy, user psychology, and product design decisions. Published at thalarikoushik.in/blog",
      techStack: ["Product Analysis", "UX Research", "GTM Strategy", "Competitive Intelligence"],
      status: "Active",
    },
  ],
  competencies: {
    productManagement: ["Agile Methodology", "Scrum Framework", "Product Roadmap Planning", "GTM Strategy", "Backlog Prioritization", "Sprint Planning", "Stakeholder Management", "RICE Framework", "Kano Analysis", "OKRs"],
    userResearch:      ["User Interview Moderation", "Jobs-to-be-Done Framework", "Usability Testing", "User Personas", "Customer Journey Mapping", "Design Thinking"],
    analyticsTools:   ["Google Analytics", "A/B Testing", "Funnel Analysis", "Data Visualization", "SQL (Basic)", "Google Sheets"],
    aiml:             ["Python", "OpenAI APIs", "LLMs", "Agentic Workflows", "NLP", "Voice Recognition", "TensorFlow", "Prompt Engineering"],
  },
  certifications: [
    { name: "McKinsey Forward Program 2025", issuer: "McKinsey & Company", year: "2025", type: "Product Strategy & Structured Problem-Solving (6-Month Intensive)" },
    { name: "Product Management: Building a Product Strategy", issuer: "LinkedIn Learning", year: "2024", type: "Self-Paced" },
  ],
  availability: "Immediately available for Full-Time / Internship roles",
};

export const semesterTimeline: SemesterTimelineEntry[] = [
  { sem: 1, label: "Semester 1", period: "Aug 11, 2025 – Jan 17, 2026", start: "Aug 11, 2025", end: "Jan 17, 2026", status: "Completed", subjects: 11, credits: 36, result: "SGPA 9.11", sgpa: 9.11, cgpa: 9.11, attendance: "99.07%" },
  { sem: 2, label: "Semester 2", period: "Jan 19, 2026 – Jun 30, 2026", start: "Jan 19, 2026", end: "Jun 30, 2026", status: "Active", subjects: 10, credits: 32, result: "In Progress", sgpa: null, cgpa: null, attendance: "90.6%" },
  { sem: 3, label: "Semester 3", period: "Jul 6, 2026 – Dec 20, 2026", start: "Jul 6, 2026", end: "Dec 20, 2026", status: "Upcoming", subjects: 9, credits: 24, result: "—", sgpa: null, cgpa: null, attendance: null },
  { sem: 4, label: "Semester 4", period: "Jan 5, 2027 – Jun 30, 2027", start: "Jan 5, 2027", end: "Jun 30, 2027", status: "Upcoming", subjects: 6, credits: 26, result: "—", sgpa: null, cgpa: null, attendance: null },
];

// ── Subjects ──────────────────────────────────────────────────────────────────

export const sem1Subjects: Subject[] = [
  { name: "Data Structures", room: "Room 101", color: "#2563eb" },
  { name: "Computer Networks", room: "Room 102", color: "#16a34a" },
  { name: "Operating Systems", room: "Room 103", color: "#dc2626" },
  { name: "Software Engineering", room: "Room 104", color: "#d97706" },
  { name: "Web Technologies", room: "Lab 1", color: "#7c3aed" },
  { name: "Python Programming", room: "Lab 2", color: "#0891b2" },
  { name: "Mathematics for Computing", room: "Room 105", color: "#c8a84b" },
  { name: "Database Management Systems", room: "Lab 3", color: "#1e40af" },
];

export const sem2Subjects: Subject[] = [
  { name: "Advanced Machine Learning", faculty: "Dr. Priya Sharma", room: "Room 201", color: "#2563eb" },
  { name: "Deep Learning", faculty: "Dr. Rajesh Kumar", room: "Room 202", color: "#16a34a" },
  { name: "Cloud Computing", faculty: "Prof. Meera Iyer", room: "Lab 4", color: "#dc2626" },
  { name: "Advanced Algorithms", faculty: "Dr. Arjun Reddy", room: "Room 204", color: "#d97706" },
  { name: "Computer Vision", faculty: "Prof. Vikram Mehta", room: "Lab 5", color: "#7c3aed" },
  { name: "Data Analytics", faculty: "Dr. Suresh Patel", room: "Room 205", color: "#0891b2" },
  { name: "Natural Language Processing", faculty: "Dr. Anita Desai", room: "Room 206", color: "#c8a84b" },
];

// ── Timetable (old session format — kept for backward compat) ─────────────────

export const sem1Timetable: Record<string, { s1: number | null; s2: number | null }> = {
  Monday:    { s1: 0, s2: 1 },
  Tuesday:   { s1: 1, s2: 6 },
  Wednesday: { s1: 2, s2: 3 },
  Thursday:  { s1: 2, s2: 0 },
  Friday:    { s1: 4, s2: 6 },
};

export const sem2Timetable: Record<string, { s1: number | null; s2: number | null; s3: number | null }> = {
  Monday:    { s1: 0, s2: 1, s3: 4 },
  Tuesday:   { s1: 1, s2: 3, s3: null },
  Wednesday: { s1: 2, s2: 2, s3: 6 },
  Thursday:  { s1: 6, s2: 4, s3: 2 },
  Friday:    { s1: 6, s2: 0, s3: 5 },
};

// ── New daily timetable format (Mon–Sat, one 4-hr class per day) ───────────────

export interface DailyClass {
  day: string;
  subject: string;
  faculty?: string;
  time: string;
  room: string;
  color: string;
  duration: string;
  note?: string;
}

export const sem1TimetableDaily: DailyClass[] = [
  { day: "Monday",    subject: "Data Structures",           time: "9:00 AM – 1:00 PM",   room: "Room 101", color: "#2563eb", duration: "4 Hours" },
  { day: "Tuesday",   subject: "Computer Networks",         time: "10:00 AM – 2:00 PM",  room: "Room 102", color: "#16a34a", duration: "4 Hours" },
  { day: "Wednesday", subject: "Operating Systems",         time: "11:00 AM – 3:00 PM",  room: "Room 103", color: "#dc2626", duration: "4 Hours" },
  { day: "Thursday",  subject: "Software Engineering",      time: "9:00 AM – 1:00 PM",   room: "Room 104", color: "#d97706", duration: "4 Hours" },
  { day: "Friday",    subject: "Python Programming",        time: "2:00 PM – 6:00 PM",   room: "Lab 2",    color: "#0891b2", duration: "4 Hours", note: "Week A: Web Technologies (Lab 1) alternates" },
  { day: "Saturday",  subject: "Mathematics for Computing", time: "10:00 AM – 2:00 PM",  room: "Room 105", color: "#c8a84b", duration: "4 Hours", note: "Week B: DBMS (Lab 3) alternates" },
];

export const sem2TimetableDaily: DailyClass[] = [
  { day: "Monday",    subject: "Advanced Machine Learning",   faculty: "Dr. Priya Sharma",  time: "9:00 AM – 1:00 PM",   room: "Room 201", color: "#2563eb", duration: "4 Hours" },
  { day: "Tuesday",   subject: "Deep Learning",               faculty: "Dr. Rajesh Kumar",  time: "11:00 AM – 3:00 PM",  room: "Room 202", color: "#16a34a", duration: "4 Hours", note: "Alternate Tuesdays: Cloud Computing (Prof. Meera Iyer)" },
  { day: "Wednesday", subject: "Advanced Algorithms",         faculty: "Dr. Arjun Reddy",   time: "9:00 AM – 1:00 PM",   room: "Room 204", color: "#d97706", duration: "4 Hours" },
  { day: "Thursday",  subject: "Computer Vision",             faculty: "Prof. Vikram Mehta", time: "2:00 PM – 6:00 PM",  room: "Lab 5",    color: "#7c3aed", duration: "4 Hours" },
  { day: "Friday",    subject: "Data Analytics",              faculty: "Dr. Suresh Patel",  time: "10:00 AM – 2:00 PM",  room: "Room 205", color: "#0891b2", duration: "4 Hours" },
  { day: "Saturday",  subject: "Natural Language Processing", faculty: "Dr. Anita Desai",   time: "11:00 AM – 3:00 PM",  room: "Room 206", color: "#c8a84b", duration: "4 Hours" },
];

// ── Attendance ─────────────────────────────────────────────────────────────────

export const sem1Attendance: SemesterAttendance = {
  totalDays: 108,
  present: 107,
  absent: 1,
  percentage: 99.07,
  subjects: [
    { name: "Data Structures",             present: 13, total: 14 },
    { name: "Computer Networks",           present: 14, total: 14 },
    { name: "Operating Systems",           present: 13, total: 14 },
    { name: "Software Engineering",        present: 14, total: 14 },
    { name: "Web Technologies",            present: 13, total: 14 },
    { name: "Python Programming",          present: 14, total: 14 },
    { name: "Mathematics for Computing",   present: 13, total: 14 },
    { name: "Database Management Systems", present: 13, total: 14 },
  ],
};

export const sem2Attendance: SemesterAttendance = {
  totalDays: 64,
  present: 58,
  absent: 6,
  percentage: 90.6,
  subjects: [
    { name: "Advanced Machine Learning",   present: 9, total: 10 },
    { name: "Deep Learning",               present: 9, total: 10 },
    { name: "Advanced Algorithms",         present: 9, total: 10 },
    { name: "Computer Vision",             present: 9, total: 10 },
    { name: "Data Analytics",              present: 9, total: 10 },
    { name: "Natural Language Processing", present: 5, total: 5 },
    { name: "Cloud Computing",             present: 8, total: 9 },
  ],
};

export const sem2AttendanceDetailed = {
  overall: { totalClasses: 64, present: 58, absent: 6, percentage: 90.6 },
  subjects: [
    { name: "Advanced Machine Learning", day: "Monday", faculty: "Dr. Priya Sharma", present: 9, absent: 1, total: 10, percentage: 90, absentDates: ["2026-02-23"] },
    { name: "Deep Learning", day: "Tuesday", faculty: "Dr. Rajesh Kumar", present: 9, absent: 1, total: 10, percentage: 90, absentDates: ["2026-03-03"] },
    { name: "Advanced Algorithms", day: "Wednesday", faculty: "Dr. Arjun Reddy", present: 9, absent: 1, total: 10, percentage: 90, absentDates: ["2026-03-18"] },
    { name: "Computer Vision", day: "Thursday", faculty: "Prof. Vikram Mehta", present: 9, absent: 1, total: 10, percentage: 90, absentDates: ["2026-02-19"] },
    { name: "Data Analytics", day: "Friday", faculty: "Dr. Suresh Patel", present: 9, absent: 1, total: 10, percentage: 90, absentDates: ["2026-03-06"] },
    { name: "Natural Language Processing", day: "Friday (alternate)", faculty: "Dr. Anita Desai", present: 5, absent: 0, total: 5, percentage: 100, absentDates: [] },
    { name: "Cloud Computing", day: "Saturday", faculty: "Prof. Meera Iyer", present: 8, absent: 1, total: 9, percentage: 88.9, absentDates: ["2026-02-28"] },
  ],
};

// ── Assignments ────────────────────────────────────────────────────────────────

export const sem1Assignments: Assignment[] = [
  { subject: "Data Structures",             title: "Implement AVL Tree and Heap Sort",                    due: "Oct 10, 2025", marks: "9/10",  status: "Submitted" },
  { subject: "Computer Networks",           title: "Design a Network Topology for a Campus",               due: "Oct 12, 2025", marks: "8/10",  status: "Submitted" },
  { subject: "Operating Systems",           title: "Simulate CPU Scheduling Algorithms",                   due: "Oct 15, 2025", marks: "9/10",  status: "Submitted" },
  { subject: "Software Engineering",        title: "Draw UML Diagrams for Library System",                 due: "Oct 18, 2025", marks: "8/10",  status: "Submitted" },
  { subject: "Web Technologies",            title: "Build a Responsive Portfolio Website",                 due: "Oct 20, 2025", marks: "10/10", status: "Submitted" },
  { subject: "Python Programming",          title: "Implement Data Structures in Python",                  due: "Oct 22, 2025", marks: "9/10",  status: "Submitted" },
  { subject: "Mathematics for Computing",   title: "Solve Probability and Graph Theory Set",               due: "Oct 25, 2025", marks: "8/10",  status: "Submitted" },
  { subject: "Database Management Systems", title: "Design ER Diagram and Normalize to 3NF",               due: "Oct 28, 2025", marks: "9/10",  status: "Submitted" },
];

export const sem2Assignments: Assignment[] = [
  { no: 1,  subject: "Natural Language Processing", title: "Build a text classifier using BERT",                               due: "Jan 27, 2026", type: "Assignment", dueDate: new Date("2026-01-27"), status: "Submitted" },
  { no: 2,  subject: "Data Analytics",              title: "Lab 1: Deploy ML model on AWS Lambda",                            due: "Jan 30, 2026", type: "Lab",        dueDate: new Date("2026-01-30"), status: "Submitted" },
  { no: 3,  subject: "Computer Vision",             title: "Assignment 2: Implement object detection with YOLO",              due: "Feb 3, 2026",  type: "Assignment", dueDate: new Date("2026-02-03"), status: "Submitted" },
  { no: 4,  subject: "Cloud Computing",             title: "Lab 2: Create Docker container for deep learning model",          due: "Feb 6, 2026",  type: "Lab",        dueDate: new Date("2026-02-06"), status: "Submitted" },
  { no: 5,  subject: "Deep Learning",               title: "Assignment 3: Build a chatbot with transformer models",           due: "Feb 11, 2026", type: "Assignment", dueDate: new Date("2026-02-11"), status: "Submitted" },
  { no: 6,  subject: "Natural Language Processing", title: "Lab 3: Implement neural machine translation system",              due: "Feb 16, 2026", type: "Lab",        dueDate: new Date("2026-02-16"), status: "Submitted" },
  { no: 7,  subject: "Advanced Algorithms",         title: "Assignment 4: Train a GAN for image generation",                 due: "Feb 18, 2026", type: "Assignment", dueDate: new Date("2026-02-18"), status: "Submitted" },
  { no: 8,  subject: "Advanced Machine Learning",   title: "Lab 4: Build an RL agent for game playing",                      due: "Feb 20, 2026", type: "Lab",        dueDate: new Date("2026-02-20"), status: "Submitted" },
  { no: 9,  subject: "Deep Learning",               title: "Assignment 5: Build recommendation system with collaborative filtering", due: "Feb 25, 2026", type: "Assignment", dueDate: new Date("2026-02-25"), status: "Submitted" },
  { no: 10, subject: "Deep Learning",               title: "Lab 5: Implement graph neural network for social network analysis",     due: "Feb 27, 2026", type: "Lab",        dueDate: new Date("2026-02-27"), status: "Submitted" },
  { no: 11, subject: "Computer Vision",             title: "Assignment 6: Implement lane detection for autonomous vehicles",  due: "Mar 4, 2026",  type: "Assignment", dueDate: new Date("2026-03-04"), status: "Submitted" },
  { no: 12, subject: "Natural Language Processing", title: "Lab 6: Build zero-shot text classification system",              due: "Mar 6, 2026",  type: "Lab",        dueDate: new Date("2026-03-06"), status: "Submitted" },
  { no: 13, subject: "Advanced Machine Learning",   title: "Assignment 7: Complete mid-term review project",                 due: "Mar 12, 2026", type: "Assignment", dueDate: new Date("2026-03-12"), status: "Submitted" },
  { no: 14, subject: "Advanced Algorithms",         title: "Assignment 8: Implement multi-task learning framework",          due: "Mar 30, 2026", type: "Assignment", dueDate: new Date("2026-03-30"), status: "Pending" },
  { no: 15, subject: "Cloud Computing",             title: "Lab 7: Build explainable AI system with SHAP",                   due: "Apr 1, 2026",  type: "Lab",        dueDate: new Date("2026-04-01"), status: "Pending" },
  { no: 16, subject: "Advanced Machine Learning",   title: "Assignment 9: Create adversarial attack and defense system",     due: "Apr 6, 2026",  type: "Assignment", dueDate: new Date("2026-04-06"), status: "Pending" },
  { no: 17, subject: "Advanced Algorithms",         title: "Lab 8: Implement federated learning system",                    due: "Apr 8, 2026",  type: "Lab",        dueDate: new Date("2026-04-08"), status: "Pending" },
  { no: 18, subject: "Cloud Computing",             title: "Assignment 10: Deploy AI model on edge device",                 due: "Apr 10, 2026", type: "Assignment", dueDate: new Date("2026-04-10"), status: "Pending" },
];

// ── Results ────────────────────────────────────────────────────────────────────

export const sem2MidtermResults: MidtermResult[] = [
  { subject: "Advanced Machine Learning",   faculty: "Dr. Priya Sharma",  date: "Mar 17, 2026", score: 85, grade: "A+" },
  { subject: "Deep Learning",               faculty: "Dr. Rajesh Kumar",  date: "Mar 18, 2026", score: 88, grade: "A+" },
  { subject: "Natural Language Processing", faculty: "Dr. Anita Desai",   date: "Mar 19, 2026", score: 82, grade: "A+" },
  { subject: "Computer Vision",             faculty: "Prof. Vikram Mehta", date: "Mar 20, 2026", score: 86, grade: "A+" },
  { subject: "Data Analytics",              faculty: "Dr. Suresh Patel",  date: "Mar 23, 2026", score: 84, grade: "A+" },
  { subject: "Cloud Computing",             faculty: "Prof. Meera Iyer",  date: "Mar 24, 2026", score: 83, grade: "A+" },
  { subject: "Advanced Algorithms",         faculty: "Dr. Arjun Reddy",   date: "Mar 25, 2026", score: 87, grade: "A+" },
];

// ── Semester 1 Internal Assessments ───────────────────────────────────────────

export const sem1IA1: IAAssessment = {
  label: "Internal Assessment 1",
  period: "Sep 1 – Oct 1, 2025",
  maxMarks: 30,
  subjects: [
    { name: "Data Structures",             score: 25 },
    { name: "Computer Networks",           score: 26 },
    { name: "Operating Systems",           score: 24 },
    { name: "Software Engineering",        score: 27 },
    { name: "Web Technologies",            score: 27 },
    { name: "Python Programming",          score: 26 },
    { name: "Mathematics for Computing",   score: 24 },
    { name: "Database Management Systems", score: 26 },
  ],
  average: 25.6,
};

export const sem1IA2: IAAssessment = {
  label: "Internal Assessment 2",
  period: "Nov 15 – Nov 30, 2025",
  maxMarks: 30,
  subjects: [
    { name: "Data Structures",             score: 26 },
    { name: "Computer Networks",           score: 27 },
    { name: "Operating Systems",           score: 25 },
    { name: "Software Engineering",        score: 27 },
    { name: "Web Technologies",            score: 27 },
    { name: "Python Programming",          score: 26 },
    { name: "Mathematics for Computing",   score: 25 },
    { name: "Database Management Systems", score: 26 },
  ],
  average: 26.1,
};

export const sem1ExamSchedule: ExamScheduleEntry[] = [
  // Theory
  { date: "Dec 9, 2025",  day: "Tue", subject: "Data Structures",             type: "Theory" },
  { date: "Dec 11, 2025", day: "Thu", subject: "Computer Networks",           type: "Theory" },
  { date: "Dec 13, 2025", day: "Sat", subject: "Operating Systems",           type: "Theory" },
  { date: "Dec 15, 2025", day: "Mon", subject: "Software Engineering",        type: "Theory" },
  { date: "Dec 16, 2025", day: "Tue", subject: "Web Technologies",            type: "Theory" },
  { date: "Dec 17, 2025", day: "Wed", subject: "Python Programming",          type: "Theory" },
  { date: "Dec 18, 2025", day: "Thu", subject: "Mathematics for Computing",   type: "Theory" },
  { date: "Dec 18, 2025", day: "Thu", subject: "Database Management Systems", type: "Theory" },
  // Practical (Lab subjects)
  { date: "Jan 16, 2026", day: "Fri", subject: "Python Programming Lab",      type: "Practical" },
  { date: "Jan 16, 2026", day: "Fri", subject: "Web Technologies Lab",        type: "Practical" },
  { date: "Jan 17, 2026", day: "Sat", subject: "Database Management Lab",     type: "Practical" },
];

// ── SEMESTER 1 RESULT DATA ───────────────────────────────────────────────

export const sem1TheoryResults: SubjectResult[] = [
  {
    slNo: 1, courseCode: "MCAA101",
    courseName: "Data Structures",
    maxMarks: 100, minMarks: 40,
    seeMarks: 52, iaMarks: 34, marksScored: 86,
    credits: 4, grade: 9, creditPoints: 36,
    letterGrade: "A", status: "Pass"
  },
  {
    slNo: 2, courseCode: "MCAA102",
    courseName: "Computer Networks",
    maxMarks: 100, minMarks: 40,
    seeMarks: 50, iaMarks: 35, marksScored: 85,
    credits: 4, grade: 9, creditPoints: 36,
    letterGrade: "A", status: "Pass"
  },
  {
    slNo: 3, courseCode: "MCAA103",
    courseName: "Operating Systems",
    maxMarks: 100, minMarks: 40,
    seeMarks: 49, iaMarks: 33, marksScored: 82,
    credits: 4, grade: 9, creditPoints: 36,
    letterGrade: "A", status: "Pass"
  },
  {
    slNo: 4, courseCode: "MCAA104",
    courseName: "Software Engineering",
    maxMarks: 100, minMarks: 40,
    seeMarks: 52, iaMarks: 36, marksScored: 88,
    credits: 3, grade: 9, creditPoints: 27,
    letterGrade: "A", status: "Pass"
  },
  {
    slNo: 5, courseCode: "MCAA105",
    courseName: "Web Technologies",
    maxMarks: 100, minMarks: 40,
    seeMarks: 51, iaMarks: 36, marksScored: 87,
    credits: 3, grade: 9, creditPoints: 27,
    letterGrade: "A", status: "Pass"
  },
  {
    slNo: 6, courseCode: "MCAA106",
    courseName: "Python Programming",
    maxMarks: 100, minMarks: 40,
    seeMarks: 52, iaMarks: 35, marksScored: 87,
    credits: 4, grade: 9, creditPoints: 36,
    letterGrade: "A", status: "Pass"
  },
  {
    slNo: 7, courseCode: "MCAA107",
    courseName: "Mathematics for Computing",
    maxMarks: 100, minMarks: 40,
    seeMarks: 48, iaMarks: 33, marksScored: 81,
    credits: 4, grade: 9, creditPoints: 36,
    letterGrade: "A", status: "Pass"
  },
  {
    slNo: 8, courseCode: "MCAA108",
    courseName: "Database Management Systems",
    maxMarks: 100, minMarks: 40,
    seeMarks: 53, iaMarks: 35, marksScored: 88,
    credits: 4, grade: 9, creditPoints: 36,
    letterGrade: "A", status: "Pass"
  },
];

export const sem1PracticalResults: SubjectResult[] = [
  {
    slNo: 9, courseCode: "MCAP101",
    courseName: "Python Programming Lab",
    maxMarks: 50, minMarks: 20,
    seeMarks: 46, iaMarks: 0, marksScored: 46,
    credits: 2, grade: 10, creditPoints: 20,
    letterGrade: "A+", status: "Pass", isPractical: true
  },
  {
    slNo: 10, courseCode: "MCAP102",
    courseName: "Web Technologies Lab",
    maxMarks: 50, minMarks: 20,
    seeMarks: 45, iaMarks: 0, marksScored: 45,
    credits: 2, grade: 10, creditPoints: 20,
    letterGrade: "A+", status: "Pass", isPractical: true
  },
  {
    slNo: 11, courseCode: "MCAP103",
    courseName: "Database Management Lab",
    maxMarks: 50, minMarks: 20,
    seeMarks: 42, iaMarks: 0, marksScored: 42,
    credits: 2, grade: 9, creditPoints: 18,
    letterGrade: "A", status: "Pass", isPractical: true
  },
];

export const sem1ResultSummary: SemesterResultSummary = {
  result: "PASS",
  sgpa: 9.11,
  cgpa: 9.11,
  termGrade: "A (Excellent)",
  class: "First Class with Distinction",
  totalCredits: 36,
  totalCreditPoints: 328,
};

// ── SEMESTER 2 RESULT DATA ───────────────────────────────────────────────

export const sem2TheoryResults: SubjectResult[] = [
  { slNo:1, courseCode:"MCAB201", courseName:"Advanced Machine Learning",
    maxMarks:100, minMarks:40, seeMarks:0, iaMarks:85,
    marksScored:0, credits:4, grade:0, creditPoints:0,
    letterGrade:"—", status:"Awaited", isPractical:false },
  { slNo:2, courseCode:"MCAB202", courseName:"Deep Learning",
    maxMarks:100, minMarks:40, seeMarks:0, iaMarks:88,
    marksScored:0, credits:4, grade:0, creditPoints:0,
    letterGrade:"—", status:"Awaited", isPractical:false },
  { slNo:3, courseCode:"MCAB203", courseName:"Natural Language Processing",
    maxMarks:100, minMarks:40, seeMarks:0, iaMarks:82,
    marksScored:0, credits:4, grade:0, creditPoints:0,
    letterGrade:"—", status:"Awaited", isPractical:false },
  { slNo:4, courseCode:"MCAB204", courseName:"Computer Vision",
    maxMarks:100, minMarks:40, seeMarks:0, iaMarks:86,
    marksScored:0, credits:4, grade:0, creditPoints:0,
    letterGrade:"—", status:"Awaited", isPractical:false },
  { slNo:5, courseCode:"MCAB205", courseName:"Data Analytics",
    maxMarks:100, minMarks:40, seeMarks:0, iaMarks:84,
    marksScored:0, credits:3, grade:0, creditPoints:0,
    letterGrade:"—", status:"Awaited", isPractical:false },
  { slNo:6, courseCode:"MCAB206", courseName:"Cloud Computing",
    maxMarks:100, minMarks:40, seeMarks:0, iaMarks:83,
    marksScored:0, credits:3, grade:0, creditPoints:0,
    letterGrade:"—", status:"Awaited", isPractical:false },
  { slNo:7, courseCode:"MCAB207", courseName:"Advanced Algorithms",
    maxMarks:100, minMarks:40, seeMarks:0, iaMarks:87,
    marksScored:0, credits:4, grade:0, creditPoints:0,
    letterGrade:"—", status:"Awaited", isPractical:false },
];

export const sem2PracticalResults: SubjectResult[] = [
  { slNo:8, courseCode:"MCABP201", courseName:"Machine Learning Lab",
    maxMarks:50, minMarks:20, seeMarks:0, iaMarks:0,
    marksScored:0, credits:2, grade:0, creditPoints:0,
    letterGrade:"—", status:"Awaited", isPractical:true },
  { slNo:9, courseCode:"MCABP202", courseName:"Deep Learning Lab",
    maxMarks:50, minMarks:20, seeMarks:0, iaMarks:0,
    marksScored:0, credits:2, grade:0, creditPoints:0,
    letterGrade:"—", status:"Awaited", isPractical:true },
  { slNo:10, courseCode:"MCABP203", courseName:"Computer Vision Lab",
    maxMarks:50, minMarks:20, seeMarks:0, iaMarks:0,
    marksScored:0, credits:2, grade:0, creditPoints:0,
    letterGrade:"—", status:"Awaited", isPractical:true },
];

export const sem2ResultSummary: SemesterResultSummary = {
  result: "In Progress",
  sgpa: 0,
  cgpa: 0,
  termGrade: "Awaited",
  class: "Awaited",
  totalCredits: 32,
  totalCreditPoints: 0,
};

// ── Fees ───────────────────────────────────────────────────────────────────────

export const feesData: FeesData = {
  kpis: {
    totalPaid: "₹66,000",
    outstanding: "₹57,000",
    nextDue: "July 2026 (Sem 3)",
  },
  feeStructure: [
    { type: "Tuition Fee",          sem1: "₹48,000", sem2: "₹48,000", sem3: "₹48,000", sem4: "₹48,000" },
    { type: "Examination Fee",      sem1: "₹8,000",  sem2: "₹8,000",  sem3: "₹8,000",  sem4: "₹8,000"  },
    { type: "Lab / Practical Fee",  sem1: "₹4,500",  sem2: "₹4,500",  sem3: "₹4,500",  sem4: "₹4,500"  },
    { type: "Library Fee",          sem1: "₹1,500",  sem2: "—",       sem3: "₹1,500",  sem4: "—"        },
    { type: "Student Activity Fee", sem1: "₹500",    sem2: "—",       sem3: "₹500",    sem4: "—"        },
  ],
  feeStructureTotals: {
    sem1: "₹62,500", sem2: "₹60,500", sem3: "₹62,500", sem4: "₹60,500", program: "₹2,46,000",
  },
  payments: [
    {
      id: "SU-2025-MCA-001",
      desc: "Semester 1 Fee — Installment 1",
      amount: "₹24,000",
      date: "Aug 12, 2025",
      status: "Paid",
      receiptNo: "SU-PAY-25MCA-001",
      paymentMode: "UPI",
      txnId: "UPI20250812XXXXX001",
      semester: "Semester 1 — First Installment",
      feeItems: [
        { label: "Tuition Fee",          amount: "Rs. 18,000", amountNum: 18000 },
        { label: "Examination Fee",      amount: "Rs. 2,000",  amountNum: 2000  },
        { label: "Lab / Practical Fee",  amount: "Rs. 2,500",  amountNum: 2500  },
        { label: "Library Fee",          amount: "Rs. 1,000",  amountNum: 1000  },
        { label: "Student Activity Fee", amount: "Rs. 500",    amountNum: 500   },
      ],
    },
    {
      id: "SU-2025-MCA-002",
      desc: "Semester 1 Fee — Installment 2",
      amount: "₹18,000",
      date: "Oct 15, 2025",
      status: "Paid",
      receiptNo: "SU-PAY-25MCA-002",
      paymentMode: "UPI",
      txnId: "UPI20251015XXXXX002",
      semester: "Semester 1 — Second Installment (Balance Clearance)",
      feeItems: [
        { label: "Tuition Fee",          amount: "Rs. 12,000", amountNum: 12000 },
        { label: "Examination Fee",      amount: "Rs. 2,000",  amountNum: 2000  },
        { label: "Lab / Practical Fee",  amount: "Rs. 2,500",  amountNum: 2500  },
        { label: "Library Fee",          amount: "Rs. 1,000",  amountNum: 1000  },
        { label: "Student Activity Fee", amount: "Rs. 500",    amountNum: 500   },
      ],
    },
    {
      id: "SU-2026-MCA-001",
      desc: "Semester 2 Fee — Installment 1",
      amount: "₹24,000",
      date: "Jan 20, 2026",
      status: "Paid",
      receiptNo: "SU-PAY-25MCA-003",
      paymentMode: "UPI",
      txnId: "UPI20260120XXXXX003",
      semester: "Semester 2 — First Installment",
      feeItems: [
        { label: "Tuition Fee",          amount: "Rs. 18,000", amountNum: 18000 },
        { label: "Examination Fee",      amount: "Rs. 2,000",  amountNum: 2000  },
        { label: "Lab / Practical Fee",  amount: "Rs. 2,500",  amountNum: 2500  },
        { label: "Library Fee",          amount: "Rs. 1,000",  amountNum: 1000  },
        { label: "Student Activity Fee", amount: "Rs. 500",    amountNum: 500   },
      ],
    },
  ],
  pendingDues: [
    { desc: "Semester 1 Remaining Balance", amount: "₹20,500", due: "Overdue",      status: "Overdue" },
    { desc: "Semester 2 Remaining Balance", amount: "₹36,500", due: "Mar 31, 2026", status: "Overdue" },
  ],
  upcomingDues: [
    { desc: "Semester 3 Fee", amount: "₹62,500", due: "July 2026" },
    { desc: "Semester 4 Fee", amount: "₹60,500", due: "January 2027" },
  ],
};

// ── Calendar Events ────────────────────────────────────────────────────────────

export interface CalendarEvent {
  date: string;
  label: string;
  type: "exam" | "assignment" | "semester" | "holiday";
}

export const calendarEvents: CalendarEvent[] = [
  // ── Semester 1 ──
  { date: "2025-08-11", label: "Semester 1 Orientation Day",          type: "semester" },
  { date: "2025-09-01", label: "Internal Assessment 1 Begins",        type: "semester" },
  { date: "2025-10-01", label: "Internal Assessment 1 Ends",          type: "semester" },
  { date: "2025-10-10", label: "Assignment Due: Data Structures",     type: "assignment" },
  { date: "2025-10-12", label: "Assignment Due: Computer Networks",   type: "assignment" },
  { date: "2025-10-15", label: "Assignment Due: Operating Systems",   type: "assignment" },
  { date: "2025-10-18", label: "Assignment Due: Software Engineering",type: "assignment" },
  { date: "2025-10-20", label: "Assignment Due: Web Technologies",    type: "assignment" },
  { date: "2025-10-22", label: "Assignment Due: Python Programming",  type: "assignment" },
  { date: "2025-10-25", label: "Assignment Due: Mathematics",         type: "assignment" },
  { date: "2025-10-28", label: "Assignment Due: DBMS",                type: "assignment" },
  { date: "2025-10-31", label: "Diwali Holiday",                      type: "holiday" },
  { date: "2025-11-03", label: "Classes Resume After Diwali",         type: "semester" },
  { date: "2025-11-15", label: "Internal Assessment 2 Begins",        type: "semester" },
  { date: "2025-11-30", label: "Internal Assessment 2 Ends",          type: "semester" },
  { date: "2025-12-05", label: "Exam Preparation Break Begins",       type: "holiday" },
  { date: "2025-12-08", label: "Pre-Exam Briefing",                   type: "semester" },
  { date: "2025-12-09", label: "Exam: Data Structures",               type: "exam" },
  { date: "2025-12-10", label: "Exam: Computer Networks",             type: "exam" },
  { date: "2025-12-11", label: "Exam: Database Management Systems",   type: "exam" },
  { date: "2025-12-12", label: "Exam: Operating Systems",             type: "exam" },
  { date: "2025-12-13", label: "Exam: Software Engineering",          type: "exam" },
  { date: "2025-12-16", label: "Exam: Web Technologies",              type: "exam" },
  { date: "2025-12-17", label: "Exam: Python Programming",            type: "exam" },
  { date: "2025-12-18", label: "Exam: Mathematics for Computing",     type: "exam" },
  { date: "2025-12-25", label: "Christmas Holiday",                   type: "holiday" },
  { date: "2025-12-26", label: "Winter Break",                        type: "holiday" },
  { date: "2025-12-27", label: "Winter Break",                        type: "holiday" },
  { date: "2025-12-28", label: "Winter Break",                        type: "holiday" },
  { date: "2025-12-29", label: "Winter Break",                        type: "holiday" },
  { date: "2025-12-30", label: "Winter Break",                        type: "holiday" },
  { date: "2025-12-31", label: "Winter Break",                        type: "holiday" },
  { date: "2026-01-01", label: "New Year Holiday",                    type: "holiday" },
  { date: "2026-01-05", label: "Practical Exam Preparation Begins",   type: "semester" },
  { date: "2026-01-16", label: "Practical Exam: Data Structures",     type: "exam" },
  { date: "2026-01-17", label: "Practical Exam: Computer Networks",   type: "exam" },
  { date: "2026-01-17", label: "Semester 1 Officially Ends",          type: "semester" },
  { date: "2026-01-18", label: "Semester Break",                      type: "holiday" },
  // ── Semester 2 ──
  { date: "2026-01-19", label: "Semester 2 Orientation / First Day",  type: "semester" },
  { date: "2026-01-27", label: "Assignment Due: NLP — BERT classifier",             type: "assignment" },
  { date: "2026-01-30", label: "Assignment Due: Data Analytics Lab 1",              type: "assignment" },
  { date: "2026-02-03", label: "Assignment Due: Computer Vision — YOLO",            type: "assignment" },
  { date: "2026-02-06", label: "Assignment Due: Cloud Computing Lab 2",             type: "assignment" },
  { date: "2026-02-11", label: "Assignment Due: Deep Learning — Chatbot",           type: "assignment" },
  { date: "2026-02-14", label: "Valentine's Day (No Class)",                        type: "holiday" },
  { date: "2026-02-16", label: "Assignment Due: NLP Lab 3 — Neural Machine Translation", type: "assignment" },
  { date: "2026-02-18", label: "Assignment Due: Advanced Algorithms — GAN",         type: "assignment" },
  { date: "2026-02-20", label: "Assignment Due: Advanced ML Lab 4 — RL Agent",      type: "assignment" },
  { date: "2026-02-25", label: "Assignment Due: Deep Learning — Recommendation System", type: "assignment" },
  { date: "2026-02-26", label: "Internal Assessment 1 (Sem 2)",                     type: "semester" },
  { date: "2026-02-27", label: "Assignment Due: Deep Learning Lab 5 — Graph NN",   type: "assignment" },
  { date: "2026-03-04", label: "Assignment Due: Computer Vision — Lane Detection",  type: "assignment" },
  { date: "2026-03-06", label: "Assignment Due: NLP Lab 6 — Zero-Shot Classification", type: "assignment" },
  { date: "2026-03-08", label: "International Women's Day — College Event",         type: "semester" },
  { date: "2026-03-12", label: "Assignment Due: Advanced ML — Mid-term Review",     type: "assignment" },
  { date: "2026-03-14", label: "Mid-term Preparation Week Begins",                  type: "semester" },
  { date: "2026-03-15", label: "Holi Holiday",                                      type: "holiday" },
  { date: "2026-03-16", label: "Holi Break",                                        type: "holiday" },
  { date: "2026-03-17", label: "Mid-term Exam: Advanced Machine Learning",          type: "exam" },
  { date: "2026-03-18", label: "Mid-term Exam: Deep Learning",                      type: "exam" },
  { date: "2026-03-19", label: "Mid-term Exam: Natural Language Processing",        type: "exam" },
  { date: "2026-03-20", label: "Mid-term Exam: Computer Vision",                    type: "exam" },
  { date: "2026-03-23", label: "Mid-term Exam: Data Analytics",                     type: "exam" },
  { date: "2026-03-24", label: "Mid-term Exam: Cloud Computing",                    type: "exam" },
  { date: "2026-03-25", label: "Mid-term Exam: Advanced Algorithms",                type: "exam" },
  { date: "2026-03-26", label: "Mid-terms Concluded — Classes Resume",              type: "semester" },
  { date: "2026-03-30", label: "Assignment Due: Adv Algorithms — Multi-task Learning", type: "assignment" },
  { date: "2026-04-01", label: "Assignment Due: Cloud Computing Lab 7 — SHAP",     type: "assignment" },
  { date: "2026-04-06", label: "Assignment Due: Advanced ML — Adversarial Attack",  type: "assignment" },
  { date: "2026-04-07", label: "Ambedkar Jayanti Holiday",                          type: "holiday" },
  { date: "2026-04-08", label: "Assignment Due: Adv Algorithms Lab 8 — Federated Learning", type: "assignment" },
  { date: "2026-04-10", label: "Assignment Due: Cloud Computing — Edge AI Deployment", type: "assignment" },
  { date: "2026-04-14", label: "Baisakhi Holiday",                                  type: "holiday" },
  { date: "2026-04-21", label: "Pre-final Exam: Advanced Machine Learning",         type: "exam" },
  { date: "2026-04-22", label: "Pre-final Exam: Deep Learning",                     type: "exam" },
  { date: "2026-04-23", label: "Pre-final Exam: Natural Language Processing",       type: "exam" },
  { date: "2026-04-24", label: "Pre-final Exam: Computer Vision",                   type: "exam" },
  { date: "2026-04-27", label: "Pre-final Exam: Data Analytics",                    type: "exam" },
  { date: "2026-04-28", label: "Pre-final Exam: Cloud Computing",                   type: "exam" },
  { date: "2026-04-29", label: "Pre-final Exam: Advanced Algorithms",               type: "exam" },
  { date: "2026-05-01", label: "Labour Day Holiday",                                type: "holiday" },
  { date: "2026-05-11", label: "Final Exam: Advanced Machine Learning",             type: "exam" },
  { date: "2026-05-12", label: "Final Exam: Deep Learning",                         type: "exam" },
  { date: "2026-05-13", label: "Final Exam: Natural Language Processing",           type: "exam" },
  { date: "2026-05-14", label: "Final Exam: Computer Vision",                       type: "exam" },
  { date: "2026-05-15", label: "Final Exam: Data Analytics",                        type: "exam" },
  { date: "2026-05-18", label: "Final Exam: Cloud Computing",                       type: "exam" },
  { date: "2026-05-19", label: "Final Exam: Advanced Algorithms",                   type: "exam" },
  { date: "2026-05-25", label: "Practical Exam: Advanced Machine Learning",         type: "exam" },
  { date: "2026-05-26", label: "Practical Exam: Natural Language Processing",       type: "exam" },
  { date: "2026-05-27", label: "Practical Exam: Data Analytics",                    type: "exam" },
  { date: "2026-05-28", label: "Practical Exam: Advanced Algorithms",               type: "exam" },
  { date: "2026-06-30", label: "Semester 2 Ends",                                   type: "semester" },
  // ── Semester 3 ──
  { date: "2026-07-06", label: "Semester 3 Begins",                                  type: "semester" },
  { date: "2026-08-15", label: "Independence Day Holiday",                           type: "holiday" },
  { date: "2026-08-18", label: "Assignment Due: Research Paper Review",              type: "assignment" },
  { date: "2026-08-20", label: "Assignment Due: MDP & Bellman Equation",             type: "assignment" },
  { date: "2026-08-22", label: "Assignment Due: Hadoop MapReduce",                   type: "assignment" },
  { date: "2026-08-25", label: "Assignment Due: Transformer Architecture",           type: "assignment" },
  { date: "2026-08-27", label: "Janmashtami Holiday",                                type: "holiday" },
  { date: "2026-09-01", label: "IA1 Examination Begins",                             type: "exam" },
  { date: "2026-09-05", label: "Assignment Due: Q-Learning vs SARSA",                type: "assignment" },
  { date: "2026-09-08", label: "Assignment Due: Network Vulnerability Assessment",   type: "assignment" },
  { date: "2026-09-10", label: "IA1 Examination Ends",                               type: "exam" },
  { date: "2026-09-10", label: "Assignment Due: Spark DataFrame Analysis",           type: "assignment" },
  { date: "2026-09-12", label: "Assignment Due: RL Agent CartPole",                  type: "assignment" },
  { date: "2026-09-15", label: "Assignment Due: Fine-tune BERT",                     type: "assignment" },
  { date: "2026-09-20", label: "Assignment Due: CI/CD Pipeline",                     type: "assignment" },
  { date: "2026-09-25", label: "Assignment Due: OWASP Top 10",                       type: "assignment" },
  { date: "2026-10-01", label: "Assignment Due: Docker Containerization",            type: "assignment" },
  { date: "2026-10-02", label: "Gandhi Jayanti Holiday",                             type: "holiday" },
  { date: "2026-10-05", label: "Assignment Due: IEEE Paper Draft",                   type: "assignment" },
  { date: "2026-10-08", label: "Assignment Due: Deep Q-Network Report",              type: "assignment" },
  { date: "2026-10-15", label: "Assignment Due: Kafka Stream Processing",            type: "assignment" },
  { date: "2026-10-19", label: "IA2 Examination Begins",                             type: "exam" },
  { date: "2026-10-20", label: "Dussehra Holiday",                                   type: "holiday" },
  { date: "2026-10-20", label: "Assignment Due: MongoDB Aggregation",                type: "assignment" },
  { date: "2026-10-22", label: "Assignment Due: LangChain RAG Chatbot",              type: "assignment" },
  { date: "2026-10-28", label: "IA2 Examination Ends",                               type: "exam" },
  { date: "2026-10-28", label: "Assignment Due: Stable Diffusion Report",            type: "assignment" },
  { date: "2026-11-01", label: "Diwali Holiday",                                     type: "holiday" },
  { date: "2026-11-02", label: "Diwali 2nd Day Holiday",                             type: "holiday" },
  { date: "2026-11-05", label: "Bhai Dooj Holiday",                                  type: "holiday" },
  { date: "2026-11-16", label: "Pre-Final Exams Begin",                              type: "exam" },
  { date: "2026-11-20", label: "Pre-Final Exams End",                                type: "exam" },
  { date: "2026-11-25", label: "Mini Project Submission",                            type: "assignment" },
  { date: "2026-11-30", label: "Theory Exams Begin",                                 type: "exam" },
  { date: "2026-12-15", label: "Mini Project Viva",                                  type: "exam" },
  { date: "2026-12-18", label: "Theory Exams End",                                   type: "exam" },
  { date: "2026-12-19", label: "Practical Exams Begin",                              type: "exam" },
  { date: "2026-12-20", label: "Practical Exams End / Semester 3 Ends",              type: "semester" },
  { date: "2026-12-25", label: "Christmas Holiday",                                  type: "holiday" },
  // ── Semester 4 ──
  { date: "2027-01-05", label: "Semester 4 Begins",                                  type: "semester" },
  { date: "2027-01-20", label: "Dissertation Chapter 1 Due",                         type: "assignment" },
  { date: "2027-01-26", label: "Republic Day Holiday",                               type: "holiday" },
  { date: "2027-02-05", label: "Dissertation Chapter 2 Due",                         type: "assignment" },
  { date: "2027-02-16", label: "IA1 Examination Begins",                             type: "exam" },
  { date: "2027-02-20", label: "IA1 Examination Ends",                               type: "exam" },
  { date: "2027-02-28", label: "Dissertation Chapter 3 Due",                         type: "assignment" },
  { date: "2027-03-22", label: "IA2 Examination Begins",                             type: "exam" },
  { date: "2027-03-25", label: "Dissertation Chapter 4 Due",                         type: "assignment" },
  { date: "2027-03-26", label: "IA2 Examination Ends",                               type: "exam" },
  { date: "2027-04-19", label: "Pre-Final Exams Begin",                              type: "exam" },
  { date: "2027-04-23", label: "Pre-Final Exams End",                                type: "exam" },
  { date: "2027-05-10", label: "Theory Final Exams Begin",                           type: "exam" },
  { date: "2027-05-20", label: "Theory Final Exams End",                             type: "exam" },
  { date: "2027-05-22", label: "Practical Exams Begin",                              type: "exam" },
  { date: "2027-05-24", label: "Practical Exams End",                                type: "exam" },
  { date: "2027-05-31", label: "Final Dissertation Submission",                      type: "assignment" },
  { date: "2027-06-10", label: "Dissertation Viva",                                  type: "exam" },
  { date: "2027-06-30", label: "Semester 4 Ends / Program Complete",                 type: "semester" },
];

// ── Offer Letter Data ──────────────────────────────────────────────────────────

export interface OfferLetterJoiningDetail {
  label: string;
  value: string;
}

export interface OfferLetterDocument {
  doc: string;
  via: string;
  status: string;
}

export interface OfferLetterSemesterFee {
  sem: string;
  tuition: number;
  exam: number;
  lab: number;
  library: number;
  activity: number;
  total: number;
}

export interface OfferLetterMiscFee {
  label: string;
  amount: number;
}

export interface OfferLetterPaymentSchedule {
  installment: string;
  dueDate: string;
  amount: string;
  description: string;
}

export interface OfferLetterDigiLockerStep {
  step: number;
  label: string;
  detail: string;
}

export interface OfferLetterData {
  offerLetterNo: string;
  issueDate: string;
  reportingDate: string;
  orientationDate: string;
  classesBegin: string;
  fatherName: string;
  motherName: string;
  dbaReference: string;
  digiLockerConsentId: string;
  academicAdvisor: string;
  documents: OfferLetterDocument[];
  digiLockerPartnerId: string;
  dbaRefNo: string;
  verificationDate: string;
  semesterFees: OfferLetterSemesterFee[];
  miscFees: OfferLetterMiscFee[];
  grandTotal: number;
  miscTotal: number;
  paymentSchedule: OfferLetterPaymentSchedule[];
  upiId: string;
  ddFavorOf: string;
  digiLockerSteps: OfferLetterDigiLockerStep[];
}

export const offerLetterData: OfferLetterData = {
  offerLetterNo: "SU/MCA/2025/OL/00487",
  issueDate: "05 August 2025",
  reportingDate: "11 August 2025",
  orientationDate: "12 August 2025",
  classesBegin: "13 August 2025",
  fatherName: "Thalari Jayaraju",
  motherName: "Thalari Shanthi",
  dbaReference: "DBA/SU/2025/MCA/09871",
  digiLockerConsentId: "DGL2025KT00487",
  academicAdvisor: "Dr. Priya Sharma",
  documents: [
    { doc: "Bachelor's Degree Certificate",      via: "DigiLocker",     status: "Verified" },
    { doc: "Mark Sheet — Year 1",                via: "DigiLocker",     status: "Verified" },
    { doc: "Mark Sheet — Year 2",                via: "DigiLocker",     status: "Verified" },
    { doc: "Mark Sheet — Year 3",                via: "DigiLocker",     status: "Verified" },
    { doc: "Transfer Certificate (TC)",          via: "DigiLocker",     status: "Verified" },
    { doc: "Migration Certificate",              via: "DigiLocker",     status: "Verified" },
    { doc: "Character Certificate",              via: "DigiLocker",     status: "Verified" },
    { doc: "Medical Fitness Certificate",        via: "Physical Upload", status: "Verified" },
    { doc: "Aadhaar Card",                       via: "DigiLocker",     status: "Verified" },
    { doc: "Passport-size Photographs (×4)",     via: "Physical Upload", status: "Verified" },
    { doc: "Anti-Ragging Affidavit (Student)",   via: "Physical Upload", status: "Verified" },
    { doc: "Anti-Ragging Affidavit (Parent)",    via: "Physical Upload", status: "Verified" },
    { doc: "Income Certificate",                 via: "DigiLocker",     status: "Verified" },
    { doc: "Domicile Certificate",               via: "DigiLocker",     status: "Verified" },
    { doc: "Gap Certificate (if applicable)",    via: "Physical Upload", status: "Verified" },
    { doc: "Category Certificate (OBC/SC/ST)",   via: "DigiLocker",     status: "Verified" },
  ],
  digiLockerPartnerId: "DLP-SU-2025-MCA",
  dbaRefNo: "DBA/SU/2025/MCA/09871",
  verificationDate: "03 August 2025",
  semesterFees: [
    { sem: "Semester 1", tuition: 45000, exam: 3000, lab: 4000, library: 1500, activity: 1500, total: 55000 },
    { sem: "Semester 2", tuition: 45000, exam: 3000, lab: 4000, library: 1500, activity: 1500, total: 55000 },
    { sem: "Semester 3", tuition: 43000, exam: 3000, lab: 4000, library: 1500, activity: 1500, total: 53000 },
    { sem: "Semester 4", tuition: 41000, exam: 3000, lab: 4000, library: 1500, activity: 1500, total: 51000 },
  ],
  miscFees: [
    { label: "Registration Fee",       amount: 5000  },
    { label: "Alumni Fee",             amount: 3000  },
    { label: "Caution Deposit",        amount: 10000 },
    { label: "Welfare Fund",           amount: 5000  },
    { label: "Development Fund",       amount: 8000  },
    { label: "ID / Smart Card",        amount: 2000  },
    { label: "Insurance",              amount: 3000  },
  ],
  grandTotal: 250000,
  miscTotal: 36000,
  paymentSchedule: [
    { installment: "Installment 1", dueDate: "10 Aug 2025", amount: "Rs. 55,000", description: "Semester 1 Fee (on reporting)" },
    { installment: "Installment 2", dueDate: "15 Aug 2025", amount: "Rs. 36,000", description: "All miscellaneous fees" },
    { installment: "Installment 3", dueDate: "15 Jan 2026", amount: "Rs. 55,000", description: "Semester 2 Fee" },
    { installment: "Installment 4", dueDate: "15 Jul 2026", amount: "Rs. 53,000", description: "Semester 3 Fee" },
    { installment: "Installment 5", dueDate: "15 Jan 2027", amount: "Rs. 51,000", description: "Semester 4 Fee" },
  ],
  upiId: "shooliniuniversity@sbi",
  ddFavorOf: "Shoolini University of Biotechnology and Management Sciences",
  digiLockerSteps: [
    { step: 1, label: "DigiLocker Account Linked",      detail: "Applicant linked DigiLocker account using Aadhaar OTP authentication." },
    { step: 2, label: "Consent Granted",                detail: `Consent ID: DGL2025KT00487 — granted to Shoolini University (Partner ID: DLP-SU-2025-MCA).` },
    { step: 3, label: "Documents Auto-fetched & Verified", detail: "10 documents pulled directly from government issuer APIs via DigiLocker on 03 Aug 2025." },
    { step: 4, label: "DBA Cross-verification Complete", detail: `DBA Ref: DBA/SU/2025/MCA/09871 — all submitted credentials verified against issuing institutions.` },
  ],
};

// ── Public Holidays ────────────────────────────────────────────────────────────

export const publicHolidays: Record<string, string> = {
  "2025-08-15": "Independence Day",
  "2025-10-02": "Gandhi Jayanti",
  "2025-10-20": "Dussehra",
  "2025-11-01": "Diwali",
  "2025-11-02": "Diwali 2nd Day",
  "2025-12-25": "Christmas",
  "2026-01-26": "Republic Day",
  "2026-03-10": "Holi",
  "2026-03-25": "Holi 2nd Day (HP)",
  "2026-04-14": "Dr. Ambedkar Jayanti",
  "2026-04-18": "Good Friday",
  "2026-05-01": "Labour Day",
  "2026-05-12": "Buddha Purnima",
  "2026-06-05": "Bakrid",
  "2026-08-15": "Independence Day",
  "2026-08-27": "Janmashtami",
  "2026-10-02": "Gandhi Jayanti",
  "2026-10-20": "Dussehra",
  "2026-11-01": "Diwali",
  "2026-11-02": "Diwali 2nd Day",
  "2026-11-05": "Bhai Dooj",
  "2026-12-25": "Christmas",
  "2027-01-26": "Republic Day",
};

// ── Daily Attendance Log Generator ─────────────────────────────────────────────

const MONTH_ABBR = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function formatDisplayDate(d: Date): string {
  return `${MONTH_ABBR[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function pad2(n: number): string { return n < 10 ? `0${n}` : `${n}`; }

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
}

export function generateDailyAttendance(
  startDate: string,
  endDate: string,
  absentDates: string[] = [],
): DailyAttendanceRecord[] {
  const records: DailyAttendanceRecord[] = [];
  const portalDate = new Date("2026-03-31");
  const start = new Date(startDate);
  const end = new Date(endDate);
  const finalDate = end < portalDate ? end : portalDate;
  const absentSet = new Set(absentDates);

  for (let d = new Date(start); d <= finalDate; d.setDate(d.getDate() + 1)) {
    const ds = toDateStr(d);
    const dayName = DAY_NAMES[d.getDay()];
    const displayDate = formatDisplayDate(d);

    if (d.getDay() === 0) {
      records.push({ date: ds, dayName, displayDate, status: "Sunday" });
      continue;
    }
    if (publicHolidays[ds]) {
      records.push({ date: ds, dayName, displayDate, status: "Holiday", holidayName: publicHolidays[ds] });
      continue;
    }
    if (absentSet.has(ds)) {
      records.push({ date: ds, dayName, displayDate, status: "Absent" });
      continue;
    }
    records.push({ date: ds, dayName, displayDate, status: "Present" });
  }
  return records;
}

// Pre-generated daily logs
export const sem1DailyLog: DailyAttendanceRecord[] = generateDailyAttendance(
  "2025-08-11", "2026-01-17", ["2025-10-15"]
);

export const sem2DailyLog: DailyAttendanceRecord[] = generateDailyAttendance(
  "2026-01-19", "2026-03-31",
  ["2026-02-23","2026-03-03","2026-03-18","2026-02-19","2026-03-06","2026-02-28"]
);

// ── Semester 3 Full Data ───────────────────────────────────────────────────────

export const sem3Subjects: Sem3Subject[] = [
  {
    code: "MCAC301", name: "Reinforcement Learning", faculty: "Dr. Priya Sharma",
    credits: 4, type: "Theory", day: "Monday", time: "9:00 AM – 1:00 PM", room: "LH-301",
    syllabus: [
      "Unit 1: Introduction to RL, Markov Decision Processes, Bellman Equations",
      "Unit 2: Dynamic Programming, Monte Carlo Methods, TD Learning",
      "Unit 3: Q-Learning, SARSA, Deep Q-Networks (DQN)",
      "Unit 4: Policy Gradient Methods, Actor-Critic, PPO, A3C",
      "Unit 5: Multi-Agent RL, Real-world Applications, OpenAI Gym",
    ],
  },
  {
    code: "MCAC302", name: "Big Data Analytics", faculty: "Dr. Suresh Patel",
    credits: 4, type: "Theory", day: "Tuesday", time: "9:00 AM – 1:00 PM", room: "LH-302",
    syllabus: [
      "Unit 1: Big Data Ecosystem, Hadoop, HDFS, MapReduce",
      "Unit 2: Apache Spark, RDDs, DataFrames, Spark SQL",
      "Unit 3: Apache Kafka, Stream Processing, Real-time Analytics",
      "Unit 4: NoSQL Databases — MongoDB, Cassandra, HBase",
      "Unit 5: Data Warehousing, ETL Pipelines, Business Intelligence",
    ],
  },
  {
    code: "MCAC303", name: "Generative AI & LLMs", faculty: "Dr. Anita Desai",
    credits: 4, type: "Theory", day: "Wednesday", time: "9:00 AM – 1:00 PM", room: "LH-301",
    syllabus: [
      "Unit 1: Transformer Architecture, Attention Mechanism, BERT, GPT",
      "Unit 2: Large Language Models — Training, Fine-tuning, RLHF",
      "Unit 3: Diffusion Models, GANs, VAEs, Image Generation",
      "Unit 4: Prompt Engineering, RAG, LangChain, Vector Databases",
      "Unit 5: AI Ethics, Responsible AI, Deployment, LLMOps",
    ],
  },
  {
    code: "MCAC304", name: "Cloud Architecture & DevOps", faculty: "Prof. Meera Iyer",
    credits: 3, type: "Theory", day: "Thursday", time: "9:00 AM – 1:00 PM", room: "LH-303",
    syllabus: [
      "Unit 1: Cloud Platforms — AWS, Azure, GCP Architecture",
      "Unit 2: Containerization — Docker, Kubernetes, Microservices",
      "Unit 3: CI/CD Pipelines, Jenkins, GitHub Actions, ArgoCD",
      "Unit 4: Infrastructure as Code — Terraform, Ansible, CloudFormation",
      "Unit 5: Site Reliability Engineering, Monitoring, Logging, Alerting",
    ],
  },
  {
    code: "MCAC305", name: "Cybersecurity & AI", faculty: "Dr. Rajesh Kumar",
    credits: 3, type: "Theory", day: "Friday", time: "9:00 AM – 1:00 PM", room: "LH-302",
    syllabus: [
      "Unit 1: Network Security, Cryptography, PKI, SSL/TLS",
      "Unit 2: AI in Threat Detection, Intrusion Detection Systems",
      "Unit 3: Ethical Hacking, Penetration Testing, OWASP Top 10",
      "Unit 4: Secure Software Development, DevSecOps",
      "Unit 5: Digital Forensics, Incident Response, Compliance",
    ],
  },
  {
    code: "MCAC306", name: "Research Methodology & Technical Writing", faculty: "Dr. Arjun Reddy",
    credits: 2, type: "Theory", day: "Saturday", time: "9:00 AM – 11:00 AM", room: "LH-301",
    syllabus: [
      "Unit 1: Research Design, Problem Formulation, Literature Review",
      "Unit 2: Data Collection Methods, Experimental Design, Hypothesis Testing",
      "Unit 3: Academic Writing, IEEE/ACM Paper Format, Citations",
      "Unit 4: Statistical Analysis, Result Interpretation, Plagiarism",
      "Unit 5: Conference Presentations, Poster Design, Viva Preparation",
    ],
  },
  {
    code: "MCACP301", name: "Reinforcement Learning Lab", faculty: "Dr. Priya Sharma",
    credits: 2, type: "Practical", day: "Monday", time: "2:00 PM – 5:00 PM", room: "AI Lab-1",
    syllabus: [
      "Lab 1-3: OpenAI Gym setup, CartPole, MountainCar environments",
      "Lab 4-6: Q-Learning implementation from scratch",
      "Lab 7-9: Deep Q-Network with PyTorch",
      "Lab 10-12: Policy Gradient — REINFORCE algorithm",
      "Lab 13-15: Mini project — Train an RL agent",
    ],
  },
  {
    code: "MCACP302", name: "Big Data Lab", faculty: "Dr. Suresh Patel",
    credits: 2, type: "Practical", day: "Tuesday", time: "2:00 PM – 5:00 PM", room: "Data Lab-2",
    syllabus: [
      "Lab 1-3: Hadoop setup, HDFS operations, MapReduce programs",
      "Lab 4-6: Apache Spark — RDDs, DataFrames, ML pipelines",
      "Lab 7-9: Kafka producer/consumer, stream processing",
      "Lab 10-12: MongoDB CRUD, aggregation pipelines",
      "Lab 13-15: End-to-end data pipeline project",
    ],
  },
  {
    code: "MCACP303", name: "GenAI & LLM Lab", faculty: "Dr. Anita Desai",
    credits: 2, type: "Practical", day: "Wednesday", time: "2:00 PM – 5:00 PM", room: "AI Lab-2",
    syllabus: [
      "Lab 1-3: Hugging Face Transformers, tokenizers, pipelines",
      "Lab 4-6: Fine-tuning BERT for classification tasks",
      "Lab 7-9: LangChain RAG application with vector DB",
      "Lab 10-12: Stable Diffusion image generation",
      "Lab 13-15: Build and deploy a chatbot project",
    ],
  },
];

export const sem3TimetableDaily: DailyClass[] = [
  { day: "Monday",    subject: "Reinforcement Learning",              faculty: "Dr. Priya Sharma",  time: "9:00 AM – 1:00 PM",  room: "LH-301",     color: "#2563eb", duration: "4 Hours" },
  { day: "Monday",    subject: "Reinforcement Learning Lab",          faculty: "Dr. Priya Sharma",  time: "2:00 PM – 5:00 PM",  room: "AI Lab-1",   color: "#2563eb", duration: "3 Hours", note: "Practical Lab" },
  { day: "Tuesday",   subject: "Big Data Analytics",                  faculty: "Dr. Suresh Patel",  time: "9:00 AM – 1:00 PM",  room: "LH-302",     color: "#16a34a", duration: "4 Hours" },
  { day: "Tuesday",   subject: "Big Data Lab",                        faculty: "Dr. Suresh Patel",  time: "2:00 PM – 5:00 PM",  room: "Data Lab-2", color: "#16a34a", duration: "3 Hours", note: "Practical Lab" },
  { day: "Wednesday", subject: "Generative AI & LLMs",                faculty: "Dr. Anita Desai",   time: "9:00 AM – 1:00 PM",  room: "LH-301",     color: "#7c3aed", duration: "4 Hours" },
  { day: "Wednesday", subject: "GenAI & LLM Lab",                     faculty: "Dr. Anita Desai",   time: "2:00 PM – 5:00 PM",  room: "AI Lab-2",   color: "#7c3aed", duration: "3 Hours", note: "Practical Lab" },
  { day: "Thursday",  subject: "Cloud Architecture & DevOps",         faculty: "Prof. Meera Iyer",  time: "9:00 AM – 1:00 PM",  room: "LH-303",     color: "#d97706", duration: "4 Hours" },
  { day: "Friday",    subject: "Cybersecurity & AI",                  faculty: "Dr. Rajesh Kumar",  time: "9:00 AM – 1:00 PM",  room: "LH-302",     color: "#dc2626", duration: "4 Hours" },
  { day: "Saturday",  subject: "Research Methodology & Technical Writing", faculty: "Dr. Arjun Reddy", time: "9:00 AM – 11:00 AM", room: "LH-301",   color: "#c8a84b", duration: "2 Hours" },
];

export const sem3IASchedule = {
  ia1: { start: "September 1, 2026", end: "September 10, 2026" },
  ia2: { start: "October 19, 2026", end: "October 28, 2026" },
  preFinal: { start: "November 16, 2026", end: "November 20, 2026" },
  theoryExams: { start: "November 30, 2026", end: "December 18, 2026" },
  practicalExams: { start: "December 19, 2026", end: "December 20, 2026" },
  resultDeclaration: "February 2027 (expected)",
};

export const sem3Assignments: Assignment[] = [
  { no: 1,  subject: "Reinforcement Learning",             title: "MDP and Bellman Equation Implementation",     due: "Aug 20, 2026", type: "Theory",     dueDate: new Date("2026-08-20"), status: "Pending" },
  { no: 2,  subject: "Reinforcement Learning",             title: "Q-Learning vs SARSA Comparison Report",       due: "Sep 5, 2026",  type: "Assignment", dueDate: new Date("2026-09-05"), status: "Pending" },
  { no: 3,  subject: "Big Data Analytics",                  title: "Hadoop MapReduce Word Count Program",         due: "Aug 22, 2026", type: "Lab",        dueDate: new Date("2026-08-22"), status: "Pending" },
  { no: 4,  subject: "Big Data Analytics",                  title: "Spark DataFrame Analysis on Dataset",         due: "Sep 10, 2026", type: "Assignment", dueDate: new Date("2026-09-10"), status: "Pending" },
  { no: 5,  subject: "Generative AI & LLMs",               title: "Transformer Architecture Diagram & Report",   due: "Aug 25, 2026", type: "Assignment", dueDate: new Date("2026-08-25"), status: "Pending" },
  { no: 6,  subject: "Generative AI & LLMs",               title: "Fine-tune BERT for Sentiment Analysis",       due: "Sep 15, 2026", type: "Lab",        dueDate: new Date("2026-09-15"), status: "Pending" },
  { no: 7,  subject: "Cloud Architecture & DevOps",         title: "Docker Containerization Lab Report",          due: "Sep 1, 2026",  type: "Lab",        dueDate: new Date("2026-09-01"), status: "Pending" },
  { no: 8,  subject: "Cloud Architecture & DevOps",         title: "CI/CD Pipeline Setup using GitHub Actions",   due: "Sep 20, 2026", type: "Lab",        dueDate: new Date("2026-09-20"), status: "Pending" },
  { no: 9,  subject: "Cybersecurity & AI",                  title: "Network Vulnerability Assessment Report",     due: "Sep 8, 2026",  type: "Assignment", dueDate: new Date("2026-09-08"), status: "Pending" },
  { no: 10, subject: "Cybersecurity & AI",                  title: "OWASP Top 10 Case Study Analysis",            due: "Sep 25, 2026", type: "Assignment", dueDate: new Date("2026-09-25"), status: "Pending" },
  { no: 11, subject: "Research Methodology & Technical Writing", title: "Research Paper Review & Summary",        due: "Aug 18, 2026", type: "Assignment", dueDate: new Date("2026-08-18"), status: "Pending" },
  { no: 12, subject: "Research Methodology & Technical Writing", title: "IEEE Format Paper Draft Submission",     due: "Oct 5, 2026",  type: "Assignment", dueDate: new Date("2026-10-05"), status: "Pending" },
  { no: 13, subject: "Reinforcement Learning Lab",          title: "RL Agent Training — CartPole Environment",    due: "Sep 12, 2026", type: "Lab",        dueDate: new Date("2026-09-12"), status: "Pending" },
  { no: 14, subject: "Reinforcement Learning Lab",          title: "Deep Q-Network Implementation Report",        due: "Oct 8, 2026",  type: "Lab",        dueDate: new Date("2026-10-08"), status: "Pending" },
  { no: 15, subject: "Big Data Lab",                        title: "Kafka Stream Processing Mini Project",        due: "Oct 15, 2026", type: "Lab",        dueDate: new Date("2026-10-15"), status: "Pending" },
  { no: 16, subject: "Big Data Lab",                        title: "MongoDB Aggregation Pipeline Report",         due: "Oct 20, 2026", type: "Lab",        dueDate: new Date("2026-10-20"), status: "Pending" },
  { no: 17, subject: "GenAI & LLM Lab",                     title: "LangChain RAG Chatbot Implementation",        due: "Oct 22, 2026", type: "Lab",        dueDate: new Date("2026-10-22"), status: "Pending" },
  { no: 18, subject: "GenAI & LLM Lab",                     title: "Stable Diffusion Image Generation Report",    due: "Oct 28, 2026", type: "Lab",        dueDate: new Date("2026-10-28"), status: "Pending" },
];

export const sem3Project: ProjectData = {
  projectCode: "MCAC399",
  projectTitle: "AI-Powered Personalized Learning System",
  description: "Design and develop an AI system that personalizes learning content for students using Reinforcement Learning and NLP techniques. System should adapt to student performance, recommend resources, and generate personalized quizzes.",
  guide: "Dr. Priya Sharma",
  coGuide: "Dr. Anita Desai",
  credits: 4,
  startDate: "August 10, 2026",
  submissionDate: "November 25, 2026",
  vivaDate: "December 15, 2026",
  milestones: [
    { title: "Topic Approval & Literature Review",  due: "Aug 20, 2026",  status: "Upcoming" },
    { title: "System Design & Architecture",         due: "Sep 10, 2026",  status: "Upcoming" },
    { title: "Module 1 — RL Recommendation Engine", due: "Sep 30, 2026",  status: "Upcoming" },
    { title: "Module 2 — NLP Quiz Generator",       due: "Oct 20, 2026",  status: "Upcoming" },
    { title: "Integration & Testing",               due: "Nov 10, 2026",  status: "Upcoming" },
    { title: "Final Report & Viva",                 due: "Nov 25, 2026",  status: "Upcoming" },
  ],
  techStack: ["Python", "PyTorch", "LangChain", "FastAPI", "React", "MongoDB"],
};

// ── Semester 4 Full Data ───────────────────────────────────────────────────────

export const sem4Subjects: Sem3Subject[] = [
  {
    code: "MCAD401", name: "Advanced Deep Learning", faculty: "Dr. Rajesh Kumar",
    credits: 4, type: "Theory", day: "Monday", time: "9:00 AM – 1:00 PM", room: "LH-401",
    syllabus: [
      "Unit 1: Advanced CNN Architectures — ResNet, EfficientNet, Vision Transformer",
      "Unit 2: Sequence Models — LSTM, GRU, Attention, Transformer for sequences",
      "Unit 3: Graph Neural Networks, GCN, GAT, Knowledge Graphs",
      "Unit 4: Federated Learning, Privacy-preserving ML, Split Learning",
      "Unit 5: MLOps, Model Monitoring, Drift Detection, Retraining Pipelines",
    ],
  },
  {
    code: "MCAD402", name: "AI Product Development", faculty: "Dr. Anita Desai",
    credits: 3, type: "Theory", day: "Tuesday", time: "9:00 AM – 1:00 PM", room: "LH-402",
    syllabus: [
      "Unit 1: Product Thinking for AI — Problem Definition, User Research",
      "Unit 2: AI System Design, Scalability, Latency, Cost Optimization",
      "Unit 3: Model Deployment — REST APIs, FastAPI, gRPC, Serverless",
      "Unit 4: A/B Testing, Feature Flags, Gradual Rollouts, Metrics",
      "Unit 5: AI Startups, Funding, Go-to-market, Case Studies",
    ],
  },
  {
    code: "MCAD403", name: "Blockchain & Web3", faculty: "Prof. Vikram Mehta",
    credits: 3, type: "Theory", day: "Wednesday", time: "9:00 AM – 11:00 AM", room: "LH-403",
    syllabus: [
      "Unit 1: Blockchain Fundamentals, Consensus Mechanisms, Cryptography",
      "Unit 2: Ethereum, Smart Contracts, Solidity Programming",
      "Unit 3: DeFi, NFTs, DAOs, Web3 Architecture",
      "Unit 4: Hyperledger Fabric, Enterprise Blockchain",
      "Unit 5: AI + Blockchain Integration, Decentralized AI",
    ],
  },
  {
    code: "MCAD404", name: "Dissertation / Major Project", faculty: "Dr. Priya Sharma",
    credits: 12, type: "Theory", day: "Thursday + Friday", time: "Full Day", room: "Research Lab",
    syllabus: [
      "Phase 1: Problem Identification, Literature Survey, Gap Analysis",
      "Phase 2: Research Proposal, Methodology Design, Dataset Collection",
      "Phase 3: Model Development, Experiments, Baseline Comparisons",
      "Phase 4: Result Analysis, Paper Writing, System Implementation",
      "Phase 5: Final Report, Publication Submission, Viva Preparation",
    ],
  },
  {
    code: "MCADP401", name: "Advanced Deep Learning Lab", faculty: "Dr. Rajesh Kumar",
    credits: 2, type: "Practical", day: "Monday", time: "2:00 PM – 5:00 PM", room: "AI Lab-1",
    syllabus: [
      "Lab 1-4: Vision Transformer implementation",
      "Lab 5-8: Graph Neural Network on citation dataset",
      "Lab 9-12: Federated Learning simulation",
      "Lab 13-15: End-to-end MLOps pipeline",
    ],
  },
  {
    code: "MCADP402", name: "AI Product Lab", faculty: "Dr. Anita Desai",
    credits: 2, type: "Practical", day: "Tuesday", time: "2:00 PM – 5:00 PM", room: "Dev Lab-1",
    syllabus: [
      "Lab 1-4: FastAPI model deployment",
      "Lab 5-8: Docker + Kubernetes deployment",
      "Lab 9-12: A/B testing framework setup",
      "Lab 13-15: Full product launch simulation",
    ],
  },
];

export const sem4TimetableDaily: DailyClass[] = [
  { day: "Monday",    subject: "Advanced Deep Learning",          faculty: "Dr. Rajesh Kumar",   time: "9:00 AM – 1:00 PM",   room: "LH-401",       color: "#2563eb", duration: "4 Hours" },
  { day: "Monday",    subject: "Advanced Deep Learning Lab",      faculty: "Dr. Rajesh Kumar",   time: "2:00 PM – 5:00 PM",   room: "AI Lab-1",     color: "#2563eb", duration: "3 Hours", note: "Practical Lab" },
  { day: "Tuesday",   subject: "AI Product Development",          faculty: "Dr. Anita Desai",    time: "9:00 AM – 1:00 PM",   room: "LH-402",       color: "#16a34a", duration: "4 Hours" },
  { day: "Tuesday",   subject: "AI Product Lab",                  faculty: "Dr. Anita Desai",    time: "2:00 PM – 5:00 PM",   room: "Dev Lab-1",    color: "#16a34a", duration: "3 Hours", note: "Practical Lab" },
  { day: "Wednesday", subject: "Blockchain & Web3",               faculty: "Prof. Vikram Mehta", time: "9:00 AM – 11:00 AM",  room: "LH-403",       color: "#7c3aed", duration: "2 Hours" },
  { day: "Wednesday", subject: "Dissertation Work",               faculty: "Dr. Priya Sharma",   time: "11:00 AM – 5:00 PM",  room: "Research Lab", color: "#d97706", duration: "6 Hours", note: "Self-directed research" },
  { day: "Thursday",  subject: "Dissertation / Major Project",    faculty: "Dr. Priya Sharma",   time: "Full Day",            room: "Research Lab", color: "#d97706", duration: "Full Day", note: "Research & Development" },
  { day: "Friday",    subject: "Dissertation / Major Project",    faculty: "Dr. Priya Sharma",   time: "Full Day",            room: "Research Lab", color: "#d97706", duration: "Full Day", note: "Research & Development" },
  { day: "Saturday",  subject: "Dissertation Review & Guide Meeting", faculty: "Dr. Priya Sharma", time: "10:00 AM – 12:00 PM", room: "Research Lab", color: "#c8a84b", duration: "2 Hours", note: "Weekly progress review" },
];

export const sem4IASchedule = {
  ia1: { start: "February 16, 2027", end: "February 20, 2027" },
  ia2: { start: "March 22, 2027", end: "March 26, 2027" },
  preFinal: { start: "April 19, 2027", end: "April 23, 2027" },
  theoryExams: { start: "May 10, 2027", end: "May 20, 2027" },
  practicalExams: { start: "May 22, 2027", end: "May 24, 2027" },
  projectSubmission: "May 31, 2027",
  projectViva: { start: "June 10, 2027", end: "June 12, 2027" },
  convocation: "September 2027 (expected)",
};

export const sem4Assignments: Assignment[] = [
  { no: 1,  subject: "Advanced Deep Learning",           title: "Vision Transformer Architecture Analysis",       due: "Jan 20, 2027", type: "Assignment", dueDate: new Date("2027-01-20"), status: "Pending" },
  { no: 2,  subject: "Advanced Deep Learning",           title: "Federated Learning Implementation Report",       due: "Feb 10, 2027", type: "Lab",        dueDate: new Date("2027-02-10"), status: "Pending" },
  { no: 3,  subject: "AI Product Development",           title: "AI Product Roadmap for a Real Startup Idea",     due: "Jan 25, 2027", type: "Assignment", dueDate: new Date("2027-01-25"), status: "Pending" },
  { no: 4,  subject: "AI Product Development",           title: "FastAPI Model Deployment Documentation",         due: "Feb 15, 2027", type: "Lab",        dueDate: new Date("2027-02-15"), status: "Pending" },
  { no: 5,  subject: "Blockchain & Web3",                title: "Smart Contract Development in Solidity",         due: "Feb 5, 2027",  type: "Lab",        dueDate: new Date("2027-02-05"), status: "Pending" },
  { no: 6,  subject: "Blockchain & Web3",                title: "DeFi Protocol Analysis Report",                  due: "Feb 20, 2027", type: "Assignment", dueDate: new Date("2027-02-20"), status: "Pending" },
  { no: 7,  subject: "Dissertation / Major Project",     title: "Dissertation Chapter 1 — Introduction",          due: "Jan 20, 2027", type: "Project",    dueDate: new Date("2027-01-20"), status: "Pending" },
  { no: 8,  subject: "Dissertation / Major Project",     title: "Dissertation Chapter 2 — Literature Review",     due: "Feb 5, 2027",  type: "Project",    dueDate: new Date("2027-02-05"), status: "Pending" },
  { no: 9,  subject: "Dissertation / Major Project",     title: "Dissertation Chapter 3 — Methodology",           due: "Feb 28, 2027", type: "Project",    dueDate: new Date("2027-02-28"), status: "Pending" },
  { no: 10, subject: "Dissertation / Major Project",     title: "Dissertation Chapter 4 — Implementation",        due: "Mar 25, 2027", type: "Project",    dueDate: new Date("2027-03-25"), status: "Pending" },
  { no: 11, subject: "Dissertation / Major Project",     title: "Dissertation Chapter 5 — Results & Analysis",    due: "Apr 20, 2027", type: "Project",    dueDate: new Date("2027-04-20"), status: "Pending" },
  { no: 12, subject: "Dissertation / Major Project",     title: "Final Dissertation Report Submission",            due: "May 31, 2027", type: "Project",    dueDate: new Date("2027-05-31"), status: "Pending" },
];

export const sem4Dissertation: ProjectData = {
  projectCode: "MCAD499",
  projectTitle: "Multimodal AI System for Medical Diagnosis using Vision-Language Models",
  description: "Research and develop a multimodal AI system that combines medical imaging (X-rays, MRIs) with clinical text reports to assist doctors in diagnosis. Uses Vision Transformer + LLM fusion for accurate disease classification and report generation.",
  guide: "Dr. Priya Sharma",
  coGuide: "Dr. Rajesh Kumar",
  externalExaminer: "Prof. TBD (Industry Expert)",
  credits: 12,
  startDate: "January 5, 2027",
  submissionDate: "May 31, 2027",
  vivaDate: "June 10, 2027",
  targetPublication: "IEEE EMBS or Springer MICCAI 2027",
  milestones: [
    { title: "Literature Review & Problem Statement",   due: "Jan 20, 2027",  status: "Upcoming" },
    { title: "Dataset Collection & Preprocessing",      due: "Feb 5, 2027",   status: "Upcoming" },
    { title: "Baseline Model Implementation",           due: "Feb 28, 2027",  status: "Upcoming" },
    { title: "Vision-Language Model Development",       due: "Mar 25, 2027",  status: "Upcoming" },
    { title: "Experiments & Comparative Analysis",      due: "Apr 20, 2027",  status: "Upcoming" },
    { title: "Final Report & Paper Submission",         due: "May 20, 2027",  status: "Upcoming" },
    { title: "Dissertation Viva",                       due: "Jun 10, 2027",  status: "Upcoming" },
  ],
  techStack: ["Python", "PyTorch", "HuggingFace", "MONAI", "FastAPI", "React", "PostgreSQL", "Docker"],
};
