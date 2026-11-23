import React, { useState, useEffect, useRef, useCallback } from 'react';

interface SiteLoaderProps {
  onHeroStart: () => void;
  onComplete: () => void;
}

export const SiteLoader: React.FC<SiteLoaderProps> = ({ onHeroStart, onComplete }) => {
  const [isZooming, setIsZooming] = useState(false);
  const [isFast, setIsFast] = useState(false);
  const hasTriggeredHero = useRef(false);
  const hasCompleted = useRef(false);
  const logoRef = useRef<HTMLDivElement>(null);

  // Check preview override: /?intro=1
  const isIntroPreview = typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('intro') === '1';

  // Trigger hero animation start (at 1850ms, 150ms before overlay finishes fading)
  const triggerHero = useCallback(() => {
    if (!hasTriggeredHero.current) {
      hasTriggeredHero.current = true;
      onHeroStart();
    }
  }, [onHeroStart]);

  // Finish loader and clean up
  const finish = useCallback(() => {
    if (!hasCompleted.current) {
      hasCompleted.current = true;
      triggerHero();
      // A2 & A3: Store flag only if not in ?intro=1 preview mode
      if (!isIntroPreview) {
        try {
          sessionStorage.setItem('akaayIntroSeenV2', 'true');
        } catch {
          // Ignore storage exceptions in private/sandboxed modes
        }
      }
      onComplete();
    }
  }, [triggerHero, onComplete, isIntroPreview]);

  // Skip immediately on click, tap, or Escape (compressed to 250ms)
  const handleSkip = useCallback(() => {
    if (isZooming || hasCompleted.current) return;
    setIsFast(true);
    setIsZooming(true);
    // In fast skip (250ms), start hero 100ms in and finish at 250ms
    setTimeout(triggerHero, 100);
    setTimeout(finish, 250);
  }, [isZooming, triggerHero, finish]);

  useEffect(() => {
    // A6: Lock body scroll while loader is present
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // A5: Failsafe: 2500ms timeout that removes loader no matter what
    const failsafeTimer = setTimeout(() => {
      finish();
    }, 2500);

    // Normal sequence:
    // 1500ms: Step d - enter-through zoom & overlay fade out (700ms)
    const zoomTimer = setTimeout(() => {
      setIsZooming(true);
    }, 1500);

    // 1850ms: A7 - 150ms before overlay finishes, start hero entrance
    const heroTimer = setTimeout(() => {
      triggerHero();
    }, 1850);

    // 2200ms: A6 - Complete sequence and unmount from DOM
    const finishTimer = setTimeout(() => {
      finish();
    }, 2200);

    // Escape key listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      clearTimeout(failsafeTimer);
      clearTimeout(zoomTimer);
      clearTimeout(heroTimer);
      clearTimeout(finishTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSkip, triggerHero, finish]);

  return (
    <div
      onClick={handleSkip}
      onTouchStart={handleSkip}
      role="dialog"
      aria-modal="true"
      aria-label="Akaay Boutique Intro"
      className={`site-loader akaay-loader-overlay select-none cursor-pointer overflow-hidden ${
        isZooming
          ? isFast
            ? 'akaay-loader-fade-out-fast pointer-events-none'
            : 'akaay-loader-fade-out pointer-events-none'
          : 'opacity-100'
      }`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#46287C',
      }}
    >
      {/* Centered Logo Circle: Gold circle with deep violet 'A' mark: clamp(72px, 10vw, 128px) */}
      <div
        ref={logoRef}
        className={`rounded-full bg-[#E9C569] text-[#46287C] flex items-center justify-center shadow-2xl relative ${
          isZooming
            ? isFast
              ? 'akaay-loader-zoom-out-fast'
              : 'akaay-loader-zoom-out'
            : 'akaay-loader-circle-in'
        }`}
        style={{
          width: 'clamp(72px, 10vw, 128px)',
          height: 'clamp(72px, 10vw, 128px)',
        }}
      >
        <svg viewBox="0 0 24 24" className="w-[55%] h-[55%] fill-current" aria-hidden="true">
          <path d="M12 3L5 20H8.2L9.8 15.8H14.2L15.8 20H19L12 3ZM12 8.5L13.3 12.8H10.7L12 8.5Z" />
        </svg>
      </div>

      {/* Wordmark under it in Fraunces: clamp(11px, 1vw, 14px), letter-spacing 0.35em */}
      <div
        className={`mt-6 text-center ${
          isZooming
            ? 'opacity-0 transition-opacity duration-200'
            : 'akaay-loader-wordmark-in'
        }`}
      >
        <span
          className="font-serif text-[#FAF6EC] uppercase font-semibold block"
          style={{
            fontSize: 'clamp(11px, 1vw, 14px)',
            letterSpacing: '0.35em',
          }}
        >
          AKAAY BOUTIQUE
        </span>
      </div>

      {/* Subtle skip hint for keyboard/screen-reader users */}
      <span className="sr-only">Click or press Escape to skip intro</span>
    </div>
  );
};
