"use client";

import { useEffect, useRef, useState } from "react";
import { skillGroups } from "@/data/skills";
import { motion } from "framer-motion";

export function Skills() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [autoScrolling, setAutoScrolling] = useState(true);

  // Auto-scrolls the row slowly until the user takes over — any manual
  // scroll, drag, or touch cancels it permanently rather than fighting
  // the user's own input. The scrollbar stays hidden while this drives the
  // motion, then reappears once the user is in control themselves.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let raf = 0;
    let stopped = false;

    const stop = () => {
      stopped = true;
      setAutoScrolling(false);
      cancelAnimationFrame(raf);
      el.removeEventListener("wheel", stop);
      el.removeEventListener("touchstart", stop);
      el.removeEventListener("pointerdown", stop);
    };

    el.addEventListener("wheel", stop, { passive: true });
    el.addEventListener("touchstart", stop, { passive: true });
    el.addEventListener("pointerdown", stop, { passive: true });

    const speed = 0.4; // px per frame, ~24px/s
    // scrollLeft rounds to an integer on every write, so reading it back and
    // re-adding a sub-pixel delta each frame never accumulates — track the
    // true position ourselves and only write the rounded value out.
    let position = el.scrollLeft;
    const step = () => {
      if (stopped) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      position = position >= max ? 0 : position + speed;
      el.scrollLeft = position;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    return () => {
      stop();
    };
  }, []);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <motion.h2
          className="font-heading text-3xl font-bold tracking-tight sm:text-4xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Skills &amp; Tech Stack
        </motion.h2>
      </div>

      <div className="relative mt-10">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent sm:w-24" />

        <div
          ref={scrollerRef}
          className={`overflow-x-auto pb-6 ${autoScrolling ? "scrollbar-none" : "skills-scrollbar"}`}
        >
          <div className="flex w-max items-stretch gap-6 px-6 sm:px-10">
            {skillGroups.map((group) => (
              <div
                key={group.category}
                className="glass-card flex shrink-0 flex-col items-center rounded-2xl border border-border/60 bg-card p-7 sm:p-8"
                style={{ width: `${Math.min(760, Math.max(340, group.skills.length * 120))}px` }}
              >
                <span className="font-[family-name:var(--font-ibm-plex-mono)] text-base font-bold uppercase tracking-[0.2em] text-primary">
                  {group.category}
                </span>

                <div className="mt-5 flex flex-1 flex-wrap content-start justify-center gap-3">
                  {group.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="flex items-center gap-3 rounded-full border border-border/60 bg-background/40 px-6 py-3.5 text-lg font-medium text-foreground transition-colors hover:border-primary/60"
                    >
                      <skill.Icon className="h-6 w-6 shrink-0 text-muted-foreground" />
                      {skill.name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
