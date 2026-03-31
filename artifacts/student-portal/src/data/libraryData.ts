import { PORTAL_DATE } from "../constants";

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  issueDate: string;
  dueDate: Date;
  dueDateStr: string;
  renewalsUsed: number;
  maxRenewals: number;
  status: "Overdue" | "Due Soon" | "Borrowed";
  finePerDay: number;
}

export interface CatalogBook {
  id: string;
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  accessionNo: string;
  status: "Available" | "Reserved" | "Unavailable";
}

export interface BorrowHistory {
  id: string;
  title: string;
  author: string;
  issueDate: string;
  returnDate: string;
  status: "Returned" | "Returned Late";
  fine: string;
  finePaid: boolean;
}

export interface FineRecord {
  id: string;
  bookTitle: string;
  daysOverdue: number;
  fineAmount: number;
  status: "Paid" | "Outstanding";
  date: string;
}

function daysRemaining(due: Date): number {
  return Math.ceil((due.getTime() - PORTAL_DATE.getTime()) / 86400000);
}

function computeStatus(due: Date): "Overdue" | "Due Soon" | "Borrowed" {
  const d = daysRemaining(due);
  if (d < 0) return "Overdue";
  if (d <= 3) return "Due Soon";
  return "Borrowed";
}

export const borrowedBooks: LibraryBook[] = [
  {
    id: "LB001",
    title: "Deep Learning",
    author: "Ian Goodfellow, Yoshua Bengio, Aaron Courville",
    isbn: "978-0-262-03561-3",
    category: "Deep Learning",
    issueDate: "Feb 20, 2026",
    dueDate: new Date("2026-03-20"),
    dueDateStr: "Mar 20, 2026",
    renewalsUsed: 1,
    maxRenewals: 2,
    status: computeStatus(new Date("2026-03-20")),
    finePerDay: 2,
  },
  {
    id: "LB002",
    title: "Pattern Recognition and Machine Learning",
    author: "Christopher M. Bishop",
    isbn: "978-0-387-31073-2",
    category: "Machine Learning",
    issueDate: "Mar 1, 2026",
    dueDate: new Date("2026-04-01"),
    dueDateStr: "Apr 1, 2026",
    renewalsUsed: 0,
    maxRenewals: 2,
    status: computeStatus(new Date("2026-04-01")),
    finePerDay: 2,
  },
  {
    id: "LB003",
    title: "The Elements of Statistical Learning",
    author: "Trevor Hastie, Robert Tibshirani, Jerome Friedman",
    isbn: "978-0-387-84857-0",
    category: "Statistics & ML",
    issueDate: "Mar 5, 2026",
    dueDate: new Date("2026-03-29"),
    dueDateStr: "Mar 29, 2026",
    renewalsUsed: 0,
    maxRenewals: 2,
    status: computeStatus(new Date("2026-03-29")),
    finePerDay: 2,
  },
  {
    id: "LB004",
    title: "Natural Language Processing with Python",
    author: "Steven Bird, Ewan Klein, Edward Loper",
    isbn: "978-0-596-51649-9",
    category: "Natural Language Processing",
    issueDate: "Mar 10, 2026",
    dueDate: new Date("2026-04-10"),
    dueDateStr: "Apr 10, 2026",
    renewalsUsed: 0,
    maxRenewals: 2,
    status: computeStatus(new Date("2026-04-10")),
    finePerDay: 2,
  },
  {
    id: "LB005",
    title: "Computer Vision: Algorithms and Applications",
    author: "Richard Szeliski",
    isbn: "978-3-030-34371-2",
    category: "Computer Vision",
    issueDate: "Feb 28, 2026",
    dueDate: new Date("2026-03-28"),
    dueDateStr: "Mar 28, 2026",
    renewalsUsed: 1,
    maxRenewals: 2,
    status: computeStatus(new Date("2026-03-28")),
    finePerDay: 2,
  },
];

export function computeFine(book: LibraryBook): number {
  if (book.status !== "Overdue") return 0;
  const days = Math.abs(Math.ceil((book.dueDate.getTime() - PORTAL_DATE.getTime()) / 86400000));
  return days * book.finePerDay;
}

