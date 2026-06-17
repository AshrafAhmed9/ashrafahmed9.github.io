"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon, FileTextIcon, Menu, X } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { profile } from "@/data/profile";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const visibleSocials = profile.socials.filter((s) => !s.hidden);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="flex h-20 lg:h-36 items-center justify-between px-4 lg:px-12">
        <nav className="hidden lg:flex items-center gap-14">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-2xl font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 lg:gap-8">
          <div className="hidden lg:flex items-center gap-7">
            {visibleSocials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label={social.name}
              >
                {social.name === "GitHub" && <SiGithub className="h-10 w-10" />}
                {social.name === "LinkedIn" && <FaLinkedin className="h-10 w-10" />}
              </a>
            ))}
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-2xl font-bold text-foreground transition-colors hover:text-muted-foreground"
              aria-label="Resume"
            >
              <FileTextIcon className="h-10 w-10" />
              Resume
            </a>
          </div>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            {mounted ? (
              theme === "dark" ? (
                <Sun style={{ width: 40, height: 40 }} />
              ) : (
                <Moon style={{ width: 40, height: 40 }} />
              )
            ) : (
              <Sun style={{ width: 40, height: 40 }} />
            )}
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
          >
            {menuOpen ? (
              <X style={{ width: 36, height: 36 }} />
            ) : (
              <Menu style={{ width: 36, height: 36 }} />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-border/40 bg-background px-6 py-5 lg:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-lg font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-5 border-t border-border/40 pt-4">
              {visibleSocials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={social.name}
                >
                  {social.name === "GitHub" && <SiGithub className="h-6 w-6" />}
                  {social.name === "LinkedIn" && <FaLinkedin className="h-6 w-6" />}
                </a>
              ))}
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-lg font-bold text-foreground"
              >
                <FileTextIcon className="h-6 w-6" />
                Resume
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
