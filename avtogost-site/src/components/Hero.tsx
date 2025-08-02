import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-[80vh] md:h-[70vh] overflow-hidden">
      {/* Hero background */}
      <Image
        src="/hero-logistics.webp"
        alt="Девушка фотографирует закат, пока грузовик едет под мостом – АвтоГОСТ берёт логистику на себя"
        fill
        priority
        quality={85}
        className="object-cover"
      />
      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Text & CTAs */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center text-white">
        <h1 className="text-3xl sm:text-5xl font-bold leading-tight drop-shadow-lg">
          Мы ведём&nbsp;груз — вы ведёте&nbsp;бизнес
        </h1>
        <p className="mt-4 max-w-xl text-lg sm:text-xl">
          Аутсорсинг логистики: всё работает в&nbsp;фоне, вы сосредоточены на своём деле
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link href="#calculator" className="btn-primary">
            🚀 Рассчитать сейчас
          </Link>
          <Link href="/outsourcing" className="btn-secondary">
            🤝 Аутсорсинг логистики
          </Link>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce text-white/80 text-sm">
        ↓
      </div>
    </section>
  );
}