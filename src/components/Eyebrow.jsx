/** Small uppercase label above section headings ("The Factory", "Supply" …). */
export default function Eyebrow({ children, className = '', as: Tag = 'p' }) {
  return <Tag className={`eyebrow ${className}`}>{children}</Tag>
}
