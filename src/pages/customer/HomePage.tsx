import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, ArrowRight, Shield, Clock, HeartHandshake, RotateCcw } from 'lucide-react';
import { CATEGORIES, REVIEWS } from '../../data/products';
import { ProductCard } from '../../components/common/ProductCard';
import { useStore } from '../../context/StoreContext';
import { ThreeHeroCanvas, checkThreeCapability } from '../../components/customer/ThreeHeroCanvas';

const HERO_SLIDES = [
  {
    id: 1,
    eyebrow: 'FESTIVE EDIT + UP TO 50% OFF',
    headlineLine1: 'Heirloom Silks',
    headlineLine2: '& Organza Drapes',
    subtitle: 'Hand-embroidered festive ensembles crafted for unforgettable celebrations.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&h=900&q=80',
    link: '/shop/sarees',
    // Slide 1: marigold #F2B90D
    bgColor: '#F2B90D',
    textColor: '#3B1F5E',
    eyebrowColor: '#3B1F5E',
    line1Color: '#3B1F5E',
    line2Color: '#FFFFFF', // white italic title line
    subtitleColor: 'rgba(59, 31, 94, 0.8)',
    primaryBtnBg: '#3B1F5E',
    primaryBtnText: '#FFFFFF',
    secondaryBtnBorder: '#3B1F5E',
    secondaryBtnText: '#3B1F5E',
    archBorder: '#3B1F5E',
    arrowBg: 'rgba(59, 31, 94, 0.12)',
    arrowColor: '#3B1F5E',
  },
  {
    id: 2,
    eyebrow: 'BOUTIQUE CAPSULE + UP TO 50% OFF',
    headlineLine1: 'Modern Linen Sets',
    headlineLine2: '& Midi Silhouettes',
    subtitle: 'Effortless coordinated separates with artisan tailoring and relaxed ease.',
    image: 'https://images.unsplash.com/photo-1774005906344-57048d3f5856?auto=format&fit=crop&w=1600&h=900&q=80',
    link: '/shop/co-ord-sets',
    // Slide 2: ivory #FAF6EC
    bgColor: '#FAF6EC',
    textColor: '#3B1F5E',
    eyebrowColor: '#3B1F5E',
    line1Color: '#3B1F5E',
    line2Color: '#1E7A5A', // green italic title line
    subtitleColor: 'rgba(59, 31, 94, 0.8)',
    primaryBtnBg: '#1E5B47',
    primaryBtnText: '#FFFFFF',
    secondaryBtnBorder: '#1E5B47',
    secondaryBtnText: '#1E5B47',
    archBorder: '#1E5B47',
    arrowBg: 'rgba(59, 31, 94, 0.08)',
    arrowColor: '#3B1F5E',
  },
  {
    id: 3,
    eyebrow: 'DAILY OPULENCE + UP TO 50% OFF',
    headlineLine1: 'Pure Mulmul',
    headlineLine2: '& Chikankari Suits',
    subtitle: 'Breathable afternoon silhouettes tailored with authentic Lucknowi stitches.',
    image: 'https://images.unsplash.com/photo-1632826727346-43a7ac6bcb1b?auto=format&fit=crop&w=1600&h=900&q=80',
    link: '/shop/kurta-sets',
    // Slide 3: violet #46287C
    bgColor: '#46287C',
    textColor: '#FAF6EC',
    eyebrowColor: '#FAF6EC',
    line1Color: '#FAF6EC',
    line2Color: '#E9C569', // gold italic title line
    subtitleColor: 'rgba(250, 246, 236, 0.8)',
    primaryBtnBg: '#E9C569',
    primaryBtnText: '#3B1F5E',
    secondaryBtnBorder: '#FAF6EC',
    secondaryBtnText: '#FAF6EC',
    archBorder: '#E9C569',
    arrowBg: 'rgba(250, 246, 236, 0.15)',
    arrowColor: '#FAF6EC',
  },
];

