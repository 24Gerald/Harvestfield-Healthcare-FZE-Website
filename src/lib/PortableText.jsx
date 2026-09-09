import { imageUrl } from './sanity'

/**
 * Renders Sanity Portable Text (blocks, lists, marks, images) with site styles.
 * Deliberately small — covers what the Studio schema in /studio allows.
 */
function Marks({ children, marks = [], markDefs = [] }) {
  return marks.reduce((node, mark) => {
    if (mark === 'strong') return <strong className="font-semibold text-ink">{node}</strong>
    if (mark === 'em') return <em>{node}</em>
    if (mark === 'underline') return <u>{node}</u>
    if (mark === 'code') return <code className="rounded bg-teal-tint px-1 py-0.5 text-[0.9em]">{node}</code>
    const def = markDefs.find((d) => d._key === mark)
    if (def?._type === 'link') {
      const external = /^https?:\/\//.test(def.href)
      return (
        <a href={def.href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} className="font-medium text-teal-deep underline underline-offset-4">
          {node}
        </a>
      )
    }
    return node
  }, children)
}

function Block({ block }) {
  const text = block.children.map((span) => (
    <Marks key={span._key} marks={span.marks} markDefs={block.markDefs}>
      {span.text}
    </Marks>
  ))
  switch (block.style) {
    case 'h2':
      return <h2 className="mt-10 text-2xl font-bold text-teal-deep">{text}</h2>
    case 'h3':
      return <h3 className="mt-8 text-xl font-semibold text-teal-deep">{text}</h3>
    case 'h4':
      return <h4 className="mt-6 text-lg font-semibold text-teal-deep">{text}</h4>
    case 'blockquote':
      return <blockquote className="mt-6 border-l-2 border-teal-deep/40 pl-5 text-lg italic text-ink/80">{text}</blockquote>
    default:
      return <p className="mt-5 text-base leading-relaxed text-ink/85">{text}</p>
  }
}

export default function PortableText({ value = [] }) {
  const out = []
  let list = null
  const flush = () => {
    if (!list) return
    const Tag = list.type === 'number' ? 'ol' : 'ul'
    out.push(
      <Tag key={`list-${out.length}`} className={`mt-5 space-y-2 pl-6 text-base text-ink/85 ${list.type === 'number' ? 'list-decimal' : 'list-disc'}`}>
        {list.items}
      </Tag>,
    )
    list = null
  }
  for (const block of value) {
    if (block._type === 'block' && block.listItem) {
      if (!list || list.type !== block.listItem) {
        flush()
        list = { type: block.listItem, items: [] }
      }
      list.items.push(
        <li key={block._key}>
          {block.children.map((span) => (
            <Marks key={span._key} marks={span.marks} markDefs={block.markDefs}>
              {span.text}
            </Marks>
          ))}
        </li>,
      )
      continue
    }
    flush()
    if (block._type === 'block') out.push(<Block key={block._key} block={block} />)
    else if (block._type === 'image') {
      const src = imageUrl(block, { w: 1400 })
      if (src)
        out.push(
          <figure key={block._key} className="mt-8">
            <img src={src} alt={block.alt || ''} className="w-full rounded-2xl" loading="lazy" />
            {block.caption && <figcaption className="mt-2 text-sm text-muted">{block.caption}</figcaption>}
          </figure>,
        )
    }
  }
  flush()
  return <>{out}</>
}
