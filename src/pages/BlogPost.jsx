import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PortableText from '../lib/PortableText'
import { fetchPost, formatDate, imageUrl, sanityConfigured } from '../lib/sanity'
import { site } from '../data/siteConfig'

export default function BlogPost() {
  const { slug } = useParams()
  const [state, setState] = useState({ status: 'loading', post: null })

  useEffect(() => {
    if (!sanityConfigured()) {
      setState({ status: 'missing', post: null })
      return
    }
    setState({ status: 'loading', post: null })
    fetchPost(slug)
      .then((post) => setState({ status: post ? 'ready' : 'missing', post }))
      .catch(() => setState({ status: 'error', post: null }))
  }, [slug])

  useEffect(() => {
    if (state.post) document.title = `${state.post.title} | ${site.shortName}`
  }, [state.post])

  const post = state.post
  return (
    <article className="bg-white">
      <div className="container-site pb-24 pt-32 md:pt-40">
        <Link to="/blog" className="text-sm font-semibold text-teal-deep underline-offset-4 hover:underline">
          ← All posts
        </Link>
        {state.status === 'loading' && (
          <div className="mt-8 max-w-3xl animate-pulse" aria-busy="true">
            <div className="h-4 w-1/4 rounded bg-teal-tint-solid" />
            <div className="mt-4 h-10 w-3/4 rounded bg-teal-tint-solid" />
            <div className="mt-8 aspect-[16/9] rounded-3xl bg-teal-tint-solid" />
          </div>
        )}
        {(state.status === 'missing' || state.status === 'error') && (
          <div className="mt-8 max-w-xl">
            <h1 className="text-3xl font-bold text-teal-deep">{state.status === 'missing' ? 'Post not found.' : 'This post could not be loaded.'}</h1>
            <p className="mt-3 text-ink/80">It may have been moved or unpublished.</p>
          </div>
        )}
        {state.status === 'ready' && (
          <div className="mt-8 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-eyebrow text-muted">
              {formatDate(post.publishedAt)}
              {post.author?.name ? ` · ${post.author.name}` : ''}
            </p>
            <h1 className="mt-3 text-4xl font-bold text-teal-deep md:text-5xl">{post.title}</h1>
            {post.excerpt && <p className="mt-5 text-lg text-ink/80">{post.excerpt}</p>}
            {imageUrl(post.cover) && (
              <img src={imageUrl(post.cover)} alt={post.cover?.alt || ''} className="mt-8 w-full rounded-3xl" />
            )}
            <div className="mt-4">
              <PortableText value={post.body || []} />
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
