import { FileTextIcon } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";

import { profile } from "@/data/profile";

const iconMap: Record<string, React.ReactNode> = {
  GitHub: <SiGithub className="h-7 w-7" />,
  LinkedIn: <FaLinkedin className="h-7 w-7" />,
};

export function Footer() {
  const visibleSocials = profile.socials.filter((s) => !s.hidden);

  return (
    <footer className="border-t border-border/40 py-12">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 px-6 text-base text-muted-foreground">
        <div className="flex items-center gap-6">
          {visibleSocials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
              aria-label={social.name}
            >
              {iconMap[social.name] ?? social.name}
            </a>
          ))}
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-lg font-medium transition-colors hover:text-foreground"
            aria-label="Resume"
          >
            <FileTextIcon className="h-6 w-6" />Resume
          </a>
        </div>
        <p className="text-base">&copy; {new Date().getFullYear()} {profile.name}</p>
      </div>
    </footer>
  );
}
