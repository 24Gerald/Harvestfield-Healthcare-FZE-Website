/**
 * Renders a copy string with lightweight inline markup so links can live in
 * src/data/content.js without JSX:  [label](https://example.com)
 * External links open in a new tab; in-page anchors scroll normally.
 */
const LINK = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|#[^\s)]+)\)/g

export function renderInline(text) {
  const out = []
  let last = 0
  let m
  let i = 0
  while ((m = LINK.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const external = m[2].startsWith('http')
    out.push(
      <a
        key={i++}
        href={m[2]}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="font-semibold text-teal-deep underline decoration-teal-soft decoration-2 underline-offset-4 transition-colors hover:decoration-teal-deep"
      >
        {m[1]}
      </a>,
    )
    last = m.index + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  LINK.lastIndex = 0
  return out
}

export default function InlineMarkup({ text }) {
  return <>{renderInline(text)}</>
}
