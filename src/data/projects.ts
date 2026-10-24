export interface Project {
  title: string;
  description: string;
  tags: string[];
  repo: string;
  liveUrl?: string;
}

export const projects: Project[] = [
  {
    title: "Kiln — LLM Inference Engine",
    description:
      "An LLM inference engine written in C++ with custom CUDA kernels for attention, RMSNorm and RoPE. It serves SmolLM2-135M at 219–231 tokens/s on a GTX 1660 Ti through an OpenAI-compatible API (one request at a time), with final logits within ~6×10⁻⁵ of Hugging Face on two checkpoints. In CPU benchmarks, KV caching sped up generation 11.2× over full recomputation and paged prefix sharing fit 62 concurrent sequences in memory that held 4. An INT8 GEMM path runs 1.60× faster than FP32 on the GPU. 136 tests.",
    tags: ["C++", "CUDA", "Python", "PyTorch", "LLM Serving", "Quantization"],
    repo: "AshrafAhmed9/kiln",
  },
  {
    title: "Consensa — Distributed Vector Database",
    description:
      "A distributed vector database in Go: hand-written Raft consensus, an MVCC storage engine, HNSW vector search, range sharding with live splits, and cross-shard transactions across two 3-node replica groups. A chaos harness kills processes and partitions the network, then checks the histories for linearizability. Quorum intersection and range-split ownership are model-checked in TLA+. HNSW search returns 98.6% of the true top-10 matches in 156 µs on 5,000 synthetic vectors.",
    tags: ["Go", "Raft", "HNSW", "gRPC", "TLA+", "Distributed Systems"],
    repo: "AshrafAhmed9/Consensa",
  },
  {
    title: "Anamnesis — Memory for AI Agents",
    description:
      "A memory layer for AI agents on CockroachDB, built for the CockroachDB × AWS hackathon and deployed on AWS Lambda. Beliefs carry validity intervals, so the agent can answer what it believed last week. New beliefs are checked against old ones and contradictions supersede instead of overwriting, and every write is audited in the same SERIALIZABLE transaction.",
    tags: ["Python", "FastAPI", "CockroachDB", "AWS Lambda", "LLM Agents"],
    repo: "AshrafAhmed9/anamnesis",
    liveUrl: "https://5y52iimwosyg62vshke43wivtu0wspsd.lambda-url.us-east-1.on.aws/",
  },
  {
    title: "Aegis — Predictive Observability Platform",
    description:
      "Failure prediction and root-cause analysis for microservices. A Kafka event-time correlator traced the root cause in all 78 simulated incidents, and a gradient-boosted model warned a median 193 seconds before failure on 18 held-out simulated episodes, with shadow scoring and PSI drift monitoring around it.",
    tags: ["Python", "FastAPI", "Kafka", "Scikit-Learn", "Prometheus"],
    repo: "AshrafAhmed9/aegis-observability",
  },
  {
    title: "ClearText API — Async ML Inference Platform",
    description:
      "A FastAPI service that takes BERT inference off the request path and onto batched Celery workers. In a 500-user local load test it accepted 169 prediction requests/s at 2 ms median enqueue latency with zero endpoint failures. Model-versioned Redis caching, worker-health backpressure and a replayable dead-letter queue.",
    tags: ["FastAPI", "Celery", "Redis", "PostgreSQL", "BERT"],
    repo: "AshrafAhmed9/cleartext-api",
  },
  {
    title: "Go + Java Auth Platform",
    description:
      "A Go auth service with rotating refresh tokens, reuse detection and a Redis JTI blacklist, consumed by a Java/Spring Boot API that validates each request over gRPC behind a token-hash Caffeine cache and a fail-closed Resilience4j circuit breaker. 61 tests (Testcontainers and in-process gRPC); k6 load test at ~92 req/s with 6 ms p50 across both services.",
    tags: ["Go", "Java", "Spring Boot", "gRPC", "JWT", "Redis"],
    repo: "AshrafAhmed9/springboot-resource-api",
  },
  {
    title: "Radar–Camera Fusion for Real-Time Drone Detection",
    description:
      "Confidence-weighted late fusion of YOLOv8n detections with radar-inspired motion features, lifting precision from 0.91 to 0.94 (F1 0.92) at 8.3 FPS on CPU, with no GPU needed at inference time. An LSTM trajectory forecaster cut RMSE from 1.78 to 1.64 against a GRU baseline. Basis for two IEEE papers (ASIACONF 2026, C2I6 2025).",
    tags: ["Python", "PyTorch", "YOLOv8n", "LSTM", "CUDA (training)"],
    repo: "AshrafAhmed9/RampYOLO",
  },
];
