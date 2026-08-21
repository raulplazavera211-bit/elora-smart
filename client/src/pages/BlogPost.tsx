import { ArrowRight, BookOpen, ChevronRight, ExternalLink } from "lucide-react";
import { useEffect } from "react";
import { Link } from "wouter";
import { BlogShell } from "@/components/BlogShell";
import { Footer } from "@/components/Footer";
import { getBlogCover, getBlogPost, getBlogProductId } from "@/lib/blog";
import { ALL_PRODUCTS } from "@/lib/products";
import NotFound from "@/pages/NotFound";

type Props = { params: { slug: string } };

export default function BlogPost({ params }: Props) {
  const post = getBlogPost(params.slug);
  const relatedProduct = post ? ALL_PRODUCTS.find((product) => product.id === getBlogProductId(post)) : null;

  useEffect(() => {
    if (!post) return;
    document.title = `${post.title} | Blog Elora Smart`;
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute("content", post.excerpt);
    return () => { document.title = "Elora Smart — Inodoros Inteligentes"; };
  }, [post]);

  if (!post) return <NotFound />;

  const cover = getBlogCover(post, 1);
  const sources = [{ href: post.sourceHref, label: post.sourceLabel }, ...(post.additionalSources ?? [])];
  const technicalSpecs = relatedProduct?.technical.flatMap((group) => group.specs).slice(0, 8) ?? [];

  return (
    <BlogShell>
      <main>
        <section className="relative min-h-[540px] overflow-hidden bg-foreground text-background">
          <img src={cover} alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/35" />
          <div className="relative z-10 max-w-[1180px] mx-auto min-h-[540px] px-6 sm:px-10 py-12 md:py-20 flex flex-col justify-end">
            <div className="flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.2em] text-background/65"><Link href="/blog" className="hover:text-background">Blog</Link><ChevronRight className="w-3 h-3" /><span className="text-accent">{post.category}</span></div>
            <p className="mt-8 font-body text-[10px] uppercase tracking-[0.3em] text-accent">Información verificada en la web</p>
            <h1 className="max-w-5xl font-display text-4xl sm:text-6xl md:text-7xl uppercase tracking-wide leading-[0.9] mt-5">{post.title}</h1>
            <p className="max-w-3xl mt-7 border-l border-accent pl-5 font-body text-base md:text-lg leading-relaxed text-background/85">{post.excerpt}</p>
          </div>
        </section>

        <section className="border-y border-border bg-muted/25">
          <div className="max-w-[1180px] mx-auto px-6 sm:px-10 py-6 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-foreground/55"><BookOpen className="w-4 h-4 text-accent-deep" /><span className="font-body text-[10px] uppercase tracking-[0.2em]">Fuentes internas verificadas</span></div>
            <div className="flex flex-wrap gap-x-5 gap-y-2">{sources.map((source) => <Link key={`${source.href}-${source.label}`} href={source.href} className="inline-flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.16em] text-accent-deep hover:text-foreground transition-colors">{source.label} <ExternalLink className="w-3.5 h-3.5" /></Link>)}</div>
          </div>
        </section>

        <article className="max-w-[1180px] mx-auto px-6 sm:px-10 py-14 md:py-20 grid lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] gap-12 lg:gap-20">
          <div className="space-y-7 font-body text-[17px] leading-[1.85] text-foreground/76">
            {post.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <div className="pt-8 mt-10 border-t border-border"><p className="font-body text-xs leading-relaxed text-foreground/50">Esta guía reúne exclusivamente información ya publicada por ELORA SMART. Para confirmar las especificaciones aplicables, consulta las fuentes enlazadas arriba.</p></div>
          </div>

          {relatedProduct && (
            <aside className="lg:sticky lg:top-8 self-start border border-border bg-muted/20">
              <img src={relatedProduct.img} alt={relatedProduct.name} className="w-full aspect-[4/3] object-cover" />
              <div className="p-6 sm:p-7">
                <p className="font-body text-[10px] uppercase tracking-[0.25em] text-accent-deep">Ficha relacionada</p>
                <h2 className="font-display text-3xl uppercase tracking-wide leading-none mt-3">{relatedProduct.name}</h2>
                <p className="font-body text-sm leading-relaxed text-foreground/65 mt-4">{relatedProduct.description}</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-7 pt-6 border-t border-border">
                  {technicalSpecs.map((spec) => <div key={spec.label}><p className="font-body text-[9px] uppercase tracking-[0.16em] text-foreground/45">{spec.label}</p><p className="font-body text-xs leading-snug text-foreground mt-1">{spec.value}</p></div>)}
                </div>
                <Link href={`/producto/${relatedProduct.id.toLowerCase()}`} className="mt-8 inline-flex items-center gap-3 font-body text-[10px] uppercase tracking-[0.22em] text-foreground hover:text-accent-deep transition-colors">Ver ficha completa <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </aside>
          )}
        </article>

        {relatedProduct?.pitch.length ? (
          <section className="border-t border-border bg-background"><div className="max-w-[1180px] mx-auto px-6 sm:px-10 py-14 md:py-20"><div className="max-w-2xl"><p className="font-body text-[10px] uppercase tracking-[0.28em] text-accent-deep">Detalles de la ficha</p><h2 className="font-display text-4xl md:text-5xl uppercase tracking-wide leading-[0.95] mt-4">Funciones publicadas del modelo.</h2><p className="font-body text-sm leading-relaxed text-foreground/60 mt-5">Los siguientes apartados proceden de la ficha de {relatedProduct.name} enlazada en esta guía.</p></div><div className="grid md:grid-cols-2 xl:grid-cols-3 gap-px bg-border border border-border mt-10">{relatedProduct.pitch.map((item, index) => <div key={item.title} className="bg-background p-6 sm:p-7"><span className="font-body text-[10px] text-accent-deep">0{index + 1}</span><h3 className="font-display text-2xl uppercase tracking-wide leading-none mt-5">{item.title}</h3><p className="font-body text-sm leading-relaxed text-foreground/65 mt-4">{item.body}</p></div>)}</div></div></section>
        ) : null}

        {relatedProduct?.faqs.length ? (
          <section className="border-t border-border bg-muted/20"><div className="max-w-[1180px] mx-auto px-6 sm:px-10 py-14 md:py-20"><p className="font-body text-[10px] uppercase tracking-[0.28em] text-accent-deep">Preguntas de la ficha</p><h2 className="font-display text-4xl md:text-5xl uppercase tracking-wide mt-4">Más información publicada.</h2><div className="grid md:grid-cols-2 gap-5 mt-10">{relatedProduct.faqs.slice(0, 4).map((faq) => <div key={faq.q} className="border border-border bg-background p-6"><h3 className="font-display text-xl uppercase tracking-wide leading-none">{faq.q}</h3><p className="font-body text-sm leading-relaxed text-foreground/65 mt-4">{faq.a}</p></div>)}</div></div></section>
        ) : null}
      </main>
      <Footer />
    </BlogShell>
  );
}
