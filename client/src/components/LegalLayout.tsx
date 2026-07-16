import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Footer } from "./Footer";
import { useEffect, useRef, useState } from "react";

const LOGO_URL = "/manus-storage/elora_200_6f84beaa.png";

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [headings, setHeadings] = useState<{ id: string; text: string }[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  // Extraer los h2 del contenido y asignarles IDs
  useEffect(() => {
    if (!contentRef.current) return;
    const h2s = Array.from(contentRef.current.querySelectorAll("h2"));
    const items = h2s.map((el, i) => {
      const id = `section-${i}`;
      el.id = id;
      return { id, text: el.textContent ?? "" };
    });
    setHeadings(items);
    if (items.length > 0) setActiveId(items[0].id);
  }, [children]);

  // Detectar sección activa con IntersectionObserver
  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] font-sans antialiased">
      {/* Navbar mínimo */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-stone-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/">
            <img src={LOGO_URL} alt="Elora Smart" className="h-8 w-auto" />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 font-body text-xs uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver
          </Link>
        </div>
      </header>

      {/* Hero de la página */}
      <div className="bg-stone-900 text-white py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="font-body text-[10px] uppercase tracking-[0.35em] text-stone-400 mb-3">
            ELORA SMART SL · B23990492
          </p>
          <h1 className="font-display text-3xl md:text-4xl uppercase tracking-wide mb-3">{title}</h1>
          <p className="font-body text-sm text-stone-400">Última actualización: {lastUpdated}</p>
        </div>
      </div>

      {/* Layout con sidebar */}
      <div className="max-w-6xl mx-auto px-6 py-14 flex gap-12 items-start">

        {/* Menú lateral derecho (sticky) */}
        {headings.length > 0 && (
          <aside className="hidden lg:block w-64 shrink-0 sticky top-20 self-start order-2">
            <p className="font-body text-[10px] uppercase tracking-[0.3em] text-stone-400 mb-4 pb-3 border-b border-stone-200">
              Contenido
            </p>
            <nav className="flex flex-col gap-1">
              {headings.map(({ id, text }) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className={`text-left font-body text-xs py-1.5 px-2 rounded transition-all duration-200 leading-snug ${
                    activeId === id
                      ? "text-stone-900 bg-amber-50 border-l-2 border-amber-500 pl-3 font-medium"
                      : "text-stone-500 hover:text-stone-800 hover:bg-stone-50"
                  }`}
                >
                  {text}
                </button>
              ))}
            </nav>
          </aside>
        )}

        {/* Contenido principal */}
        <main className="flex-1 min-w-0 order-1">
          <div
            ref={contentRef}
            className="prose prose-stone prose-sm max-w-none
              prose-headings:font-display prose-headings:uppercase prose-headings:tracking-wide prose-headings:text-stone-900
              prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-stone-200
              prose-h3:text-base prose-h3:mt-6 prose-h3:mb-2
              prose-p:font-body prose-p:text-stone-600 prose-p:leading-relaxed
              prose-li:font-body prose-li:text-stone-600
              prose-strong:text-stone-800 prose-strong:font-semibold
              prose-a:text-amber-700 prose-a:no-underline hover:prose-a:underline
              prose-table:text-sm prose-th:font-body prose-th:uppercase prose-th:tracking-wider prose-th:text-xs prose-th:text-stone-500
              prose-td:font-body prose-td:text-stone-700
            "
          >
            {children}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
