import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface CarouselSlide {
  id: number;
  image: string;
  title: string;
}

interface CarouselProps {
  slides?: CarouselSlide[];
  autoplayInterval?: number;
  autoplay?: boolean;
}

const DEFAULT_SLIDES: CarouselSlide[] = [
  {
    id: 1,
    image: "https://picsum.photos/800/600",
    title: "First Slide"
  },
  {
    id: 2,
    image: "https://picsum.photos/id/15/800/600",
    title: "Second Slide"
  },
  {
    id: 3,
    image: "https://picsum.photos/id/17/800/600",
    title: "Third Slide"
  }
];

const Carousel: React.FC<CarouselProps> = ({
  slides = DEFAULT_SLIDES,
  autoplayInterval = 3000,
  autoplay = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  }, [slides.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  }, [slides.length]);

  useEffect(() => {
    if (currentIndex >= slides.length) {
      setCurrentIndex(0);
    }
  }, [slides.length, currentIndex]);

  useEffect(() => {
    let intervalId: number;
    if (isPlaying && slides.length > 1 && !isHovering) {
      intervalId = setInterval(goToNext, autoplayInterval);
    }
    return () => clearInterval(intervalId);
  }, [isPlaying, autoplayInterval, goToNext, slides.length, isHovering]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case 'Space':
          event.preventDefault();
          setIsPlaying(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious]);

  if (!slides || slides.length === 0) {
    return null;
  }

  const goToSlide = (index: number) => {
    if (index >= 0 && index < slides.length) {
      setCurrentIndex(index);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const currentTouch = e.touches[0].clientX;
    const diff = touchStart - currentTouch;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToNext();
      else goToPrevious();
      setTouchStart(null);
    }
  };

  if (slides.length === 1) {
    return (
      <div className="relative w-full max-w-4xl mx-auto">
        <div className="relative h-96 overflow-hidden rounded-xl shadow-2xl">
          <img
            src={slides[0].image}
            alt={slides[0].title}
            className="object-cover w-full h-full"
          />
          <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent">
            <h3 className="text-white text-xl font-medium">{slides[0].title}</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full max-w-4xl mx-auto group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div 
        className="relative h-96 overflow-hidden rounded-xl shadow-2xl bg-gray-900"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => setTouchStart(null)}
      >
        <div 
          className="absolute w-full h-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          <div className="absolute flex h-full" style={{ width: `${slides.length * 100}%` }}>
            {slides.map(slide => (
              <div 
                key={slide.id}
                className="relative h-full"
                style={{ width: `${100 / slides.length}%` }}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <h3 className="text-white text-xl font-medium tracking-wide">
                    {slide.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation arrows */}
        <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={goToPrevious}
            className="p-2 rounded-full bg-white/90 hover:bg-white transform transition-transform duration-300 hover:scale-110 shadow-lg"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="p-2 rounded-full bg-white/90 hover:bg-white transform transition-transform duration-300 hover:scale-110 shadow-lg"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Autoplay control */}
        <button
          onClick={() => setIsPlaying(prev => !prev)}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white transform transition-all duration-300 hover:scale-110 shadow-lg opacity-0 group-hover:opacity-100"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </button>

        {/* Progress indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white w-6' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;