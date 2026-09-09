import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import Eyebrow from '../components/Eyebrow'
import { posts, formatDate, mediaUrl } from '../lib/posts'
import { site } from '../data/siteConfig'
import { blog } from '../data/content'

export default function Blog() {
  useEffect(() => {
    document.title = `${blog.title} | ${site.shortName}`
  }, [])

  return (
    <section className="bg-white">
      <div className="container-site pb-24 pt-32 md:pt-40">
        <Reveal>
          <Eyebrow className="text-teal-deep">{blog.eyebrow}</Eyebrow>
          <h1 className="mt-4 text-4xl font-bold text-teal-deep md:text-5xl">{blog.title}</h1>
          <p className="mt-4 max-w-xl text-lg text-ink/80">{blog.intro}</p>
        </Reveal>

        {posts.length === 0 ? (
          <div className="mt-14 rounded-3xl bg-teal-tint-solid p-8 md:p-10">
            <h2 className="text-2xl font-bold text-teal-deep">{blog.soonTitle}</h2>
            <p className="mt-3 max-w-xl text-base text-ink/80">{blog.soonBody}</p>
          </div>
        ) : (
          <ul className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <Reveal key={p.slug} as="li" delay={i * 0.06}>
                <Link to={`/blog/${p.slug}`} className="group block">
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
  )
}
