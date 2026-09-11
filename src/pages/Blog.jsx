import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import PageHeader from '../components/PageHeader'
import { posts, formatDate, mediaUrl } from '../lib/posts'
import { blog, pages } from '../data/content'

/** News — milestones. Replaces the blog; entries are still written in the admin panel. */
export default function Blog() {
  return (
    <>
      <PageHeader page={pages.news} />
      <section className="bg-white">
        <div className="container-site section-pad">

        {posts.length === 0 ? (
          <div className="rounded-3xl bg-teal-tint-solid p-8 md:p-10">
            <h2 className="text-2xl font-bold text-teal-deep">{blog.soonTitle}</h2>
            <p className="mt-3 max-w-xl text-base text-ink/80">{blog.soonBody}</p>
          </div>
        ) : (
          <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <Reveal key={p.slug} as="li" delay={i * 0.06}>
                <Link to={`${pages.news.path}/${p.slug}`} className="group block">
                  <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-teal-tint-solid">
                    {p.cover && (
                      <img
                        src={mediaUrl(p.cover)}
                        alt={p.coverAlt || ''}
                        className="h-full w-full object-cover transition-transform duration-700 ease-brand group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-eyebrow text-muted">{formatDate(p.publishedAt)}</p>
                  <h2 className="mt-2 text-xl font-semibold text-teal-deep group-hover:underline group-hover:underline-offset-4">{p.title}</h2>
                  {p.excerpt && <p className="mt-2 text-sm text-ink/75">{p.excerpt}</p>}
                </Link>
              </Reveal>
            ))}
          </ul>
        )}
        </div>
      </section>
    </>
  )
}
