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
      "Intelligent observability platform that automatically correlates distributed traces, builds failure propagation graphs, and generates complete SRE war rooms with Groq-powered AI root cause analysis.",
    tags: ["Python", "FastAPI", "Groq LLM", "Docker"],
    repo: "AshrafAhmed9/aegis-observability",
  },
  {
    title: "Custom Key-Value Storage Engine",
    description:
      "High-performance persistent key-value store achieving 1.1M reads/sec and 938K writes/sec with full durability, crash recovery, and ~25x throughput over baseline C++ implementation.",
    tags: ["Python", "LSM-tree", "WAL", "TCP", "Docker", "Pytest"],
    repo: "AshrafAhmed9/kv-store",
  },
  {
    title: "ClearText API — Async AI Inference Platform",
    description:
      "Scalable distributed ML inference backend handling 231 RPS with sub-110ms latency under 500 concurrent users, with async task queue reducing response time from ~1600ms to under 5ms.",
    tags: ["FastAPI", "Redis", "PostgreSQL", "Celery", "Groq LLM"],
    repo: "AshrafAhmed9/cleartext-api",
  },
  {
    title: "Authentication & RBAC API — Secure Identity Service",
    description:
      "Production-ready authentication service with JWT auth, fine-grained role-based access control, rate limiting, graceful shutdown, and 14 unit tests with automated CI/CD.",
    tags: ["Go", "Gin", "JWT", "Docker"],
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
