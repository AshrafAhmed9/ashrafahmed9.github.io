"use client";

import { skillGroups } from "@/data/skills";
import { motion } from "framer-motion";

const allSkills = skillGroups.flatMap((g) => g.skills);

function shuffled<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.abs((seed * (i + 1) * 9301 + 49297) % a.length);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const rows = Array.from({ length: 2 }, (_, i) => {
  const skills = shuffled(allSkills, i + 1);
  return [...skills, ...skills, ...skills];
});

const durations = [80, 100];

export function Skills() {
  return (
    <section className="py-24 overflow-hidden">
      <div className="mx-auto max-w-5xl px-6">
        <motion.h2
          className="font-heading text-3xl font-bold tracking-tight sm:text-4xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Skills & Tech Stack
        </motion.h2>
      </div>

      <div className="mt-12 flex flex-col gap-8">
        {rows.map((row, ri) => (
          <div
            key={ri}
            className="flex w-max gap-4"
            style={{
              animation: `skill-scroll-${ri % 2 === 0 ? "left" : "right"} ${durations[ri]}s linear infinite`,
            }}
          >
            {row.map((skill, si) => (
              <div
                key={`${ri}-${si}`}
                className="flex shrink-0 items-center gap-4 rounded-2xl border border-border/60 bg-card px-10 py-6 text-2xl font-semibold text-foreground shadow-sm transition-colors hover:border-border"
              >
                <skill.Icon className="h-10 w-10 text-muted-foreground" />
                {skill.name}
              </div>
            ))}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes skill-scroll-left {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
        @keyframes skill-scroll-right {
          from { transform: translateX(-33.333%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}
