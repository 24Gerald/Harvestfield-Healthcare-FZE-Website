import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ADMIN } from '../config'
import { fmtDate } from '../lib/util'
import { Btn, inputClass, useToast, EASE } from './ui'

const rawUrl = (path) => `https://raw.githubusercontent.com/${ADMIN.owner}/${ADMIN.repo}/${ADMIN.branch}/public/${path}`

export default function Dashboard({ client, onNew, onEdit, refreshKey }) {
  const [posts, setPosts] = useState(null)
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('all')
  const toast = useToast()

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const files = (await client.list(ADMIN.postsDir)).filter((f) => f.name.endsWith('.json'))
        const loaded = await Promise.all(files.map((f) => client.readJson(`${ADMIN.postsDir}/${f.name}`)))
        if (alive) setPosts(loaded.filter(Boolean).sort((a, b) => new Date(b.data.publishedAt) - new Date(a.data.publishedAt)))
      } catch (e) {
        toast(`Could not load posts: ${e.message}`, 'error')
        if (alive) setPosts([])
      }
    })()
    return () => {
      alive = false
    }
  }, [client, refreshKey, toast])

  const shown = useMemo(() => {
    if (!posts) return []
    return posts.filter((p) => {
      if (filter === 'published' && !p.data.published) return false
      if (filter === 'draft' && p.data.published) return false
      if (q && !`${p.data.title} ${p.data.excerpt}`.toLowerCase().includes(q.toLowerCase())) return false
      return true
    })
  }, [posts, q, filter])

  const counts = { all: posts?.length || 0, published: posts?.filter((p) => p.data.published).length || 0, draft: posts?.filter((p) => !p.data.published).length || 0 }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-teal-deep sm:text-3xl">Posts</h1>
          <p className="mt-1 text-sm text-muted">Every save becomes a commit; the site updates itself within about two minutes.</p>
        </div>
        <Btn onClick={onNew}>+ New post</Btn>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex rounded-full bg-teal-tint-solid p-1">
          {['all', 'published', 'draft'].map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)} className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${filter === f ? 'bg-white text-teal-deep shadow-sm' : 'text-muted hover:text-teal-deep'}`}>
              {f} <span className="ml-1 text-muted">{counts[f]}</span>
            </button>
          ))}
        </div>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search posts" className={`${inputClass} sm:max-w-xs`} type="search" />
      </div>

      {posts === null ? (
        <ul className="mt-8 space-y-3" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <li key={i} className="h-20 animate-pulse rounded-2xl bg-teal-tint-solid" />
          ))}
        </ul>
      ) : shown.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-teal-tint-solid p-8 text-center">
          <p className="text-lg font-semibold text-teal-deep">{posts.length === 0 ? 'No posts yet.' : 'Nothing matches.'}</p>
          {posts.length === 0 && (
            <Btn className="mt-4" onClick={onNew}>
              Write the first post
            </Btn>
          )}
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {shown.map((p, i) => (
            <motion.li key={p.data.slug} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE, delay: i * 0.04 }}>
              <button type="button" onClick={() => onEdit(p)} className="group flex w-full items-center gap-3 rounded-2xl border border-teal-deep/10 bg-white p-3 text-left transition-shadow hover:shadow-[0_12px_30px_-18px_rgba(16,81,91,0.35)] sm:gap-4">
                <div className="h-12 w-16 flex-none overflow-hidden rounded-xl bg-teal-tint-solid sm:h-14 sm:w-20">
                  {p.data.cover && <img src={rawUrl(p.data.cover)} alt="" className="h-full w-full object-cover" loading="lazy" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-teal-deep group-hover:underline group-hover:underline-offset-4">{p.data.title || 'Untitled'}</p>
                  <p className="mt-0.5 truncate text-xs text-muted">{fmtDate(p.data.publishedAt)} · /news/{p.data.slug}</p>
                </div>
                <span className={`flex-none rounded-full px-2.5 py-1 text-xs font-semibold ${p.data.published ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {p.data.published ? 'Published' : 'Draft'}
                </span>
              </button>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  )
}
