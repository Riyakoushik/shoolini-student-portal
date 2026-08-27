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
  pdfUrl?: string;
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

export const borrowedBooks: LibraryBook[] = [];

export function computeFine(book: LibraryBook): number {
  if (book.status !== "Overdue") return 0;
  const days = Math.abs(Math.ceil((book.dueDate.getTime() - PORTAL_DATE.getTime()) / 86400000));
  return days * book.finePerDay;
}

export const catalogBooks: CatalogBook[] = [
  { id: "CAT001", title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell, Peter Norvig", category: "Artificial Intelligence", totalCopies: 4, availableCopies: 2, accessionNo: "SCSE-AI-001", status: "Available", pdfUrl: "https://www.tutorialspoint.com/artificial_intelligence/artificial_intelligence_tutorial.pdf" },
  { id: "CAT002", title: "Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow", author: "Aurélien Géron", category: "Machine Learning", totalCopies: 5, availableCopies: 0, accessionNo: "SCSE-ML-002", status: "Unavailable" },
  { id: "CAT003", title: "Speech and Language Processing", author: "Daniel Jurafsky, James H. Martin", category: "Natural Language Processing", totalCopies: 3, availableCopies: 1, accessionNo: "SCSE-NLP-003", status: "Available", pdfUrl: "https://web.stanford.edu/~jurafsky/slp3/ed3book.pdf" },
  { id: "CAT004", title: "Deep Learning for Computer Vision", author: "Rajalingappaa Shanmugamani", category: "Computer Vision", totalCopies: 2, availableCopies: 0, accessionNo: "SCSE-CV-004", status: "Reserved" },
  { id: "CAT005", title: "Reinforcement Learning: An Introduction", author: "Richard S. Sutton, Andrew G. Barto", category: "Reinforcement Learning", totalCopies: 3, availableCopies: 2, accessionNo: "SCSE-RL-005", status: "Available", pdfUrl: "http://incompleteideas.net/book/the-book-2nd.html" },
  { id: "CAT006", title: "Cloud Computing: Concepts, Technology & Architecture", author: "Thomas Erl, Ricardo Puttini, Zaigham Mahmood", category: "Cloud Computing", totalCopies: 3, availableCopies: 1, accessionNo: "SCSE-CC-006", status: "Available", pdfUrl: "https://arxiv.org/pdf/1301.6960.pdf" },
  { id: "CAT007", title: "Introduction to Algorithms", author: "Thomas H. Cormen et al.", category: "Algorithms", totalCopies: 6, availableCopies: 3, accessionNo: "SCSE-ALG-007", status: "Available", pdfUrl: "https://mitpress.mit.edu/9780262046304/introduction-to-algorithms/" },
  { id: "CAT008", title: "Python Machine Learning", author: "Sebastian Raschka, Vahid Mirjalili", category: "Machine Learning", totalCopies: 4, availableCopies: 0, accessionNo: "SCSE-ML-008", status: "Reserved" },
  { id: "CAT009", title: "Data Analytics: A Small Book on a Big Subject", author: "Zachary Thomas", category: "Data Analytics", totalCopies: 2, availableCopies: 2, accessionNo: "SCSE-DA-009", status: "Available", pdfUrl: "https://www.stat.cmu.edu/~ryantibs/statcomp/lectures/data_analytics.pdf" },
  { id: "CAT010", title: "Generative Deep Learning", author: "David Foster", category: "Deep Learning", totalCopies: 3, availableCopies: 1, accessionNo: "SCSE-DL-010", status: "Available", pdfUrl: "https://arxiv.org/pdf/2103.04956.pdf" },
  { id: "CAT011", title: "Deep Learning", author: "Ian Goodfellow, Yoshua Bengio, Aaron Courville", category: "Deep Learning", totalCopies: 5, availableCopies: 4, accessionNo: "SCSE-DL-011", status: "Available", pdfUrl: "https://www.deeplearningbook.org/" },
  { id: "CAT012", title: "Pattern Recognition and Machine Learning", author: "Christopher M. Bishop", category: "Machine Learning", totalCopies: 3, availableCopies: 2, accessionNo: "SCSE-ML-012", status: "Available", pdfUrl: "https://www.microsoft.com/en-us/research/uploads/prod/2006/01/Bishop-Pattern-Recognition-and-Machine-Learning-2006.pdf" },
  { id: "CAT013", title: "The Elements of Statistical Learning", author: "Trevor Hastie, Robert Tibshirani, Jerome Friedman", category: "Statistics & ML", totalCopies: 4, availableCopies: 3, accessionNo: "SCSE-ML-013", status: "Available", pdfUrl: "https://web.stanford.edu/~hastie/ElemStatLearn/printings/ESLII_print12.pdf" },
  { id: "CAT014", title: "Natural Language Processing with Python", author: "Steven Bird, Ewan Klein, Edward Loper", category: "Natural Language Processing", totalCopies: 3, availableCopies: 2, accessionNo: "SCSE-NLP-014", status: "Available", pdfUrl: "https://www.nltk.org/book/" },
  { id: "CAT015", title: "Computer Vision: Algorithms and Applications", author: "Richard Szeliski", category: "Computer Vision", totalCopies: 3, availableCopies: 1, accessionNo: "SCSE-CV-015", status: "Available", pdfUrl: "http://szeliski.org/Book/drafts/SzeliskiBook_20200608_draft.pdf" },
  { id: "CAT016", title: "Neural Networks and Deep Learning", author: "Michael Nielsen", category: "Deep Learning", totalCopies: 5, availableCopies: 5, accessionNo: "SCSE-DL-016", status: "Available", pdfUrl: "http://neuralnetworksanddeeplearning.com/" },
  { id: "CAT017", title: "Introduction to Machine Learning", author: "Ethem Alpaydin", category: "Machine Learning", totalCopies: 4, availableCopies: 3, accessionNo: "SCSE-ML-017", status: "Available", pdfUrl: "https://d1wqtxts1xzle7.cloudfront.net/38740177/Introduction_to_Machine_Learning-with-cover-page-v2.pdf" },
  { id: "CAT018", title: "Data Science from Scratch", author: "Joel Grus", category: "Data Science", totalCopies: 3, availableCopies: 2, accessionNo: "SCSE-DS-018", status: "Available", pdfUrl: "https://doc.lagout.org/programmation/python/Data%20Science%20from%20Scratch_%20First%20Principles%20with%20Python%20-%20Grus%2C%20Joel%20%5B2015%5D.pdf" },
  { id: "CAT019", title: "Mathematics for Machine Learning", author: "Marc Peter Deisenroth et al.", category: "Mathematics & ML", totalCopies: 4, availableCopies: 4, accessionNo: "SCSE-MATH-019", status: "Available", pdfUrl: "https://mml-book.github.io/book/mml-book.pdf" },
  { id: "CAT020", title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", category: "Distributed Systems", totalCopies: 5, availableCopies: 3, accessionNo: "SCSE-DS-020", status: "Available", pdfUrl: "https://learning.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/" },
  { id: "CAT021", title: "Clean Code", author: "Robert C. Martin", category: "Software Engineering", totalCopies: 6, availableCopies: 4, accessionNo: "SCSE-SE-021", status: "Available", pdfUrl: "https://archive.org/details/CleanCode_201606" },
  { id: "CAT022", title: "Design Patterns: Elements of Reusable Object-Oriented Software", author: "Erich Gamma et al.", category: "Software Engineering", totalCopies: 4, availableCopies: 2, accessionNo: "SCSE-SE-022", status: "Available", pdfUrl: "https://archive.org/details/designpatternsel00erich" }
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
  { id: "HB009", title: "Computer Networking: A Top-Down Approach", author: "Kurose & Ross", issueDate: "Dec 1, 2025", returnDate: "Jan 10, 2026", status: "Returned Late", fine: "₹14", finePaid: true },
  { id: "HB010", title: "Database System Concepts", author: "Silberschatz et al.", issueDate: "Jan 20, 2026", returnDate: "Feb 20, 2026", status: "Returned", fine: "₹0", finePaid: true },
  { id: "HB011", title: "Probabilistic Graphical Models", author: "Koller & Friedman", issueDate: "Feb 1, 2026", returnDate: "Mar 3, 2026", status: "Returned Late", fine: "₹6", finePaid: true },
  { id: "HB012", title: "Mining of Massive Datasets", author: "Leskovec et al.", issueDate: "Mar 1, 2026", returnDate: "Mar 20, 2026", status: "Returned", fine: "₹0", finePaid: true },
];

export const fineRecords: FineRecord[] = [
  { id: "FR001", bookTitle: "Deep Learning (Goodfellow)", daysOverdue: 6, fineAmount: 12, status: "Paid", date: "Mar 20, 2026" },
  { id: "FR002", bookTitle: "Computer Networking: A Top-Down Approach", daysOverdue: 7, fineAmount: 14, status: "Paid", date: "Jan 10, 2026" },
  { id: "FR003", bookTitle: "Probabilistic Graphical Models", daysOverdue: 3, fineAmount: 6, status: "Paid", date: "Mar 3, 2026" },
  { id: "FR004", bookTitle: "Python Crash Course", daysOverdue: 10, fineAmount: 20, status: "Paid", date: "Oct 15, 2025" },
  { id: "FR005", bookTitle: "Learning Python", daysOverdue: 5, fineAmount: 10, status: "Paid", date: "Dec 5, 2025" },
];
