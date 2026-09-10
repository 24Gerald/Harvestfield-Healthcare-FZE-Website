import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ADMIN } from '../config'
import { prepareImage, fileToBase64 } from '../lib/util'
import { Btn, useToast, EASE } from './ui'

const isImage = (n) => /\.(png|jpe?g|webp|gif|avif)$/i.test(n)
const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' })
const rawUrl = (dir, name) => `https://raw.githubusercontent.com/${ADMIN.owner}/${ADMIN.repo}/${ADMIN.branch}/${dir}/${name}`
const seqPrefix = (n) => String(n).padStart(2, '0')

/**
 * Lists a media folder in the repo, uploads new files (images are resized in the
 * browser) and hands back a site-relative path ("blog-media/<name>") on pick.
 * Default folder: public/blog-media (blog images, timestamp-named).
 * `sequence` mode (the home-page gallery): files are numbered 01-, 02-, … in the
 * order they are chosen, because the slider shows them in file-name order.
 */
export default function MediaLibrary({ client, onPick, pickLabel = 'Use this image', dir = ADMIN.mediaDir, sequence = false, imagesOnly = false, maxEdge = ADMIN.maxImageEdge }) {
  const [items, setItems] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [drag, setDrag] = useState(false)
  const fileRef = useRef(null)
  const toast = useToast()

  const load = async () => {
    try {
      const list = await client.list(dir)
      const files = list.filter((f) => f.type === 'file' && f.name !== 'README.txt' && f.name !== '.gitkeep')
      setItems(sequence ? files.sort((a, b) => collator.compare(a.name, b.name)) : files.sort((a, b) => (a.name < b.name ? 1 : -1)))
    } catch (e) {
      toast(`Could not list media: ${e.message}`, 'error')
      setItems([])
    }
  }
  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const upload = async (files) => {
    if (!files?.length) return
    setUploading(true)
    // Sequence mode: continue numbering after the highest existing prefix.
    let next = 1
    if (sequence) for (const f of items || []) { const m = /^(\d+)-/.exec(f.name); if (m) next = Math.max(next, Number(m[1]) + 1) }
    for (const file of files) {
      try {
        let name, base64
        if (file.type.startsWith('image/') && file.type !== 'image/gif' && file.type !== 'image/svg+xml') {
          const img = await prepareImage(file, maxEdge)
          name = img.name
          base64 = img.base64
        } else if (imagesOnly) {
          throw new Error(`${file.name}: only JPG, PNG or WebP photos can go in the gallery`)
        } else {
          name = `${Date.now().toString(36)}-${file.name.replace(/[^a-zA-Z0-9._-]+/g, '-')}`
          base64 = await fileToBase64(file)
        }
        if (sequence) name = `${seqPrefix(next++)}-${name.replace(/^[0-9a-z]+-/, '')}`
        await client.write(`${dir}/${name}`, base64, `${sequence ? 'Add gallery photo' : 'Upload media'}: ${name}`, { isBase64: true })
        toast(`Uploaded ${name}`, 'success')
      } catch (e) {
        toast(`Upload failed: ${e.message}`, 'error')
      }
    }
    setUploading(false)
    load()
  }

  const remove = async (name) => {
    if (!confirm(sequence ? `Remove ${name} from the gallery?` : `Delete ${name}? Posts using it will lose the image.`)) return
    try {
      await client.remove(`${dir}/${name}`, `${sequence ? 'Remove gallery photo' : 'Delete media'}: ${name}`)
      toast('Deleted', 'success')
      load()
    } catch (e) {
      toast(`Delete failed: ${e.message}`, 'error')
    }
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); upload([...e.dataTransfer.files]) }}
        className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-6 text-center transition-colors sm:px-6 sm:py-8 ${drag ? 'border-teal-deep bg-teal-tint' : 'border-teal-deep/25 bg-teal-tint-solid/60'}`}
      >
        <p className="text-sm font-medium text-teal-deep"><span className="hidden sm:inline">Drop images here</span><span className="sm:hidden">Add images</span></p>
        <p className="mt-1 text-xs text-muted">
          {imagesOnly ? 'JPG, PNG or WebP.' : 'JPG, PNG, WebP, GIF or PDF.'} Large images are resized to {maxEdge}px on the long edge.
          {sequence && ' Photos are numbered in the order you choose them.'}
        </p>
        <Btn variant="ghost" className="mt-4" busy={uploading} onClick={() => fileRef.current.click()}>
          Choose files
        </Btn>
        <input ref={fileRef} type="file" multiple accept={imagesOnly ? 'image/jpeg,image/png,image/webp' : 'image/*,application/pdf'} className="hidden" onChange={(e) => upload([...e.target.files])} />
      </div>

      {items === null ? (
        <p className="mt-6 text-sm text-muted">Loading…</p>
      ) : items.length === 0 ? (
        <p className="mt-6 text-sm text-muted">{sequence ? 'No photos yet. The slider stays hidden on the site until you add some.' : 'No media yet.'}</p>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4">
          {items.map((f, i) => (
            <motion.li key={f.sha} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE, delay: i * 0.03 }} className="group overflow-hidden rounded-2xl border border-teal-deep/10 bg-white">
              <div className={`${sequence ? 'aspect-video' : 'aspect-[4/3]'} bg-teal-tint-solid`}>
                {isImage(f.name) ? <img src={rawUrl(dir, f.name)} alt="" className="h-full w-full object-cover" loading="lazy" /> : <div className="flex h-full items-center justify-center text-xs text-muted">{f.name.split('.').pop().toUpperCase()}</div>}
              </div>
              <div className="p-3">
                <p className="truncate text-xs text-ink" title={f.name}>
                  {sequence && <span className="mr-1.5 rounded-full bg-teal-tint px-1.5 py-0.5 text-[10px] font-semibold text-teal-deep">{i + 1}</span>}
                  {f.name}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {onPick && (
                    <Btn className="px-3 py-1 text-xs" onClick={() => onPick({ path: `blog-media/${f.name}`, name: f.name })}>
                      {pickLabel}
                    </Btn>
                  )}
                  {!sequence && (
                    <Btn variant="quiet" className="px-2 py-1 text-xs" onClick={() => { navigator.clipboard.writeText(`blog-media/${f.name}`); toast('Path copied') }}>
                      Copy
                    </Btn>
                  )}
                  <Btn variant="quiet" className="ml-auto px-2 py-1 text-xs text-red-700" onClick={() => remove(f.name)}>
                    Delete
                  </Btn>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  )
}
