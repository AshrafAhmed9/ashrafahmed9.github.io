"use client";

import { motion } from "framer-motion";
import { FileTextIcon } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/profile";

export function Hero() {
  const github = profile.socials.find((s) => s.name === "GitHub");
  const linkedin = profile.socials.find((s) => s.name === "LinkedIn");

  return (
    <section className="relative flex min-h-[calc(100vh-6rem)] items-center justify-center px-6">
      <motion.div
        className="absolute top-20 left-1/2 flex -translate-x-1/2 flex-wrap items-center justify-center gap-4 px-6 sm:top-24"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {linkedin && (
          <a
            href={linkedin.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full border border-border/60 bg-card/60 px-6 py-3.5 text-lg font-semibold text-muted-foreground backdrop-blur-md transition-colors hover:border-border hover:text-foreground"
          >
            <FaLinkedin className="h-6 w-6" />
            LinkedIn
          </a>
        )}

        {github && (
          <a
            href={github.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full border border-primary/60 bg-primary/10 px-8 py-4 text-xl font-bold text-primary backdrop-blur-md transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_28px] hover:shadow-primary/50"
          >
            <SiGithub className="h-7 w-7" />
            GitHub
          </a>
        )}

        <a
          href={profile.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 rounded-full border border-border/60 bg-card/60 px-6 py-3.5 text-lg font-semibold text-muted-foreground backdrop-blur-md transition-colors hover:border-border hover:text-foreground"
        >
          <FileTextIcon className="h-6 w-6" />
          Resume
        </a>
      </motion.div>

      <div className="mx-auto max-w-4xl text-center">
        <motion.p
          className="font-[family-name:var(--font-ibm-plex-mono)] text-xs tracking-[0.3em] text-primary/70 uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          // Backend &amp; ML Systems Engineer
        </motion.p>

        <motion.h1
          className="mt-6 font-heading text-6xl font-bold tracking-tight sm:text-7xl lg:text-8xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {profile.name}
        </motion.h1>

        <motion.p
          className="mx-auto mt-8 max-w-2xl text-lg font-medium text-foreground sm:text-xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          {profile.credibility}
        </motion.p>

        <motion.p
          className="mt-4 text-base text-muted-foreground"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          {profile.availability}
        </motion.p>

        <motion.div
          className="mt-12 flex flex-wrap items-center justify-center gap-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <a href="#work">View Work</a>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
            <a href={`mailto:${profile.email}`}>Get in Touch</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
