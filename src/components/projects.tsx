"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, BookOpen } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { projects } from "@/data/projects";
import { ReadmeDialog } from "@/components/readme-dialog";

export function Projects() {
  const [readmeRepo, setReadmeRepo] = useState<string | null>(null);

  return (
    <section id="work" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.h2
          className="font-heading text-5xl font-bold tracking-tight sm:text-6xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Selected Projects
        </motion.h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, i) => (
            <motion.div
              key={project.repo}
              className="group flex flex-col rounded-xl border border-border/60 bg-card p-8 transition-colors hover:border-border"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <h3 className="font-heading text-3xl font-semibold leading-snug">
                {project.title}
              </h3>
              <p className="mt-4 text-xl text-muted-foreground leading-relaxed">
                {project.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-lg px-4 py-1.5">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
                <Button asChild variant="outline" size="lg" className="text-lg">
                  <a
                    href={`https://github.com/${project.repo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SiGithub className="mr-2 h-6 w-6" />
                    Repository
                  </a>
                </Button>

                {project.liveUrl && (
                  <Button asChild variant="outline" size="lg" className="text-lg">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-6 w-6" />
                      Live
                    </a>
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg"
                  onClick={() => setReadmeRepo(project.repo)}
                >
                  <BookOpen className="mr-2 h-6 w-6" />
                  README
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
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
