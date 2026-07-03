import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Footer } from "./Footer";

const LOGO_URL = "https://elorasmart.com/wp-content/uploads/2025/05/elora_200.png";

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-[#faf9f7] font-sans antialiased">
      {/* Navbar mínimo */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-stone-100">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
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
        <div className="max-w-3xl mx-auto">
          <p className="font-body text-[10px] uppercase tracking-[0.35em] text-stone-400 mb-3">
            ELORA SMART SL · B23990492
          </p>
          <h1 className="font-display text-3xl md:text-4xl uppercase tracking-wide mb-3">{title}</h1>
          <p className="font-body text-sm text-stone-400">Última actualización: {lastUpdated}</p>
        </div>
      </div>

      {/* Contenido */}
      <main className="max-w-3xl mx-auto px-6 py-14">
        <div className="prose prose-stone prose-sm max-w-none
          prose-headings:font-display prose-headings:uppercase prose-headings:tracking-wide prose-headings:text-stone-900
          prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-stone-200
          prose-h3:text-base prose-h3:mt-6 prose-h3:mb-2
          prose-p:font-body prose-p:text-stone-600 prose-p:leading-relaxed
          prose-li:font-body prose-li:text-stone-600
          prose-strong:text-stone-800 prose-strong:font-semibold
          prose-a:text-amber-700 prose-a:no-underline hover:prose-a:underline
          prose-table:text-sm prose-th:font-body prose-th:uppercase prose-th:tracking-wider prose-th:text-xs prose-th:text-stone-500
          prose-td:font-body prose-td:text-stone-700
        ">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
