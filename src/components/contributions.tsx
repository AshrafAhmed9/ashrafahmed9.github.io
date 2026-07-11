"use client";

import { motion } from "framer-motion";
import { ExternalLink, GitPullRequest } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { contributions } from "@/data/contributions";

export function Contributions() {
  return (
    <section id="open-source" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.h2
          className="font-heading text-5xl font-bold tracking-tight sm:text-6xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Open Source
        </motion.h2>

        <div className="mt-12 space-y-6">
          {contributions.map((contrib, i) => (
            <motion.div
              key={contrib.url}
              className="group flex flex-col rounded-lg border border-border/60 bg-card/50 p-8 transition-colors hover:border-border hover:bg-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <SiGithub className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-semibold text-muted-foreground">
                      {contrib.repo}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">
                      {contrib.stars} ★
                    </span>
                  </div>
                  <h3 className="mt-3 font-heading text-2xl font-semibold leading-snug">
                    {contrib.title}
                  </h3>
                  <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
                    {contrib.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>
                    <GitPullRequest className="mr-1 inline h-4 w-4" />
                    PR #{contrib.pr}
                  </span>
                  <span className="font-mono">{contrib.lines}</span>
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="ml-auto"
                >
                  <a
                    href={contrib.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View PR
                  </a>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
