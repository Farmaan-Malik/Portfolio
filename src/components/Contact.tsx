import { Reveal } from "./Reveal";
import { profile } from "@/lib/data";
import { Mail, ArrowUpRight } from "lucide-react";
import { Github, Linkedin } from "./BrandIcons";

export function Contact() {
  return (
    <section
      id="contact"
      className="relative mx-auto max-w-5xl scroll-mt-24 px-6 py-24 md:py-32"
    >
      <Reveal>
        <div className="glass relative overflow-hidden rounded-3xl px-6 py-16 text-center md:px-16">
          <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-[radial-gradient(circle,rgba(139,187,146,0.22),transparent_60%)] blur-2xl" />
          <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-[radial-gradient(circle,rgba(201,120,78,0.2),transparent_60%)] blur-2xl" />

          <div className="relative">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
              Contact
            </span>
            <h2 className="font-display mx-auto mt-4 max-w-2xl text-4xl font-light tracking-tight text-foreground sm:text-6xl">
              Let&apos;s build something{" "}
              <span className="italic text-accent-gradient">great</span>{" "}
              together.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-muted">
              I&apos;m open to full-time roles and interesting freelance work.
              Whether you have a question or just want to say hi, my inbox is
              always open.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href={profile.socials.email}
                className="group inline-flex max-w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2f8f7f] to-[#8bbb92] px-5 py-3.5 text-sm font-semibold text-foreground transition-transform hover:scale-[1.03] active:scale-95 sm:px-6"
              >
                <Mail size={18} className="shrink-0" />
                <span className="break-all">{profile.email}</span>
                <ArrowUpRight
                  size={16}
                  className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm text-muted">
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
              >
                <Github size={16} /> GitHub
              </a>
              <span className="h-4 w-px bg-foreground/10" />
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
              >
                <Linkedin size={16} /> LinkedIn
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-foreground/5 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-6 text-sm text-muted sm:flex-row">
        <p>© 2026 Farmaan Malik. All rights reserved.</p>
        <p className="font-mono text-xs">Built with Next.js, Tailwind & Motion.</p>
      </div>
    </footer>
  );
}
