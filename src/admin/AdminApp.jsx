import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HarvestfieldLogo } from '../components/HarvestfieldMark'
import { ADMIN } from './config'
import { makeClient } from './lib/github'
import { clearVault } from './lib/vault'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import PostEditor from './components/PostEditor'
import MediaLibrary from './components/MediaLibrary'
import DeployStatus from './components/DeployStatus'
import { ToastProvider, Btn } from './components/ui'

/**
 * Blog admin. Views: posts (dashboard) · editor · media. State-driven, no router,
 * so it works under any path (/admin/) on GitHub Pages and Netlify alike.
 */
export default function AdminApp() {
  const [session, setSession] = useState(null) // { token, user }
  const [view, setView] = useState({ name: 'posts' })
  const [deployBump, setDeployBump] = useState(0)
  const [refreshKey, setRefreshKey] = useState(0)
  const client = useMemo(() => (session ? makeClient(session.token) : null), [session])

  if (!session) {
    return (
      <ToastProvider>
        <Login onReady={setSession} />
      </ToastProvider>
    )
  }

  const nav = [
    { id: 'posts', label: 'Posts' },
    { id: 'media', label: 'Media' },
  ]
  const signOut = () => {
    if (confirm('Sign out?')) {
      if (!session.storedInRepo && confirm('Also forget the GitHub token on this browser?')) clearVault()
      setSession(null)
    }
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#f6f9f9] text-ink">
        <header className="on-dark sticky top-0 z-30 bg-teal-deep text-white">
          <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-6 md:px-10">
            <HarvestfieldLogo className="h-9" />
            <nav className="flex items-center gap-1">
              {nav.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setView({ name: n.id })}
                  className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${view.name === n.id || (n.id === 'posts' && view.name === 'editor') ? 'text-white' : 'text-white/70 hover:text-white'}`}
                >
                  {(view.name === n.id || (n.id === 'posts' && view.name === 'editor')) && (
                    <motion.span layoutId="admin-pill" className="absolute inset-0 rounded-full bg-white/12" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                  )}
                  <span className="relative">{n.label}</span>
                </button>
              ))}
            </nav>
            <div className="ml-auto flex items-center gap-3">
              <DeployStatus client={client} bump={deployBump} />
              <a href={ADMIN.siteUrl} target="_blank" rel="noopener noreferrer" className="hidden text-xs text-white/70 hover:text-white md:block">
                View site ↗
              </a>
              <Btn variant="ghost" className="border-white/30 px-3 py-1.5 text-xs text-white hover:bg-white/10" onClick={signOut}>
                {session.user} · sign out
              </Btn>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-10">
          <AnimatePresence mode="wait">
            {view.name === 'posts' && (
              <motion.div key="posts" exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                <Dashboard client={client} refreshKey={refreshKey} onNew={() => setView({ name: 'editor', post: null })} onEdit={(p) => setView({ name: 'editor', post: p })} />
              </motion.div>
            )}
            {view.name === 'editor' && (
              <motion.div key={`editor-${view.post?.data?.slug || 'new'}`} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                <PostEditor
                  client={client}
                  initial={view.post}
                  onBack={() => { setRefreshKey((k) => k + 1); setView({ name: 'posts' }) }}
                  onSaved={() => setRefreshKey((k) => k + 1)}
                  onDeployed={() => setTimeout(() => setDeployBump((b) => b + 1), 4000)}
                />
              </motion.div>
            )}
            {view.name === 'media' && (
              <motion.div key="media" exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                <h1 className="text-3xl font-bold text-teal-deep">Media</h1>
                <p className="mt-1 text-sm text-muted">Images and files for posts. Stored in the site repository at public/blog-media.</p>
                <div className="mt-6">
                  <MediaLibrary client={client} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </ToastProvider>
  )
}
