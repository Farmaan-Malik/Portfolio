"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Github } from "./BrandIcons";
import { SectionHeading } from "./Reveal";
import { projects } from "@/lib/data";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const card = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Projects() {
  return (
    <section
      id="projects"
      className="relative mx-auto max-w-5xl scroll-mt-24 px-6 py-24 md:py-32"
    >
      <SectionHeading eyebrow="Projects" title="Things I've built" />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="grid gap-6 sm:grid-cols-2"
      >
        {projects.map((p) => (
          <motion.a
            key={p.name}
            variants={card}
            href={p.repo}
            target="_blank"
            rel="noreferrer"
            whileHover={{ y: -6 }}
            className="group glass relative overflow-hidden rounded-2xl p-6 transition-colors hover:border-foreground/20"
          >
            {/* accent glow */}
            <div
              className={`absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${p.accent} opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-40`}
            />

            <div className="relative flex items-start justify-between">
              <div className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${p.accent} text-background`}>
                <Github size={20} />
              </div>
              <ArrowUpRight
                size={20}
                className="text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
              />
            </div>

            <h3 className="relative mt-5 text-xl font-bold text-foreground">
              {p.name}
            </h3>
            <p className="relative mt-2 text-sm leading-relaxed text-muted">
              {p.blurb}
            </p>

            <ul className="relative mt-5 flex flex-wrap gap-2">
              {p.stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1 font-mono text-[11px] text-muted"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </motion.a>
        ))}
      </motion.div>

      <div className="mt-10 text-center">
        <a
          href="https://github.com/Farmaan-Malik?tab=repositories"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-foreground/10 px-5 py-3 text-sm font-medium text-muted transition-colors hover:border-foreground/25 hover:text-foreground"
        >
          <Github size={16} />
          See all repositories on GitHub
        </a>
      </div>
    </section>
  );
}
