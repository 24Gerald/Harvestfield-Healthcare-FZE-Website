import { useEffect, useState } from 'react'
import { ADMIN } from '../config'

/** Polls the latest Pages workflow run so editors can see when a change is live. */
export default function DeployStatus({ client, bump }) {
  const [run, setRun] = useState(null)
  useEffect(() => {
    let alive = true
    let timer
    const tick = async () => {
      try {
        const r = await client.latestRun()
        if (alive) setRun(r)
        const active = r && r.status !== 'completed'
        timer = setTimeout(tick, active ? 8000 : 45000)
      } catch {
        timer = setTimeout(tick, 60000)
      }
    }
    tick()
    return () => {
      alive = false
      clearTimeout(timer)
    }
  }, [client, bump])

  if (!run) return null
  const building = run.status !== 'completed'
  const ok = run.conclusion === 'success'
  return (
    <a href={run.html_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 hover:bg-white/15" title="Latest deploy">
      <span className={`h-2 w-2 rounded-full ${building ? 'animate-pulse bg-amber-300' : ok ? 'bg-emerald-300' : 'bg-red-400'}`} />
      {building ? 'Deploying…' : ok ? 'Site up to date' : 'Last deploy failed'}
      <span className="sr-only"> — open on GitHub</span>
      {!building && ok && (
        <span className="text-white/50">
          ·{' '}
          <span className="underline-offset-2 hover:underline" onClick={(e) => { e.preventDefault(); window.open(ADMIN.siteUrl, '_blank') }}>
            view site
          </span>
        </span>
      )}
    </a>
  )
}
