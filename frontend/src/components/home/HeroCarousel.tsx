import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from '@/components/icons';
import Banner1 from "../../../assets/banner-1.jpeg";
import Banner2 from "../../../assets/banner-2.jpeg";
interface Slide {
  id: number;
  image: string;
  alt: string;
  label: string;
  title: string;
  highlight: string;
  cta: string;
}

interface HeroCarouselProps {
  slides?: Slide[];
}

export function HeroCarousel({ slides: propSlides }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const defaultSlides: Slide[] = [
    {
      id: 1,
      image: Banner1,
      alt: "Mostrando suéter de lana orgánica premium",
      label: "",
      title: "",
      highlight: "",
      cta: "Descubrir el Tejido",
    },
    {
      id: 2,
      image: Banner2,
      alt: "Editorial El Arte de la Quietud",
      label: "",
      title: "",
      highlight: "",
      cta: "Explorar Editorial",
    },
  ];

  const slides = propSlides || defaultSlides;

  const moveSlide = useCallback(
    (direction: number) => {
      setCurrentSlide(
        (prev) => (prev + direction + slides.length) % slides.length,
      );
    },
    [slides.length],
  );

  useEffect(() => {
    const timer = setInterval(() => moveSlide(1), 8000);
    return () => clearInterval(timer);
  }, [moveSlide]);

  return (
    <section className="relative h-screen min-h-[700px] w-full overflow-hidden bg-surface-container">
      <div
        className="relative h-full flex transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="min-w-full h-full relative">
            <img
              src={slide.image}
              alt={slide.alt}
              className="absolute inset-0 w-full h-full object-cover animate-fade-in-scale"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 z-10">
              <span className="label-md tracking-[0.4em] uppercase text-white/90 mb-6 drop-shadow-sm">
                {slide.label}
              </span>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-white leading-tight mb-12 drop-shadow-xl">
                {slide.title}{" "}
                <span className="italic text-[#ffb5a0]">{slide.highlight}</span>
              </h1>
              <button className="bg-[#e27d60] text-white px-8 py-4 md:px-12 md:py-5 rounded-lg font-bold tracking-widest uppercase text-xs hover:bg-primary transition-all duration-500 shadow-2xl active:scale-[0.98] min-h-[44px]">
                {slide.cta}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel Controls */}
      <div className="absolute inset-y-0 left-4 md:left-6 flex items-center z-20">
        <button
          onClick={() => moveSlide(-1)}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all duration-300 active:scale-90 min-h-[44px] min-w-[44px]"
          aria-label="Slide anterior"
        >
          <ChevronLeft size={20} className="md:size-6" />
        </button>
      </div>
      <div className="absolute inset-y-0 right-4 md:right-6 flex items-center z-20">
        <button
          onClick={() => moveSlide(1)}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all duration-300 active:scale-90 min-h-[44px] min-w-[44px]"
          aria-label="Slide siguiente"
        >
          <ChevronRight size={20} className="md:size-6" />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              idx === currentSlide
                ? "bg-white"
                : "bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
