import Hero from "@/components/Hero";
import Calculator from "@/components/Calculator";

export default function Home() {
  return (
    <>
      <Hero />
      <section id="calculator" className="py-12 bg-gradient-to-b from-brand to-brand-dark text-white">
        <Calculator />
      </section>
    </>
  );
}