export interface AssignmentQuestion {
  q: string;
  marks: number;
}

export interface RubricRow {
  criteria: string;
  maxMarks: number;
  description: string;
}

export interface AssignmentReference {
  label: string;
  detail: string;
}

export interface AssignmentDetail {
  no: number;
  labObjective?: string;
  labRequirements?: string[];
  questions?: AssignmentQuestion[];
  labSteps?: string[];
  labExpectedOutput?: string;
  viva?: string[];
  rubric: RubricRow[];
  references: AssignmentReference[];
}

export const assignmentDetails: Record<number, AssignmentDetail> = {
  1: {
    no: 1,
    questions: [
      { q: "Explain the BERT architecture and its two pre-training objectives (MLM and NSP) with diagrams.", marks: 3 },
      { q: "Fine-tune a pre-trained BERT model on the IMDB sentiment dataset. Report accuracy, precision, recall and F1-score.", marks: 4 },
      { q: "Compare fine-tuning BERT vs. training a BiLSTM from scratch on the same dataset. Discuss accuracy vs. compute cost.", marks: 2 },
      { q: "Apply data augmentation (back-translation, synonym replacement) and report the impact on model performance.", marks: 1 },
    ],
    rubric: [
      { criteria: "Correctness & Accuracy", maxMarks: 4, description: "Model achieves ≥ 88% accuracy; evaluation metrics correctly computed." },
      { criteria: "Code Quality", maxMarks: 3, description: "Clean, modular code with comments; uses PyTorch or TensorFlow correctly." },
      { criteria: "Documentation & Report", maxMarks: 2, description: "Concise report with methodology, results, and analysis." },
      { criteria: "Timely Submission", maxMarks: 1, description: "Submitted before deadline via university portal." },
    ],
    references: [
      { label: "Devlin et al. (2018) — BERT Paper", detail: "arXiv:1810.04805 — 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding'" },
      { label: "Hugging Face Transformers Docs", detail: "huggingface.co/docs/transformers — Fine-tuning BERT for text classification" },
      { label: "Jurafsky & Martin — Chapter 11", detail: "'Speech and Language Processing' 3rd Ed. — Transfer Learning and Fine-Tuning" },
    ],
  },
  2: {
    no: 2,
    labObjective: "Deploy a trained scikit-learn ML model as a scalable, cost-effective REST API using AWS Lambda and API Gateway without managing servers.",
    labRequirements: ["Python 3.9+", "AWS Account (Free Tier)", "boto3, scikit-learn, joblib", "AWS CLI configured locally", "Postman or curl for API testing"],
    labSteps: [
      "Train a scikit-learn RandomForestClassifier on the Iris dataset and serialize it using joblib (model.pkl).",
      "Create a Python handler function (lambda_function.py) that loads model.pkl and returns a JSON prediction.",
      "Package the handler and dependencies into a .zip file for Lambda upload.",
      "Create an AWS Lambda function (Python 3.9 runtime) and upload the .zip package.",
      "Add an API Gateway trigger (REST API, POST /predict endpoint) to the Lambda function.",
      "Test the endpoint using Postman: POST { \"features\": [5.1, 3.5, 1.4, 0.2] } and verify response { \"prediction\": 0 }.",
      "Implement error handling for malformed input; return HTTP 400 with descriptive error message.",
      "Document latency, cold start time, and estimated monthly cost for 1M invocations.",
    ],
    labExpectedOutput: "A live HTTPS REST endpoint returning JSON predictions with <500ms latency for warm starts.",
    viva: [
      "What is a serverless architecture and how does AWS Lambda implement the FaaS model?",
      "How do you handle cold starts in Lambda and what strategies reduce their impact?",
      "Compare API Gateway (REST API) vs. API Gateway (HTTP API) — when would you choose each?",
    ],
    rubric: [
      { criteria: "Successful Deployment", maxMarks: 4, description: "Lambda function deployed and endpoint returns correct predictions." },
      { criteria: "Code & Handler Quality", maxMarks: 3, description: "Error handling, input validation, and clean code structure." },
      { criteria: "Lab Report & Screenshots", maxMarks: 2, description: "Step-by-step screenshots of AWS console; cost analysis included." },
      { criteria: "Timely Submission", maxMarks: 1, description: "Lab record submitted before deadline." },
    ],
    references: [
      { label: "AWS Lambda Developer Guide", detail: "docs.aws.amazon.com/lambda — Deploying Python Lambda functions" },
      { label: "Géron — Chapter 19", detail: "'Hands-On ML with Scikit-Learn, Keras & TF' — Deploying ML Models" },
      { label: "Boto3 Documentation", detail: "boto3.amazonaws.com/v1/documentation — AWS SDK for Python" },
    ],
  },
  3: {
    no: 3,
    questions: [
      { q: "Explain the YOLO (You Only Look Once) architecture. How does it differ from region-based detectors like Faster R-CNN?", marks: 3 },
      { q: "Implement YOLOv5 or YOLOv8 to detect objects in at least 3 different image categories. Show bounding boxes and confidence scores.", marks: 4 },
      { q: "Analyse false positives and false negatives in your detection results. What hyperparameters would you adjust to reduce them?", marks: 2 },
      { q: "Evaluate your model using mean Average Precision (mAP) at IoU thresholds of 0.5 and 0.75.", marks: 1 },
    ],
    rubric: [
      { criteria: "Detection Accuracy", maxMarks: 4, description: "mAP@0.5 ≥ 0.75; correct bounding boxes and class labels." },
      { criteria: "Implementation Quality", maxMarks: 3, description: "Correct use of YOLO API; custom inference pipeline implemented." },
      { criteria: "Analysis & Report", maxMarks: 2, description: "Detailed error analysis; comparison of YOLO vs Faster R-CNN." },
      { criteria: "Timely Submission", maxMarks: 1, description: "Code and report submitted on time via portal." },
    ],
    references: [
      { label: "Redmon et al. (2016) — YOLO Paper", detail: "arXiv:1506.02640 — 'You Only Look Once: Unified, Real-Time Object Detection'" },
      { label: "Szeliski — Chapter 6", detail: "'Computer Vision: Algorithms and Applications' — Feature Detection and Matching" },
      { label: "Ultralytics YOLOv8 Docs", detail: "docs.ultralytics.com — Training and deploying YOLOv8 models" },
    ],
  },
  4: {
    no: 4,
    labObjective: "Containerize a PyTorch deep learning model using Docker and deploy it as a REST API service, understanding image layering, port mapping, and container orchestration.",
    labRequirements: ["Docker Desktop 24+", "Python 3.10, PyTorch 2.0, FastAPI, Uvicorn", "Pre-trained ResNet-18 model", "Docker Hub account", "curl or Postman"],
    labSteps: [
      "Create a FastAPI application (app.py) that loads a pre-trained ResNet-18 and exposes a POST /classify endpoint.",
      "Write requirements.txt with exact pinned versions for torch, torchvision, fastapi, and uvicorn.",
      "Author a multi-stage Dockerfile: builder stage (pip install) + slim runtime stage (copy installed packages).",
      "Build the Docker image: docker build -t dl-classifier:v1 . Verify image size < 2GB.",
      "Run the container locally: docker run -p 8080:8080 dl-classifier:v1 and test with a sample image.",
      "Tag and push the image to Docker Hub: docker tag / docker push.",
      "Write a docker-compose.yml that spins up the API service and an Nginx reverse proxy.",
      "Stress-test the endpoint with 100 concurrent requests using Apache Bench (ab) and report throughput.",
    ],
    labExpectedOutput: "A containerized REST API returning ImageNet class predictions accessible at http://localhost:8080/classify.",
    viva: [
      "Explain the difference between a Docker image and a container. What is an image layer?",
      "What is the advantage of a multi-stage Docker build for ML model containers?",
      "How does Kubernetes extend Docker for production ML serving at scale?",
    ],
    rubric: [
      { criteria: "Dockerfile & Image", maxMarks: 4, description: "Valid Dockerfile; image builds successfully; multi-stage build used." },
      { criteria: "API Functionality", maxMarks: 3, description: "Endpoint returns correct predictions; error handling present." },
      { criteria: "Lab Report", maxMarks: 2, description: "docker-compose.yml included; stress test results documented." },
      { criteria: "Timely Submission", maxMarks: 1, description: "Submitted before deadline." },
    ],
    references: [
      { label: "Docker Official Docs", detail: "docs.docker.com — Build and run Docker containers" },
      { label: "FastAPI Documentation", detail: "fastapi.tiangolo.com — Building async REST APIs in Python" },
      { label: "Géron — Chapter 19", detail: "'Hands-On ML' — Serving ML Models with Docker and Kubernetes" },
    ],
  },
  5: {
    no: 5,
    questions: [
      { q: "Describe the encoder-decoder architecture of seq2seq models. How does the attention mechanism improve performance on long sequences?", marks: 3 },
      { q: "Build a rule-based + transformer hybrid chatbot using a fine-tuned GPT-2 or DialoGPT model. The bot must handle at least 5 intent categories.", marks: 4 },
      { q: "Evaluate the chatbot using BLEU score and human evaluation rubric (coherence, relevance, fluency) on 20 test conversations.", marks: 2 },
      { q: "Implement a context management system so the chatbot remembers the last 5 turns of conversation.", marks: 1 },
    ],
    rubric: [
      { criteria: "Chatbot Functionality", maxMarks: 4, description: "Handles 5+ intents correctly; context window implemented." },
      { criteria: "Model Implementation", maxMarks: 3, description: "Correct use of transformer model; fine-tuning demonstrated." },
      { criteria: "Evaluation & Report", maxMarks: 2, description: "BLEU score reported; human eval rubric filled for 20 conversations." },
      { criteria: "Timely Submission", maxMarks: 1, description: "Submitted on time." },
    ],
    references: [
      { label: "Vaswani et al. (2017) — Attention Is All You Need", detail: "arXiv:1706.03762 — Transformer architecture" },
      { label: "Jurafsky & Martin — Chapter 26", detail: "'Speech and Language Processing' — Dialogue Systems and Chatbots" },
      { label: "Hugging Face — DialoGPT Model Card", detail: "huggingface.co/microsoft/DialoGPT-medium" },
    ],
  },
  6: {
    no: 6,
    labObjective: "Implement a full Neural Machine Translation (NMT) pipeline from data preprocessing to inference using a Transformer seq2seq model.",
    labRequirements: ["Python 3.10, PyTorch 2.0, torchtext", "Multi30k English-German dataset", "GPU (Google Colab or local)", "SacreBLEU library"],
    labSteps: [
      "Download and preprocess the Multi30k dataset; build vocabulary with torchtext and apply byte-pair encoding (BPE).",
      "Implement Transformer encoder and decoder stacks from scratch using nn.TransformerEncoder and nn.TransformerDecoder.",
      "Define positional encoding and multi-head attention with 8 heads; embed dimension = 512.",
      "Train the model for 15 epochs with Adam optimiser (lr=0.0001) and label smoothing (ε=0.1).",
      "Implement beam search decoding (beam width = 5) for inference.",
      "Evaluate on test split using SacreBLEU; target ≥ 32 BLEU points.",
      "Visualise attention weights for 5 sample translations using matplotlib heatmap.",
      "Write a Gradio demo that accepts an English sentence and returns German translation.",
    ],
    labExpectedOutput: "Trained NMT model achieving ≥ 32 BLEU on Multi30k test set with an interactive Gradio demo.",
    viva: [
      "What is byte-pair encoding (BPE) and why is it preferred over word-level tokenisation for NMT?",
      "Explain multi-head attention. What does each head learn to attend to?",
      "How does beam search improve translation quality compared to greedy decoding?",
    ],
    rubric: [
      { criteria: "Model Training & BLEU", maxMarks: 4, description: "Model converges; BLEU ≥ 28 on test set." },
      { criteria: "Implementation Quality", maxMarks: 3, description: "Correct Transformer implementation; beam search working." },
      { criteria: "Visualisations & Demo", maxMarks: 2, description: "Attention heatmaps produced; Gradio demo functional." },
      { criteria: "Timely Submission", maxMarks: 1, description: "Submitted before deadline." },
    ],
    references: [
      { label: "Vaswani et al. (2017) — Attention Is All You Need", detail: "arXiv:1706.03762" },
      { label: "PyTorch NLP Tutorial", detail: "pytorch.org/tutorials — Language Translation with nn.Transformer" },
      { label: "Jurafsky & Martin — Chapter 13", detail: "'Speech and Language Processing' — Machine Translation" },
    ],
  },
  7: {
    no: 7,
    questions: [
      { q: "Explain the GAN framework: what are the generator and discriminator objectives? Derive the original minimax loss.", marks: 3 },
      { q: "Implement a DCGAN to generate synthetic images from the CelebA or CIFAR-10 dataset. Train for at least 50 epochs.", marks: 4 },
      { q: "Compute the Fréchet Inception Distance (FID) for your generated images. Compare results with Wasserstein GAN (WGAN).", marks: 2 },
      { q: "Demonstrate mode collapse: show a training run that collapses and explain mitigation strategies you applied.", marks: 1 },
    ],
    rubric: [
      { criteria: "GAN Training Stability", maxMarks: 4, description: "Generator produces recognisable images; FID ≤ 50 for CelebA." },
      { criteria: "Code Quality", maxMarks: 3, description: "Modular code; training loop with logging; loss curves plotted." },
      { criteria: "Analysis & Comparison", maxMarks: 2, description: "DCGAN vs WGAN analysis; mode collapse documented." },
      { criteria: "Timely Submission", maxMarks: 1, description: "Submitted before deadline." },
    ],
    references: [
      { label: "Goodfellow et al. (2014) — Generative Adversarial Nets", detail: "arXiv:1406.2661 — Original GAN paper" },
      { label: "Radford et al. (2015) — DCGAN", detail: "arXiv:1511.06434 — 'Unsupervised Representation Learning with DCGANs'" },
      { label: "Goodfellow et al. — Chapter 20", detail: "'Deep Learning' (MIT Press) — Generative Models" },
    ],
  },
  8: {
    no: 8,
    labObjective: "Build and train a Deep Q-Network (DQN) reinforcement learning agent to play a classic Atari game using OpenAI Gymnasium.",
    labRequirements: ["Python 3.10, PyTorch 2.0", "OpenAI Gymnasium (gymnasium[atari])", "Stable Baselines3", "GPU recommended (Google Colab)", "Matplotlib for plotting"],
    labSteps: [
      "Install and configure the Gymnasium Atari environment (CartPole-v1 or SpaceInvaders-v4).",
      "Implement the experience replay buffer (ReplayBuffer) storing (s, a, r, s', done) tuples.",
      "Define the Q-network (3 convolutional layers + 2 FC layers) and a target network updated every 1000 steps.",
      "Implement epsilon-greedy exploration: ε decays from 1.0 to 0.01 over 100,000 steps.",
      "Train the agent for 500 episodes, optimising with MSE loss on the Bellman equation targets.",
      "Plot the episode reward curve and running average over 100 episodes.",
      "Evaluate the trained agent for 20 episodes and report mean and std of total reward.",
      "Compare DQN performance against a random policy baseline.",
    ],
    labExpectedOutput: "A trained DQN agent achieving mean episode reward > 200 on CartPole-v1 with reward curve demonstrating stable convergence.",
    viva: [
      "What is the Bellman optimality equation and how does DQN approximate it using neural networks?",
      "Why is experience replay necessary in DQN and how does it break temporal correlations?",
      "What is the target network in DQN and why does it stabilise training?",
    ],
    rubric: [
      { criteria: "Agent Performance", maxMarks: 4, description: "Mean reward > 150 on CartPole; stable training curve." },
      { criteria: "Implementation", maxMarks: 3, description: "Correct DQN with replay buffer and target network." },
      { criteria: "Analysis & Plots", maxMarks: 2, description: "Reward curve plotted; comparison with random policy." },
      { criteria: "Timely Submission", maxMarks: 1, description: "Submitted before deadline." },
    ],
    references: [
      { label: "Mnih et al. (2015) — DQN Paper", detail: "Nature 518, 529–533 — 'Human-level control through deep reinforcement learning'" },
      { label: "Sutton & Barto — Chapters 6 & 9", detail: "'Reinforcement Learning: An Introduction' — TD Learning & Function Approximation" },
      { label: "OpenAI Gymnasium Docs", detail: "gymnasium.farama.org — Atari environments and wrappers" },
    ],
  },
  9: {
    no: 9,
    questions: [
      { q: "Compare collaborative filtering, content-based filtering, and hybrid recommendation approaches. What are the cold-start problems of each?", marks: 3 },
      { q: "Build a movie recommendation system using matrix factorisation (SVD or ALS) on the MovieLens 1M dataset.", marks: 4 },
      { q: "Evaluate your system using RMSE, MAE, Precision@K and Recall@K metrics. Compare against a popularity-based baseline.", marks: 2 },
      { q: "Implement a simple neural collaborative filtering (NCF) model and compare its performance to SVD.", marks: 1 },
    ],
    rubric: [
      { criteria: "Recommendation Quality", maxMarks: 4, description: "RMSE ≤ 0.90 on MovieLens test split." },
      { criteria: "Code Quality", maxMarks: 3, description: "Modular pipeline; data preprocessing correctly handled." },
      { criteria: "Evaluation & Report", maxMarks: 2, description: "All 4 metrics reported; NCF vs SVD comparison present." },
      { criteria: "Timely Submission", maxMarks: 1, description: "Submitted on time." },
    ],
    references: [
      { label: "He et al. (2017) — Neural Collaborative Filtering", detail: "arXiv:1708.05031 — NCF framework" },
      { label: "Aggarwal — Chapter 2", detail: "'Recommender Systems: The Textbook' — Collaborative Filtering" },
      { label: "Surprise Library Docs", detail: "surpriselib.com — SVD and matrix factorisation for recommender systems" },
    ],
  },
  10: {
    no: 10,
    labObjective: "Implement a Graph Neural Network (GNN) for node classification on a social network graph, using the Cora citation dataset.",
    labRequirements: ["Python 3.10, PyTorch 2.0, PyTorch Geometric (PyG)", "Cora dataset (via PyG built-in)", "torch_scatter, torch_sparse", "Matplotlib, NetworkX"],
    labSteps: [
      "Load the Cora dataset using torch_geometric.datasets.Planetoid; inspect graph statistics (nodes, edges, features, classes).",
      "Visualise the graph using NetworkX, colouring nodes by class label.",
      "Implement a 2-layer GCN (Graph Convolutional Network) using GCNConv layers from PyTorch Geometric.",
      "Train using Adam optimiser (lr=0.01, weight_decay=5e-4) for 200 epochs; use train mask for backprop.",
      "Evaluate on test mask; report accuracy. Target ≥ 80% on Cora test set.",
      "Replace GCNConv with GATConv (Graph Attention Network) and compare performance.",
      "Implement node embedding visualisation using t-SNE on the penultimate layer features.",
      "Write a short report comparing GCN vs GAT: accuracy, training time, attention interpretability.",
    ],
    labExpectedOutput: "GCN achieving ≥ 80% node classification accuracy on Cora test set; t-SNE plot showing clear cluster separation by class.",
    viva: [
      "How does the graph convolution operation aggregate neighbourhood information in GCN?",
      "What is the difference between spectral and spatial graph convolution approaches?",
      "How does the attention mechanism in GAT differ from the uniform aggregation in GCN?",
    ],
    rubric: [
      { criteria: "Model Accuracy", maxMarks: 4, description: "GCN achieves ≥ 78% on Cora; GAT comparison present." },
      { criteria: "Implementation", maxMarks: 3, description: "Correct GCN and GAT implementations using PyG." },
      { criteria: "Visualisations & Report", maxMarks: 2, description: "t-SNE plot generated; GCN vs GAT report written." },
      { criteria: "Timely Submission", maxMarks: 1, description: "Submitted before deadline." },
    ],
    references: [
      { label: "Kipf & Welling (2017) — GCN Paper", detail: "arXiv:1609.02907 — 'Semi-Supervised Classification with GCN'" },
      { label: "Velickovic et al. (2018) — GAT Paper", detail: "arXiv:1710.10903 — 'Graph Attention Networks'" },
      { label: "PyTorch Geometric Docs", detail: "pytorch-geometric.readthedocs.io — Node classification tutorials" },
    ],
  },
  11: {
    no: 11,
    questions: [
      { q: "Explain the lane detection pipeline: edge detection → Hough transform → polynomial fitting. What are the limitations of classical methods on curves?", marks: 3 },
      { q: "Implement a lane detection system using OpenCV on at least 5 minutes of dashcam video. Overlay lane boundaries on the output frames.", marks: 4 },
      { q: "Extend the system to estimate lane curvature (radius of curvature in metres) and vehicle offset from lane centre.", marks: 2 },
      { q: "Compare the classical pipeline with a deep learning-based approach (e.g., LaneNet). Discuss F1-score and FPS.", marks: 1 },
    ],
    rubric: [
      { criteria: "Detection Accuracy", maxMarks: 4, description: "Lanes detected correctly on straight and curved road sections." },
      { criteria: "Code Quality", maxMarks: 3, description: "Modular pipeline; video I/O correctly handled with OpenCV." },
      { criteria: "Analysis & Metrics", maxMarks: 2, description: "Curvature and offset computed; comparison with DL approach." },
      { criteria: "Timely Submission", maxMarks: 1, description: "Submitted on time." },
    ],
    references: [
      { label: "Szeliski — Chapter 7", detail: "'Computer Vision: Algorithms and Applications' — Feature Matching and Motion Estimation" },
      { label: "OpenCV Docs — Hough Line Transform", detail: "docs.opencv.org/4.x — Hough Line Transform tutorial" },
      { label: "Pan et al. (2018) — LaneNet", detail: "arXiv:1802.05591 — 'Spatial CNN for End-to-End Lane Detection'" },
    ],
  },
  12: {
    no: 12,
    labObjective: "Build a zero-shot text classification system using a pre-trained NLI model that classifies text into arbitrary categories without task-specific training.",
    labRequirements: ["Python 3.10, Transformers (Hugging Face)", "facebook/bart-large-mnli model", "Datasets: AG News, Yahoo Answers", "Sklearn for evaluation"],
    labSteps: [
      "Load the facebook/bart-large-mnli model from Hugging Face as a zero-shot-classification pipeline.",
      "Design 5 different label sets (e.g., topics, sentiments, domain categories) to test versatility.",
      "Evaluate on 500 samples from AG News using topic labels: World, Sports, Business, Sci/Tech.",
      "Evaluate on 200 samples from Yahoo Answers using domain labels.",
      "Implement multi-label zero-shot classification with threshold tuning for overlapping categories.",
      "Compare zero-shot performance against a fine-tuned BERT baseline on 1000 labelled examples.",
      "Analyse failure cases: which categories are most confused and why?",
      "Create a Streamlit app for interactive zero-shot classification.",
    ],
    labExpectedOutput: "Zero-shot classifier achieving ≥ 70% accuracy on AG News 4-class classification; interactive Streamlit demo deployed locally.",
    viva: [
      "How does the NLI (Natural Language Inference) framework enable zero-shot classification without labelled training data?",
      "What are the trade-offs between zero-shot classification and few-shot in-context learning with GPT-4?",
      "In what scenarios would you prefer zero-shot over a fine-tuned classifier?",
    ],
    rubric: [
      { criteria: "Classification Performance", maxMarks: 4, description: "≥ 70% accuracy on AG News; multi-label experiment performed." },
      { criteria: "Implementation Quality", maxMarks: 3, description: "Correct use of NLI pipeline; all 5 label sets evaluated." },
      { criteria: "Analysis & Demo", maxMarks: 2, description: "Failure case analysis; Streamlit app functional." },
      { criteria: "Timely Submission", maxMarks: 1, description: "Submitted before deadline." },
    ],
    references: [
      { label: "Yin et al. (2019) — Benchmarking Zero-Shot Text Classification", detail: "arXiv:1909.00161" },
      { label: "Hugging Face Zero-Shot Pipeline", detail: "huggingface.co/docs/transformers — ZeroShotClassificationPipeline" },
      { label: "Jurafsky & Martin — Chapter 9", detail: "'Speech and Language Processing' — Text Classification" },
    ],
  },
  13: {
    no: 13,
    questions: [
      { q: "Summarise the key concepts from Semester 2 mid-term syllabus across all 7 subjects in a structured review table.", marks: 3 },
      { q: "Select any two subjects and implement a mini-project that integrates techniques from both. (e.g., NLP + Computer Vision for Visual Question Answering).", marks: 4 },
      { q: "Critically evaluate your mid-term performance. Identify 3 areas of weakness and propose a study plan to address each before the final exam.", marks: 2 },
      { q: "Predict the likely final exam question patterns based on mid-term topics and faculty hints.", marks: 1 },
    ],
    rubric: [
      { criteria: "Review Quality", maxMarks: 4, description: "Comprehensive review table; integration project implemented and running." },
      { criteria: "Critical Reflection", maxMarks: 3, description: "Honest self-assessment; study plan is specific and actionable." },
      { criteria: "Integration Project", maxMarks: 2, description: "Cross-subject mini-project demonstrates understanding of both domains." },
      { criteria: "Timely Submission", maxMarks: 1, description: "Submitted before deadline." },
    ],
    references: [
      { label: "Bishop — Chapters 1–4", detail: "'Pattern Recognition and Machine Learning' — Review of probabilistic models" },
      { label: "Goodfellow et al. — Chapters 6–12", detail: "'Deep Learning' — Core architecture review" },
      { label: "Jurafsky & Martin — Chapters 1–12", detail: "'Speech and Language Processing' — NLP core review" },
    ],
  },
  14: {
    no: 14,
    questions: [
      { q: "Define multi-task learning (MTL). Explain hard parameter sharing vs soft parameter sharing architectures with diagrams.", marks: 3 },
      { q: "Implement an MTL framework that jointly trains a sentiment classifier and a named entity recogniser on shared BERT representations.", marks: 4 },
      { q: "Evaluate the MTL model vs two single-task baselines. Report F1-score for each task. Analyse negative transfer if observed.", marks: 2 },
      { q: "Experiment with task weighting strategies (equal, uncertainty weighting, GradNorm) and report their effect on performance.", marks: 1 },
    ],
    rubric: [
      { criteria: "MTL Implementation", maxMarks: 4, description: "Both tasks trained jointly; shared encoder and task-specific heads implemented." },
      { criteria: "Code Quality", maxMarks: 3, description: "Modular codebase; hyperparameters externalised; training logged." },
      { criteria: "Evaluation & Analysis", maxMarks: 2, description: "MTL vs single-task F1 comparison; negative transfer analysis." },
      { criteria: "Timely Submission", maxMarks: 1, description: "Submitted before deadline." },
    ],
    references: [
      { label: "Ruder (2017) — An Overview of Multi-Task Learning", detail: "arXiv:1706.05098 — Comprehensive MTL survey" },
      { label: "Caruana (1997) — Multitask Learning", detail: "Machine Learning 28(1):41–75 — Original MTL paper" },
      { label: "Devlin et al. (2018) — BERT", detail: "arXiv:1810.04805 — Fine-tuning BERT for multiple tasks" },
    ],
  },
  15: {
    no: 15,
    labObjective: "Build an Explainable AI system that uses SHAP (SHapley Additive exPlanations) to interpret ML model predictions, deployed as a cloud-hosted API.",
    labRequirements: ["Python 3.10, SHAP, Scikit-learn, XGBoost", "AWS EC2 or Google Cloud Run", "FastAPI, Uvicorn, Docker", "Diabetes or Credit Card Fraud dataset"],
    labSteps: [
      "Train an XGBoost classifier on the Diabetes or Credit Fraud dataset; achieve > 85% ROC-AUC.",
      "Integrate SHAP TreeExplainer to generate feature importance values for each prediction.",
      "Create a FastAPI endpoint POST /explain that accepts input features and returns prediction + SHAP values.",
      "Generate SHAP summary plots (beeswarm and bar charts) for the test set.",
      "Containerize the application using Docker (multi-stage build for minimal image size).",
      "Deploy to AWS EC2 (t2.micro) or Google Cloud Run using the Docker image.",
      "Add a feature dependency plot for the top 3 most important features.",
      "Write documentation explaining SHAP values to a non-technical stakeholder.",
    ],
    labExpectedOutput: "A cloud-deployed explainable AI API returning SHAP values per prediction, accessible via public URL.",
    viva: [
      "What are Shapley values from game theory and how does SHAP apply them to ML interpretability?",
      "Compare SHAP with LIME (Local Interpretable Model-agnostic Explanations). When would you use each?",
      "What are the computational complexity trade-offs of TreeSHAP vs KernelSHAP?",
    ],
    rubric: [
      { criteria: "SHAP Integration & API", maxMarks: 4, description: "Correct SHAP values computed; API returns explanations." },
      { criteria: "Deployment", maxMarks: 3, description: "Docker image built; service deployed to cloud; public URL accessible." },
      { criteria: "Documentation & Plots", maxMarks: 2, description: "SHAP plots generated; non-technical explanation written." },
      { criteria: "Timely Submission", maxMarks: 1, description: "Submitted before deadline." },
    ],
    references: [
      { label: "Lundberg & Lee (2017) — SHAP Paper", detail: "arXiv:1705.07874 — 'A Unified Approach to Interpreting Model Predictions'" },
      { label: "SHAP Library Docs", detail: "shap.readthedocs.io — TreeExplainer and visualisations" },
      { label: "AWS EC2 Getting Started", detail: "docs.aws.amazon.com/ec2 — Launching and connecting to EC2 instances" },
    ],
  },
  16: {
    no: 16,
    questions: [
      { q: "Define adversarial examples in ML. Explain the FGSM (Fast Gradient Sign Method) attack with mathematical derivation.", marks: 3 },
      { q: "Implement FGSM and PGD (Projected Gradient Descent) attacks on a pre-trained ResNet-18 on CIFAR-10. Report fooling rate at ε=0.01, 0.05, 0.1.", marks: 4 },
      { q: "Implement adversarial training (PGD-AT) as a defence. Measure accuracy on clean and adversarial test sets. Report the accuracy-robustness trade-off.", marks: 2 },
      { q: "Test your defended model against an adaptive adversary (using the Carlini-Wagner attack). Discuss implications.", marks: 1 },
    ],
    rubric: [
      { criteria: "Attack Implementation", maxMarks: 4, description: "FGSM and PGD implemented correctly; fooling rates reported across ε values." },
      { criteria: "Defence Implementation", maxMarks: 3, description: "PGD-AT implemented; clean and robust accuracy both evaluated." },
      { criteria: "Analysis & Report", maxMarks: 2, description: "Accuracy-robustness trade-off discussed; adaptive attack evaluated." },
      { criteria: "Timely Submission", maxMarks: 1, description: "Submitted before deadline." },
    ],
    references: [
      { label: "Goodfellow et al. (2015) — FGSM Paper", detail: "arXiv:1412.6572 — 'Explaining and Harnessing Adversarial Examples'" },
      { label: "Madry et al. (2018) — PGD Adversarial Training", detail: "arXiv:1706.06083 — 'Towards Deep Learning Models Resistant to Adversarial Attacks'" },
      { label: "RobustBench Leaderboard", detail: "robustbench.github.io — State-of-the-art robustness benchmarks" },
    ],
  },
  17: {
    no: 17,
    labObjective: "Design and implement a Federated Learning (FL) simulation where multiple clients train local models on private data and a central server aggregates weights using FedAvg.",
    labRequirements: ["Python 3.10, PyTorch 2.0", "Flower (flwr) federated learning framework", "MNIST or CIFAR-10 dataset (non-IID partitioned)", "Matplotlib for convergence plots"],
    labSteps: [
      "Partition the MNIST dataset into non-IID splits across 10 simulated clients using Dirichlet distribution (α=0.5).",
      "Implement a CNN client model (2 conv layers + 2 FC layers) as a Flower client class.",
      "Implement the FedAvg aggregation strategy on the central server.",
      "Run 20 federated rounds with 5 clients selected per round (C=0.5 fraction).",
      "Track global model accuracy after each round; plot convergence curve.",
      "Compare FedAvg with local training only (no federation) and centralised training (IID).",
      "Implement differential privacy (Gaussian noise DP-SGD) on client updates and measure accuracy degradation.",
      "Write a report on data privacy guarantees offered by FL vs centralised training.",
    ],
    labExpectedOutput: "FL simulation with 10 clients converging to ≥ 95% accuracy on MNIST in 20 rounds, with convergence curve and privacy analysis report.",
    viva: [
      "What is the FedAvg algorithm and how does it aggregate model weights from heterogeneous clients?",
      "What is non-IID data distribution in federated learning and why is it a challenge?",
      "How does differential privacy (DP-SGD) protect individual client data in federated settings?",
    ],
    rubric: [
      { criteria: "FL Simulation", maxMarks: 4, description: "10-client FL with FedAvg converges; non-IID partitioning implemented." },
      { criteria: "Implementation", maxMarks: 3, description: "Flower framework used correctly; DP-SGD integrated." },
      { criteria: "Analysis & Report", maxMarks: 2, description: "Convergence plot; FL vs centralised comparison; privacy report." },
      { criteria: "Timely Submission", maxMarks: 1, description: "Submitted before deadline." },
    ],
    references: [
      { label: "McMahan et al. (2017) — FedAvg Paper", detail: "arXiv:1602.05629 — 'Communication-Efficient Learning of Deep Networks from Decentralized Data'" },
      { label: "Flower Framework Docs", detail: "flower.dev/docs — Federated learning simulation with Flower" },
      { label: "Abadi et al. (2016) — DP-SGD", detail: "arXiv:1607.00133 — 'Deep Learning with Differential Privacy'" },
    ],
  },
  18: {
    no: 18,
    questions: [
      { q: "Explain edge AI deployment challenges: model size, latency, power constraints, and heterogeneous hardware. Compare ONNX, TensorRT, and TFLite as deployment targets.", marks: 3 },
      { q: "Quantize a MobileNetV2 model to INT8 using PyTorch post-training quantization. Deploy it on a Raspberry Pi 4 (or simulated ARM environment) and measure inference latency.", marks: 4 },
      { q: "Implement knowledge distillation to compress a ResNet-50 teacher into a MobileNet student. Report accuracy vs. FLOPs trade-off.", marks: 2 },
      { q: "Compare the following: Full precision (FP32) vs INT8 quantized model on CIFAR-10 — accuracy drop, file size reduction, and inference speedup.", marks: 1 },
    ],
    rubric: [
      { criteria: "Model Optimization", maxMarks: 4, description: "INT8 quantization implemented; latency measurements on target device." },
      { criteria: "Knowledge Distillation", maxMarks: 3, description: "Teacher-student training correct; accuracy vs FLOPs trade-off reported." },
      { criteria: "Comparison & Report", maxMarks: 2, description: "FP32 vs INT8 comparison table; ONNX/TFLite export demonstrated." },
      { criteria: "Timely Submission", maxMarks: 1, description: "Submitted before deadline." },
    ],
    references: [
      { label: "Han et al. (2016) — Deep Compression", detail: "arXiv:1510.00149 — 'Deep Compression: Compressing DNNs with Pruning, Quantization and Huffman Coding'" },
      { label: "PyTorch Quantization Docs", detail: "pytorch.org/docs/stable/quantization.html — Post-training static quantization" },
      { label: "Hinton et al. (2015) — Knowledge Distillation", detail: "arXiv:1503.02531 — 'Distilling the Knowledge in a Neural Network'" },
    ],
  },
};
