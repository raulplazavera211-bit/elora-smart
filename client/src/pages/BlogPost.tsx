import { ArrowRight, BookOpen, ChevronRight, ExternalLink } from "lucide-react";
import { useEffect, useLayoutEffect } from "react";
import { Link } from "wouter";
import { BlogImagePlaceholder } from "@/components/BlogImagePlaceholder";
import { BlogShell } from "@/components/BlogShell";
import { Footer } from "@/components/Footer";
import { getBlogPost, getBlogProductId } from "@/lib/blog";
import { ALL_PRODUCTS } from "@/lib/products";
import NotFound from "@/pages/NotFound";

type Props = { params: { slug: string } };

export default function BlogPost({ params }: Props) {
  const post = getBlogPost(params.slug);
  const relatedProduct = post ? ALL_PRODUCTS.find((product) => product.id === getBlogProductId(post)) : null;

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [params.slug]);

  useEffect(() => {
    if (!post) return;
    document.title = `${post.title} | Blog Elora Smart`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", post.excerpt);
    return () => { document.title = "Elora Smart — Inodoros Inteligentes"; };
  }, [post]);

  if (!post) return <NotFound />;

  const sources = [{ href: post.sourceHref, label: post.sourceLabel }, ...(post.additionalSources ?? [])];
  const technicalSpecs = relatedProduct?.technical.flatMap((group) => group.specs).slice(0, 8) ?? [];
  const structuredData = { "@context": "https://schema.org", "@type": "Article", headline: post.title, description: post.excerpt, mainEntityOfPage: `https://www.elorasmart.store/blog/${post.slug}`, publisher: { "@type": "Organization", name: "Elora Smart" } };

  return (
    <BlogShell>
      <main id="contenido-principal">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <header className="border-b border-border bg-background">
          <div className="max-w-[1280px] mx-auto grid lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.75fr)]">
            <div className="px-6 sm:px-10 lg:px-16 py-12 md:py-18 flex flex-col justify-center">
              <nav aria-label="Migas de pan" className="flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.2em] text-foreground/45"><Link href="/blog" className="hover:text-foreground">Blog</Link><ChevronRight className="w-3 h-3" /><span className="text-accent-deep">{post.category}</span></nav>
              <p className="mt-9 font-body text-[10px] uppercase tracking-[0.3em] text-accent-deep">Guía de Elora Smart</p>
              <h1 className="max-w-4xl font-display text-4xl sm:text-5xl lg:text-6xl uppercase tracking-wide leading-[0.92] mt-5">{post.title}</h1>
              <p className="max-w-3xl mt-7 border-l border-accent-deep pl-5 font-body text-base leading-relaxed text-foreground/65">{post.excerpt}</p>
            </div>
            <BlogImagePlaceholder className="min-h-[250px] lg:min-h-full border-x-0 border-y lg:border-y-0 lg:border-l" label="Imagen de cabecera pendiente" />
          </div>
        </header>

        <section aria-labelledby="fuentes-guia" className="border-b border-border bg-muted/20"><div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16 py-6"><div className="flex items-center gap-3 text-foreground/55"><BookOpen className="w-4 h-4 text-accent-deep" /><h2 id="fuentes-guia" className="font-body text-[10px] uppercase tracking-[0.2em]">Fuentes internas de esta guía</h2></div><div className="flex flex-wrap gap-x-5 gap-y-2 mt-4">{sources.map((source) => <Link key={`${source.href}-${source.label}`} href={source.href} className="inline-flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.16em] text-accent-deep hover:text-foreground transition-colors">{source.label}<ExternalLink className="w-3.5 h-3.5" /></Link>)}</div></div></section>

        <article className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16 py-14 md:py-20">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-12 lg:gap-20">
            <div><div className="space-y-7 font-body text-[17px] leading-[1.85] text-foreground/76">{post.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><p className="mt-10 pt-8 border-t border-border font-body text-xs leading-relaxed text-foreground/50">Esta guía resume exclusivamente información que ya está publicada por ELORA SMART. Para comprobar las especificaciones aplicables, consulta las fuentes enlazadas.</p></div>
            <aside className="self-start lg:sticky lg:top-8 border border-border bg-muted/20"><BlogImagePlaceholder className="aspect-[4/3] border-0 border-b" label="Imagen de la ficha pendiente" />{relatedProduct && <div className="p-6 sm:p-7"><p className="font-body text-[10px] uppercase tracking-[0.25em] text-accent-deep">Ficha relacionada</p><h2 className="font-display text-3xl uppercase tracking-wide leading-none mt-3">{relatedProduct.name}</h2><p className="font-body text-sm leading-relaxed text-foreground/65 mt-4">{relatedProduct.description}</p><dl className="grid grid-cols-2 gap-x-4 gap-y-4 mt-7 pt-6 border-t border-border">{technicalSpecs.map((spec) => <div key={spec.label}><dt className="font-body text-[9px] uppercase tracking-[0.16em] text-foreground/45">{spec.label}</dt><dd className="font-body text-xs leading-snug text-foreground mt-1">{spec.value}</dd></div>)}</dl><Link href={`/producto/${relatedProduct.id.toLowerCase()}`} className="mt-8 inline-flex items-center gap-3 font-body text-[10px] uppercase tracking-[0.22em] text-foreground hover:text-accent-deep transition-colors">Ver ficha completa <ArrowRight className="w-4 h-4" /></Link></div>}</aside>
          </div>
        </article>

        {relatedProduct?.pitch.length ? <section aria-labelledby="detalles-modelo" className="border-t border-border bg-muted/15"><div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16 py-14 md:py-20"><div className="max-w-2xl"><p className="font-body text-[10px] uppercase tracking-[0.28em] text-accent-deep">Amplía la información</p><h2 id="detalles-modelo" className="font-display text-4xl md:text-5xl uppercase tracking-wide leading-[0.95] mt-4">Detalles de la ficha relacionada.</h2><p className="font-body text-sm leading-relaxed text-foreground/60 mt-5">Estos apartados proceden de la ficha de {relatedProduct.name} enlazada en esta guía.</p></div><div className="grid md:grid-cols-2 xl:grid-cols-3 gap-px bg-border border border-border mt-10">{relatedProduct.pitch.map((item, index) => <section key={item.title} className="bg-background p-6 sm:p-7"><span className="font-body text-[10px] text-accent-deep">0{index + 1}</span><h3 className="font-display text-2xl uppercase tracking-wide leading-none mt-5">{item.title}</h3><p className="font-body text-sm leading-relaxed text-foreground/65 mt-4">{item.body}</p></section>)}</div></div></section> : null}

        {relatedProduct?.faqs.length ? <section aria-labelledby="preguntas-ficha" className="border-t border-border bg-background"><div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16 py-14 md:py-20"><p className="font-body text-[10px] uppercase tracking-[0.28em] text-accent-deep">Preguntas frecuentes</p><h2 id="preguntas-ficha" className="font-display text-4xl md:text-5xl uppercase tracking-wide mt-4">Más información publicada.</h2><div className="grid md:grid-cols-2 gap-5 mt-10">{relatedProduct.faqs.slice(0, 4).map((faq) => <section key={faq.q} className="border border-border bg-muted/15 p-6"><h3 className="font-display text-xl uppercase tracking-wide leading-none">{faq.q}</h3><p className="font-body text-sm leading-relaxed text-foreground/65 mt-4">{faq.a}</p></section>)}</div></div></section> : null}
      </main>
      <Footer />
    </BlogShell>
  );
}
