import {
  SiPython, SiCplusplus, SiFastapi, SiCelery, SiPostgresql,
  SiRedis, SiDocker, SiGit, SiPytorch, SiGo, SiSqlite,
  SiSpringboot, SiApachekafka, SiTypescript, SiKubernetes,
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
      { name: "Kubernetes", Icon: SiKubernetes },
      { name: "GitHub Actions", Icon: SiGithubactions },
      { name: "AWS EC2", Icon: Cloud },
      { name: "Locust", Icon: Bug },
      { name: "Pytest", Icon: SiPytest },
      { name: "Git", Icon: SiGit },
      { name: "Groq LLM", Icon: Cpu },
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
      { name: "Model Serving", Icon: Cpu },
      { name: "Model Evaluation", Icon: FlaskConical },
      { name: "MLOps", Icon: Infinity },
      { name: "Drift Monitoring (PSI)", Icon: BarChart3 },
      { name: "MCP", Icon: Component },
    ],
  },
];
