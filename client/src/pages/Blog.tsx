import { ArrowRight, BookOpen } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { BlogShell } from "@/components/BlogShell";
import { Footer } from "@/components/Footer";
import { BLOG_POSTS, getBlogCover, type BlogPost } from "@/lib/blog";

const CATEGORIES = ["Todo", "Modelos", "Funciones", "Instalación", "Guías prácticas"] as const;

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState<(typeof CATEGORIES)[number]>("Todo");
  const posts = useMemo(
    () => activeCategory === "Todo" ? BLOG_POSTS : BLOG_POSTS.filter((post) => post.category === activeCategory),
    [activeCategory],
  );

  return (
    <BlogShell>
      <main>
        <section className="relative min-h-[560px] overflow-hidden bg-foreground text-background">
          <img src={getBlogCover(BLOG_POSTS[0])} alt="Inodoro inteligente ELORA SMART" className="absolute inset-0 h-full w-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/35" />
          <div className="relative z-10 min-h-[560px] max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-16 md:py-24 flex flex-col justify-end">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 text-accent mb-6"><span className="h-px w-10 bg-accent" /><span className="font-body text-[10px] uppercase tracking-[0.32em]">Elora Journal</span></div>
              <h1 className="font-display text-5xl sm:text-6xl md:text-8xl uppercase tracking-wide leading-[0.86]">Preguntas,<br /><span className="text-accent">guías</span> y diseño.</h1>
              <p className="mt-8 max-w-xl border-l border-accent pl-5 font-body text-sm md:text-base leading-relaxed text-background/85">Treinta guías detalladas construidas exclusivamente con las fichas, preguntas frecuentes, funciones e instalación ya publicadas por ELORA SMART.</p>
            </div>
          </div>
        </section>

        <section className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-12 md:py-16">
          <div className="flex flex-col gap-7 border-b border-border pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
              <div><p className="font-body text-[10px] uppercase tracking-[0.28em] text-accent-deep mb-3">Encuentra tu respuesta</p><h2 className="font-display text-3xl md:text-5xl uppercase tracking-wide leading-none">Guías para elegir y entender.</h2></div>
              <p className="font-body text-xs text-foreground/55 whitespace-nowrap">{posts.length} guías verificadas</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => <button key={category} onClick={() => setActiveCategory(category)} className={`font-body text-[10px] uppercase tracking-[0.18em] px-4 py-2 border transition-colors ${activeCategory === category ? "bg-foreground text-background border-foreground" : "border-border text-foreground/65 hover:border-foreground hover:text-foreground"}`}>{category}</button>)}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-x-7 gap-y-12 mt-12">
            {posts.map((post, index) => <PostCard key={post.slug} post={post} number={index + 1} />)}
          </div>
        </section>
      </main>
      <Footer />
    </BlogShell>
  );
}

function PostCard({ post, number }: { post: BlogPost; number: number }) {
  const image = getBlogCover(post, number - 1);
  return (
    <article className="group flex flex-col">
      <Link href={`/blog/${post.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-muted">
        <img src={image} alt="" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        <div className="absolute left-5 right-5 bottom-4 flex items-center justify-between"><span className="font-body text-[10px] tracking-[0.2em] uppercase text-white/90">{post.category}</span><span className="font-body text-[10px] text-white/70 tabular-nums">{String(number).padStart(2, "0")}</span></div>
      </Link>
      <div className="pt-6 flex flex-col flex-1">
        <h3 className="font-display text-3xl uppercase tracking-wide leading-[0.95] group-hover:text-accent-deep transition-colors"><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
        <p className="font-body text-sm leading-relaxed text-foreground/65 mt-4">{post.excerpt}</p>
        <div className="mt-6 pt-5 border-t border-border flex items-center justify-between gap-4"><span className="font-body text-[9px] uppercase tracking-[0.18em] text-foreground/42 inline-flex items-center gap-2"><BookOpen className="w-3.5 h-3.5" /> Fuente interna</span><Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.22em] text-foreground hover:text-accent-deep transition-colors">Leer guía <ArrowRight className="w-3.5 h-3.5" /></Link></div>
      </div>
    </article>
  );
}
