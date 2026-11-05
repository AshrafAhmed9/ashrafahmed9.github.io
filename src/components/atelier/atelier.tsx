"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { FileText } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { contributions } from "@/data/contributions";
import { LAST, chapters, scrollProgress } from "./journey";
import { Content, GitHubButton, btnAccent, mono } from "./content";
import { ReadmePanel } from "./readme-panel";
import type { Tip } from "./scene";

// three.js needs `window` and WebGL, so the scene is client-only and ships
// as a separate chunk. The text content never waits for it.
const Scene = dynamic(() => import("./scene"), { ssr: false });

const linkedin = profile.socials.find((s) => s.name === "LinkedIn");
const navItems = chapters.slice(1);

// Browser-only facts read through useSyncExternalStore: the server render
// (static export) sees `false`, the client sees the real value on hydration.
const noop = () => () => {};
const serverFalse = () => false;
let webglCache: boolean | undefined;
function hasWebGL() {
  if (webglCache === undefined) {
    const c = document.createElement("canvas");
    webglCache = !!(c.getContext("webgl2") || c.getContext("webgl"));
  }
  return webglCache;
}

function useMedia(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    serverFalse,
  );
}

export function Atelier() {
  // Scroll progress is read by the render loop every frame, so it lives in a
  // ref; putting it in state would re-render the page on every scroll event.
  const progress = useRef(0);
  const tipEl = useRef<HTMLDivElement>(null);

  const webgl = useSyncExternalStore(noop, hasWebGL, serverFalse);
  const reduced = useMedia("(prefers-reduced-motion: reduce)");
  const compact = useMedia("(max-width: 767px)");
  const [sceneReady, setSceneReady] = useState(false);
  const [current, setCurrent] = useState(0);
  const [readme, setReadme] = useState<string | null>(null);
  const [tip, setTip] = useState<Tip | null>(null);

  // "focus" follows the item in the middle of the screen while scrolling;
  // "hover" wins while the pointer is on a card or a 3D object.
  const [focusProject, setFocusProject] = useState<number | null>(null);
  const [hoverProject, setHoverProject] = useState<number | null>(null);
  const [focusCoin, setFocusCoin] = useState<number | null>(null);
  const [hoverCoin, setHoverCoin] = useState<number | null>(null);
  const [focusCategory, setFocusCategory] = useState<string | null>(null);
  const [hoverCategory, setHoverCategory] = useState<string | null>(null);

  const project = hoverProject ?? focusProject;
  const coin = hoverCoin ?? focusCoin;
  const category = hoverCategory ?? focusCategory;

  // Scroll position → camera progress and the active nav item.
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-station]"));
    const update = () => {
      progress.current = scrollProgress(sections);
      const c = Math.round(progress.current * LAST);
      setCurrent((prev) => (prev === c ? prev : c));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // The card crossing the middle band of the screen becomes the 3D focus.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const raw = (e.target as HTMLElement).dataset.focus ?? "";
          const sep = raw.indexOf(":");
          const kind = raw.slice(0, sep);
          const value = raw.slice(sep + 1);
          if (kind === "project") setFocusProject(Number(value));
          else if (kind === "coin") setFocusCoin(Number(value));
          else if (kind === "category") setFocusCategory(value);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    document.querySelectorAll("[data-focus]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // The tooltip tracks the cursor through a ref so pointer moves never re-render.
  useEffect(() => {
    const move = (e: PointerEvent) => {
      tipEl.current?.style.setProperty("transform", `translate(${e.clientX + 18}px, ${e.clientY + 18}px)`);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  // 3D objects are links: a slab opens its repo, a coin opens its PR.
  const onPickProject = useCallback((i: number) => {
    window.open(`https://github.com/${projects[i].repo}`, "_blank", "noopener,noreferrer");
  }, []);
  const onPickCoin = useCallback((i: number) => {
    window.open(contributions[i].url, "_blank", "noopener,noreferrer");
  }, []);
  const closeReadme = useCallback(() => setReadme(null), []);
  const onSceneReady = useCallback(() => setSceneReady(true), []);

  return (
    <div className="relative isolate min-h-screen bg-[#050507] text-[#f4eee1]">
      <div
        aria-hidden
        className={cn(
          "fixed inset-0 z-0 transition-opacity duration-[1500ms]",
          sceneReady ? "opacity-100" : "opacity-0",
        )}
      >
        {webgl && (
          <Scene
            progress={progress}
            reduced={reduced}
            compact={compact}
            project={project}
            setHoverProject={setHoverProject}
            onPickProject={onPickProject}
            coin={coin}
            setHoverCoin={setHoverCoin}
            onPickCoin={onPickCoin}
            category={category}
            setTip={setTip}
            onReady={onSceneReady}
          />
        )}
      </div>

      {/* Scrims: darken behind the text column (desktop) or everything (phone). */}
      <div aria-hidden className="pointer-events-none fixed inset-y-0 left-0 z-[1] hidden w-[62%] bg-gradient-to-r from-[#050507]/85 via-[#050507]/50 to-transparent md:block" />
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[1] bg-[#050507]/45 md:hidden" />

      <TopBar current={current} />
      <Rail current={current} />

      <div className="relative z-[2]">
        <Content
          project={project}
          setHoverProject={setHoverProject}
          coin={coin}
          setHoverCoin={setHoverCoin}
          category={category}
          setHoverCategory={setHoverCategory}
          openReadme={setReadme}
        />
      </div>

      <ReadmePanel repo={readme} onClose={closeReadme} />

      <div ref={tipEl} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[70]">
        <div
          className={cn(
            "max-w-xs rounded-lg border border-[#d9b36c]/40 bg-[#0a0a0d]/95 px-3 py-2 transition-opacity duration-150",
            tip ? "opacity-100" : "opacity-0",
          )}
        >
          <p className="font-heading text-sm text-[#f4eee1]">{tip?.title}</p>
          {tip?.sub && (
            <p className={cn(mono, "mt-0.5 text-[10px] uppercase tracking-[0.16em] text-[#d9b36c]")}>{tip.sub}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function TopBar({ current }: { current: number }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#d9b36c]/10 bg-[#050507]/75 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 px-5 py-3 md:px-[6vw]">
        <a
          href="#top"
          aria-label={`${profile.name}, back to top`}
          className={cn(
            mono,
            "flex size-9 shrink-0 items-center justify-center rounded-full border border-[#d9b36c]/60 text-[11px] tracking-widest text-[#d9b36c] hover:bg-[#d9b36c] hover:text-[#050507]",
          )}
        >
          KA
        </a>
        <nav aria-label="Sections" className="hidden lg:block">
          <ul className={cn(mono, "flex items-center gap-7 text-[11px] uppercase tracking-[0.2em]")}>
            {navItems.map((c, i) => (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  aria-current={current === i + 1 ? "true" : undefined}
                  className={cn(
                    "transition-colors hover:text-[#d9b36c]",
                    current === i + 1 ? "text-[#d9b36c]" : "text-[#f4eee1]/65",
                  )}
                >
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Phones show icons only for these two so all three fit in the bar. */}
          {linkedin && (
            <a href={linkedin.url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={cn(btnAccent, "px-2.5 py-1.5 text-sm sm:px-3.5")}>
              <FaLinkedin className="size-4" />
              <span className="max-sm:hidden">LinkedIn</span>
            </a>
          )}
          <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" aria-label="Resume" className={cn(btnAccent, "px-2.5 py-1.5 text-sm sm:px-3.5")}>
            <FileText className="size-4" />
            <span className="max-sm:hidden">Resume</span>
          </a>
          <GitHubButton size="sm" label="GitHub" />
        </div>
      </div>
      {/* Below lg the section links become a swipeable strip. */}
      <nav aria-label="Sections" className="overflow-x-auto border-t border-[#d9b36c]/10 [scrollbar-width:none] lg:hidden">
        <ul className={cn(mono, "flex w-max gap-5 px-5 py-2.5 text-[11px] uppercase tracking-[0.18em]")}>
          {navItems.map((c, i) => (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                className={current === i + 1 ? "text-[#d9b36c]" : "text-[#f4eee1]/65"}
              >
                {c.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

function Rail({ current }: { current: number }) {
  return (
    <nav aria-hidden className="fixed right-[2.4vw] top-1/2 z-40 hidden -translate-y-1/2 xl:block">
      <ul className="flex flex-col items-end gap-3.5">
        {chapters.map((c, i) => (
          <li key={c.id}>
            <a href={`#${c.id}`} tabIndex={-1} className="group flex items-center gap-3">
              <span
                className={cn(
                  mono,
                  "text-[10px] uppercase tracking-[0.22em] opacity-0 transition-opacity group-hover:opacity-100",
                  current === i ? "text-[#d9b36c]" : "text-[#f4eee1]/60",
                )}
              >
                {c.label}
              </span>
              <span
                className={cn(
                  "block rounded-full border transition-all duration-500",
                  current === i
                    ? "size-2.5 border-[#d9b36c] bg-[#d9b36c] shadow-[0_0_12px_#d9b36c]"
                    : "size-2 border-[#f4eee1]/40 group-hover:border-[#d9b36c]",
                )}
              />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
