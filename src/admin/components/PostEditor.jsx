import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ADMIN } from '../config'
import { slugify, isoToLocalInput, localInputToIso, nowLocalInput } from '../lib/util'
import RichText, { cleanHtml } from './RichText'
import MediaLibrary from './MediaLibrary'
import { Btn, Field, Modal, inputClass, useToast, EASE } from './ui'

const rawUrl = (path) => `https://raw.githubusercontent.com/${ADMIN.owner}/${ADMIN.repo}/${ADMIN.branch}/public/${path}`

const empty = () => ({
  title: '',
  slug: '',
  publishedAt: localInputToIso(nowLocalInput()),
  published: false,
  excerpt: '',
  author: 'Harvestfield Healthcare',
  cover: '',
  coverAlt: '',
  body: '',
})

export default function PostEditor({ client, initial, onSaved, onBack, onDeployed }) {
  const [post, setPost] = useState(initial?.data || empty())
  const [sha] = useState(initial?.sha || null)
  const [slugTouched, setSlugTouched] = useState(!!initial)
  const [busy, setBusy] = useState(false)
  const [media, setMedia] = useState(null) // null | 'cover' | { resolve }
  const [dirty, setDirty] = useState(false)
  const toast = useToast()
  const draftKey = `hf-admin-draft-${initial?.data?.slug || 'new'}`
  const restoredRef = useRef(false)
  const barRef = useRef(null)

  // Publish the action bar's height so the editor toolbar can stick below it.
  useEffect(() => {
    const el = barRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const apply = () => document.documentElement.style.setProperty('--hf-actionbar', `${el.offsetHeight}px`)
    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(el)
    return () => {
      ro.disconnect()
      document.documentElement.style.setProperty('--hf-actionbar', '0px')
    }
  }, [])

  // Autosave a local draft so a closed tab loses nothing.
  useEffect(() => {
    if (restoredRef.current) return
    restoredRef.current = true
    try {
      const saved = localStorage.getItem(draftKey)
      if (saved && !initial) {
        const d = JSON.parse(saved)
        if (d.title || d.body) {
          setPost(d)
          toast('Restored an unsaved draft from this browser')
        }
      }
    } catch { /* ignore */ }
  }, [draftKey, initial, toast])
  useEffect(() => {
    if (!dirty) return
    const t = setTimeout(() => localStorage.setItem(draftKey, JSON.stringify(post)), 600)
    return () => clearTimeout(t)
  }, [post, dirty, draftKey])

  const set = (patch) => {
    setDirty(true)
    setPost((p) => {
      const next = { ...p, ...patch }
      if (!slugTouched && patch.title !== undefined) next.slug = slugify(patch.title)
      return next
    })
  }

  const validate = () => {
    if (!post.title.trim()) return 'Give the post a title.'
    if (!post.slug.trim()) return 'The URL slug is empty.'
    if (!post.body.trim() || post.body === '<p></p>') return 'The post body is empty.'
    return null
  }

  const save = async (publish) => {
    const err = validate()
    if (err) return toast(err, 'error')
    setBusy(true)
    const data = { ...post, slug: slugify(post.slug), body: cleanHtml(post.body), published: publish ?? post.published }
    const path = `${ADMIN.postsDir}/${data.slug}.json`
    try {
      if (initial && initial.data.slug !== data.slug) {
        // Renamed: remove the old file, then write the new one.
        await client.remove(`${ADMIN.postsDir}/${initial.data.slug}.json`, `Rename post: ${initial.data.slug} → ${data.slug}`)
      }
      await client.write(path, JSON.stringify(data, null, 2) + '\n', `${data.published ? 'Publish' : 'Save draft'}: ${data.title}`)
      localStorage.removeItem(draftKey)
      setDirty(false)
      setPost(data)
      toast(data.published ? 'Published. The site will update in about two minutes.' : 'Draft saved.', 'success')
      onDeployed?.()
      onSaved?.(data)
    } catch (e) {
      toast(`Save failed: ${e.message}`, 'error')
    } finally {
      setBusy(false)
    }
  }

  const unpublish = () => save(false)

  const del = async () => {
    if (!initial) return onBack()
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return
    setBusy(true)
    try {
      await client.remove(`${ADMIN.postsDir}/${initial.data.slug}.json`, `Delete post: ${post.title}`)
      localStorage.removeItem(draftKey)
      toast('Post deleted', 'success')
      onDeployed?.()
      onBack()
    } catch (e) {
      toast(`Delete failed: ${e.message}`, 'error')
      setBusy(false)
    }
  }

  // Image insertion from the body editor: open the library, resolve with a path.
  const insertImage = () =>
    new Promise((resolve) => {
      setMedia({ resolve })
    })
  const pick = (item) => {
    if (media === 'cover') set({ cover: item.path })
    else if (media?.resolve) media.resolve({ path: item.path, alt: '' })
    setMedia(null)
  }
  const closeMedia = () => {
    if (media?.resolve) media.resolve(null)
    setMedia(null)
  }

  const wordCount = post.body.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }}>
      {/* Action bar */}
      <div
        ref={barRef}
        className="sticky top-[var(--hf-header,64px)] z-20 -mx-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-teal-deep/10 bg-white/95 px-4 py-2.5 backdrop-blur sm:-mx-6 sm:px-6 sm:py-3 md:-mx-10 md:px-10"
      >
        <Btn variant="quiet" onClick={onBack} className="-ml-2 px-3">
          ← Posts
        </Btn>
        <span className="hidden text-sm text-muted sm:inline">
          {initial ? 'Editing' : 'New post'} · {wordCount} words {dirty && '· unsaved changes'}
        </span>
        <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${post.published ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
            {post.published ? 'Published' : 'Draft'}
          </span>
          {initial && <Btn variant="danger" onClick={del} busy={busy} className="px-3">Delete</Btn>}
          {post.published ? (
            <Btn variant="ghost" onClick={unpublish} busy={busy} className="px-3">Unpublish</Btn>
          ) : (
            <Btn variant="ghost" onClick={() => save(false)} busy={busy} className="px-3">Save draft</Btn>
          )}
          <Btn onClick={() => save(true)} busy={busy}>{post.published ? 'Update' : 'Publish'}</Btn>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted sm:hidden">
        {initial ? 'Editing' : 'New post'} · {wordCount} words {dirty && '· unsaved changes'}
      </p>

      <div className="mt-5 grid gap-8 sm:mt-8 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-6">
          <input
            value={post.title}
            onChange={(e) => set({ title: e.target.value })}
            placeholder="Post title"
            className="w-full border-0 bg-transparent text-2xl font-bold text-teal-deep placeholder:text-teal-deep/30 focus:outline-none sm:text-3xl md:text-4xl"
          />
          <Field label="Excerpt" hint="One or two sentences shown on the blog page and in link previews.">
            <textarea rows={2} className={inputClass} value={post.excerpt} onChange={(e) => set({ excerpt: e.target.value })} />
          </Field>
          <RichText value={post.body} onChange={(html) => set({ body: html })} onInsertImage={insertImage} />
        </div>

        <aside className="min-w-0 space-y-6">
          <div className="rounded-2xl border border-teal-deep/15 p-4 sm:p-5">
            <p className="eyebrow text-teal-deep">Cover image</p>
            <div className="mt-3 aspect-[16/10] overflow-hidden rounded-xl bg-teal-tint-solid">
              {post.cover && <img src={rawUrl(post.cover)} alt={post.coverAlt} className="h-full w-full object-cover" />}
            </div>
            <div className="mt-3 flex gap-2">
              <Btn variant="ghost" className="px-3 py-1.5 text-xs" onClick={() => setMedia('cover')}>
                {post.cover ? 'Change' : 'Choose image'}
              </Btn>
              {post.cover && (
                <Btn variant="quiet" className="px-3 py-1.5 text-xs" onClick={() => set({ cover: '', coverAlt: '' })}>
                  Remove
                </Btn>
              )}
            </div>
            {post.cover && (
              <div className="mt-3">
                <Field label="Alt text" hint="Describe the image for screen readers.">
                  <input className={inputClass} value={post.coverAlt} onChange={(e) => set({ coverAlt: e.target.value })} />
                </Field>
              </div>
            )}
          </div>

          <div className="space-y-4 rounded-2xl border border-teal-deep/15 p-4 sm:p-5">
            <Field label="URL slug" hint={`${ADMIN.siteUrl}/news/${post.slug || '…'}`}>
              <input className={inputClass} value={post.slug} onChange={(e) => { setSlugTouched(true); set({ slug: slugify(e.target.value) }) }} />
            </Field>
            <Field label="Publish date" hint="Future dates keep the post hidden until the next site build after that time.">
              <input type="datetime-local" className={inputClass} value={isoToLocalInput(post.publishedAt)} onChange={(e) => set({ publishedAt: localInputToIso(e.target.value) })} />
            </Field>
            <Field label="Author">
              <input className={inputClass} value={post.author} onChange={(e) => set({ author: e.target.value })} />
            </Field>
          </div>
          {sha && <p className="break-all text-[11px] text-muted">File: {ADMIN.postsDir}/{initial.data.slug}.json</p>}
        </aside>
      </div>

      <Modal open={!!media} onClose={closeMedia} title={media === 'cover' ? 'Choose a cover image' : 'Insert an image'} wide>
        <MediaLibrary client={client} onPick={pick} pickLabel={media === 'cover' ? 'Use as cover' : 'Insert'} />
      </Modal>
    </motion.div>
  )
}
