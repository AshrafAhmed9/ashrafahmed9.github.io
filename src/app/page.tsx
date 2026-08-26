import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { ScrollDeck } from "@/components/scroll-deck";
import { About } from "@/components/about";
import { Skills } from "@/components/skills";
import { Contact } from "@/components/contact";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <ScrollDeck />
        <Skills />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
