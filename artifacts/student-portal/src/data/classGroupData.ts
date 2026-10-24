export interface ClassResource {
  id: string;
  type: "Lab & Coding Test" | "HackerRank" | "OpenSource PDF" | "Recording" | "Discussion";
  subject: string;
  title: string;
  author: string;
  date: string;
  url: string;
  description: string;
  duration?: string;
  fileSize?: string;
  platform?: "HackerRank" | "LeetCode" | "Google Colab" | "GitHub" | "Kaggle" | "OpenSource" | "Drive";
  pinned?: boolean;
}

export const initialClassResources: ClassResource[] = [
  // HackerRank Challenges & Coding Tests
  {
    id: "HR-01",
    type: "HackerRank",
    subject: "Reinforcement Learning",
    title: "HackerRank: Dynamic Programming, Bellman Optimization & Matrix Challenges",
    author: "Dr. Priya Sharma",
    date: "Oct 20, 2026",
    url: "https://www.hackerrank.com/domains/algorithms?filters%5Bsubdomains%5D%5B%5D=dynamic-programming",
    description: "Curated problem set for Value Iteration, grid world Markov Decision Processes, state-action rewards, and convergence simulation.",
    platform: "HackerRank",
    pinned: true,
  },
  {
    id: "HR-02",
    type: "HackerRank",
    subject: "Big Data Analytics",
    title: "HackerRank: SQL & Big Data Aggregation Coding Benchmark Test",
    author: "Dr. Suresh Patel",
    date: "Oct 18, 2026",
    url: "https://www.hackerrank.com/domains/sql",
    description: "Mandatory coding challenges covering window functions, CTEs, distributed join optimizations, and massive dataset partitioning.",
    platform: "HackerRank",
    pinned: true,
  },
  {
    id: "CODE-01",
    type: "Lab & Coding Test",
    subject: "Reinforcement Learning Lab",
    title: "Google Colab: CartPole DQN & REINFORCE Policy Gradient Implementation Testbed",
    author: "Dept. of AI/ML Lab",
    date: "Oct 22, 2026",
    url: "https://colab.research.google.com/github/pytorch/tutorials/blob/gh-pages/_downloads/reinforcement_q_learning.ipynb",
    description: "Interactive GPU notebook to train an agent on OpenAI Gym CartPole-v1 using Deep Q-Learning (PyTorch). Includes automated unit-test validation.",
    platform: "Google Colab",
    pinned: true,
  },
  {
    id: "CODE-02",
    type: "Lab & Coding Test",
    subject: "Generative AI & LLMs",
    title: "Google Colab: Hugging Face Transformers & LangChain RAG Chatbot Lab",
    author: "Dr. Anita Desai",
    date: "Oct 23, 2026",
    url: "https://colab.research.google.com/github/huggingface/notebooks/blob/main/transformers_doc/en/pytorch/text_classification.ipynb",
    description: "Hands-on pipeline test for BERT sentiment fine-tuning, FAISS vector store indexing, and retrieval-augmented generation prompts.",
    platform: "Google Colab",
  },
  {
    id: "CODE-03",
    type: "Lab & Coding Test",
    subject: "Cloud Architecture & DevOps",
    title: "GitHub Open-Source Testbed: Docker Containerization & CI/CD GitHub Actions",
    author: "Prof. Meera Iyer",
    date: "Oct 15, 2026",
    url: "https://github.com/dockersamples/example-voting-app",
    description: "Multi-container microservices application repo used for the Docker Compose, Kubernetes manifests, and automated CI/CD pipeline grading.",
    platform: "GitHub",
  },
  {
    id: "CODE-04",
    type: "Lab & Coding Test",
    subject: "Cybersecurity & AI",
    title: "Open-Source Lab: OWASP Web Security Vulnerability Assessment Sandbox",
    author: "Dr. Rajesh Kumar",
    date: "Oct 17, 2026",
    url: "https://github.com/juice-shop/juice-shop",
    description: "Hands-on penetration testing ground covering OWASP Top 10 vulnerabilities, API token tampering, SQLi, and security logging.",
    platform: "GitHub",
  },

  // Open-Source Lab Task PDFs
  {
    id: "PDF-01",
    type: "OpenSource PDF",
    subject: "Generative AI & LLMs",
    title: "Open-Source Lab Sheet: Attention Is All You Need — Transformer Architecture Lab Task",
    author: "arXiv Open Research",
    date: "Oct 22, 2026",
    url: "https://arxiv.org/pdf/1706.03762.pdf",
    description: "Official open-source architecture specification with detailed task requirements for implementing scaled dot-product attention from scratch.",
    fileSize: "2.2 MB",
    platform: "OpenSource",
    pinned: true,
  },
  {
    id: "PDF-02",
    type: "OpenSource PDF",
    subject: "Reinforcement Learning Lab",
    title: "Open-Source Lab Guide: Sutton & Barto RL Implementation Tasks & Pseudocode",
    author: "Complete Ideas Open-Source",
    date: "Oct 16, 2026",
    url: "http://incompleteideas.net/book/the-book-2nd.html",
    description: "Comprehensive task manual for Q-learning, SARSA, and Temporal Difference control algorithms with evaluation benchmarks.",
    fileSize: "4.5 MB",
    platform: "OpenSource",
  },
  {
    id: "PDF-03",
    type: "OpenSource PDF",
    subject: "Big Data Lab",
    title: "Open-Source Lab Manual: Stanford Massive Datasets & MapReduce Lab Problems",
    author: "Stanford InfoLab Open Courseware",
    date: "Oct 12, 2026",
    url: "http://infolab.stanford.edu/~ullman/mmds/book.pdf",
    description: "Official textbook and problem sets for large-scale file systems, MapReduce algorithms, data stream hashing, and page rank algorithms.",
    fileSize: "5.1 MB",
    platform: "OpenSource",
  },
  {
    id: "PDF-04",
    type: "OpenSource PDF",
    subject: "Cloud Architecture & DevOps",
    title: "Open-Source Lab Spec: NIST Cloud Computing Architecture & Security Reference",
    author: "NIST Open Publication",
    date: "Oct 10, 2026",
    url: "https://nvlpubs.nist.gov/nistpubs/legacy/sp/nistspecialpublication500-292.pdf",
    description: "Authoritative architectural reference and grading rubric for cloud service layers, tenant isolation, and container security compliance.",
    fileSize: "1.8 MB",
    platform: "OpenSource",
  },

  // Lecture Recordings
  {
    id: "REC-01",
    type: "Recording",
    subject: "Generative AI & LLMs",
    title: "Lab Walkthrough: LangChain RAG & Vector Databases (ChromaDB & FAISS)",
    author: "Dr. Anita Desai",
    date: "Oct 21, 2026",
    url: "https://drive.google.com/file/d/genai-rag-oct21/view",
    description: "Coding lab recording demonstrating embedding generation, chunking strategies, and vector similarity indexing in Python.",
    duration: "1h 45m",
    platform: "Drive",
  },
  {
    id: "REC-02",
    type: "Recording",
    subject: "Reinforcement Learning Lab",
    title: "Lab Walkthrough: Deep Q-Networks (DQN) PyTorch Training & Experience Replay",
    author: "Dr. Priya Sharma",
    date: "Oct 19, 2026",
    url: "https://drive.google.com/file/d/rl-dqn-oct19/view",
    description: "Complete hands-on implementation of DQN agent, replay buffer, target network update, and reward convergence plotting.",
    duration: "1h 38m",
    platform: "Drive",
  },

  // Class Discussions / Notes
  {
    id: "DISC-01",
    type: "Discussion",
    subject: "Generative AI & LLMs",
    title: "Tips for Assignment 17: Local Ollama + LangChain Vector DB Setup",
    author: "Koushik Thalari (Class Rep)",
    date: "Oct 23, 2026",
    url: "#",
    description: "If you're running out of VRAM while running Llama-3 locally for Assignment 17, try using q4_k_m GGUF quantization with ChromaDB persistent storage.",
  },
];
