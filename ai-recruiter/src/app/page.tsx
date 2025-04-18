import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Footer } from "@/components/landing/Footer";
import { BubblesBackground } from "@/components/ui/bubbles-background";

export default function Home() {
  return (
    <main className="relative">
      <BubblesBackground />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Features />
        <HowItWorks />
        <Footer />
      </div>
    </main>
  );
}
