import Calculator from "@/components/Calculator";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-brand to-brand-dark text-white p-6">
      <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-center drop-shadow-lg">
        АвтоГОСТ – грузоперевозки по России 24/7
      </h1>
      <p className="mb-8 text-center max-w-2xl">
        Рассчитайте точную стоимость доставки за несколько секунд с помощью нашего AI-калькулятора.
      </p>
      <Calculator />
    </main>
  );
}
