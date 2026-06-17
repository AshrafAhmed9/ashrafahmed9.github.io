"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/profile";

export function About() {
  return (
    <section id="about" className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <motion.h2
          className="font-heading text-4xl font-bold tracking-tight sm:text-5xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          About
        </motion.h2>

        <motion.p
          className="mt-8 max-w-3xl text-lg text-muted-foreground leading-relaxed"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {profile.bio}
        </motion.p>

        <motion.div
          className="mt-8 space-y-2 text-base text-muted-foreground"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <p className="text-lg font-medium text-foreground">{profile.education.institution}</p>
          <p>{profile.education.degree} | GPA: {profile.education.gpa} | {profile.education.period}</p>
          <p className="text-sm">Coursework: {profile.education.coursework}</p>
        </motion.div>

        <motion.div
          className="mt-6 text-base text-muted-foreground"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-lg font-medium text-foreground">Publication</p>
          <p>{profile.publication}</p>
        </motion.div>
      </div>
    </section>
  );
}
