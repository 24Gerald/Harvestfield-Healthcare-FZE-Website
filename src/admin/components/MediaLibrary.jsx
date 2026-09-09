import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ADMIN } from '../config'
import { prepareImage, fileToBase64 } from '../lib/util'
import { Btn, useToast, EASE } from './ui'

const isImage = (n) => /\.(png|jpe?g|webp|gif|avif)$/i.test(n)
const rawUrl = (name) => `https://raw.githubusercontent.com/${ADMIN.owner}/${ADMIN.repo}/${ADMIN.branch}/${ADMIN.mediaDir}/${name}`

/**
 * Lists public/blog-media, uploads new files (images are resized in the browser),
 * and hands back a site-relative path ("blog-media/<name>") on pick.
 */
export default function MediaLibrary({ client, onPick, pickLabel = 'Use this image' }) {
  const [items, setItems] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [drag, setDrag] = useState(false)
  const fileRef = useRef(null)
  const toast = useToast()

  const load = async () => {
    try {
      const list = await client.list(ADMIN.mediaDir)
      setItems(list.filter((f) => f.type === 'file' && f.name !== 'README.txt').sort((a, b) => (a.name < b.name ? 1 : -1)))
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
    for (const file of files) {
      try {
        let name, base64
        if (file.type.startsWith('image/') && file.type !== 'image/gif' && file.type !== 'image/svg+xml') {
          const img = await prepareImage(file, ADMIN.maxImageEdge)
          name = img.name
          base64 = img.base64
        } else {
          name = `${Date.now().toString(36)}-${file.name.replace(/[^a-zA-Z0-9._-]+/g, '-')}`
          base64 = await fileToBase64(file)
        }
        await client.write(`${ADMIN.mediaDir}/${name}`, base64, `Upload media: ${name}`, { isBase64: true })
        toast(`Uploaded ${name}`, 'success')
      } catch (e) {
        toast(`Upload failed: ${e.message}`, 'error')
      }
    }
    setUploading(false)
    load()
  }

  const remove = async (name) => {
    if (!confirm(`Delete ${name}? Posts using it will lose the image.`)) return
    try {
      await client.remove(`${ADMIN.mediaDir}/${name}`, `Delete media: ${name}`)
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
        className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors ${drag ? 'border-teal-deep bg-teal-tint' : 'border-teal-deep/25 bg-teal-tint-solid/60'}`}
      >
        <p className="text-sm font-medium text-teal-deep">Drop images here</p>
        <p className="mt-1 text-xs text-muted">JPG, PNG, WebP, GIF or PDF. Large images are resized to {ADMIN.maxImageEdge}px on the long edge.</p>
        <Btn variant="ghost" className="mt-4" busy={uploading} onClick={() => fileRef.current.click()}>
          Choose files
        </Btn>
        <input ref={fileRef} type="file" multiple accept="image/*,application/pdf" className="hidden" onChange={(e) => upload([...e.target.files])} />
      </div>

      {items === null ? (
        <p className="mt-6 text-sm text-muted">Loading…</p>
      ) : items.length === 0 ? (
        <p className="mt-6 text-sm text-muted">No media yet.</p>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {items.map((f, i) => (
            <motion.li key={f.sha} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE, delay: i * 0.03 }} className="group overflow-hidden rounded-2xl border border-teal-deep/10 bg-white">
              <div className="aspect-[4/3] bg-teal-tint-solid">
                {isImage(f.name) ? <img src={rawUrl(f.name)} alt="" className="h-full w-full object-cover" loading="lazy" /> : <div className="flex h-full items-center justify-center text-xs text-muted">{f.name.split('.').pop().toUpperCase()}</div>}
              </div>
              <div className="p-3">
                <p className="truncate text-xs text-ink" title={f.name}>{f.name}</p>
                <div className="mt-2 flex gap-1">
                  {onPick && (
                    <Btn className="px-3 py-1 text-xs" onClick={() => onPick({ path: `blog-media/${f.name}`, name: f.name })}>
                      {pickLabel}
                    </Btn>
                  )}
                  <Btn variant="quiet" className="px-2 py-1 text-xs" onClick={() => { navigator.clipboard.writeText(`blog-media/${f.name}`); toast('Path copied') }}>
                    Copy
                  </Btn>
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
