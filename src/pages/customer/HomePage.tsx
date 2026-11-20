import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, ArrowRight, Sparkles, Shield, Clock, HeartHandshake } from 'lucide-react';
import { CATEGORIES, REVIEWS } from '../../data/products';
import { ProductCard } from '../../components/common/ProductCard';
import { useStore } from '../../context/StoreContext';

const HERO_SLIDES = [
  {
    id: 1,
    title: 'Heirloom Silks & Organza Drapes',
    subtitle: 'Hand-embroidered festive ensembles crafted for unforgettable celebrations.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&h=900&q=80',
    link: '/shop/sarees',
    category: 'Festive Edit',
  },
  {
    id: 2,
    title: 'Pure Mulmul & Chikankari Suits',
    subtitle: 'Breathable afternoon silhouettes tailored with authentic Lucknowi stitches.',
    image: 'https://images.unsplash.com/photo-1632826727346-43a7ac6bcb1b?auto=format&fit=crop&w=1600&h=900&q=80',
    link: '/shop/kurta-sets',
    category: 'Daily Opulence',
  },
  {
    id: 3,
    title: 'Modern Linen Sets & Midi Silhouettes',
    subtitle: 'Effortless coordinated separates with artisan tailoring and relaxed ease.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&h=900&q=80',
    link: '/shop/co-ord-sets',
    category: 'Boutique Capsule',
  },
];

const BUDGET_BANDS = [
  { label: 'Under ₹499', filterPrice: 499, description: 'Everyday crop tops & staples', tag: 'Steal Deals' },
  { label: 'Under ₹699', filterPrice: 699, description: 'Smocked blouses & tunics', tag: 'Popular' },
  { label: 'Under ₹899', filterPrice: 899, description: 'Handloom cottons & midis', tag: 'Value Picks' },
  { label: 'Under ₹999', filterPrice: 999, description: 'Chikankari & tiered dresses', tag: 'Best Buys' },
];