// 2.8 The dot row doubles as slide indicators: four dots, 10px circles, 12px gap
const PALETTE_DOTS = [
  { id: 0, name: 'Marigold & Violet', color: '#3B1F5E', targetSlide: 0, ariaLabel: 'Go to slide 1', floatClass: 'hero-float-dot-0' },
  { id: 1, name: 'Warm Ivory & Green', color: '#1E7A5A', targetSlide: 1, ariaLabel: 'Go to slide 2', floatClass: 'hero-float-dot-1' },
  { id: 2, name: 'Deep Violet & Gold', color: '#E9C569', targetSlide: 2, ariaLabel: 'Go to slide 3', floatClass: 'hero-float-dot-2' },
  { id: 3, name: 'Warm Ivory Accent', color: '#FAF6EC', targetSlide: 1, ariaLabel: 'Go to slide 2', floatClass: 'hero-float-dot-3' },
];

const BUDGET_BANDS = [
  { label: 'Under ₹499', filterPrice: 499, description: 'Everyday crop tops & staples', tag: 'Steal Deals' },
  { label: 'Under ₹699', filterPrice: 699, description: 'Smocked blouses & tunics', tag: 'Popular' },
  { label: 'Under ₹899', filterPrice: 899, description: 'Handloom cottons & midis', tag: 'Value Picks' },
  { label: 'Under ₹999', filterPrice: 999, description: 'Chikankari & tiered dresses', tag: 'Best Buys' },
];

