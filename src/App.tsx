import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Snowflake, Sparkles, X, ListChecks } from 'lucide-react';

interface CarouselItem {
  id: string;
  src: string;
  bg: string;
  panel: string;
  accent: string;
  title: string;
  duration?: string;
  price?: string;
  freeze?: string;
  badge?: string;
  description: string;
  features: string[];
  whatsappMessage: string;
  alt: string;
  isCutout?: boolean;
}

const ITEMS: CarouselItem[] = [
  {
    id: 'coach-boda',
    src: 'https://i.postimg.cc/5t9dBpP8/1000244341-removebg-preview.png',
    bg: '#E06D44',
    panel: '#F0855D',
    accent: '#FFD166',
    title: 'COACH BODA',
    badge: '1-ON-1 ONLINE COACHING',
    description:
      'Personalized fitness programming, nutrition mastery, and physique transformation. Real results with dedicated 1-on-1 coaching.',
    features: [
      'Personalized Workout & Nutrition Plans',
      'Continuous Body Composition & Progress Tracking',
      'Direct WhatsApp Follow-up & Priority Support',
      'Tailored Adjustments to Fit Your Exact Lifestyle & Goals',
    ],
    whatsappMessage: 'Hello Coach Boda, I would like to inquire about your online coaching programs.',
    alt: 'Coach Boda',
    isCutout: true,
  },
  {
    id: '1-month-plan',
    src: 'https://i.postimg.cc/Gtdkt831/IMG-20260902-172237.png',
    bg: '#0E2416',
    panel: '#1A4328',
    accent: '#2CEE2C',
    title: '1 MONTH PLAN',
    duration: '1 MONTH',
    price: '400 EGP',
    freeze: 'No Freeze',
    badge: 'STARTER PROGRAM',
    description:
      '400 EGP • Personalized Workout & Nutrition Plan, Weekly Follow-up, Progress Tracking, Body Evolution Support & Plan Adjustments.',
    features: [
      'Personalized Workout Plan',
      'Personalized Nutrition Plan',
      'Weekly Follow-up',
      'Progress Tracking',
      'متابعة شكل الجسم وتطور المستوي',
      'تعديل الـ Plan حسب الـ Progress',
      'Support & Questions',
      'إمكانية Freeze الاشتراك عند الحاجة (No Freeze)',
    ],
    whatsappMessage: 'Hello Coach Boda, I want to join the 1 Month Package (400 EGP).',
    alt: '1 Month Online Coaching Package - 400 EGP',
    isCutout: false,
  },
  {
    id: '3-months-plan',
    src: 'https://i.postimg.cc/2ykZmsTC/IMG-20260902-172302.png',
    bg: '#210F38',
    panel: '#3D1B68',
    accent: '#C084FC',
    title: '3 MONTHS PLAN',
    duration: '3 MONTHS',
    price: '1,000 EGP',
    freeze: '1 Week Freeze',
    badge: 'POPULAR CHOICE',
    description:
      '1,000 EGP • Everything in 1 Month Plan, Weekly Progress Photos, Detailed Body Follow-up, Plan Adjustments, Priority Support & 1 Week Freeze.',
    features: [
      'Everything in 1 Month Plan',
      'Weekly Progress Photos',
      'Detailed Body Progress Follow-up',
      'Weekly Plan Adjustments',
      'متابعة أدق للأداء والتقدم',
      'تعديل التغذية والتمرين حسب الـ Progress',
      'Priority Support',
      'مرونة أكبر في تعديل الـ Plan',
      'FREEZE: 1 Week Freeze',
    ],
    whatsappMessage: 'Hello Coach Boda, I want to join the 3 Months Package (1,000 EGP).',
    alt: '3 Months Online Coaching Package - 1,000 EGP',
    isCutout: false,
  },
  {
    id: '6-months-plan',
    src: 'https://i.postimg.cc/Qd2KV903/IMG-20260902-172359.png',
    bg: '#2B1E05',
    panel: '#4F380A',
    accent: '#FACC15',
    title: '6 MONTHS PLAN',
    duration: '6 MONTHS',
    price: '1,600 EGP',
    freeze: '2 Weeks Freeze',
    badge: 'TOTAL TRANSFORMATION',
    description:
      '1,600 EGP • Everything in 3 Months Plan, Daily Meal Check-in, 24/7 Questions & Support, Daily Lifestyle Follow-up, Continuous Plan Adjustments & 2 Weeks Freeze.',
    features: [
      'Everything in 3 Months Plan',
      'Daily Meal Check-in',
      '24/7 Questions & Support',
      'Daily Progress & Lifestyle Follow-up',
      'Continuous Plan Adjustments',
      'متابعة دقيقة للتفاصيل اليومية',
      'تعديل ال Plan حسب ال Lifestyle بشكل مستمر',
      'Maximum Attention & Support',
      'FREEZE: 2 Weeks Freeze',
    ],
    whatsappMessage: 'Hello Coach Boda, I want to join the 6 Months Package (1,600 EGP).',
    alt: '6 Months Online Coaching Package - 1,600 EGP',
    isCutout: false,
  },
];

