import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import About from "@/app/components/About";
import Skills from "@/app/components/Skills";
import Experience from "@/app/components/Experience";
import Projects from "@/app/components/Projects";
import Education from "@/app/components/Education";
import Contact from "@/app/components/Contact";
import Footer from "@/app/components/Footer";
import AIAssistant from "@/app/components/ai-assistant/AIAssistant";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Contact />
      </main>
      <Footer />
      {/* AI Portfolio Assistant — fixed overlay, all three display states */}
      <AIAssistant />
    </>
  );
}
