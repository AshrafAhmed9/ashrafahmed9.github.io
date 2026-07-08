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
      "Automated microservice failure prediction and root-cause analysis, achieving a 228-second predictive warning lead time and 100% topological diagnosis agreement, by engineering an event-time stream correlator using Kafka and a shadow-mode MLOps pipeline with HistGradientBoosting and PSI drift monitoring.",
    tags: ["Python", "FastAPI", "Kafka", "Scikit-Learn", "React", "Prometheus"],
    repo: "AshrafAhmed9/aegis-observability",
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
    title: "Authentication & RBAC API — Secure Identity Service",
    description:
      "Developed a secure, fault-tolerant identity service in Go, supporting token validation at ~72 requests/sec with a sub-5ms lookup latency, by implementing rotating refresh token reuse detection, a Redis-backed JTI blacklist, and a gRPC validation server.",
    tags: ["Go", "Gin", "JWT", "gRPC", "Docker", "PostgreSQL"],
    repo: "AshrafAhmed9/go-auth-service",
  },
  {
    title: "Distributed Log Processing & Analytics System",
    description:
      "High-throughput real-time log processing platform ingesting 343 logs/sec with 10ms P50 latency and 99.5% processing reliability, with real-time alerting and analytics.",
    tags: ["FastAPI", "Redis Streams", "PostgreSQL"],
    repo: "AshrafAhmed9/log-systems",
  },
  {
    title: "Lightweight Radar–Camera Fusion System (RAMP-CNN + YOLO)",
    description:
      "Multi-modal object detection system achieving >90% accuracy on 5,000+ COCO samples with CUDA acceleration. Published as peer-reviewed research paper (ASIANCONF 2026).",
    tags: ["Python", "PyTorch", "CUDA"],
    repo: "AshrafAhmed9/RampYOLO",
  },
];