const NOISE_SVG_DATA_URI =
  "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E";

export default function App() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [showFeaturesModal, setShowFeaturesModal] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Preload all package images on mount
  useEffect(() => {
    ITEMS.forEach((item) => {
      const imageObj = new Image();
      imageObj.src = item.src;
    });
  }, []);

  // Update mobile status on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Navigation handler with animation lock for circular items
  const navigate = useCallback(
    (direction: 'next' | 'prev') => {
      if (isAnimating) return;

      setIsAnimating(true);
      setActiveIndex((prev) => {
        if (direction === 'next') {
          return (prev + 1) % ITEMS.length;
        } else {
          return (prev - 1 + ITEMS.length) % ITEMS.length;
        }
      });

      const timer = window.setTimeout(() => {
        setIsAnimating(false);
      }, 650);

      return () => clearTimeout(timer);
    },
    [isAnimating]
  );

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showFeaturesModal) {
        if (e.key === 'Escape') {
          setShowFeaturesModal(false);
        }
        return;
      }
      if (e.key === 'ArrowLeft') {
        navigate('prev');
      } else if (e.key === 'ArrowRight') {
        navigate('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, showFeaturesModal]);

  // Touch swipe support with horizontal threshold check
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = touchStartX.current - endX;
    const diffY = (touchStartY.current ?? endY) - endY;

    // Trigger only if horizontal swipe exceeds vertical movement and threshold
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX > 0) {
        navigate('next');
      } else {
        navigate('prev');
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Determine role styles for carousel items
  const getRoleStyle = (index: number) => {
    const total = ITEMS.length;
    const diff = (index - activeIndex + total) % total;

    let role: 'center' | 'left' | 'right' | 'hidden';

    if (diff === 0) {
      role = 'center';
    } else if (diff === total - 1) {
      role = 'left';
    } else if (diff === 1) {
      role = 'right';
    } else {
      role = 'hidden';
    }

    const item = ITEMS[index];

    switch (role) {
      case 'center':
        return {
          role,
          transform: item.isCutout
            ? `translateX(-50%) scale(${isMobile ? 1.32 : 1.78})`
            : `translateX(-50%) scale(${isMobile ? 1.16 : 1.42})`,
          filter: 'blur(0px)',
          opacity: 1,
          zIndex: 20,
          left: '50%',
          width: item.isCutout
            ? isMobile
              ? '90%'
              : '55%'
            : isMobile
            ? '98%'
            : '82%',
          height: item.isCutout
            ? isMobile
              ? '68%'
              : '94%'
            : isMobile
            ? '52%'
            : '76%',
          bottom: item.isCutout
            ? isMobile
              ? '16%'
              : '0%'
            : isMobile
            ? '20%'
            : '9%',
          pointerEvents: 'auto' as const,
          cursor: 'default',
        };
      case 'left':
        return {
          role,
          transform: 'translateX(-50%) scale(0.9)',
          filter: 'blur(3px)',
          opacity: 0.8,
          zIndex: 10,
          left: isMobile ? '10%' : '20%',
          width: item.isCutout
            ? isMobile
              ? '52%'
              : '34%'
            : isMobile
            ? '62%'
            : '50%',
          height: item.isCutout
            ? isMobile
              ? '28%'
              : '48%'
            : isMobile
            ? '24%'
            : '40%',
          bottom: isMobile ? '28%' : '11%',
          pointerEvents: 'auto' as const,
          cursor: 'pointer',
        };
      case 'right':
        return {
          role,
          transform: 'translateX(-50%) scale(0.9)',
          filter: 'blur(3px)',
          opacity: 0.8,
          zIndex: 10,
          left: isMobile ? '90%' : '80%',
          width: item.isCutout
            ? isMobile
              ? '52%'
              : '34%'
            : isMobile
            ? '62%'
            : '50%',
          height: item.isCutout
            ? isMobile
              ? '28%'
              : '48%'
            : isMobile
            ? '24%'
            : '40%',
          bottom: isMobile ? '28%' : '11%',
          pointerEvents: 'auto' as const,
          cursor: 'pointer',
        };
      case 'hidden':
      default:
        return {
          role,
          transform: 'translateX(-50%) scale(0.55)',
          filter: 'blur(6px)',
          opacity: 0,
          zIndex: 0,
          left: '50%',
          width: '40%',
          height: '40%',
          bottom: '10%',
          pointerEvents: 'none' as const,
          cursor: 'default',
        };
    }
  };

  const handleItemClick = (role: 'center' | 'left' | 'right' | 'hidden') => {
    if (role === 'left') {
      navigate('prev');
    } else if (role === 'right') {
      navigate('next');
    }
  };

  const currentItem = ITEMS[activeIndex];

  const getWhatsAppLink = () => {
    return (
      'https://wa.me/201150941297?text=' +
      encodeURIComponent(currentItem.whatsappMessage)
    );
  };

  return (
    <div
      className="relative w-full h-[100dvh] overflow-hidden select-none"
      style={{
        backgroundColor: currentItem.bg,
        transition: 'background-color 650ms cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: "'Inter', sans-serif",
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 50,
          opacity: 0.4,
          backgroundImage: `url("${NOISE_SVG_DATA_URI}")`,
          backgroundSize: '200px 200px',
          backgroundRepeat: 'repeat',
        }}
      />

      {/* 2. Top Bar (Brand + Nav indicators + Package quick switch) */}
      <header className="absolute top-0 inset-x-0 z-[60] px-4 sm:px-8 pt-[max(1rem,env(safe-area-inset-top))] pb-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div
            className="text-xs sm:text-sm font-bold uppercase text-white tracking-[0.2em]"
            style={{ opacity: 0.95 }}
          >
            COACH BODA
          </div>
          {currentItem.badge && (
            <span
              className="hidden md:inline-flex items-center text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border border-white/20 text-white/90"
              style={{ backgroundColor: `${currentItem.panel}88` }}
            >
              {currentItem.badge}
            </span>
          )}
        </div>

        {/* Carousel slide indicators */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {ITEMS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                if (idx !== activeIndex && !isAnimating) {
                  setIsAnimating(true);
                  setActiveIndex(idx);
                  setTimeout(() => setIsAnimating(false), 650);
                }
              }}
              aria-label={`Go to ${item.title}`}
              title={item.title}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === activeIndex
                  ? 'w-6 bg-white shadow-sm'
                  : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </header>

      {/* 3. Main Carousel Stage */}
      <main className="absolute inset-0 overflow-hidden" style={{ zIndex: 3 }}>
        {ITEMS.map((item, index) => {
          const style = getRoleStyle(index);

          return (
            <div
              key={item.id}
              onClick={() => handleItemClick(style.role)}
              className="absolute flex items-end justify-center"
              style={{
                left: style.left,
                bottom: style.bottom,
                width: style.width,
                height: style.height,
                transform: style.transform,
                filter: style.filter,
                opacity: style.opacity,
                zIndex: style.zIndex,
                pointerEvents: style.pointerEvents,
                cursor: style.cursor,
                transition:
                  'transform 650ms cubic-bezier(0.4, 0, 0.2, 1), filter 650ms cubic-bezier(0.4, 0, 0.2, 1), opacity 650ms cubic-bezier(0.4, 0, 0.2, 1), left 650ms cubic-bezier(0.4, 0, 0.2, 1), width 650ms cubic-bezier(0.4, 0, 0.2, 1), height 650ms cubic-bezier(0.4, 0, 0.2, 1), bottom 650ms cubic-bezier(0.4, 0, 0.2, 1)',
                willChange:
                  'transform, filter, opacity, left, width, height, bottom',
              }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={item.src}
                  alt={item.alt}
                  referrerPolicy="no-referrer"
                  draggable={false}
                  className="w-full h-full object-contain pointer-events-none select-none drop-shadow-[0_25px_50px_rgba(0,0,0,0.65)]"
                  style={{
                    objectPosition: item.isCutout
                      ? 'bottom center'
                      : 'center center',
                  }}
                />
              </div>
            </div>
          );
        })}
      </main>

      {/* 4. Desktop Bottom Controls Layout (Visible on sm+) */}
      <footer className="hidden sm:block">
        {/* Bottom-left text + badges + details trigger + nav buttons */}
        <div
          className="absolute bottom-10 left-8 md:bottom-14 md:left-14 lg:bottom-16 lg:left-16 z-[60]"
          style={{ maxWidth: '420px' }}
        >
          {/* Price & Duration Badges */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {currentItem.price && (
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-extrabold tracking-wide uppercase shadow-sm"
                style={{
                  backgroundColor: currentItem.accent,
                  color: '#000000',
                }}
              >
                {currentItem.price}
              </span>
            )}
            {currentItem.freeze && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide bg-white/15 text-white/90 border border-white/15 backdrop-blur-sm">
                <Snowflake size={11} className="text-cyan-300" />
                {currentItem.freeze}
              </span>
            )}
          </div>

          <p
            className="mb-1 text-lg md:text-[22px] font-bold uppercase tracking-wider text-white transition-all duration-300"
            style={{
              opacity: 0.95,
              letterSpacing: '0.02em',
            }}
          >
            {currentItem.title}
          </p>

          <p
            className="text-xs md:text-sm text-white/85 mb-3.5 transition-opacity duration-300 line-clamp-2"
            style={{
              lineHeight: 1.55,
            }}
          >
            {currentItem.description}
          </p>

          {/* Action Row */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('prev')}
              aria-label="Previous item"
              className="w-12 h-12 md:w-13 md:h-13 rounded-full border-2 border-white flex items-center justify-center text-white transition-all duration-150 active:scale-95 hover:scale-[1.08] hover:bg-white/15 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              style={{
                backgroundColor: 'transparent',
              }}
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={2.25} />
            </button>

            <button
              type="button"
              onClick={() => navigate('next')}
              aria-label="Next item"
              className="w-12 h-12 md:w-13 md:h-13 rounded-full border-2 border-white flex items-center justify-center text-white transition-all duration-150 active:scale-95 hover:scale-[1.08] hover:bg-white/15 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              style={{
                backgroundColor: 'transparent',
              }}
            >
              <ArrowRight className="w-5 h-5" strokeWidth={2.25} />
            </button>

            {/* View Full Package Benefits Button */}
            <button
              type="button"
              onClick={() => setShowFeaturesModal(true)}
              className="h-12 md:h-13 px-4 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-2 backdrop-blur-md active:scale-95 cursor-pointer"
            >
              <ListChecks size={16} style={{ color: currentItem.accent }} />
              <span>Features List</span>
            </button>
          </div>
        </div>

        {/* Bottom-right link "JOIN NOW" */}
        <a
          href={getWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Join now via WhatsApp"
          className="absolute bottom-10 right-8 md:bottom-14 md:right-12 lg:bottom-16 lg:right-16 z-[60] flex items-center gap-3 text-white no-underline transition-all duration-200 cursor-pointer group"
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: 'clamp(28px, 4.5vw, 56px)',
            fontWeight: 400,
            opacity: 0.95,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            textTransform: 'uppercase',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.95')}
        >
          <span className="whitespace-nowrap">JOIN NOW</span>
          <ArrowRight
            className="w-6 h-6 md:w-8 md:h-8 transition-transform duration-200 group-hover:translate-x-1.5"
            strokeWidth={2.25}
          />
        </a>
      </footer>

      {/* 5. Mobile-Specific Bottom Action Sheet (Visible on <sm) */}
      <footer className="sm:hidden absolute bottom-0 inset-x-0 z-[60] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 bg-gradient-to-t from-black/85 via-black/50 to-transparent backdrop-blur-[4px]">
        {/* Title & Badges */}
        <div className="mb-2.5">
          <div className="flex items-center justify-between gap-2 mb-1">
            <p
              className="text-base font-bold uppercase tracking-wide text-white leading-tight truncate"
              style={{ opacity: 0.98 }}
            >
              {currentItem.title}
            </p>
            {currentItem.price && (
              <span
                className="px-2 py-0.5 rounded-full text-[11px] font-black tracking-wide uppercase shrink-0"
                style={{
                  backgroundColor: currentItem.accent,
                  color: '#000000',
                }}
              >
                {currentItem.price}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between text-[11px] text-white/80">
            <span className="truncate">{currentItem.description}</span>
            <button
              type="button"
              onClick={() => setShowFeaturesModal(true)}
              className="ml-2 underline text-white font-medium shrink-0 flex items-center gap-0.5"
              style={{ color: currentItem.accent }}
            >
              <span>Details</span>
            </button>
          </div>
        </div>

        {/* Action Row: Left/Right navigation + Prominent Join Now button */}
        <div className="flex items-center justify-between gap-2.5">
          {/* Navigation Arrows */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => navigate('prev')}
              aria-label="Previous item"
              className="w-10 h-10 rounded-full border border-white/80 flex items-center justify-center text-white bg-black/25 active:scale-90 active:bg-white/20 transition-all touch-manipulation focus:outline-none"
            >
              <ArrowLeft size={18} strokeWidth={2.5} />
            </button>

            <button
              type="button"
              onClick={() => navigate('next')}
              aria-label="Next item"
              className="w-10 h-10 rounded-full border border-white/80 flex items-center justify-center text-white bg-black/25 active:scale-90 active:bg-white/20 transition-all touch-manipulation focus:outline-none"
            >
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          </div>

          {/* Prominent Mobile Join Now Button */}
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Join now via WhatsApp"
            className="flex-1 h-10 px-4 rounded-full bg-white text-black font-['Anton'] text-base uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-transform no-underline shrink-0 touch-manipulation"
          >
            <span>JOIN NOW</span>
            <ArrowRight size={16} strokeWidth={2.5} />
          </a>
        </div>
      </footer>

      {/* 6. Package Features & Inclusions Modal */}
      {showFeaturesModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setShowFeaturesModal(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl border border-white/20 p-6 md:p-7 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col text-white"
            style={{
              backgroundColor: currentItem.bg,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-white/15">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="text-xl md:text-2xl font-black uppercase tracking-wide text-white">
                    {currentItem.title}
                  </h3>
                  {currentItem.price && (
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-black tracking-wide text-black"
                      style={{ backgroundColor: currentItem.accent }}
                    >
                      {currentItem.price}
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/70">
                  {currentItem.duration ? `Duration: ${currentItem.duration}` : 'Head Coach Overview'}
                  {currentItem.freeze && ` • Freeze: ${currentItem.freeze}`}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowFeaturesModal(false)}
                aria-label="Close features modal"
                className="w-8 h-8 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Features list */}
            <div className="overflow-y-auto py-4 space-y-2.5 pr-1 text-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-white/60 mb-2 flex items-center gap-1.5">
                <Sparkles size={13} style={{ color: currentItem.accent }} />
                <span>WHAT YOU GET • المزايا والخدمات</span>
              </p>

              {currentItem.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10"
                >
                  <CheckCircle2
                    size={17}
                    className="shrink-0 mt-0.5"
                    style={{ color: currentItem.accent }}
                  />
                  <span className="text-white/90 leading-snug font-medium">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Modal Bottom CTA */}
            <div className="pt-4 border-t border-white/15 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowFeaturesModal(false)}
                className="px-4 py-2.5 rounded-full border border-white/20 text-xs font-semibold tracking-wider uppercase text-white/80 hover:bg-white/10 transition-colors"
              >
                Close
              </button>
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 rounded-full text-black font-['Anton'] text-center tracking-wider text-sm uppercase flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-md"
                style={{ backgroundColor: currentItem.accent }}
              >
                <span>JOIN VIA WHATSAPP</span>
                <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