export const catalogBooks: CatalogBook[] = [
  {
    id: "CAT001",
    title: "Artificial Intelligence: A Modern Approach",
    author: "Stuart Russell, Peter Norvig",
    category: "Artificial Intelligence",
    totalCopies: 4,
    availableCopies: 2,
    accessionNo: "SCSE-AI-001",
    status: "Available",
  },
  {
    id: "CAT002",
    title: "Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow",
    author: "Aurélien Géron",
    category: "Machine Learning",
    totalCopies: 5,
    availableCopies: 0,
    accessionNo: "SCSE-ML-002",
    status: "Unavailable",
  },
  {
    id: "CAT003",
    title: "Speech and Language Processing",
    author: "Daniel Jurafsky, James H. Martin",
    category: "Natural Language Processing",
    totalCopies: 3,
    availableCopies: 1,
    accessionNo: "SCSE-NLP-003",
    status: "Available",
  },
  {
    id: "CAT004",
    title: "Deep Learning for Computer Vision",
    author: "Rajalingappaa Shanmugamani",
    category: "Computer Vision",
    totalCopies: 2,
    availableCopies: 0,
    accessionNo: "SCSE-CV-004",
    status: "Reserved",
  },
  {
    id: "CAT005",
    title: "Reinforcement Learning: An Introduction",
    author: "Richard S. Sutton, Andrew G. Barto",
    category: "Reinforcement Learning",
    totalCopies: 3,
    availableCopies: 2,
    accessionNo: "SCSE-RL-005",
    status: "Available",
  },
  {
    id: "CAT006",
    title: "Cloud Computing: Concepts, Technology & Architecture",
    author: "Thomas Erl, Ricardo Puttini, Zaigham Mahmood",
    category: "Cloud Computing",
    totalCopies: 3,
    availableCopies: 1,
    accessionNo: "SCSE-CC-006",
    status: "Available",
  },
  {
    id: "CAT007",
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen et al.",
    category: "Algorithms",
    totalCopies: 6,
    availableCopies: 3,
    accessionNo: "SCSE-ALG-007",
    status: "Available",
  },
  {
    id: "CAT008",
    title: "Python Machine Learning",
    author: "Sebastian Raschka, Vahid Mirjalili",
    category: "Machine Learning",
    totalCopies: 4,
    availableCopies: 0,
    accessionNo: "SCSE-ML-008",
    status: "Reserved",
  },
  {
    id: "CAT009",
    title: "Data Analytics: A Small Book on a Big Subject",
    author: "Zachary Thomas",
    category: "Data Analytics",
    totalCopies: 2,
    availableCopies: 2,
    accessionNo: "SCSE-DA-009",
    status: "Available",
  },
  {
    id: "CAT010",
    title: "Generative Deep Learning",
    author: "David Foster",
    category: "Deep Learning",
    totalCopies: 3,
    availableCopies: 1,
    accessionNo: "SCSE-DL-010",
    status: "Available",
  },
];

export const borrowHistory: BorrowHistory[] = [
  { id: "HB001", title: "Introduction to Machine Learning", author: "Alpaydin", issueDate: "Aug 15, 2025", returnDate: "Sep 10, 2025", status: "Returned", fine: "₹0", finePaid: true },
  { id: "HB002", title: "Algorithms Unlocked", author: "Thomas H. Cormen", issueDate: "Aug 20, 2025", returnDate: "Sep 15, 2025", status: "Returned", fine: "₹0", finePaid: true },
  { id: "HB003", title: "Data Science from Scratch", author: "Joel Grus", issueDate: "Sep 5, 2025", returnDate: "Oct 5, 2025", status: "Returned", fine: "₹0", finePaid: true },
  { id: "HB004", title: "Python Crash Course", author: "Eric Matthes", issueDate: "Sep 12, 2025", returnDate: "Oct 15, 2025", status: "Returned Late", fine: "₹20", finePaid: true },
  { id: "HB005", title: "Mathematics for Machine Learning", author: "Deisenroth et al.", issueDate: "Oct 1, 2025", returnDate: "Nov 1, 2025", status: "Returned", fine: "₹0", finePaid: true },
  { id: "HB006", title: "Neural Networks and Deep Learning", author: "Michael Nielsen", issueDate: "Oct 20, 2025", returnDate: "Nov 20, 2025", status: "Returned", fine: "₹0", finePaid: true },
  { id: "HB007", title: "Learning Python", author: "Mark Lutz", issueDate: "Nov 1, 2025", returnDate: "Dec 5, 2025", status: "Returned Late", fine: "₹10", finePaid: true },
  { id: "HB008", title: "Operating System Concepts", author: "Silberschatz et al.", issueDate: "Nov 15, 2025", returnDate: "Dec 15, 2025", status: "Returned", fine: "₹0", finePaid: true },
  { id: "HB009", title: "Computer Networking: A Top-Down Approach", author: "Kurose & Ross", issueDate: "Dec 1, 2025", returnDate: "Jan 10, 2026", status: "Returned Late", fine: "₹14", finePaid: false },
  { id: "HB010", title: "Database System Concepts", author: "Silberschatz et al.", issueDate: "Jan 20, 2026", returnDate: "Feb 20, 2026", status: "Returned", fine: "₹0", finePaid: true },
  { id: "HB011", title: "Probabilistic Graphical Models", author: "Koller & Friedman", issueDate: "Feb 1, 2026", returnDate: "Mar 3, 2026", status: "Returned Late", fine: "₹6", finePaid: false },
  { id: "HB012", title: "Mining of Massive Datasets", author: "Leskovec et al.", issueDate: "Mar 1, 2026", returnDate: "Mar 20, 2026", status: "Returned", fine: "₹0", finePaid: true },
];

export const fineRecords: FineRecord[] = [
  { id: "FR001", bookTitle: "Deep Learning (Goodfellow)", daysOverdue: 6, fineAmount: 12, status: "Outstanding", date: "Mar 20, 2026" },
  { id: "FR002", bookTitle: "Computer Networking: A Top-Down Approach", daysOverdue: 7, fineAmount: 14, status: "Outstanding", date: "Jan 10, 2026" },
  { id: "FR003", bookTitle: "Probabilistic Graphical Models", daysOverdue: 3, fineAmount: 6, status: "Outstanding", date: "Mar 3, 2026" },
  { id: "FR004", bookTitle: "Python Crash Course", daysOverdue: 10, fineAmount: 20, status: "Paid", date: "Oct 15, 2025" },
  { id: "FR005", bookTitle: "Learning Python", daysOverdue: 5, fineAmount: 10, status: "Paid", date: "Dec 5, 2025" },
];
