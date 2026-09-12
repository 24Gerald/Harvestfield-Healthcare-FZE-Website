import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HarvestfieldLogo } from '../components/HarvestfieldMark'
import { ADMIN } from './config'
import { makeClient } from './lib/github'
import { makeServerClient, serverLogout } from './lib/server'
import { clearVault } from './lib/vault'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import PostEditor from './components/PostEditor'
import MediaLibrary from './components/MediaLibrary'
import DeployStatus from './components/DeployStatus'
import { ToastProvider, Btn } from './components/ui'

/**
 * Blog admin. Views: posts (dashboard) · editor · media · gallery. State-driven, no router,
 * so it works under any path (/admin/) on GitHub Pages and Netlify alike.
 */
export default function AdminApp() {
  const [session, setSession] = useState(null) // { token, user }
  const [view, setView] = useState({ name: 'posts' })
  const [deployBump, setDeployBump] = useState(0)
  const [refreshKey, setRefreshKey] = useState(0)
  const client = useMemo(() => (session ? (session.mode === 'server' ? makeServerClient() : makeClient(session.token)) : null), [session])
  const headerRef = useRef(null)

  // Publish the sticky header's height so the editor's action bar and toolbar
  // can stick just below it (it is one row on desktop, two on phones).
  useEffect(() => {
    const el = headerRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const apply = () => document.documentElement.style.setProperty('--hf-header', `${el.offsetHeight}px`)
    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(el)
    return () => ro.disconnect()
  }, [session])

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
    { id: 'gallery', label: 'Gallery' },
    { id: 'models', label: '3D models' },
  ]
  const signOut = () => {
    if (confirm('Sign out?')) {
      if (session.mode === 'server') serverLogout().catch(() => {})
      else if (!session.storedInRepo && confirm('Also forget the GitHub token on this browser?')) clearVault()
      setSession(null)
    }
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#f6f9f9] text-ink">
        <header ref={headerRef} className="on-dark sticky top-0 z-30 bg-teal-deep text-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2.5 md:h-16 md:flex-nowrap md:gap-6 md:px-10 md:py-0">
            <HarvestfieldLogo className="h-8 md:h-9" />
            <nav className="order-last -mx-1 flex w-full items-center gap-1 md:order-none md:mx-0 md:w-auto" aria-label="Admin sections">
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
              <a href={ADMIN.siteUrl} target="_blank" rel="noopener noreferrer" className="ml-auto px-2 text-xs text-white/70 hover:text-white md:hidden">
                View site ↗
              </a>
            </nav>
            <div className="ml-auto flex min-w-0 items-center gap-2 md:gap-3">
              <DeployStatus client={client} bump={deployBump} />
              <a href={ADMIN.siteUrl} target="_blank" rel="noopener noreferrer" className="hidden text-xs text-white/70 hover:text-white md:block">
                View site ↗
              </a>
              <Btn variant="ghost" className="whitespace-nowrap border-white/30 px-3 py-1.5 text-xs text-white hover:bg-white/10" onClick={signOut} aria-label={`Sign out (${session.user})`}>
                <span className="hidden md:inline">{session.user} · </span>
                <span className="md:hidden">Sign out</span>
                <span className="hidden md:inline">sign out</span>
              </Btn>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10">
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
            {view.name === 'gallery' && (
              <motion.div key="gallery" exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                <h1 className="text-3xl font-bold text-teal-deep">Gallery</h1>
                <p className="mt-1 max-w-2xl text-sm text-muted">
                  Photos for the “Inside the factory” slider on the home page. They roll past in the order shown here (file-name order), so choose the
                  photo you want first, first. Each change rebuilds the site; allow a couple of minutes for it to go live.
                </p>
                <div className="mt-6">
                  <MediaLibrary client={client} dir={ADMIN.galleryDir} sequence imagesOnly maxEdge={1400} />
                </div>
              </motion.div>
            )}
            {view.name === 'models' && (
              <motion.div key="models" exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                <h1 className="text-3xl font-bold text-teal-deep">3D models</h1>
                <p className="mt-1 max-w-2xl text-sm text-muted">
                  GLB and glTF files for the 3D elements on the site. Upload the file here, then press Copy and send the path to your developer —
                  which element a model drives has to be wired in code, so a new upload does not change the site on its own. A .gltf package needs
                  its .bin and texture files uploaded alongside it with their names unchanged.
                </p>
                <div className="mt-6">
                  <MediaLibrary client={client} dir={ADMIN.modelsDir} models />
                </div>
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
