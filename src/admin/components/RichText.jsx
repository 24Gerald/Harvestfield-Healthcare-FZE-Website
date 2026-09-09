import { useEffect, useRef, useState } from 'react'
import { Btn } from './ui'

const ALLOWED = new Set(['P', 'BR', 'STRONG', 'B', 'EM', 'I', 'U', 'H2', 'H3', 'BLOCKQUOTE', 'UL', 'OL', 'LI', 'A', 'IMG', 'HR', 'FIGURE', 'FIGCAPTION'])

/** Keep only the tags/attributes the site renders; unwrap everything else. Used on paste and on save. */
export function cleanHtml(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const walk = (node) => {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === 1) {
        walk(child)
        const tag = child.tagName
        if (tag === 'SCRIPT' || tag === 'STYLE') {
          child.remove()
          continue
        }
        if (tag === 'DIV' || tag === 'SPAN' || tag === 'FONT' || tag === 'SECTION' || tag === 'ARTICLE') {
          // unwrap
          while (child.firstChild) node.insertBefore(child.firstChild, child)
          child.remove()
          continue
        }
        if (!ALLOWED.has(tag)) {
          const p = doc.createElement('p')
          while (child.firstChild) p.appendChild(child.firstChild)
          child.replaceWith(p)
          continue
        }
        for (const attr of [...child.attributes]) {
          const keep = (tag === 'A' && attr.name === 'href') || (tag === 'IMG' && ['src', 'alt', 'width', 'height'].includes(attr.name))
          if (!keep) child.removeAttribute(attr.name)
        }
        if (tag === 'B') child.outerHTML = `<strong>${child.innerHTML}</strong>`
        if (tag === 'I') child.outerHTML = `<em>${child.innerHTML}</em>`
      } else if (child.nodeType === 8) child.remove()
    }
  }
  walk(doc.body)
  return doc.body.innerHTML.replace(/<p>(\s|&nbsp;|<br>)*<\/p>/g, '').trim()
}

const tools = [
  { cmd: 'bold', label: 'B', title: 'Bold', className: 'font-bold' },
  { cmd: 'italic', label: 'I', title: 'Italic', className: 'italic' },
  { cmd: 'underline', label: 'U', title: 'Underline', className: 'underline' },
  { block: 'H2', label: 'H2', title: 'Heading' },
  { block: 'H3', label: 'H3', title: 'Subheading' },
  { block: 'P', label: '¶', title: 'Paragraph' },
  { block: 'BLOCKQUOTE', label: '“ ”', title: 'Quote' },
  { cmd: 'insertUnorderedList', label: '• List', title: 'Bulleted list' },
  { cmd: 'insertOrderedList', label: '1. List', title: 'Numbered list' },
  { cmd: 'insertHorizontalRule', label: '—', title: 'Divider' },
]

/**
 * contenteditable editor with a small, opinionated toolbar. Pasted content is
 * cleaned to the tags the site renders. `onInsertImage` opens the media flow
 * and resolves to a path that is inserted at the caret.
 */
export default function RichText({ value, onChange, onInsertImage, placeholder = 'Write your post…' }) {
  const ref = useRef(null)
  const [linkOpen, setLinkOpen] = useState(false)
  const savedRange = useRef(null)

  // Only push external value in when it differs (avoid caret jumps).
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) ref.current.innerHTML = value || ''
  }, [value])

  const emit = () => onChange(ref.current.innerHTML)
  const exec = (cmd, arg) => {
    ref.current.focus()
    document.execCommand(cmd, false, arg)
    emit()
  }
  const block = (tag) => exec('formatBlock', tag === 'P' ? 'p' : tag.toLowerCase())

  const onPaste = (e) => {
    const html = e.clipboardData.getData('text/html')
    const text = e.clipboardData.getData('text/plain')
    e.preventDefault()
    if (html) document.execCommand('insertHTML', false, cleanHtml(html))
    else document.execCommand('insertText', false, text)
    emit()
  }

  const rememberSelection = () => {
    const sel = window.getSelection()
    if (sel && sel.rangeCount) savedRange.current = sel.getRangeAt(0)
  }
  const restoreSelection = () => {
    const sel = window.getSelection()
    if (savedRange.current && sel) {
      sel.removeAllRanges()
      sel.addRange(savedRange.current)
    }
  }

  const addLink = (e) => {
    e.preventDefault()
    const url = new FormData(e.currentTarget).get('url')
    setLinkOpen(false)
    if (!url) return
    ref.current.focus()
    restoreSelection()
    exec('createLink', url)
  }

  const insertImage = async () => {
    rememberSelection()
    const result = await onInsertImage()
    if (!result) return
    ref.current.focus()
    restoreSelection()
    exec('insertHTML', `<figure><img src="${result.path}" alt="${result.alt || ''}" /><figcaption>${result.caption || ''}</figcaption></figure><p></p>`)
  }

  const onKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault()
      rememberSelection()
      setLinkOpen(true)
    }
  }

  return (
    <div className="rounded-2xl border border-teal-deep/20 bg-white">
      <div className="sticky top-[calc(var(--hf-header,64px)_+_var(--hf-actionbar,0px))] z-10 flex items-center gap-1 overflow-x-auto rounded-t-2xl border-b border-teal-deep/10 bg-white/95 px-2 py-2 backdrop-blur [scrollbar-width:none] md:flex-wrap md:overflow-visible">
        {tools.map((t) => (
          <button
            key={t.label}
            type="button"
            title={t.title}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => (t.cmd ? exec(t.cmd) : block(t.block))}
            className={`flex-none whitespace-nowrap rounded-lg px-2.5 py-1.5 text-sm text-teal-deep hover:bg-teal-tint ${t.className || ''}`}
          >
            {t.label}
          </button>
        ))}
        <button type="button" title="Link (Ctrl/Cmd+K)" onMouseDown={(e) => e.preventDefault()} onClick={() => { rememberSelection(); setLinkOpen(true) }} className="flex-none rounded-lg px-2.5 py-1.5 text-sm text-teal-deep hover:bg-teal-tint">
          Link
        </button>
        <button type="button" title="Insert image" onMouseDown={(e) => e.preventDefault()} onClick={insertImage} className="flex-none rounded-lg px-2.5 py-1.5 text-sm text-teal-deep hover:bg-teal-tint">
          Image
        </button>
        <span className="ml-auto hidden pr-2 text-[11px] text-muted lg:inline">Paste from Word/Docs is cleaned automatically</span>
      </div>
      {linkOpen && (
        <form onSubmit={addLink} className="flex flex-wrap gap-2 border-b border-teal-deep/10 bg-teal-tint-solid px-3 py-2">
          <input name="url" type="url" autoFocus placeholder="https://…" className="min-w-0 flex-1 basis-40 rounded-lg border border-teal-deep/20 px-3 py-1.5 text-sm" />
          <Btn type="submit" className="px-3 py-1.5">Add link</Btn>
          <Btn variant="quiet" className="px-3 py-1.5" onClick={() => setLinkOpen(false)}>Cancel</Btn>
        </form>
      )}
      <div
        ref={ref}
        className="hf-editor px-4 py-4 sm:px-5"
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={emit}
        onBlur={emit}
        onPaste={onPaste}
        onKeyDown={onKeyDown}
        role="textbox"
        aria-multiline="true"
        aria-label="Post body"
      />
    </div>
  )
}
