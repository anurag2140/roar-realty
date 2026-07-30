import type { Metadata } from "next";
import Link from "next/link";
import { getInsights } from "@/lib/sanity/queries";
import { imageUrl } from "@/lib/sanity/image";
import { PageHeader } from "@/components/layout/PageHeader";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Insights — Delhi NCR property, honestly reported",
  description:
    "Market reports, buyer guides and RERA explainers from Roar Realty. What's actually selling, where prices moved, and which projects we walked away from.",
  alternates: { canonical: "/insights" },
};

export default async function InsightsPage() {
  const insights = await getInsights();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Insights", href: "/insights" },
        ]}
      />

      <PageHeader
        eyebrow="Insights"
        title="What we actually see in the market."
        intro="Not press releases. Market reports, buyer guides and the occasional account of a deal we told a client to walk away from."
      />

      <div className="mx-auto max-w-[1400px] px-5 pb-24 lg:px-10 lg:pb-32">
        {insights.length ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-6.5">
            {insights.map((post) => {
              const cover = imageUrl(post.cover, 700, 440);
              return (
                <article
                  key={post._id}
                  className="roar-reveal group relative flex flex-col border border-gold/20 bg-ink-2 transition-all duration-300 hover:-translate-y-1 hover:border-gold-hi/55"
                >
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cover}
                      alt=""
                      width={700}
                      height={440}
                      loading="lazy"
                      className="h-52 w-full object-cover"
                    />
                  ) : (
                    <div className="h-52 w-full bg-gradient-to-br from-ink-2 to-ink" />
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    {post.category && (
                      <div className="mb-3 text-[10px] tracking-[0.24em] text-gold uppercase">
                        {post.category}
                      </div>
                    )}
                    <h2 className="font-display text-xl leading-snug text-ivory">
                      <Link
                        href={`/insights/${post.slug}`}
                        className="no-underline after:absolute after:inset-0 after:content-[''] hover:text-gold-hi"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    {post.excerpt && (
                      <p className="mt-3 text-sm leading-relaxed text-ivory/55">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="mt-auto pt-5 text-[11px] tracking-[0.16em] text-ivory/35 uppercase">
                      <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </time>
                      {post.readingMinutes ? ` · ${post.readingMinutes} min read` : ""}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="border border-dashed border-gold/25 px-6 py-16 text-center text-ivory/45">
            No articles published yet. Write your first in{" "}
            <a href="/studio" className="text-gold-hi underline underline-offset-2">
              Studio → Insights
            </a>
            .
          </p>
        )}
      </div>
    </>
  );
}
