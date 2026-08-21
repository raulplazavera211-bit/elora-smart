import { ArrowRight, BookOpen } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Footer } from "@/components/Footer";
import { BLOG_POSTS, type BlogPost } from "@/lib/blog";

const LOGO_URL = "/manus-storage/elora_logo_color_2329eaab.webp";
const CATEGORIES = ["Todo", "Modelos", "Funciones", "Instalación", "Garantía y soporte", "Envíos"] as const;

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState<(typeof CATEGORIES)[number]>("Todo");
  const posts = useMemo(
    () => activeCategory === "Todo" ? BLOG_POSTS : BLOG_POSTS.filter((post) => post.category === activeCategory),
    [activeCategory],
  );

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto h-16 px-5 sm:px-8 lg:px-12 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center">
            <img src={LOGO_URL} alt="Elora Smart" className="h-8 w-auto" />
          </Link>
          <nav className="flex items-center gap-4 sm:gap-7 font-body text-[10px] uppercase tracking-[0.22em]">
            <Link href="/" className="text-foreground/55 hover:text-foreground transition-colors">Inicio</Link>
            <Link href="/coleccion" className="text-foreground/55 hover:text-foreground transition-colors">Colección</Link>
            <span className="text-accent-deep">Blog</span>
          </nav>
        </div>
      </header>

      <main>
        <section className="bg-foreground text-background overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-16 md:py-24 grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-end">
            <div>
              <div className="flex items-center gap-3 text-accent-deep mb-5">
                <span className="h-px w-9 bg-accent-deep" />
                <span className="font-body text-[10px] uppercase tracking-[0.32em]">Elora Journal</span>
              </div>
              <h1 className="font-display text-5xl sm:text-6xl md:text-8xl uppercase tracking-wide leading-[0.88]">Guías<br />Elora Smart</h1>
            </div>
            <div className="lg:max-w-md lg:justify-self-end border-l border-background/20 pl-6 sm:pl-8">
              <p className="font-body text-sm leading-relaxed text-background/70">
                Treinta artículos basados exclusivamente en las fichas de producto, la información de garantías y la política de envíos publicada por ELORA SMART.
              </p>
              <p className="mt-5 font-body text-[10px] uppercase tracking-[0.25em] text-background/45">
                Sin datos de terceros · Sin afirmaciones añadidas
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-10 md:py-16">
          <div className="flex flex-col gap-6 border-b border-border pb-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-body text-[10px] uppercase tracking-[0.28em] text-accent-deep mb-2">Explora por tema</p>
                <h2 className="font-display text-3xl md:text-4xl uppercase tracking-wide">Información publicada</h2>
              </div>
              <p className="font-body text-xs text-foreground/55 whitespace-nowrap">{posts.length} artículos</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`font-body text-[10px] uppercase tracking-[0.18em] px-4 py-2 border transition-colors ${
                    activeCategory === category
                      ? "bg-foreground text-background border-foreground"
                      : "border-border text-foreground/65 hover:border-foreground hover:text-foreground"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 border-l border-t border-border mt-10">
            {posts.map((post, index) => <PostCard key={post.slug} post={post} number={index + 1} />)}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function PostCard({ post, number }: { post: BlogPost; number: number }) {
  return (
    <article className="group min-h-[300px] border-r border-b border-border p-6 sm:p-8 flex flex-col bg-background hover:bg-muted/45 transition-colors duration-300">
      <div className="flex items-start justify-between gap-4">
        <span className="font-body text-[10px] tracking-[0.18em] uppercase text-accent-deep">{post.category}</span>
        <span className="font-body text-[10px] text-foreground/35 tabular-nums">{String(number).padStart(2, "0")}</span>
      </div>
      <h3 className="font-display text-2xl uppercase tracking-wide leading-[0.98] mt-8 group-hover:text-accent-deep transition-colors">{post.title}</h3>
      <p className="font-body text-sm leading-relaxed text-foreground/65 mt-4">{post.excerpt}</p>
      <div className="mt-auto pt-8 flex items-center justify-between gap-4">
        <span className="font-body text-[9px] uppercase tracking-[0.18em] text-foreground/42 inline-flex items-center gap-2"><BookOpen className="w-3.5 h-3.5" /> Fuente interna</span>
        <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.22em] text-foreground group-hover:text-accent-deep transition-colors">
          Leer <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
}
