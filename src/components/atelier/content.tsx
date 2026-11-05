"use client";

import type { ReactNode } from "react";
import { ArrowUpRight, BookOpen, ExternalLink, FileText, Mail } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import { contributions } from "@/data/contributions";
import { projectName, projectSubtitle } from "./textures";

export const mono = "font-[family-name:var(--font-ibm-plex-mono)]";

// Same tech list the classic site shows under the work-experience entry.
const workStack = ["Java 17", "Spring Boot 3", "MongoDB", "JWT + OAuth2", "JUnit", "OpenAPI"];

// Headline figures, taken word for word from the experience bullets below.
const workStats = [
  { big: "40 → 2", small: "extra database lookups per application page" },
  { big: "−46%", small: "job-list payload size" },
  { big: "8", small: "LLM call sites with token and cost tracking" },
  { big: "5", small: "production security vulnerabilities fixed" },
];

const github = profile.socials.find((s) => s.name === "GitHub");
const linkedin = profile.socials.find((s) => s.name === "LinkedIn");

/* ------------------------------- primitives ------------------------------- */

function Section({
  id,
  index,
  children,
  className,
}: {
  id: string;
  index: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      data-station={index}
      className={cn(
        // The section spans the full width but only its text column takes
        // pointer events, so the 3D showpiece on the right stays hoverable.
        "pointer-events-none relative flex min-h-[100svh] scroll-mt-24 flex-col justify-center px-5 py-28 md:px-[6vw]",
        className,
      )}
    >
      <div className="pointer-events-auto w-full max-w-[44rem]">{children}</div>
    </section>
  );
}

function Heading({ n, label, title, lede }: { n: string; label: string; title: string; lede?: ReactNode }) {
  return (
    <header className="mb-8">
      <p className={cn(mono, "mb-3 text-xs uppercase tracking-[0.28em] text-[#d9b36c]")}>
        {n} · {label}
      </p>
      <h2 className="font-heading text-[clamp(2.4rem,5vw,3.8rem)] leading-[1.04] text-[#f4eee1]">
        {title}
      </h2>
      {lede && <p className="mt-4 text-lg leading-relaxed text-[#f4eee1]/75">{lede}</p>}
    </header>
  );
}

// Every block of text sits on a near-opaque panel so the 3D never competes with it.
function Card({
  children,
  lit,
  className,
  ...rest
}: { children: ReactNode; lit?: boolean; className?: string } & React.ComponentProps<"article">) {
  return (
    <article
      {...rest}
      className={cn(
        "scroll-mt-28 rounded-2xl border bg-[#0a0a0d]/85 p-6 backdrop-blur-md transition-[border-color,box-shadow] duration-500 md:p-7",
        lit
          ? "border-[#d9b36c]/60 shadow-[0_0_0_1px_rgba(217,179,108,0.25),0_0_40px_-10px_rgba(217,179,108,0.45)]"
          : "border-[#d9b36c]/15",
        className,
      )}
    >
      {children}
    </article>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <li className={cn(mono, "rounded-full border border-[#d9b36c]/30 px-3 py-1 text-xs text-[#e9d3a2]")}>
      {children}
    </li>
  );
}

const btnBase =
  "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f1dba8]";
const btnGold = `${btnBase} border border-[#d9b36c] bg-[#d9b36c] text-[#050507] hover:bg-[#f1dba8]`;
const btnGhost = `${btnBase} border border-[#d9b36c]/45 text-[#f4eee1] hover:border-[#d9b36c] hover:text-[#d9b36c]`;

