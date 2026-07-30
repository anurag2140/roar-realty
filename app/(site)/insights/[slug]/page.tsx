import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextComponents } from "next-sanity";
import { getAllInsightSlugs, getInsightBySlug } from "@/lib/sanity/queries";
import { imageSrcSet, imageUrl } from "@/lib/sanity/image";
import type { SanityImage } from "@/lib/sanity/image";
import { isLive } from "@/lib/env";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllInsightSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getInsightBySlug(slug);
  if (!post) return { title: "Article not found" };

  const og = imageUrl(post.seo?.ogImage ?? post.cover, 1200, 630);
  return {
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.excerpt,
    robots: post.seo?.noIndex || !isLive ? { index: false, follow: true } : undefined,
    alternates: { canonical: `/insights/${post.slug}` },
    openGraph: {
      type: "article",
      publishedTime: post.publishedAt,
      title: post.title,
      description: post.excerpt,
      images: og ? [{ url: og, width: 1200, height: 630 }] : undefined,
    },
  };
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: SanityImage }) => {
      const src = imageUrl(value, 1200);
      if (!src) return null;
      return (
        <figure className="my-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            srcSet={imageSrcSet(value, [640, 1080, 1440]) ?? undefined}
            sizes="(max-width: 768px) 100vw, 720px"
            alt={value.alt || ""}
            loading="lazy"
            className="w-full"
          />
          {value.caption && (
            <figcaption className="mt-2 text-xs text-ivory/40">{value.caption}</figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h2: ({ children }) => (
      <h2 className="mt-10 mb-3 font-display text-[28px] text-ivory">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-2 font-display text-2xl text-ivory">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-2 border-gold pl-5 font-serif text-xl italic text-gold-hi">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => <p className="mb-5">{children}</p>,
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        rel="noopener noreferrer"
        className="text-gold-hi underline underline-offset-2"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mb-5 list-disc pl-6">{children}</ul>,
    number: ({ children }) => <ol className="mb-5 list-decimal pl-6">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="mb-2">{children}</li>,
  },
};

export default async function InsightPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getInsightBySlug(slug);
  if (!post) notFound();

  const cover = imageUrl(post.cover, 1400, 700);

  return (
    <>
      <ArticleJsonLd insight={post} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Insights", href: "/insights" },
          { name: post.title, href: `/insights/${post.slug}` },
        ]}
      />

      <article className="mx-auto max-w-3xl px-5 pt-16 pb-24 lg:px-10">
        <nav aria-label="Breadcrumb" className="mb-8 text-[11px] tracking-[0.16em] uppercase">
          <Link href="/insights" className="text-ivory/40 no-underline hover:text-gold-hi">
            ← All insights
          </Link>
        </nav>

        {post.category && (
          <div className="mb-4 text-[11px] tracking-[0.28em] text-gold uppercase">
            {post.category}
          </div>
        )}

        <h1 className="m-0 font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.1] text-balance text-ivory">
          {post.title}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-[11px] tracking-[0.16em] text-ivory/40 uppercase">
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
          {post.author && <span>· {post.author.name}</span>}
          {post.readingMinutes ? <span>· {post.readingMinutes} min read</span> : null}
        </div>

        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            srcSet={imageSrcSet(post.cover, [640, 1080, 1440], 2) ?? undefined}
            sizes="(max-width: 768px) 100vw, 720px"
            alt={post.cover?.alt || ""}
            width={1400}
            height={700}
            fetchPriority="high"
            className="mt-8 w-full"
          />
        )}

        {post.excerpt && (
          <p className="mt-8 font-serif text-xl leading-relaxed italic text-gold-hi">
            {post.excerpt}
          </p>
        )}

        {post.body && (
          <div className="mt-8 text-[17px] leading-[1.85] text-ivory/70">
            <PortableText value={post.body} components={components} />
          </div>
        )}
      </article>
    </>
  );
}
