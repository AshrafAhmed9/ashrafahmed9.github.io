"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/profile";

export function Hero() {
  return (
    <section className="flex min-h-[calc(100vh-9rem)] items-center justify-center px-6">
      <div className="mx-auto max-w-4xl text-center">
        <motion.h1
          className="font-heading text-6xl font-bold tracking-tight sm:text-7xl lg:text-8xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {profile.name}
        </motion.h1>

        <motion.p
          className="mt-8 text-xl text-muted-foreground sm:text-2xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          className="mt-12 flex flex-wrap items-center justify-center gap-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
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
