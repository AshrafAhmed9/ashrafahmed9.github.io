import {
  SiPython, SiCplusplus, SiFastapi, SiCelery, SiPostgresql,
  SiRedis, SiDocker, SiGit, SiPytorch, SiGo, SiSqlite,
} from "react-icons/si";
import {
  Network, Zap, Waves, Database, ListTodo, Timer,
  Binary, Boxes, Activity, Eye, Cpu, ShieldCheck,
  Infinity, Monitor, Globe, BarChart3, Cloud, Component,
  BookOpen, Lightbulb, Coffee, Link, GitBranch, Bug,
  FlaskConical, TestTube,
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
      { name: "C++", Icon: SiCplusplus },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "FastAPI", Icon: SiFastapi },
      { name: "Gin", Icon: SiGo },
      { name: "REST APIs", Icon: Link },
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
      { name: "GitHub Actions", Icon: GitBranch },
      { name: "AWS EC2", Icon: Cloud },
      { name: "Locust", Icon: Bug },
      { name: "Pytest", Icon: TestTube },
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
      { name: "YOLO", Icon: Eye },
      { name: "RAMP-CNN", Icon: Activity },
      { name: "CUDA", Icon: Cpu },
      { name: "PyTorch", Icon: SiPytorch },
    ],
  },
];
