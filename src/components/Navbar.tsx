"use client";

import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
} from "motion/react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { navLinks, profile } from "@/lib/data";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // scroll-spy: which section is centered in the viewport
  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1));
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* scroll progress */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-accent to-accent-2"
      />

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
      >
        <nav
          className={`flex w-full max-w-5xl items-center justify-between rounded-full py-2.5 pl-3 pr-2.5 transition-all duration-300 ${
            scrolled
              ? "glass shadow-[0_8px_30px_-12px_rgba(36,31,26,0.25)]"
              : "border border-transparent bg-transparent"
          }`}
        >
          {/* brand */}
          <a href="#top" className="group flex shrink-0 items-center gap-2.5 pr-2">
            <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-[#2f8f7f] to-[#8bbb92] font-mono text-sm font-bold text-foreground">
              FM
              <span className="absolute inset-0 translate-y-full bg-foreground/10 transition-transform duration-300 group-hover:translate-y-0" />
            </span>
            <span className="hidden whitespace-nowrap text-sm font-semibold tracking-tight text-foreground sm:block">
              Farmaan Malik
            </span>
          </a>

          {/* links */}
          <ul className="hidden shrink-0 items-center gap-0.5 md:flex">
            {navLinks.map((link) => {
              const isActive = active === link.href.slice(1);
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="group relative flex items-center whitespace-nowrap rounded-full px-3.5 py-2 text-sm transition-colors"
                  >
                    <span
                      className={
                        isActive
                          ? "text-foreground"
                          : "text-muted transition-colors group-hover:text-foreground"
                      }
                    >
                      {link.label}
                    </span>
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 32,
                        }}
                        className="absolute inset-0 -z-10 rounded-full bg-accent/10 ring-1 ring-accent/20"
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex shrink-0 items-center gap-1.5">
            {/* desktop shows the toggle on the phone's home screen instead */}
            <span className="lg:hidden">
              <ThemeToggle />
            </span>
            <a
              href={profile.socials.email}
              className="group hidden shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-foreground px-4 py-2 text-sm font-semibold leading-none text-background transition-transform hover:scale-[1.03] active:scale-95 md:inline-flex"
            >
              Let&apos;s talk
              <ArrowUpRight
                size={15}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
            <button
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full text-foreground transition-colors hover:bg-foreground/5 md:hidden"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="glass absolute left-4 right-4 top-20 rounded-3xl p-3 md:hidden"
            >
              <ul className="flex flex-col">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-2xl px-4 py-3 transition-colors hover:bg-foreground/5"
                    >
                      <span className="font-display text-2xl font-light text-foreground">
                        {link.label}
                      </span>
                    </a>
                  </li>
                ))}
                <li className="p-1">
                  <a
                    href={profile.socials.email}
                    onClick={() => setOpen(false)}
                    className="mt-1 flex items-center justify-center gap-1.5 rounded-2xl bg-foreground px-3 py-3.5 font-semibold text-background"
                  >
                    Let&apos;s talk <ArrowUpRight size={16} />
                  </a>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
