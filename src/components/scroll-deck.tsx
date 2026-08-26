"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { PhaseTree, TreeItem } from "@/components/phase-tree";
import { ReadmeDialog } from "@/components/readme-dialog";
import { contributions } from "@/data/contributions";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";

type Phase = "Open Source" | "Work Experience" | "Personal Projects";

// Real data only — this deck is a presentation layer over the same
// contributions/projects/profile data the rest of the site uses, not a
// separate mock content set.
const openSourceItems: TreeItem[] = contributions.map((c) => ({
  title: c.title,
  description: c.description,
  meta: [c.repo, `PR #${c.pr}`, c.lines],
  externalLink: { label: "View PR", href: c.url },
}));

const workItems: TreeItem[] = [
  {
    title: `${profile.experience.role} — ${profile.experience.company}`,
    subtitle: `${profile.experience.location} · ${profile.experience.period}`,
    description: profile.experience.bullets.join(" "),
    meta: [
      "Java 17",
      "Spring Boot 3",
      "MongoDB",
      "JWT + OAuth2",
      "JUnit",
      "OpenAPI",
    ],
  },
];

const projectItems: TreeItem[] = projects.map((p) => ({
  title: p.title,
  description: p.description,
  meta: p.tags,
  repo: p.repo,
  liveUrl: p.liveUrl,
}));

const panels: { phase: Phase; items: TreeItem[] }[] = [
  { phase: "Open Source", items: openSourceItems },
  { phase: "Work Experience", items: workItems },
  { phase: "Personal Projects", items: projectItems },
];
const phases: Phase[] = panels.map((p) => p.phase);
const slug = (phase: Phase) => `phase-${phase.toLowerCase().replace(/\s+/g, "-")}`;

function PhaseSection({
  phase,
  items,
  index,
  onOpenReadme,
  onActive,
}: {
  phase: Phase;
  items: TreeItem[];
  index: number;
  onOpenReadme: (repo: string) => void;
  onActive: (phase: Phase) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });

  useEffect(() => {
    if (inView) onActive(phase);
  }, [inView, phase, onActive]);

  return (
    <motion.div
      ref={ref}
      id={slug(phase)}
      // The "stacking card" motion: each phase arrives scaled down, tilted
      // back, and offset, then settles flat as it scrolls into place. A
      // negative top margin plus increasing z-index (below) makes it glide
      // up over the tail of the previous section instead of just appearing —
      // without pinning/locking scroll the way a true scroll-jacked stack does.
      initial={{ opacity: 0, y: 100, scale: 0.9, rotateX: -8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ zIndex: index, transformOrigin: "top center" }}
      className={`scroll-mt-32 rounded-2xl py-8 ${index > 0 ? "-mt-16" : ""}`}
    >
      <PhaseTree phase={phase} items={items} onOpenReadme={onOpenReadme} />
    </motion.div>
  );
}

export function ScrollDeck() {
  const [readmeRepo, setReadmeRepo] = useState<string | null>(null);
  const [activePhase, setActivePhase] = useState<Phase>("Open Source");

  const jumpToPhase = (phase: Phase) => {
    document.getElementById(slug(phase))?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="work" className="relative w-full py-16">
      <div className="sticky top-6 z-30 mx-auto flex w-fit gap-2 rounded-full border border-border/60 bg-card/80 p-2 backdrop-blur-md">
        {phases.map((phase) => (
          <button
            key={phase}
            onClick={() => jumpToPhase(phase)}
            className="relative rounded-full px-7 py-3 font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider transition-colors sm:text-base"
          >
            {activePhase === phase && (
              <motion.span
                layoutId="deck-tab-indicator"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <span
              className={`relative z-10 ${
                activePhase === phase ? "text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {phase}
            </span>
          </button>
        ))}
      </div>

      <div className="mx-auto mt-10 max-w-5xl px-4 [perspective:1200px] sm:px-6">
        {panels.map((panel, i) => (
          <PhaseSection
            key={panel.phase}
            phase={panel.phase}
            items={panel.items}
            index={i}
            onOpenReadme={setReadmeRepo}
            onActive={setActivePhase}
          />
        ))}
      </div>

      <ReadmeDialog
        repo={readmeRepo ?? ""}
        open={readmeRepo !== null}
        onOpenChange={(open) => {
          if (!open) setReadmeRepo(null);
        }}
      />
    </section>
  );
}
