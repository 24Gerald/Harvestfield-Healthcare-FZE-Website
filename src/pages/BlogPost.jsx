import { useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPost, formatDate, mediaUrl, safeHtml } from '../lib/posts'
import { site } from '../data/siteConfig'

export default function BlogPost() {
  const { slug } = useParams()
  const post = getPost(slug)
  const html = useMemo(() => (post ? safeHtml(post.body) : ''), [post])

  useEffect(() => {
    if (post) document.title = `${post.title} | ${site.shortName}`
  }, [post])

  return (
    <article className="bg-white">
      <div className="container-site pb-24 pt-32 md:pt-40">
        <Link to="/news" className="text-sm font-semibold text-teal-deep underline-offset-4 hover:underline">
          ← All posts
        </Link>
        {!post ? (
          <div className="mt-8 max-w-xl">
            <h1 className="text-3xl font-bold text-teal-deep">Post not found.</h1>
            <p className="mt-3 text-ink/80">It may have been moved or unpublished.</p>
          </div>
        ) : (
          <div className="mt-8 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-eyebrow text-muted">
              {formatDate(post.publishedAt)}
              {post.author ? ` · ${post.author}` : ''}
            </p>
            <h1 className="mt-3 text-4xl font-bold text-teal-deep md:text-5xl">{post.title}</h1>
            {post.excerpt && <p className="mt-5 text-lg text-ink/80">{post.excerpt}</p>}
            {post.cover && <img src={mediaUrl(post.cover)} alt={post.coverAlt || ''} className="mt-8 w-full rounded-3xl" />}
            <div className="hf-prose mt-6" dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        )}
      </div>
    </article>
  )
}
