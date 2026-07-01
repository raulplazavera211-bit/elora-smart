// ─── Sección de reseñas compartida ───────────────────────────────────────────
// Usa getReviews(lang) de @/lib/reviews para mostrar reseñas en el idioma activo.

import { useTranslation } from "react-i18next";
import { getReviews, AVATAR_COLORS } from "@/lib/reviews";

function GoogleStarIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="#FBBC04">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
    </svg>
  );
}

function GoogleLogoIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function ReviewCard({ r, idx }: { r: ReturnType<typeof getReviews>[number]; idx: number }) {
  const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
  return (
    <div className="w-[300px] md:w-[340px] flex-shrink-0 bg-white rounded-xl shadow-[0_1px_6px_rgba(0,0,0,0.12)] p-5 border border-gray-100 hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)] transition-shadow duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0"
            style={{ backgroundColor: color }}
          >
            {r.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm leading-tight">{r.name}</p>
            <p className="text-gray-400 text-xs">{r.date}</p>
          </div>
        </div>
        <GoogleLogoIcon />
      </div>
      <div className="flex gap-0.5 mb-3">
        {[1,2,3,4,5].map(s => <GoogleStarIcon key={s} />)}
      </div>
      <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">{r.text}</p>
    </div>
  );
}

export function ReviewsSection() {
  const { t, i18n } = useTranslation();
  const reviews = getReviews(i18n.language);
  const doubled = [...reviews, ...reviews];
  return (
    <section className="w-full bg-[#F8F9FA] py-20 md:py-28 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-16 mb-12">
        <div className="flex items-center gap-2 mb-3">
          <GoogleLogoIcon />
          <p className="font-body text-xs uppercase tracking-[0.3em] text-gray-400">{t('reviews.verified')}</p>
        </div>
        <div className="flex items-end justify-between">
          <h2 className="font-display text-4xl md:text-6xl uppercase tracking-wide text-foreground leading-[0.9]">
            {t('reviews.title')}
          </h2>
          <div className="hidden md:flex items-center gap-3 bg-white rounded-xl px-5 py-3 shadow-sm border border-gray-100">
            <div className="text-center">
              <p className="font-bold text-gray-900 text-2xl leading-none">5.0</p>
              <div className="flex gap-0.5 mt-1">{[1,2,3,4,5].map(i => <GoogleStarIcon key={i} />)}</div>
              <p className="text-gray-400 text-xs mt-1">{t('reviews.count')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Carrusel infinito fila 1 → izquierda */}
      <div className="relative">
        <div className="flex gap-5 w-max" style={{ animation: "marquee-left 40s linear infinite" }}>
          {doubled.map((r, i) => <ReviewCard key={i} r={r} idx={i % reviews.length} />)}
        </div>
      </div>

      {/* Carrusel infinito fila 2 → derecha */}
      <div className="relative mt-5">
        <div className="flex gap-5 w-max" style={{ animation: "marquee-right 50s linear infinite" }}>
          {[...doubled].reverse().map((r, i) => <ReviewCard key={i} r={r} idx={(reviews.length - 1 - (i % reviews.length))} />)}
        </div>
      </div>

      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}
