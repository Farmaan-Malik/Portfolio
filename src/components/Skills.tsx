import { Reveal, SectionHeading } from "./Reveal";
import { skillGroups } from "@/lib/data";

const marquee = [
  "React Native",
  "TypeScript",
  "Go",
  "Kotlin",
  "Expo",
  "Zustand",
  "Redux Toolkit",
  "Jetpack Compose",
  "Node.js",
  "MongoDB",
  "PostgreSQL",
  "Docker",
  "WebRTC",
  "LiveKit",
  "SSE",
  "AWS",
];

export function Skills() {
  return (
    <section
      id="skills"
      className="relative mx-auto max-w-5xl scroll-mt-24 px-6 py-24 md:py-32"
    >
      <SectionHeading eyebrow="Skills" title="My toolkit" />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, i) => (
          <Reveal key={group.title} delay={i * 0.06}>
            <div className="glass h-full rounded-2xl p-6 transition-colors hover:border-foreground/20">
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-accent-2">
                {group.title}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-lg border border-foreground/10 bg-foreground/[0.03] px-3 py-1.5 text-sm text-foreground/90"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      {/* marquee */}
      <div className="relative mt-14 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
        <div className="animate-marquee flex w-max gap-4">
          {[...marquee, ...marquee].map((skill, i) => (
            <span
              key={skill + i}
              className="whitespace-nowrap rounded-full border border-foreground/10 bg-foreground/[0.03] px-5 py-2 font-mono text-sm text-muted"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
