import { ArrowLeft, ArrowRight, BookOpen, ChevronRight, ExternalLink } from "lucide-react";
import { useEffect } from "react";
import { Link } from "wouter";
import { Footer } from "@/components/Footer";
import { getBlogPost } from "@/lib/blog";
import NotFound from "@/pages/NotFound";

const LOGO_URL = "/manus-storage/elora_logo_color_2329eaab.webp";

type Props = { params: { slug: string } };

export default function BlogPost({ params }: Props) {
  const post = getBlogPost(params.slug);

  useEffect(() => {
    if (!post) return;
    document.title = `${post.title} | Blog Elora Smart`;
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute("content", post.excerpt);
    return () => { document.title = "Elora Smart — Inodoros Inteligentes"; };
  }, [post]);

  if (!post) return <NotFound />;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="max-w-[1180px] mx-auto h-16 px-5 sm:px-8 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center"><img src={LOGO_URL} alt="Elora Smart" className="h-8 w-auto" /></Link>
          <Link href="/blog" className="inline-flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.22em] text-foreground/65 hover:text-foreground transition-colors"><ArrowLeft className="w-3.5 h-3.5" /> Blog</Link>
        </div>
      </header>

      <main>
        <section className="max-w-[1180px] mx-auto px-5 sm:px-8 pt-10 md:pt-16 pb-10 md:pb-14">
          <div className="flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.2em] text-foreground/45">
            <Link href="/blog" className="hover:text-foreground">Blog</Link><ChevronRight className="w-3 h-3" /><span className="text-accent-deep">{post.category}</span>
          </div>
          <div className="mt-9 max-w-4xl">
            <p className="font-body text-[10px] uppercase tracking-[0.3em] text-accent-deep">Información verificada en la web</p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl uppercase tracking-wide leading-[0.92] mt-5">{post.title}</h1>
            <p className="font-body text-lg md:text-xl leading-relaxed text-foreground/65 mt-7 max-w-3xl">{post.excerpt}</p>
          </div>
        </section>

        <section className="border-y border-border bg-muted/25">
          <div className="max-w-[1180px] mx-auto px-5 sm:px-8 py-5 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-foreground/55"><BookOpen className="w-4 h-4 text-accent-deep" /><span className="font-body text-[10px] uppercase tracking-[0.2em]">Fuentes internas verificadas</span></div>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {[{ href: post.sourceHref, label: post.sourceLabel }, ...(post.additionalSources ?? [])].map((source) => (
                <Link key={`${source.href}-${source.label}`} href={source.href} className="inline-flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.16em] text-accent-deep hover:text-foreground transition-colors">{source.label} <ExternalLink className="w-3.5 h-3.5" /></Link>
              ))}
            </div>
          </div>
        </section>

        <article className="max-w-[760px] mx-auto px-5 sm:px-8 py-14 md:py-20">
          <div className="space-y-7 font-body text-[17px] leading-[1.85] text-foreground/76">
            {post.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <div className="mt-14 pt-8 border-t border-border flex flex-col sm:flex-row gap-5 sm:items-center sm:justify-between">
            <p className="font-body text-xs leading-relaxed text-foreground/50 max-w-md">Este artículo resume exclusivamente información que ya está publicada por ELORA SMART. Para comprobar las especificaciones aplicables, consulta la fuente enlazada.</p>
            <Link href="/coleccion" className="inline-flex items-center gap-3 font-body text-[10px] uppercase tracking-[0.22em] text-foreground hover:text-accent-deep transition-colors whitespace-nowrap">Ver colección <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
