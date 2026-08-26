import { ReactNode } from "react";
import { ExternalLink, BookOpen } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface TreeItem {
  title: string;
  subtitle?: string;
  description: string;
  meta: string[];
  repo?: string;
  liveUrl?: string;
  externalLink?: { label: string; href: string };
}

interface PhaseTreeProps {
  phase: string;
  items: TreeItem[];
  onOpenReadme: (repo: string) => void;
}

function ItemCard({ item, onOpenReadme }: { item: TreeItem; onOpenReadme: (repo: string) => void }) {
  return (
    <div className="min-w-0 rounded-xl p-2 text-left transition-colors hover:bg-white/[0.03]">
      <h4 className="font-heading text-xl font-semibold leading-snug sm:text-2xl">{item.title}</h4>
      {item.subtitle && (
        <p className="mt-1 text-sm uppercase tracking-wide text-primary/70">{item.subtitle}</p>
      )}
      <p className="mt-2 line-clamp-3 text-base leading-relaxed text-muted-foreground">
        {item.description}
      </p>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {item.meta.map((m) => (
          <Badge key={m} variant="secondary" className="text-sm">
            {m}
          </Badge>
        ))}
      </div>
      <div className="mt-1.5 flex flex-wrap items-center gap-2">
        {item.repo && (
          <Button asChild variant="outline" size="sm">
            <a href={`https://github.com/${item.repo}`} target="_blank" rel="noopener noreferrer">
              <SiGithub className="mr-1.5 h-4 w-4" />
              Repository
            </a>
          </Button>
        )}
        {item.liveUrl && (
          <Button asChild variant="outline" size="sm">
            <a href={item.liveUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-1.5 h-4 w-4" />
              Live
            </a>
          </Button>
        )}
        {item.repo && (
          <Button variant="outline" size="sm" onClick={() => onOpenReadme(item.repo!)}>
            <BookOpen className="mr-1.5 h-4 w-4" />
            README
          </Button>
        )}
        {item.externalLink && (
          <Button asChild variant="outline" size="sm">
            <a href={item.externalLink.href} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-1.5 h-4 w-4" />
              {item.externalLink.label}
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}

// Renders every item in a phase at once. Below sm it's a plain single-column
// timeline (the 3-column left/right grid squeezes each card into ~150px on
// a phone, wrapping titles and buttons into a tangled mess) — the alternating
// branch layout only kicks in once there's enough width for it, sm and up.
export function PhaseTree({ phase, items, onOpenReadme }: PhaseTreeProps) {
  return (
    <div className="glass-card w-full rounded-2xl border border-border/60 bg-card p-6 sm:p-8">
      <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-[0.2em] text-primary/70">
        {phase}
      </span>

      <div className="relative mt-4 flex flex-col gap-6 sm:hidden">
        <div className="absolute top-0 bottom-0 left-[5px] w-px bg-border" />
        {items.map((item) => (
          <div key={item.title} className="relative pl-6">
            <span className="absolute top-2 left-0 h-2.5 w-2.5 rounded-full border-2 border-primary bg-background shadow-[0_0_10px] shadow-primary/50" />
            <ItemCard item={item} onOpenReadme={onOpenReadme} />
          </div>
        ))}
      </div>

      <div className="relative mt-4 hidden flex-col sm:flex">
        <div className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-border" />

        {items.map((item, i) => {
          const onRight = i % 2 === 0;
          const card: ReactNode = <ItemCard item={item} onOpenReadme={onOpenReadme} />;

          return (
            <div key={item.title} className="relative grid grid-cols-[1fr_2rem_1fr] items-start">
              <div className={onRight ? "" : "flex justify-end"}>
                {!onRight && (
                  <div className="relative">
                    <span className="absolute top-6 -right-4 h-px w-4 bg-border" />
                    {card}
                  </div>
                )}
              </div>
              <span className="z-10 mx-auto mt-6 h-3 w-3 shrink-0 rounded-full border-2 border-primary bg-background shadow-[0_0_10px] shadow-primary/50" />
              <div>
                {onRight && (
                  <div className="relative">
                    <span className="absolute top-6 -left-4 h-px w-4 bg-border" />
                    {card}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
