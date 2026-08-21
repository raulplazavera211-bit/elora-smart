import { ArrowRight, BookOpen } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { BlogImagePlaceholder } from "@/components/BlogImagePlaceholder";
import { BlogShell } from "@/components/BlogShell";
import { Footer } from "@/components/Footer";
import { BLOG_POSTS, type BlogPost } from "@/lib/blog";

const CATEGORIES = ["Todo", "Modelos", "Funciones", "Instalación", "Guías prácticas"] as const;

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState<(typeof CATEGORIES)[number]>("Todo");
  const posts = useMemo(() => activeCategory === "Todo" ? BLOG_POSTS : BLOG_POSTS.filter((post) => post.category === activeCategory), [activeCategory]);
  const structuredData = { "@context": "https://schema.org", "@type": "Blog", name: "Guías Elora Smart", description: "Guías basadas en las fichas y preguntas frecuentes publicadas por Elora Smart.", url: "https://www.elorasmart.store/blog" };

  return (
    <BlogShell>
      <main id="contenido-principal">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <header className="border-b border-border bg-background">
          <div className="max-w-[1440px] mx-auto grid lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
            <div className="px-6 sm:px-10 lg:px-16 py-14 md:py-20 flex flex-col justify-center">
              <div className="flex items-center gap-3 text-accent-deep mb-6"><span className="h-px w-10 bg-accent-deep" /><span className="font-body text-[10px] uppercase tracking-[0.32em]">Elora Journal</span></div>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl uppercase tracking-wide leading-[0.88]">Guías para<br /><span className="text-accent-deep">elegir bien.</span></h1>
              <p className="mt-8 max-w-xl border-l border-accent-deep pl-5 font-body text-sm md:text-base leading-relaxed text-foreground/70">Información organizada sobre modelos, funciones e instalación. Cada guía enlaza solamente a contenidos ya publicados por ELORA SMART.</p>
              <dl className="mt-10 grid grid-cols-2 max-w-sm border-t border-border pt-5"><div><dt className="font-body text-[9px] uppercase tracking-[0.2em] text-foreground/45">Guías</dt><dd className="font-display text-3xl mt-1">30</dd></div><div><dt className="font-body text-[9px] uppercase tracking-[0.2em] text-foreground/45">Fuentes</dt><dd className="font-display text-xl mt-2">Web Elora</dd></div></dl>
            </div>
            <BlogImagePlaceholder className="min-h-[280px] lg:min-h-full border-x-0 border-y lg:border-y-0 lg:border-l" label="Portada del blog · Imagen pendiente" />
          </div>
        </header>

        <section aria-labelledby="explorar-guias" className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-12 md:py-16">
          <div className="flex flex-col gap-7 border-b border-border pb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5"><div><p className="font-body text-[10px] uppercase tracking-[0.28em] text-accent-deep mb-3">Índice del blog</p><h2 id="explorar-guias" className="font-display text-3xl md:text-5xl uppercase tracking-wide leading-none">Explora por tema.</h2></div><p aria-live="polite" className="font-body text-xs text-foreground/55">{posts.length} guías disponibles</p></div>
            <nav aria-label="Filtrar las guías por tema" className="flex flex-wrap gap-2">{CATEGORIES.map((category) => <button key={category} type="button" aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)} className={`font-body text-[10px] uppercase tracking-[0.18em] px-4 py-2 border transition-colors ${activeCategory === category ? "bg-foreground text-background border-foreground" : "border-border text-foreground/65 hover:border-foreground hover:text-foreground"}`}>{category}</button>)}</nav>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-x-7 gap-y-12 mt-12">{posts.map((post, index) => <PostCard key={post.slug} post={post} number={index + 1} />)}</div>
        </section>
      </main>
      <Footer />
    </BlogShell>
  );
}

function PostCard({ post, number }: { post: BlogPost; number: number }) {
  return (
    <article className="group flex flex-col border-t border-border pt-5">
      <Link href={`/blog/${post.slug}`} aria-label={`Leer guía: ${post.title}`}><BlogImagePlaceholder className="aspect-[4/3]" label="Imagen de la guía pendiente" /></Link>
      <div className="pt-6 flex flex-col flex-1"><div className="flex items-center justify-between gap-4"><span className="font-body text-[10px] tracking-[0.2em] uppercase text-accent-deep">{post.category}</span><span className="font-body text-[10px] text-foreground/35 tabular-nums">{String(number).padStart(2, "0")}</span></div><h3 className="font-display text-3xl uppercase tracking-wide leading-[0.95] mt-5 group-hover:text-accent-deep transition-colors"><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3><p className="font-body text-sm leading-relaxed text-foreground/65 mt-4">{post.excerpt}</p><div className="mt-6 pt-5 border-t border-border flex items-center justify-between gap-4"><span className="font-body text-[9px] uppercase tracking-[0.18em] text-foreground/42 inline-flex items-center gap-2"><BookOpen className="w-3.5 h-3.5" /> Fuente interna</span><Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.22em] text-foreground hover:text-accent-deep transition-colors">Leer guía <ArrowRight className="w-3.5 h-3.5" /></Link></div></div>
    </article>
  );
}
