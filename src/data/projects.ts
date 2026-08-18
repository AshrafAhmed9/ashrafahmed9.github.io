export interface Project {
  title: string;
  description: string;
  tags: string[];
  repo: string;
  liveUrl?: string;
}

export const projects: Project[] = [
  {
    title: "Aegis — AI-Native Distributed Systems Observability Platform",
    description:
      "Automated microservice failure prediction and root-cause analysis: an event-time Kafka stream correlator whose topological RCA was correct on all 78 evaluated incidents, a statistical detector (EWMA z-score + OLS trend projection) reaching 228-second median lead time, and a HistGradientBoosting classifier evaluated in shadow mode against it with PSI drift monitoring, a versioned registry and gated retraining.",
    tags: ["Python", "FastAPI", "Kafka", "Scikit-Learn", "React", "Prometheus"],
    repo: "AshrafAhmed9/aegis-observability",
  },
  {
    title: "Go + Java Auth Platform — Polyglot Microservices Identity System",
    description:
      "Built a two-service identity platform: a Go auth service with rotating refresh tokens, reuse detection, and a Redis JTI blacklist, consumed by a Java/Spring Boot resource API that validates every request over gRPC — with a token-hash Caffeine validation cache and a fail-closed Resilience4j circuit breaker. 61 tests (Testcontainers + in-process gRPC) in CI; k6-load-tested at ~92 req/s with 6ms p50 across the two-service auth path.",
    tags: ["Go", "Java", "Spring Boot", "gRPC", "JWT", "Redis", "PostgreSQL"],
    repo: "AshrafAhmed9/springboot-resource-api",
  },
  {
    title: "Custom Key-Value Storage Engine",
    description:
      "Built a durable, crash-resilient storage engine from scratch in Python, achieving ~26,000 writes/sec in batched fsync mode and 100% recovery rates under simulated unclean shutdowns (kill -9), by designing an LSM-tree architecture with a Write-Ahead Log, Bloom filters, and size-tiered compaction.",
    tags: ["Python", "LSM-Tree", "WAL", "TCP", "Docker", "Pytest"],
    repo: "AshrafAhmed9/kv-store",
  },
  {
    title: "ClearText API — Async AI Inference Platform",
    description:
      "Optimized toxic comment ML inference throughput, scaling to 231 requests/sec at 106ms average latency under a 500 concurrent-user load, by building an asynchronous FastAPI serving backend utilizing Celery task queues, Redis model-versioned caching, and a custom worker micro-batcher.",
    tags: ["FastAPI", "Redis", "PostgreSQL", "Celery", "Groq LLM"],
    repo: "AshrafAhmed9/cleartext-api",
  },
  {
    title: "Distributed Log Processing & Analytics System",
    description:
      "High-throughput real-time log processing platform ingesting 343 logs/sec with 10ms P50 latency and 99.5% processing reliability, with real-time alerting and analytics.",
    tags: ["FastAPI", "Redis Streams", "PostgreSQL"],
    repo: "AshrafAhmed9/log-systems",
  },
  {
    title: "Radar–Camera Fusion for Real-Time Drone Detection (YOLOv8n + LSTM)",
    description:
      "Confidence-weighted late fusion of YOLOv8n detection with radar-inspired motion features, lifting precision from 0.91 to 0.94 (F1 0.92) while holding 8.3 FPS real-time inference on CPU — no GPU required at serving time. An LSTM trajectory forecaster cut RMSE from 1.78 to 1.64 versus a GRU baseline. Two peer-reviewed IEEE papers (ASIACONF 2026, C2I6 2025).",
    tags: ["Python", "PyTorch", "YOLOv8n", "LSTM", "Ultralytics", "CUDA (training)"],
    repo: "AshrafAhmed9/RampYOLO",
  },
];
