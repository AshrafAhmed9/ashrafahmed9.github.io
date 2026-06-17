"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ReadmeDialogProps {
  repo: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function rewriteImageSrc(src: string | undefined, repo: string, branch: string): string {
  if (!src) return "";
  if (src.startsWith("https://raw.githubusercontent.com")) return src;
  if (src.startsWith("http://") || src.startsWith("https://")) {
    const ghMatch = src.match(/github\.com\/([^/]+\/[^/]+)\/raw\/([^/]+)\/(.*)/);
    if (ghMatch) return `https://raw.githubusercontent.com/${ghMatch[1]}/${ghMatch[2]}/${ghMatch[3]}`;
    return src;
  }
  if (src.startsWith("/")) {
    const ghMatch = src.match(/\/([^/]+\/[^/]+)\/raw\/([^/]+)\/(.*)/);
    if (ghMatch) return `https://raw.githubusercontent.com/${ghMatch[1]}/${ghMatch[2]}/${ghMatch[3]}`;
    return `https://raw.githubusercontent.com${src}`;
  }
  const cleaned = src.replace(/^\.\//, "");
  return `https://raw.githubusercontent.com/${repo}/${branch}/${cleaned}`;
}

export function ReadmeDialog({ repo, open, onOpenChange }: ReadmeDialogProps) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [branch, setBranch] = useState("main");
  const contentRef = useRef<HTMLDivElement>(null);

  const rewriteImages = useCallback(() => {
    if (!contentRef.current) return;
    const imgs = contentRef.current.querySelectorAll("img");
    imgs.forEach((img) => {
      const original = img.getAttribute("src") ?? "";
      const rewritten = rewriteImageSrc(original, repo, branch);
      if (rewritten !== original) {
        img.setAttribute("src", rewritten);
      }
    });
  }, [repo, branch]);

  useEffect(() => {
    if (!open) {
      setContent(null);
      setError(false);
      return;
    }

    async function fetchReadme() {
      setLoading(true);
      setError(false);

      try {
        let res = await fetch(
          `https://raw.githubusercontent.com/${repo}/main/README.md`
        );
        let foundBranch = "main";
        if (!res.ok) {
          res = await fetch(
            `https://raw.githubusercontent.com/${repo}/master/README.md`
          );
          foundBranch = "master";
        }
        if (!res.ok) throw new Error("Not found");
        const text = await res.text();
        setBranch(foundBranch);
        setContent(text);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchReadme();
  }, [open, repo]);

  useEffect(() => {
    if (!content || !contentRef.current) return;
    rewriteImages();
  }, [content, rewriteImages]);

  useEffect(() => {
    if (!content || !contentRef.current) return;

    const codeBlocks = contentRef.current.querySelectorAll("code.language-mermaid");
    if (codeBlocks.length === 0) return;

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js";
    script.onload = () => {
      codeBlocks.forEach((block) => {
        const pre = block.parentElement;
        if (!pre) return;
        const div = document.createElement("div");
        div.className = "mermaid";
        div.textContent = block.textContent ?? "";
        pre.replaceWith(div);
      });
      // @ts-expect-error mermaid is loaded via CDN
      window.mermaid.init(undefined, ".mermaid");
    };
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [content]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="overflow-y-auto p-8"
        style={{ maxWidth: "90vw", width: "900px", maxHeight: "90vh" }}
      >
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">README</DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-foreground" />
          </div>
        )}

        {error && (
          <div className="py-8 text-center">
            <p className="mb-4 text-muted-foreground">
              Couldn&apos;t load README.
            </p>
            <Button asChild variant="outline">
              <a
                href={`https://github.com/${repo}#readme`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub
              </a>
            </Button>
          </div>
        )}

        {content && (
          <div ref={contentRef} className="prose dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                img: ({ src, alt, ...props }) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={rewriteImageSrc(src, repo, branch)}
                    alt={alt ?? ""}
                    className="max-w-full rounded-lg"
                    {...props}
                  />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
