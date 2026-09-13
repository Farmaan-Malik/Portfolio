import { Background } from "@/components/Background";
import { CursorFollower } from "@/components/CursorFollower";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Journey } from "@/components/Journey";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Contact, Footer } from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Background />
      <CursorFollower />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <Journey />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
