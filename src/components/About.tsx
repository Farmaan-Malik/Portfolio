"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Reveal, SectionHeading } from "./Reveal";
import { Smartphone, Server, Zap } from "lucide-react";

const facets = [
  {
    icon: Smartphone,
    title: "Mobile architecture",
    body: "Large-scale React Native apps: global state, custom media playback, offline caching, and the fiddly Android platform bits that most people avoid.",
  },
  {
    icon: Server,
    title: "Full-stack reach",
    body: "Comfortable past the client too: Node, Express, and Go backends with REST APIs, JWT auth, and real-time streaming over Server-Sent Events.",
  },
  {
    icon: Zap,
    title: "Performance & polish",
    body: "Killing UI jitter, speeding up search, and upgrading React Native versions to cut user-reported issues. The unglamorous work that makes apps feel good.",
  },
];

export function About() {
  const [active, setActive] = useState(0);

  return (
    <section id="about" className="relative scroll-mt-24 py-24 md:py-32">
      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <SectionHeading eyebrow="About" title="A bit about me" />

        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <p className="text-xl leading-relaxed text-foreground">
              I spend my time building apps, and the rest of it trying to learn
              something new.
            </p>
            <p className="mt-5 leading-relaxed text-muted">
              React Native is home base, but I&apos;m always wandering off into
              new tools and tech: Go, backends, whatever&apos;s caught my eye
              lately. A few things I keep coming back to:
            </p>
          </Reveal>

          {/* interactive accordion - one facet open at a time */}
          <Reveal delay={0.1}>
            <div className="border-t border-foreground/10">
              {facets.map((f, i) => {
                const open = active === i;
                return (
                  <div key={f.title} className="border-b border-foreground/10">
                    <button
                      onClick={() => setActive(i)}
                      onMouseEnter={() => setActive(i)}
                      className="flex w-full items-center gap-3 py-4 text-left"
                    >
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border transition-colors ${
                          open
                            ? "border-accent/40 bg-accent/10 text-accent"
                            : "border-foreground/10 text-muted"
                        }`}
                      >
                        <f.icon size={17} />
                      </span>
                      <span
                        className={`font-display text-lg transition-colors ${
                          open ? "text-foreground" : "text-muted"
                        }`}
                      >
                        {f.title}
                      </span>
                      <span
                        className={`ml-auto font-mono text-xs transition-colors ${
                          open ? "text-accent" : "text-muted/50"
                        }`}
                      >
                        0{i + 1}
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="pb-5 pl-12 text-sm leading-relaxed text-muted">
                            {f.body}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
