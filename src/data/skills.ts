import {
  SiPython, SiCplusplus, SiFastapi, SiCelery, SiPostgresql,
  SiRedis, SiDocker, SiGit, SiPytorch, SiGo, SiSqlite,
  SiSpringboot, SiApachekafka, SiTypescript,
  SiMongodb, SiGithubactions, SiPytest, SiJsonwebtokens,
  SiUltralytics, SiNvidia, SiC, SiJavascript,
} from "react-icons/si";
import {
  Network, Zap, Waves, Database, ListTodo, Timer,
  Binary, Boxes, Activity, Cpu, ShieldCheck,
  Infinity, Monitor, Globe, BarChart3, Cloud, Component,
  BookOpen, Lightbulb, Coffee, Link, Bug,
  FlaskConical,
} from "lucide-react";
import type { IconType } from "react-icons";
import type { LucideIcon } from "lucide-react";

export interface Skill {
  name: string;
  Icon: IconType | LucideIcon;
}

export interface SkillGroup {
  category: string;
  skills: Skill[];
}

export const skillGroups: SkillGroup[] = [
  {
    category: "Languages",
    skills: [
      { name: "Python", Icon: SiPython },
      { name: "Go", Icon: SiGo },
      { name: "Java", Icon: Coffee },
      { name: "C", Icon: SiC },
      { name: "C++", Icon: SiCplusplus },
      { name: "JavaScript", Icon: SiJavascript },
      { name: "TypeScript", Icon: SiTypescript },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "FastAPI", Icon: SiFastapi },
      { name: "Spring Boot", Icon: SiSpringboot },
      { name: "Gin", Icon: SiGo },
      { name: "gRPC", Icon: Network },
      { name: "Kafka", Icon: SiApachekafka },
      { name: "REST APIs", Icon: Link },
      { name: "OAuth2", Icon: ShieldCheck },
      { name: "JWT", Icon: SiJsonwebtokens },
      { name: "Celery", Icon: SiCelery },
      { name: "Async Processing", Icon: Zap },
      { name: "Event-Driven Architecture", Icon: Network },
    ],
  },
  {
    category: "Databases & Storage",
    skills: [
      { name: "PostgreSQL", Icon: SiPostgresql },
      { name: "Redis", Icon: SiRedis },
      { name: "MongoDB", Icon: SiMongodb },
      { name: "SQLite", Icon: SiSqlite },
      { name: "LSM-tree", Icon: Database },
      { name: "WAL", Icon: Database },
    ],
  },
  {
    category: "Systems",
    skills: [
      { name: "Distributed Systems", Icon: Network },
      { name: "Raft Consensus", Icon: Network },
      { name: "Caching", Icon: Database },
      { name: "Rate Limiting", Icon: Timer },
      { name: "Task Queues", Icon: ListTodo },
      { name: "Stream Processing", Icon: Waves },
      { name: "Observability", Icon: Monitor },
      { name: "Concurrency", Icon: Zap },
      { name: "Fault Tolerance", Icon: ShieldCheck },
    ],
  },
  {
    category: "Tools",
    skills: [
      { name: "Docker", Icon: SiDocker },
      { name: "GitHub Actions", Icon: SiGithubactions },
      { name: "AWS Lambda", Icon: Cloud },
      { name: "Locust", Icon: Bug },
      { name: "Pytest", Icon: SiPytest },
      { name: "Git", Icon: SiGit },
      { name: "OpenAI API", Icon: Cpu },
    ],
  },
  {
    category: "Core",
    skills: [
      { name: "DSA", Icon: Binary },
      { name: "System Design", Icon: Boxes },
      { name: "Performance Benchmarking", Icon: BarChart3 },
      { name: "Load Testing", Icon: Activity },
    ],
  },
  {
    category: "ML / AI",
    skills: [
      { name: "BERT", Icon: Cpu },
      { name: "YOLOv8", Icon: SiUltralytics },
      { name: "CUDA", Icon: SiNvidia },
      { name: "PyTorch", Icon: SiPytorch },
      { name: "LSTM", Icon: Waves },
      { name: "LLM Serving", Icon: Cpu },
      { name: "KV Caching", Icon: Database },
      { name: "Quantization (INT8/INT4)", Icon: Binary },
      { name: "LoRA Fine-Tuning", Icon: FlaskConical },
      { name: "Vector Search (HNSW)", Icon: Network },
      { name: "Model Evaluation", Icon: FlaskConical },
      { name: "MLOps", Icon: Infinity },
      { name: "Drift Monitoring (PSI)", Icon: BarChart3 },
      { name: "MCP", Icon: Component },
    ],
  },
];
