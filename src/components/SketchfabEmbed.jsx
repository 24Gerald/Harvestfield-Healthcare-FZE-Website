import { useState } from 'react'
import Button from './Button'

/**
 * Sketchfab model viewer behind a lightweight facade.
 *
 * The Sketchfab iframe pulls in a full WebGL viewer (several MB), so it is not
 * created until the visitor asks for it. Until then a brand-coloured card with
 * a "view in 3D" button stands in. Attribution (model, author, Sketchfab) is
 * required by Sketchfab's embed terms and is always rendered.
 */
export default function SketchfabEmbed({ modelId, title, author, authorUrl, modelUrl, loadLabel = 'View in 3D', note }) {
  const [loaded, setLoaded] = useState(false)
  const src = `https://sketchfab.com/models/${modelId}/embed?autostart=1&ui_theme=dark&preload=1`

  return (
    <figure className="sketchfab-embed-wrapper">
      <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-teal-deeper sm:aspect-[16/9]">
        {loaded ? (
          <iframe
            title={title}
            src={src}
            className="absolute inset-0 h-full w-full"
            frameBorder="0"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-[radial-gradient(80%_70%_at_50%_45%,#15606b_0%,#0b3b43_100%)] px-6 text-center text-white">
            {/* Abstract mosquito glyph as the poster — no external image request */}
            <svg viewBox="0 0 120 60" className="h-14 w-28 opacity-80" fill="#ffffff" aria-hidden="true">
              <ellipse cx="52" cy="30" rx="26" ry="6" opacity="0.9" />
              <circle cx="80" cy="29" r="7" opacity="0.9" />
              <path d="M87 29 L112 25" stroke="#ffffff" strokeWidth="2" opacity="0.7" />
              <ellipse cx="48" cy="17" rx="18" ry="7" opacity="0.45" transform="rotate(-18 48 17)" />
              <ellipse cx="48" cy="43" rx="18" ry="7" opacity="0.45" transform="rotate(18 48 43)" />
            </svg>
            <Button variant="solidOnDark" onClick={() => setLoaded(true)} aria-label={`${loadLabel}: ${title}`}>
              {loadLabel}
            </Button>
            {note && <p className="max-w-xs text-xs text-white/60">{note}</p>}
          </div>
        )}
      </div>
      <figcaption className="mt-3 text-xs text-muted">
        <a href={modelUrl} target="_blank" rel="nofollow noopener noreferrer" className="font-semibold text-teal-deep underline-offset-4 hover:underline">
          {title}
        </a>{' '}
        by{' '}
        <a href={authorUrl} target="_blank" rel="nofollow noopener noreferrer" className="font-semibold text-teal-deep underline-offset-4 hover:underline">
          {author}
        </a>{' '}
        on{' '}
        <a href="https://sketchfab.com" target="_blank" rel="nofollow noopener noreferrer" className="font-semibold text-teal-deep underline-offset-4 hover:underline">
          Sketchfab
        </a>
      </figcaption>
    </figure>
  )
}
