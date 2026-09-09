import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import Eyebrow from '../components/Eyebrow'
import { fetchPosts, formatDate, imageUrl, sanityConfigured } from '../lib/sanity'
import { site } from '../data/siteConfig'
import { blog } from '../data/content'

export default function Blog() {
  const [state, setState] = useState({ status: sanityConfigured() ? 'loading' : 'unconfigured', posts: [] })

  useEffect(() => {
    document.title = `${blog.title} | ${site.shortName}`
    if (!sanityConfigured()) return
    fetchPosts()
      .then((posts) => setState({ status: 'ready', posts }))
      .catch(() => setState({ status: 'error', posts: [] }))
  }, [])

  return (
    <section className="bg-white">
      <div className="container-site pb-24 pt-32 md:pt-40">
        <Reveal>
          <Eyebrow className="text-teal-deep">{blog.eyebrow}</Eyebrow>
          <h1 className="mt-4 text-4xl font-bold text-teal-deep md:text-5xl">{blog.title}</h1>
          <p className="mt-4 max-w-xl text-lg text-ink/80">{blog.intro}</p>
        </Reveal>

        {state.status === 'unconfigured' && <Empty title={blog.soonTitle} body={blog.soonBody} />}
        {state.status === 'error' && <Empty title="The blog could not be loaded." body="Please try again in a moment." />}
        {state.status === 'loading' && (
          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3" aria-busy="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[16/10] rounded-2xl bg-teal-tint-solid" />
                <div className="mt-4 h-4 w-1/3 rounded bg-teal-tint-solid" />
                <div className="mt-3 h-6 w-4/5 rounded bg-teal-tint-solid" />
              </div>
            ))}
          </div>
        )}
        {state.status === 'ready' && state.posts.length === 0 && <Empty title={blog.soonTitle} body={blog.soonBody} />}
        {state.status === 'ready' && state.posts.length > 0 && (
          <ul className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {state.posts.map((p, i) => (
              <Reveal key={p._id} as="li" delay={i * 0.06}>
                <Link to={`/blog/${p.slug}`} className="group block">
                  <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-teal-tint-solid">
                    {imageUrl(p.cover, { w: 900 }) && (
                      <img
                        src={imageUrl(p.cover, { w: 900 })}
                        alt={p.cover?.alt || ''}
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

function Empty({ title, body }) {
  return (
    <div className="mt-14 rounded-3xl bg-teal-tint-solid p-8 md:p-10">
      <h2 className="text-2xl font-bold text-teal-deep">{title}</h2>
      <p className="mt-3 max-w-xl text-base text-ink/80">{body}</p>
    </div>
  )
}
