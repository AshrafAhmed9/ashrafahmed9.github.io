"use client";

import Link from "next/link";

const navLinks = [
  { label: "Projects", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

// Deliberately not sticky — it scrolls away with the page rather than
// following the user down, since the prominent LinkedIn/GitHub/Resume links
// now live in the hero instead of pinned chrome.
export function Header() {
  return (
    <header className="w-full pt-6 pb-4">
      <nav className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-3 px-4 text-center">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-full border border-border/60 bg-card/50 px-6 py-2.5 text-lg font-bold tracking-wide text-foreground/80 backdrop-blur-md transition-all hover:border-primary/60 hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_18px] hover:shadow-primary/30 sm:text-xl"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
