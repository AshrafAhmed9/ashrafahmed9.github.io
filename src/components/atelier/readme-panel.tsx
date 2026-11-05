"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { ArrowUpRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Same README behaviour as the classic site's dialog (main → master fallback,
// relative image rewriting, mermaid diagrams), restyled as a side drawer.

function rewriteImageSrc(src: string | undefined, repo: string, branch: string) {
  if (!src) return "";
  if (src.startsWith("https://raw.githubusercontent.com")) return src;
  const gh = src.match(/github\.com\/([^/]+\/[^/]+)\/raw\/([^/]+)\/(.*)/);
  if (gh) return `https://raw.githubusercontent.com/${gh[1]}/${gh[2]}/${gh[3]}`;
  if (/^https?:\/\//.test(src)) return src;
  if (src.startsWith("/")) {
    const local = src.match(/\/([^/]+\/[^/]+)\/raw\/([^/]+)\/(.*)/);
    if (local) return `https://raw.githubusercontent.com/${local[1]}/${local[2]}/${local[3]}`;
    return `https://raw.githubusercontent.com${src}`;
  }
  return `https://raw.githubusercontent.com/${repo}/${branch}/${src.replace(/^\.\//, "")}`;
}

// Results are tagged with their repo, so "loading" is simply "no result for
// the repo that's open yet" rather than a separate flag to keep in sync.
type Result = { repo: string; ok: true; text: string; branch: string } | { repo: string; ok: false };

export function ReadmePanel({ repo, onClose }: { repo: string | null; onClose: () => void }) {
  const [result, setResult] = useState<Result | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);
  const open = repo !== null;
  const current = result && result.repo === repo ? result : null;
  const doc = current?.ok ? current : null;

  useEffect(() => {
    if (!repo) return;
    opener.current = document.activeElement;
    closeRef.current?.focus();
    let cancelled = false;
    (async () => {
      for (const branch of ["main", "master"]) {
        try {
          const res = await fetch(`https://raw.githubusercontent.com/${repo}/${branch}/README.md`);
          if (res.ok) {
            const text = await res.text();
            if (!cancelled) setResult({ repo, ok: true, text, branch });
            return;
          }
        } catch {
          break;
        }
      }
      if (!cancelled) setResult({ repo, ok: false });
    })();
    return () => {
      cancelled = true;
      // Return focus to the README button that opened the drawer.
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [repo]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Render ```mermaid blocks as diagrams. Loaded from a CDN only when needed.
  useEffect(() => {
    if (!doc || !bodyRef.current) return;
    const blocks = bodyRef.current.querySelectorAll("code.language-mermaid");
    if (!blocks.length) return;
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js";
    script.onload = () => {
      blocks.forEach((block) => {
        const div = document.createElement("div");
        div.className = "mermaid";
        div.textContent = block.textContent ?? "";
        block.parentElement?.replaceWith(div);
      });
      const mermaid = (window as unknown as { mermaid?: { initialize: (c: object) => void; init: (c: undefined, s: string) => void } }).mermaid;
      mermaid?.initialize({ startOnLoad: false, theme: "dark" });
      mermaid?.init(undefined, ".mermaid");
    };
    document.head.appendChild(script);
    return () => script.remove();
  }, [doc]);

  return (
    <>
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-[60] bg-[#050507]/70 backdrop-blur-sm transition-opacity duration-500",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={repo ? `${repo} README` : "README"}
        inert={!open}
        className={cn(
          "fixed inset-y-0 right-0 z-[61] flex w-full max-w-3xl flex-col border-l border-[#d9b36c]/25 bg-[#0a0a0d] transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)]",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between gap-4 border-b border-[#d9b36c]/15 px-6 py-4">
          <p className="font-[family-name:var(--font-ibm-plex-mono)] truncate text-sm text-[#d9b36c]">
            {repo} / README.md
          </p>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close README"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#d9b36c]/40 text-[#d9b36c] hover:bg-[#d9b36c] hover:text-[#050507]"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8 md:px-10">
          {open && !current && (
            <div className="flex justify-center py-16">
              <div className="size-8 animate-spin rounded-full border-2 border-[#d9b36c]/20 border-t-[#d9b36c]" />
            </div>
          )}
          {current && !current.ok && repo && (
            <div className="py-12 text-center text-[#f4eee1]/75">
              <p>Couldn&apos;t load the README.</p>
              <a
                href={`https://github.com/${repo}#readme`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-[#d9b36c] underline underline-offset-4"
              >
                View on GitHub <ArrowUpRight className="size-4" />
              </a>
            </div>
          )}
          {doc && repo && (
            <div
              ref={bodyRef}
              className="prose prose-invert max-w-none prose-headings:font-heading prose-a:text-[#d9b36c] prose-code:text-[#f1dba8] prose-pre:bg-[#050507]"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  img: ({ src, alt, ...rest }) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      {...rest}
                      src={rewriteImageSrc(typeof src === "string" ? src : undefined, repo, doc.branch)}
                      alt={alt ?? ""}
                      className="max-w-full rounded-lg"
                    />
                  ),
                }}
              >
                {doc.text}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