function ExtLink({ href, className, children }: { href: string; className: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}

/* --------------------------------- content -------------------------------- */

export interface ContentProps {
  project: number | null;
  setHoverProject: (i: number | null) => void;
  coin: number | null;
  setHoverCoin: (i: number | null) => void;
  category: string | null;
  setHoverCategory: (c: string | null) => void;
  openReadme: (repo: string) => void;
}

export function Content(p: ContentProps) {
  const { experience: xp, education: edu } = profile;

  return (
    <main className="relative">
      {/* ------------------------------- Intro ------------------------------- */}
      <Section id="top" index={0} className="pt-32">
        <p className={cn(mono, "text-xs uppercase tracking-[0.3em] text-[#d9b36c]")}>
          {"// Backend & ML Systems Engineer"}
        </p>
        <h1 className="font-heading mt-5 text-[clamp(3.2rem,8vw,6.4rem)] leading-[0.95] text-[#f4eee1]">
          {profile.name}
        </h1>
        <p className="font-heading mt-4 text-[clamp(1.35rem,2.4vw,1.9rem)] italic text-[#d9b36c]">
          {profile.tagline}
        </p>
        <p className="mt-6 text-xl leading-relaxed text-[#f4eee1]">{profile.credibility}</p>
        <p className="mt-3 text-base leading-relaxed text-[#f4eee1]/70">{profile.availability}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#work" className={btnGold}>View Work</a>
          <a href={`mailto:${profile.email}`} className={btnGhost}>
            <Mail className="size-4" /> Get in Touch
          </a>
        </div>
        <div className="mt-3 flex flex-wrap gap-3">
          {github && (
            <ExtLink href={github.url} className={btnGhost}>
              <SiGithub className="size-4" /> GitHub
            </ExtLink>
          )}
          {linkedin && (
            <ExtLink href={linkedin.url} className={btnGhost}>
              <FaLinkedin className="size-4" /> LinkedIn
            </ExtLink>
          )}
          <ExtLink href={profile.resumeUrl} className={btnGhost}>
            <FileText className="size-4" /> Resume
          </ExtLink>
        </div>

        {/* For a recruiter skimming: the essentials without scrolling. */}
        <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[#d9b36c]/20 bg-[#d9b36c]/20 sm:grid-cols-2">
          {[
            { k: "Current role", v: `${xp.role}, ${xp.company} · ${xp.period}` },
            { k: "Education", v: `${edu.degree}, ${edu.institution} · ${edu.period}` },
            { k: "Publications & awards", v: "2 peer-reviewed IEEE papers · 3rd place, Global Innovation Build Challenge V2" },
            { k: "Email", v: profile.email, href: `mailto:${profile.email}` },
          ].map((row) => (
            <div key={row.k} className="bg-[#0a0a0d]/90 p-4 backdrop-blur-md">
              <dt className={cn(mono, "text-[11px] uppercase tracking-[0.22em] text-[#d9b36c]")}>{row.k}</dt>
              <dd className="mt-1.5 text-[15px] leading-snug text-[#f4eee1]/90">
                {row.href ? (
                  <a href={row.href} className="underline decoration-[#d9b36c]/50 underline-offset-4 hover:text-[#d9b36c]">
                    {row.v}
                  </a>
                ) : (
                  row.v
                )}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <div id="work" className="scroll-mt-24">
        {/* ---------------------------- Open source ---------------------------- */}
        <Section id="opensource" index={1}>
          <Heading n="01" label="Open Source" title="Merged upstream." lede={profile.credibility} />
          <div className="space-y-4">
            {contributions.map((c, i) => (
              <Card
                key={c.url}
                id={`pr-${i}`}
                data-focus={`coin:${i}`}
                lit={p.coin === i}
                onMouseEnter={() => p.setHoverCoin(i)}
                onMouseLeave={() => p.setHoverCoin(null)}
              >
                <h3 className="font-heading text-2xl leading-snug text-[#f4eee1]">{c.title}</h3>
                <p className={cn(mono, "mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#d9b36c]")}>
                  <span>{c.repo}</span>
                  <span aria-hidden>·</span>
                  <span>PR #{c.pr}</span>
                  <span aria-hidden>·</span>
                  <span>{c.lines}</span>
                  <span aria-hidden>·</span>
                  <span>{c.stars} stars</span>
                </p>
                <p className="mt-3 text-base leading-relaxed text-[#f4eee1]/80">{c.description}</p>
                <ExtLink href={c.url} className={cn(btnGhost, "mt-4 px-4 py-2 text-sm")}>
                  View PR <ArrowUpRight className="size-4" />
                </ExtLink>
              </Card>
            ))}
          </div>
        </Section>

        {/* ----------------------------- Experience ---------------------------- */}
        <Section id="experience" index={2}>
          <Heading n="02" label="Work Experience" title={xp.role} />
          <Card lit>
            <p className="font-heading text-2xl text-[#f4eee1]">
              {xp.company}
              <span className="text-[#f4eee1]/55"> — {xp.companyDescription}</span>
            </p>
            <p className={cn(mono, "mt-1 text-xs uppercase tracking-[0.18em] text-[#d9b36c]")}>
              {xp.location} · {xp.period}
            </p>
            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5">
              {workStats.map((s) => (
                <div key={s.big} className="border-t border-[#d9b36c]/30 pt-3">
                  <dt className="font-heading text-[clamp(1.8rem,3vw,2.4rem)] leading-none text-[#d9b36c]">{s.big}</dt>
                  <dd className="mt-2 text-sm leading-snug text-[#f4eee1]/70">{s.small}</dd>
                </div>
              ))}
            </dl>
            <ul className="mt-7 space-y-3">
              {xp.bullets.map((b) => (
                <li key={b} className="flex gap-3 text-base leading-relaxed text-[#f4eee1]/85">
                  <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rotate-45 bg-[#d9b36c]" />
                  {b}
                </li>
              ))}
            </ul>
            <ul className="mt-6 flex flex-wrap gap-2">
              {workStack.map((t) => <Chip key={t}>{t}</Chip>)}
            </ul>
          </Card>
        </Section>

        {/* ------------------------------ Projects ----------------------------- */}
        <Section id="projects" index={3}>
          <Heading n="03" label="Personal Projects" title="Selected work." />
          <div className="space-y-4">
            {projects.map((pr, i) => (
              <Card
                key={pr.title}
                id={`project-${i}`}
                data-focus={`project:${i}`}
                lit={p.project === i}
                onMouseEnter={() => p.setHoverProject(i)}
                onMouseLeave={() => p.setHoverProject(null)}
              >
                <p className={cn(mono, "text-xs text-[#d9b36c]")}>{String(i + 1).padStart(2, "0")}</p>
                <h3 className="font-heading mt-1 text-[1.7rem] leading-tight text-[#f4eee1]">{projectName(pr)}</h3>
                <p className="font-heading text-lg italic text-[#d9b36c]">{projectSubtitle(pr)}</p>
                <p className="mt-3 text-base leading-relaxed text-[#f4eee1]/80">{pr.description}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {pr.tags.map((t) => <Chip key={t}>{t}</Chip>)}
                </ul>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  <ExtLink href={`https://github.com/${pr.repo}`} className={cn(btnGhost, "px-4 py-2 text-sm")}>
                    <SiGithub className="size-4" /> Repository
                  </ExtLink>
                  {pr.liveUrl && (
                    <ExtLink href={pr.liveUrl} className={cn(btnGhost, "px-4 py-2 text-sm")}>
                      <ExternalLink className="size-4" /> Live
                    </ExtLink>
                  )}
                  <button onClick={() => p.openReadme(pr.repo)} className={cn(btnGhost, "px-4 py-2 text-sm")}>
                    <BookOpen className="size-4" /> README
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </Section>
      </div>

      {/* ------------------------------- Skills ------------------------------ */}
      <Section id="skills" index={4}>
        <Heading
          n="04"
          label="Skills & Tech Stack"
          title="The stack, in orbit."
          lede={
            <>
              Each ring on the right is one group below. Hover a group to light up its
              ring<span className="max-md:hidden">, or hover a gem to read its name</span>.
            </>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {skillGroups.map((g) => (
            <Card
              key={g.category}
              data-focus={`category:${g.category}`}
              lit={p.category === g.category}
              onMouseEnter={() => p.setHoverCategory(g.category)}
              onMouseLeave={() => p.setHoverCategory(null)}
              className={cn(g.skills.length > 9 && "sm:col-span-2")}
            >
              <h3 className={cn(mono, "text-sm font-medium uppercase tracking-[0.2em] text-[#d9b36c]")}>
                {g.category}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {g.skills.map((s) => (
                  <li
                    key={s.name}
                    className="flex items-center gap-2 rounded-full border border-[#f4eee1]/12 bg-[#f4eee1]/[0.03] px-3.5 py-2 text-[15px] text-[#f4eee1]/90"
                  >
                    <s.Icon aria-hidden className="size-4 shrink-0 text-[#d9b36c]" />
                    {s.name}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>

      {/* -------------------------------- About ------------------------------ */}
      <Section id="about" index={5}>
        <Heading n="05" label="About" title="About." />
        <Card>
          <p className="text-[17px] leading-relaxed text-[#f4eee1]/85">{profile.bio}</p>
        </Card>
        <Card className="mt-4">
          <h3 className={cn(mono, "text-xs uppercase tracking-[0.22em] text-[#d9b36c]")}>Education</h3>
          <p className="font-heading mt-3 text-2xl text-[#f4eee1]">{edu.institution}</p>
          <p className="mt-1 text-base text-[#f4eee1]/80">
            {edu.degree} | GPA: {edu.gpa} | {edu.period}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#f4eee1]/65">
            <span className="text-[#f4eee1]/85">Coursework:</span> {edu.coursework}
          </p>
        </Card>
        <Card className="mt-4">
          <h3 className={cn(mono, "text-xs uppercase tracking-[0.22em] text-[#d9b36c]")}>Publications</h3>
          <ul className="mt-3 space-y-4">
            {profile.publications.map((pub) => (
              <li key={pub} className="flex gap-3 text-base leading-relaxed text-[#f4eee1]/85">
                <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rotate-45 bg-[#d9b36c]" />
                {pub}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="mt-4">
          <h3 className={cn(mono, "text-xs uppercase tracking-[0.22em] text-[#d9b36c]")}>Awards</h3>
          <ul className="mt-3 space-y-4">
            {profile.awards.map((a) => (
              <li key={a.title} className="flex gap-3 text-base leading-relaxed text-[#f4eee1]/85">
                <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rotate-45 bg-[#d9b36c]" />
                <span>
                  <span className="text-[#f4eee1]">{a.title}</span>
                  <br />
                  {a.detail}{" "}
                  <ExtLink href={a.url} className="inline-flex items-center gap-0.5 text-[#d9b36c] underline underline-offset-4">
                    Marked <ArrowUpRight className="size-3.5" />
                  </ExtLink>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </Section>

      {/* ------------------------------- Contact ----------------------------- */}
      <Section id="contact" index={6}>
        <Heading
          n="06"
          label="Contact"
          title="Get in Touch."
          lede="Interested in working together or have a question? I'd love to hear from you."
        />
        <Card>
          <a
            href={`mailto:${profile.email}`}
            className="font-heading break-all text-[clamp(1.4rem,3vw,2rem)] text-[#f4eee1] underline decoration-[#d9b36c]/50 underline-offset-[6px] hover:text-[#d9b36c]"
          >
            {profile.email}
          </a>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`mailto:${profile.email}`} className={btnGold}>
              <Mail className="size-4" /> Email Me
            </a>
            {github && (
              <ExtLink href={github.url} className={btnGhost}>
                <SiGithub className="size-4" /> GitHub
              </ExtLink>
            )}
            {linkedin && (
              <ExtLink href={linkedin.url} className={btnGhost}>
                <FaLinkedin className="size-4" /> LinkedIn
              </ExtLink>
            )}
            <ExtLink href={profile.resumeUrl} className={btnGhost}>
              <FileText className="size-4" /> Resume
            </ExtLink>
          </div>
        </Card>
      </Section>

      <footer className="relative border-t border-[#d9b36c]/15 bg-[#050507]/80 px-5 py-10 backdrop-blur md:px-[6vw]">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-[#f4eee1]/60">
          <p>&copy; {new Date().getFullYear()} {profile.name}</p>
          <div className="flex items-center gap-5">
            {github && (
              <ExtLink href={github.url} className="hover:text-[#d9b36c]">
                <span className="sr-only">GitHub</span>
                <SiGithub className="size-5" />
              </ExtLink>
            )}
            {linkedin && (
              <ExtLink href={linkedin.url} className="hover:text-[#d9b36c]">
                <span className="sr-only">LinkedIn</span>
                <FaLinkedin className="size-5" />
              </ExtLink>
            )}
            <ExtLink href={profile.resumeUrl} className="flex items-center gap-1.5 hover:text-[#d9b36c]">
              <FileText className="size-4" /> Resume
            </ExtLink>
          </div>
        </div>
      </footer>
    </main>
  );
}