export const HomePage: React.FC = () => {
  const { products, settings } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const navigate = useNavigate();

  // 5s Auto-advance timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  // Mobile swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      handleNextSlide();
    } else if (distance < -50) {
      handlePrevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Product slices (8 bestsellers, 8 new arrivals)
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 8);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 8);

  const heroOfferText = settings.heroOfferText || 'up to 50% off';

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* 1. HERO CAROUSEL */}
      <section
        className="relative w-full overflow-hidden bg-ivory-300"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative h-[420px] sm:h-[520px] md:h-[600px] w-full">
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                width="1600"
                height="900"
                className="w-full h-full object-cover object-top"
              />
              {/* Gradient Overlay for warm readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-ink-900/30 to-transparent sm:bg-gradient-to-r sm:from-ink-900/85 sm:via-ink-900/40 sm:to-transparent" />

              {/* Slide Content */}
              <div className="absolute inset-0 flex items-end sm:items-center">
                <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full pb-10 sm:pb-0">
                  <div className="max-w-xl text-ivory space-y-3 sm:space-y-4">
                    <div className="inline-flex items-center gap-2 bg-marigold/20 border border-marigold/50 text-marigold text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{slide.category} • {heroOfferText}</span>
                    </div>

                    <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-normal leading-[1.15]">
                      {slide.title}
                    </h1>

                    <p className="text-xs sm:text-base text-ivory-300 line-clamp-2 max-w-md font-sans">
                      {slide.subtitle}
                    </p>

                    <div className="pt-2 flex items-center gap-3">
                      <Link
                        to={slide.link}
                        className="touch-tap-target px-6 py-3 rounded bg-terracotta text-white font-medium text-xs sm:text-sm uppercase tracking-wider hover:bg-terracotta-600 transition-colors shadow-md inline-flex items-center gap-2"
                      >
                        <span>Shop Now</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <Link
                        to="/offers"
                        className="touch-tap-target px-5 py-3 rounded bg-ivory/15 border border-ivory/30 text-ivory font-medium text-xs sm:text-sm uppercase tracking-wider hover:bg-ivory/25 transition-colors inline-flex items-center"
                      >
                        Explore Offers
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Carousel Arrows (Desktop) */}
          <button
            type="button"
            onClick={handlePrevSlide}
            aria-label="Previous Slide"
            className="hidden sm:flex touch-tap-target absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-ivory/80 text-ink hover:bg-ivory hover:text-terracotta items-center justify-center transition-colors shadow"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleNextSlide}
            aria-label="Next Slide"
            className="hidden sm:flex touch-tap-target absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-ivory/80 text-ink hover:bg-ivory hover:text-terracotta items-center justify-center transition-colors shadow"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center items-center gap-2">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  i === currentSlide ? 'w-6 h-1.5 bg-marigold' : 'w-1.5 h-1.5 bg-ivory/60'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. CIRCULAR CATEGORY TILES ROW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
            Artisanal Curation
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal mt-1">
            Shop by Category
          </h2>
          <div className="w-12 h-0.5 bg-terracotta/40 mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/shop/${cat.slug}`}
              className="group flex flex-col items-center text-center space-y-2 focus:outline-none"
            >
              <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden p-0.5 border-2 border-ivory-400 group-hover:border-terracotta transition-colors shadow-sm">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  width="120"
                  height="120"
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div>
                <span className="font-serif text-xs sm:text-sm font-medium text-ink group-hover:text-terracotta transition-colors block">
                  {cat.name}
                </span>
                <span className="text-[10px] text-ink-500 font-sans hidden sm:block">
                  {cat.tag}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. "BUDGET FINDS" PRICE-BAND STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-ivory-300 rounded-xl p-5 sm:p-8 border border-ivory-400">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
            <div>
              <span className="text-xs uppercase tracking-widest text-marigold-600 font-bold">
                Affordable Luxury
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal">
                Budget Finds & Daily Ensembles
              </h2>
            </div>
            <Link
              to="/offers"
              className="text-xs sm:text-sm font-medium text-terracotta hover:underline inline-flex items-center gap-1"
            >
              <span>Explore All Offers</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {BUDGET_BANDS.map((band) => (
              <div
                key={band.filterPrice}
                onClick={() => navigate(`/offers?maxPrice=${band.filterPrice}`)}
                className="cursor-pointer group bg-ivory rounded-lg p-4 sm:p-5 border border-ivory-400 hover:border-terracotta transition-all shadow-sm flex flex-col justify-between"
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
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink mt-3">
                    {band.label}
                  </h3>
                  <p className="text-xs text-ink-500 mt-1">{band.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-ivory-300 text-[11px] font-semibold text-terracotta">
                  Browse Ensembles
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. BEST SELLING PRODUCT ROW (8 PRODUCTS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
              Loved by Patrons
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal mt-0.5">
              Best Selling Ensembles
            </h2>
          </div>
          <Link
            to="/best-selling"
            className="text-xs sm:text-sm font-medium text-terracotta hover:underline inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Scrollable / Grid row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* BOUTIQUE PROMISE STRIP */}
      <section className="bg-ivory-200 border-y border-ivory-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center space-y-2 p-2">
              <Shield className="w-6 h-6 text-terracotta" />
              <h4 className="font-serif text-base font-medium text-ink">Handloom Certified</h4>
              <p className="text-xs text-ink-500 max-w-xs">
                Authentic master weaver creations sourced directly from Varanasi, Lucknow & Chanderi.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 p-2">
              <Clock className="w-6 h-6 text-terracotta" />
              <h4 className="font-serif text-base font-medium text-ink">3-5 Day Express Shipping</h4>
              <p className="text-xs text-ink-500 max-w-xs">
                Carefully inspected, steam-pressed, and shipped in signature boutique packaging.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 p-2">
              <HeartHandshake className="w-6 h-6 text-terracotta" />
              <h4 className="font-serif text-base font-medium text-ink">Instant WhatsApp Stylist</h4>
              <p className="text-xs text-ink-500 max-w-xs">
                Real human guidance on blouse sizing, custom tailoring, and color matching.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NEW ARRIVALS PRODUCT ROW (8 PRODUCTS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-marigold-600 font-bold">
              Fresh Off the Loom
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal mt-0.5">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/new-arrivals"
            className="text-xs sm:text-sm font-medium text-terracotta hover:underline inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. REVIEWS (4 SHORT REVIEWS WITH NAMES, CITIES, RATINGS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
            Client Testimonials
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal mt-1">
            Words of Love from Our Patrons
          </h2>
          <div className="w-12 h-0.5 bg-terracotta/40 mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-ivory rounded-lg p-5 border border-ivory-400 flex flex-col justify-between shadow-sm space-y-4"
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
                <p className="text-xs sm:text-sm text-ink-700 leading-relaxed italic">
                  "{review.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-ivory-300">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-sm font-medium text-ink">{review.name}</span>
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
  );
};
