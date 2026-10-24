export const profile = {
  name: "K Ashraf Ahmed",
  email: "ashrafahmed1232@gmail.com",
  tagline: "AI Systems & Backend Engineer.",
  credibility: "12 merged PRs across 8 open-source repositories, including Zalando Skipper, CNCF etcd and CALL-E.",
  availability: "Associate Software Engineer @ The Jobs Jungle · Bengaluru, India · open to AI engineering, forward deployed and AI infrastructure roles",
  bio: "Software engineer in Bengaluru working on AI systems and the backends under them. At The Jobs Jungle I build AI features for an applicant-tracking product in Java and Spring Boot: a voice interviewer, a candidate-sourcing pipeline and the cost tracking around our LLM calls. On my own time I build infrastructure from first principles: Kiln, an LLM inference engine in C++ and CUDA, and Consensa, a distributed vector database in Go with hand-written Raft. I also contribute to Zalando Skipper, CNCF etcd and CALL-E.",
  experience: {
    company: "The Jobs Jungle",
    role: "Associate Software Engineer",
    location: "Bengaluru, India",
    period: "Aug 2026 – Present",
    bullets: [
      "Shipped two paid AI features for recruiting agencies: a voice interviewer where OpenAI writes the questions and scores each answer, with guardrails that keep accent, age and other protected traits out of the score, and an LLM pipeline that searches the web and ranks candidates for a job.",
      "Gave the team its first view of LLM spend by tracking tokens and estimated cost across 8 LLM call sites, and added prompt caching where identical requests were being re-sent.",
      "Cut extra database lookups per application page from 40 to 2 and job-list payloads by 46%, built candidate data retention and erasure across 14 record types, and fixed 5 production security vulnerabilities.",
    ],
  },
  education: {
    institution: "New Horizon College of Engineering, Bengaluru",
    degree: "B.E in Computer Science and Engineering",
    period: "Nov 2022 – July 2026",
    gpa: "7.71",
    coursework:
      "Data Structures & Algorithms, Design & Analysis of Algorithms, Operating Systems, Computer Networks, Database Management Systems, Linux System Programming, Computer Architecture (ARM), Machine Learning, Generative AI, Cloud Architecture & Security",
  },
  publications: [
    'IEEE ASIACONF 2026 — "Lightweight Radar-Camera Fusion for Real-Time Drone Detection and Trajectory Prediction" (peer-reviewed): confidence-weighted late fusion of YOLOv8n with radar-inspired features lifted precision 0.91 → 0.94 at 8.3 FPS CPU-only inference.',
    'IEEE C2I6 2025 — "Lightweight Real-Time Drone Detection and Trajectory Forecasting Using YOLOv8 and LSTM Networks" (peer-reviewed): mAP 0.89 at ~9 FPS CPU-only inference.',
  ],
  resumeUrl: "/Ashraf_Ahmed_Software_Engineer.pdf",
  socials: [
    {
      name: "GitHub",
      url: "https://github.com/AshrafAhmed9",
      hidden: false,
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/k-ashraf-ahmed-648107335/",
      hidden: false,
    },
    {
      name: "LeetCode",
      url: "https://leetcode.com/u/Ashraf_Ahmed12/",
      hidden: true,
    },
  ],
};
