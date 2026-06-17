"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/profile";

export function Contact() {
  return (
    <section id="contact" className="py-24">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <motion.h2
          className="font-heading text-4xl font-bold tracking-tight sm:text-5xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Get in Touch
        </motion.h2>

        <motion.p
          className="mx-auto mt-6 max-w-lg text-lg text-muted-foreground"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Interested in working together or have a question? I&apos;d love to hear from you.
        </motion.p>

        <motion.p
          className="mt-6 text-xl font-medium text-foreground"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {profile.email}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-6"
        >
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <a href={`mailto:${profile.email}`}>
              <Mail className="mr-2 h-6 w-6" />
              Email Me
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