export const HomePage: React.FC = () => {
  const { products } = useStore();
  const navigate = useNavigate();

  // Part 2: Carousel state & Three.js guardrails
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');
  const [useThreeJs, setUseThreeJs] = useState(() => checkThreeCapability());
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Timers and gesture refs
  const autoplayTimerRef = useRef<number | null>(null);
  const resumeTimerRef = useRef<number | null>(null);
  const animatingLockTimerRef = useRef<number | null>(null);
  const dotCancelTimerRef = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Transition to a specific slide with 800ms isAnimating lock and directional wipe tracking
  const goToSlide = useCallback((nextIndex: number, direction?: 'next' | 'prev') => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSlideDirection(direction || (nextIndex >= currentSlide ? 'next' : 'prev'));
    setCurrentSlide(nextIndex);

    if (animatingLockTimerRef.current) clearTimeout(animatingLockTimerRef.current);
    animatingLockTimerRef.current = setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  }, [isAnimating, currentSlide]);

  const handleNextSlide = useCallback(() => {
    const nextIndex = (currentSlide + 1) % HERO_SLIDES.length;
    goToSlide(nextIndex, 'next');
  }, [currentSlide, goToSlide]);

  const handlePrevSlide = useCallback(() => {
    const prevIndex = (currentSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length;
    goToSlide(prevIndex, 'prev');
  }, [currentSlide, goToSlide]);

  // Dot click cancels autoplay for 10 seconds (2.10)
  const handleDotClick = (targetSlide: number) => {
    if (targetSlide === currentSlide || isAnimating) return;
    goToSlide(targetSlide, targetSlide >= currentSlide ? 'next' : 'prev');

    setIsPaused(true);
    if (dotCancelTimerRef.current) clearTimeout(dotCancelTimerRef.current);
    dotCancelTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 10000);
  };

  // Mouse move over hero: subtle background shift and arch image tilt
  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    setMousePos({ x, y });
  };

  const handleHeroMouseLeave = () => {
    resumeAutoplay();
    setMousePos({ x: 0, y: 0 });
  };

  // Pause on hover / touch / focus
  const pauseAutoplay = useCallback(() => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
    setIsPaused(true);
  }, []);

  // Resume 3s after pointer leave or blur (2.9)
  const resumeAutoplay = useCallback(() => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 3000);
  }, []);

  // Autoplay advances every 5.5s (2.9)
  useEffect(() => {
    if (isPaused) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    autoplayTimerRef.current = setInterval(() => {
      handleNextSlide();
    }, 5500);

    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [isPaused, handleNextSlide]);

  // Cleanup all timers on unmount (2.10)
  useEffect(() => {
    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      if (animatingLockTimerRef.current) clearTimeout(animatingLockTimerRef.current);
      if (dotCancelTimerRef.current) clearTimeout(dotCancelTimerRef.current);
    };
  }, []);

  // Mobile swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    pauseAutoplay();
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    resumeAutoplay();
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 45) {
      handleNextSlide();
    } else if (distance < -45) {
      handlePrevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Keyboard accessibility: Left / Right arrow navigation (3.3)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrevSlide();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNextSlide();
    }
  };

  // Product slices (8 bestsellers, 8 new arrivals)
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 8);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 8);

  const currentSlideData = HERO_SLIDES[currentSlide];

  return (
    <div className="pb-12">
      {/* Screen-reader live announcement of slide change */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {`Showing slide ${currentSlide + 1} of 3: ${currentSlideData.headlineLine1} ${currentSlideData.headlineLine2}`}
      </div>

      {/* PART 2: HERO CAROUSEL */}
      <section
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured collections"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseEnter={pauseAutoplay}
        onMouseLeave={handleHeroMouseLeave}
        onMouseMove={handleHeroMouseMove}
        onFocusCapture={pauseAutoplay}
        onBlurCapture={resumeAutoplay}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="hero relative w-full flex items-center justify-center select-none overflow-hidden focus:outline-none"
        style={{
          minHeight: 'calc(100vh - var(--header-h))',
          paddingBlock: 'clamp(24px, 4vh, 60px)',
        }}
      >
        {/* Three.js dynamic canvas background with directional wipe & particles */}
        {useThreeJs ? (
          <ThreeHeroCanvas
            currentSlide={currentSlide}
            slideDirection={slideDirection}
            slides={HERO_SLIDES.map((s) => ({ id: s.id, bgColor: s.bgColor }))}
            mousePos={mousePos}
            onFallback={() => setUseThreeJs(false)}
          />
        ) : (
          /* CSS-only fallback background crossfade (permanent fallback) */
          <div className="hero-bg absolute inset-0 pointer-events-none" aria-hidden="true">
            {HERO_SLIDES.map((slide, i) => (
              <div
                key={`bg-${slide.id}`}
                className="absolute inset-0 transition-opacity duration-300 ease-out"
                style={{
                  backgroundColor: slide.bgColor,
                  opacity: i === currentSlide ? 1 : 0,
                }}
              />
            ))}
          </div>
        )}

        {/* Hero content container: fluid container with clamp gutters */}
        <div className="site-container w-full relative z-10 px-4 sm:px-6 lg:px-8">
          {HERO_SLIDES.map((slide, index) => {
            const isActive = index === currentSlide;
            if (!isActive) return null;

            return (
              <article
                key={`slide-${slide.id}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of 3`}
                className="hero-slide w-full relative grid grid-cols-1 min-[900px]:grid-cols-[55%_45%] items-center"
                style={{ gap: 'clamp(24px, 4vw, 72px)' }}
              >
                {/* Giant background word AKAAY centered behind content */}
                <div
                  className="hero-word absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif font-black select-none pointer-events-none hero-animate-word z-0 text-center whitespace-nowrap overflow-hidden"
                  style={{
                    fontSize: 'clamp(100px, 18vw, 300px)',
                    lineHeight: 0.85,
                    color: slide.textColor,
                    opacity: 0.08,
                  }}
                  aria-hidden="true"
                >
                  AKAAY
                </div>

                {/* Left column (55% desktop): eyebrow, title, subtext, buttons */}
                <div className="hero-content relative z-10 flex flex-col items-center min-[900px]:items-start text-center min-[900px]:text-left">
                  {/* Eyebrow */}
                  <p
                    className="hero-animate-eyebrow font-semibold uppercase tracking-[0.25em]"
                    style={{
                      color: slide.eyebrowColor,
                      fontSize: 'clamp(11px, 0.9vw, 15px)',
                      marginBottom: 'clamp(8px, 1.2vh, 18px)',
                    }}
                  >
                    {slide.eyebrow}
                  </p>

                  {/* Title */}
                  <h1
                    className="font-serif tracking-tight"
                    style={{
                      fontSize: 'clamp(36px, 4.4vw, 76px)',
                      lineHeight: 1.05,
                      marginBottom: 'clamp(12px, 1.8vh, 24px)',
                    }}
                  >
                    <span
                      className="hero-animate-title1 block font-normal"
                      style={{ color: slide.line1Color }}
                    >
                      {slide.headlineLine1}
                    </span>
                    <span
                      className="hero-animate-title2 block italic"
                      style={{ color: slide.line2Color }}
                    >
                      {slide.headlineLine2}
                    </span>
                  </h1>

                  {/* Subtext */}
                  <p
                    className="hero-animate-subtext font-sans text-ink-700 leading-relaxed"
                    style={{
                      color: slide.subtitleColor,
                      fontSize: 'clamp(14px, 1.1vw, 20px)',
                      maxWidth: 'clamp(380px, 34vw, 580px)',
                      marginBottom: 'clamp(20px, 3vh, 40px)',
                    }}
                  >
                    {slide.subtitle}
                  </p>

                  {/* Buttons */}
                  <div
                    className="hero-animate-buttons flex flex-wrap items-center justify-center min-[900px]:justify-start"
                    style={{ gap: 'clamp(12px, 1.5vw, 24px)' }}
                  >
                    <Link
                      to={slide.link}
                      className="touch-tap-target rounded-full font-semibold tracking-wider uppercase transition-all duration-200 inline-flex items-center gap-2 shadow-md hover:-translate-y-0.5 hover:brightness-95 active:translate-y-0 focus-visible:ring-2 focus-visible:ring-offset-2"
                      style={{
                        backgroundColor: slide.primaryBtnBg,
                        color: slide.primaryBtnText,
                        fontSize: 'clamp(12px, 0.85vw, 15px)',
                        paddingInline: 'clamp(22px, 2vw, 36px)',
                        paddingBlock: 'clamp(12px, 1.2vh, 18px)',
                      }}
                    >
                      <span>SHOP NOW</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/offers"
                      className="touch-tap-target rounded-full font-semibold tracking-wider uppercase transition-all duration-200 inline-flex items-center hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-2 focus-visible:ring-offset-2 border-2"
                      style={{
                        borderColor: slide.secondaryBtnBorder,
                        color: slide.secondaryBtnText,
                        backgroundColor: 'transparent',
                        fontSize: 'clamp(12px, 0.85vw, 15px)',
                        paddingInline: 'clamp(22px, 2vw, 36px)',
                        paddingBlock: 'clamp(12px, 1.2vh, 18px)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = slide.secondaryBtnBorder;
                        e.currentTarget.style.color = slide.bgColor;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = slide.secondaryBtnText;
                      }}
                    >
                      <span>EXPLORE OFFERS</span>
                    </Link>
                  </div>
                </div>

                {/* Right column (45% desktop): Arch image & palette dots */}
                <div className="hero-media relative z-10 flex flex-col items-center justify-center">
                  <div className="hero-animate-arch mx-auto flex items-center justify-center">
                    <div
                      className="hero-float-arch flex items-center justify-center transition-transform duration-200 ease-out"
                      style={{
                        transform: `perspective(1000px) rotateY(${mousePos.x * 5}deg) rotateX(${-mousePos.y * 5}deg)`,
                      }}
                    >
                      <div
                        className="aspect-[3/4] rounded-t-full rounded-b-none overflow-hidden relative shadow-2xl"
                        style={{
                          width: 'clamp(240px, 24vw, 440px)',
                          border: `clamp(2px, 0.25vw, 4px) solid ${slide.archBorder}`,
                          boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
                        }}
                      >
                        <img
                          src={slide.image}
                          alt={`${slide.headlineLine1} ${slide.headlineLine2}`}
                          width="800"
                          height="1067"
                          className="w-full h-full object-cover object-top"
                          loading={index === 0 ? 'eager' : 'lazy'}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Palette Dot Row */}
                  <div
                    className="flex items-center justify-center z-20"
                    style={{
                      gap: 'clamp(10px, 1vw, 18px)',
                      marginTop: 'clamp(14px, 2vh, 28px)',
                    }}
                    role="tablist"
                    aria-label="Slide indicators"
                  >
                    {PALETTE_DOTS.map((dot) => {
                      const isDotActive = currentSlide === dot.targetSlide;
                      const needsRing = dot.color === '#FAF6EC' && currentSlide !== 2;
                      return (
                        <button
                          key={dot.id}
                          type="button"
                          role="tab"
                          aria-selected={isDotActive}
                          aria-label={dot.ariaLabel}
                          onClick={() => handleDotClick(dot.targetSlide)}
                          className={`rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${dot.floatClass} ${
                            isDotActive
                              ? 'opacity-100 scale-125'
                              : 'opacity-40 hover:opacity-80'
                          } ${needsRing ? 'ring-1 ring-[#3B1F5E]' : ''}`}
                          style={{
                            width: 'clamp(9px, 0.75vw, 14px)',
                            height: 'clamp(9px, 0.75vw, 14px)',
                            backgroundColor: dot.color,
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Carousel Side Arrows */}
        <button
          type="button"
          onClick={handlePrevSlide}
          aria-label="Previous slide"
          className="hidden min-[900px]:flex touch-tap-target absolute top-1/2 -translate-y-1/2 z-20 rounded-full items-center justify-center opacity-70 hover:opacity-100 transition-all duration-200 shadow-sm"
          style={{
            left: 'clamp(12px, 2vw, 36px)',
            width: 'clamp(40px, 3.2vw, 56px)',
            height: 'clamp(40px, 3.2vw, 56px)',
            backgroundColor: currentSlideData.arrowBg,
            color: currentSlideData.arrowColor,
          }}
        >
          <ChevronLeft style={{ width: 'clamp(18px, 1.4vw, 24px)', height: 'clamp(18px, 1.4vw, 24px)' }} />
        </button>
        <button
          type="button"
          onClick={handleNextSlide}
          aria-label="Next slide"
          className="hidden min-[900px]:flex touch-tap-target absolute top-1/2 -translate-y-1/2 z-20 rounded-full items-center justify-center opacity-70 hover:opacity-100 transition-all duration-200 shadow-sm"
          style={{
            right: 'clamp(12px, 2vw, 36px)',
            width: 'clamp(40px, 3.2vw, 56px)',
            height: 'clamp(40px, 3.2vw, 56px)',
            backgroundColor: currentSlideData.arrowBg,
            color: currentSlideData.arrowColor,
          }}
        >
          <ChevronRight style={{ width: 'clamp(18px, 1.4vw, 24px)', height: 'clamp(18px, 1.4vw, 24px)' }} />
        </button>
      </section>

      {/* Marquee Strip directly under the hero */}
      <aside
        className="w-full bg-[#3B1F5E] overflow-hidden flex items-center select-none z-20 relative"
        style={{ height: 'clamp(40px, 4.5vh, 60px)' }}
        aria-hidden="true"
      >
        <div className="animate-marquee flex whitespace-nowrap">
          <span
            className="font-serif italic text-[#FAF6EC] px-4"
            style={{ fontSize: 'clamp(12px, 0.95vw, 16px)', letterSpacing: '0.12em' }}
          >
            HEIRLOOM SILKS + ORGANZA DRAPES + MULMUL COTTONS + CHIKANKARI SUITS + HAND EMBROIDERY +&nbsp;
          </span>
          <span
            className="font-serif italic text-[#FAF6EC] px-4"
            style={{ fontSize: 'clamp(12px, 0.95vw, 16px)', letterSpacing: '0.12em' }}
          >
            HEIRLOOM SILKS + ORGANZA DRAPES + MULMUL COTTONS + CHIKANKARI SUITS + HAND EMBROIDERY +&nbsp;
          </span>
        </div>
      </aside>

      {/* Sections 2-7: Standard elegant boutique layout matching Image 1 & 2 */}
      <div
        className="flex flex-col"
        style={{
          gap: 'var(--section-y)',
          paddingBlock: 'var(--section-y)',
        }}
      >
        {/* 2. CIRCULAR CATEGORY TILES ROW (Matches Image 1 & 2: 6 columns across fluid container) */}
        <section className="site-container px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <span
              className="uppercase tracking-widest text-terracotta font-semibold block"
              style={{ fontSize: 'clamp(11px, 0.8vw, 14px)' }}
            >
              Artisanal Curation
            </span>
            <h2
              className="font-serif text-ink font-normal mt-1"
              style={{ fontSize: 'clamp(22px, 2vw, 36px)' }}
            >
              Shop by Category
            </h2>
            <div className="w-12 h-0.5 bg-terracotta/40 mx-auto mt-2" />
          </div>

          <div
            className="grid grid-cols-3 min-[900px]:grid-cols-6 justify-items-center"
            style={{ gap: 'clamp(12px, 2vw, 36px)' }}
          >
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                to={`/shop/${cat.slug}`}
                className="group flex flex-col items-center text-center space-y-2 focus:outline-none"
              >
                <div
                  className="rounded-full overflow-hidden p-1 border-2 border-ivory-400 group-hover:border-terracotta transition-colors shadow-sm flex-shrink-0"
                  style={{
                    width: 'clamp(90px, 9.5vw, 180px)',
                    height: 'clamp(90px, 9.5vw, 180px)',
                    aspectRatio: '1 / 1',
                  }}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    width="180"
                    height="180"
                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div>
                  <span
                    className="font-serif font-medium text-ink group-hover:text-terracotta transition-colors block"
                    style={{ fontSize: 'clamp(13px, 1vw, 18px)' }}
                  >
                    {cat.name}
                  </span>
                  <span
                    className="text-ink-500 font-sans hidden sm:block"
                    style={{ fontSize: 'clamp(10px, 0.75vw, 13px)' }}
                  >
                    {cat.tag}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. "BUDGET FINDS" PRICE-BAND STRIP (Matches Image 1 & 2: 4 columns across fluid container) */}
        <section className="site-container px-4 sm:px-6 lg:px-8">
          <div
            className="bg-ivory-300 border border-ivory-400"
            style={{
              padding: 'clamp(20px, 3vw, 48px)',
              borderRadius: 'clamp(12px, 1.2vw, 24px)',
            }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
              <div>
                <span
                  className="uppercase tracking-widest text-marigold-600 font-bold block"
                  style={{ fontSize: 'clamp(11px, 0.8vw, 14px)' }}
                >
                  Affordable Luxury
                </span>
                <h2
                  className="font-serif text-ink font-normal"
                  style={{ fontSize: 'clamp(22px, 2vw, 36px)' }}
                >
                  Budget Finds & Daily Ensembles
                </h2>
              </div>
              <Link
                to="/offers"
                className="font-medium text-terracotta hover:underline inline-flex items-center gap-1"
                style={{ fontSize: 'clamp(12px, 0.85vw, 15px)' }}
              >
                <span>Explore All Offers</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div
              className="grid grid-cols-2 min-[900px]:grid-cols-4"
              style={{ gap: 'clamp(12px, 1.5vw, 24px)' }}
            >
              {BUDGET_BANDS.map((band) => (
                <div
                  key={band.filterPrice}
                  onClick={() => navigate(`/offers?maxPrice=${band.filterPrice}`)}
                  className="cursor-pointer group bg-ivory rounded-lg border border-ivory-400 hover:border-terracotta transition-all shadow-sm flex flex-col justify-between"
                  style={{ padding: 'clamp(14px, 1.5vw, 28px)' }}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-terracotta bg-terracotta/10 px-2 py-0.5 rounded">
                        {band.tag}
                      </span>
                      <span className="text-xs text-ink-400 group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </div>
                    <h3
                      className="font-serif font-bold text-ink mt-2"
                      style={{ fontSize: 'clamp(18px, 1.6vw, 28px)' }}
                    >
                      {band.label}
                    </h3>
                    <p
                      className="text-ink-500 mt-1"
                      style={{ fontSize: 'clamp(11px, 0.85vw, 14px)' }}
                    >
                      {band.description}
                    </p>
                  </div>
                  <div
                    className="mt-4 pt-3 border-t border-ivory-300 font-semibold text-terracotta"
                    style={{ fontSize: 'clamp(11px, 0.85vw, 14px)' }}
                  >
                    Browse Ensembles
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. BEST SELLING PRODUCT ROW (8 PRODUCTS in 4 columns) */}
        <section className="site-container px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span
                className="uppercase tracking-widest text-terracotta font-semibold block"
                style={{ fontSize: 'clamp(11px, 0.8vw, 14px)' }}
              >
                Loved by Patrons
              </span>
              <h2
                className="font-serif text-ink font-normal mt-0.5"
                style={{ fontSize: 'clamp(22px, 2vw, 36px)' }}
              >
                Best Selling Ensembles
              </h2>
            </div>
            <Link
              to="/best-selling"
              className="font-medium text-terracotta hover:underline inline-flex items-center gap-1"
              style={{ fontSize: 'clamp(12px, 0.85vw, 15px)' }}
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
            style={{ gap: 'clamp(14px, 1.8vw, 32px)' }}
          >
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* 5. BOUTIQUE PROMISE STRIP (4 items) */}
        <section
          className="bg-ivory-200 border-y border-ivory-400"
          style={{ paddingBlock: 'clamp(32px, 4vw, 56px)' }}
        >
          <div className="site-container px-4 sm:px-6 lg:px-8">
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 text-center"
              style={{ gap: 'clamp(16px, 2vw, 36px)' }}
            >
              <div className="flex flex-col items-center space-y-2 p-2">
                <Shield
                  className="text-terracotta"
                  style={{ width: 'clamp(22px, 1.8vw, 32px)', height: 'clamp(22px, 1.8vw, 32px)' }}
                />
                <h4
                  className="font-serif font-medium text-ink"
                  style={{ fontSize: 'clamp(14px, 1.05vw, 18px)' }}
                >
                  Handloom Certified
                </h4>
                <p
                  className="text-ink-500 max-w-xs"
                  style={{ fontSize: 'clamp(11px, 0.8vw, 14px)' }}
                >
                  Authentic master weaver creations sourced directly from Varanasi, Lucknow & Chanderi.
                </p>
              </div>

              <div className="flex flex-col items-center space-y-2 p-2">
                <Clock
                  className="text-terracotta"
                  style={{ width: 'clamp(22px, 1.8vw, 32px)', height: 'clamp(22px, 1.8vw, 32px)' }}
                />
                <h4
                  className="font-serif font-medium text-ink"
                  style={{ fontSize: 'clamp(14px, 1.05vw, 18px)' }}
                >
                  3-5 Day Express Shipping
                </h4>
                <p
                  className="text-ink-500 max-w-xs"
                  style={{ fontSize: 'clamp(11px, 0.8vw, 14px)' }}
                >
                  Carefully inspected, steam-pressed, and shipped in signature boutique packaging.
                </p>
              </div>

              <div className="flex flex-col items-center space-y-2 p-2">
                <HeartHandshake
                  className="text-terracotta"
                  style={{ width: 'clamp(22px, 1.8vw, 32px)', height: 'clamp(22px, 1.8vw, 32px)' }}
                />
                <h4
                  className="font-serif font-medium text-ink"
                  style={{ fontSize: 'clamp(14px, 1.05vw, 18px)' }}
                >
                  Instant WhatsApp Stylist
                </h4>
                <p
                  className="text-ink-500 max-w-xs"
                  style={{ fontSize: 'clamp(11px, 0.8vw, 14px)' }}
                >
                  Real human guidance on blouse sizing, custom tailoring, and color matching.
                </p>
              </div>

              <div className="flex flex-col items-center space-y-2 p-2">
                <RotateCcw
                  className="text-terracotta"
                  style={{ width: 'clamp(22px, 1.8vw, 32px)', height: 'clamp(22px, 1.8vw, 32px)' }}
                />
                <h4
                  className="font-serif font-medium text-ink"
                  style={{ fontSize: 'clamp(14px, 1.05vw, 18px)' }}
                >
                  7-Day Seamless Exchange
                </h4>
                <p
                  className="text-ink-500 max-w-xs"
                  style={{ fontSize: 'clamp(11px, 0.8vw, 14px)' }}
                >
                  Hassle-free sizing exchanges and dedicated concierge support on every order.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. NEW ARRIVALS PRODUCT ROW (8 PRODUCTS in 4 columns) */}
        <section className="site-container px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span
                className="uppercase tracking-widest text-marigold-600 font-bold block"
                style={{ fontSize: 'clamp(11px, 0.8vw, 14px)' }}
              >
                Fresh Off the Loom
              </span>
              <h2
                className="font-serif text-ink font-normal mt-0.5"
                style={{ fontSize: 'clamp(22px, 2vw, 36px)' }}
              >
                New Arrivals
              </h2>
            </div>
            <Link
              to="/new-arrivals"
              className="font-medium text-terracotta hover:underline inline-flex items-center gap-1"
              style={{ fontSize: 'clamp(12px, 0.85vw, 15px)' }}
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
            style={{ gap: 'clamp(14px, 1.8vw, 32px)' }}
          >
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* 7. REVIEWS (4 SHORT REVIEWS WITH NAMES, CITIES, RATINGS) */}
        <section className="site-container px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span
              className="uppercase tracking-widest text-terracotta font-semibold block"
              style={{ fontSize: 'clamp(11px, 0.8vw, 14px)' }}
            >
              Client Testimonials
            </span>
            <h2
              className="font-serif text-ink font-normal mt-1"
              style={{ fontSize: 'clamp(22px, 2vw, 36px)' }}
            >
              Words of Love from Our Patrons
            </h2>
            <div className="w-12 h-0.5 bg-terracotta/40 mx-auto mt-2" />
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            style={{ gap: 'clamp(14px, 1.5vw, 28px)' }}
          >
            {REVIEWS.map((review) => (
              <div
                key={review.id}
                className="bg-ivory rounded-lg border border-ivory-400 flex flex-col justify-between shadow-sm space-y-4"
                style={{ padding: 'clamp(16px, 1.5vw, 24px)' }}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-marigold">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(review.rating)
                            ? 'fill-marigold stroke-marigold'
                            : 'fill-transparent stroke-marigold/60'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-semibold text-ink-600 ml-1">
                      {review.rating.toFixed(1)}
                    </span>
                  </div>
                  <p
                    className="text-ink-700 leading-relaxed italic"
                    style={{ fontSize: 'clamp(12px, 0.9vw, 15px)' }}
                  >
                    "{review.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-ivory-300">
                  <div className="flex items-center justify-between">
                    <span
                      className="font-serif font-medium text-ink"
                      style={{ fontSize: 'clamp(13px, 0.95vw, 16px)' }}
                    >
                      {review.name}
                    </span>
                    <span className="text-[11px] text-ink-400">{review.city}</span>
                  </div>
                  <span className="text-[10px] text-terracotta font-sans block mt-0.5">
                    Ordered {review.productName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
