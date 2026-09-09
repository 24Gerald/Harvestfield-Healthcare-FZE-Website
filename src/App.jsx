import { BrowserRouter, MemoryRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Nav from './components/Nav'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'
import Home from './pages/Home'
import Privacy from './pages/Privacy'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import { smoothScrollTo } from './lib/motion'

/** Scroll to top on route change; if the new location carries a hash (e.g. /#factory from the blog), ease to it. */
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (hash) {
      const t = setTimeout(() => smoothScrollTo(hash), 80)
      return () => clearTimeout(t)
    }
  }, [pathname, hash])
  return null
}

// Normal hosting uses real URLs. Set VITE_ROUTER=memory for sandboxed previews
// (e.g. a single-file build served from a fixed URL) where the path cannot change.
const Router = import.meta.env.VITE_ROUTER === 'memory' ? MemoryRouter : BrowserRouter

export default function App() {
  return (
    <Router basename={import.meta.env.VITE_ROUTER === 'memory' ? '/' : import.meta.env.BASE_URL}>
      <ScrollToTop />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-teal-deep"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <Nav />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/legal" element={<Navigate to="/privacy" replace />} />
          {/* Unknown routes fall back to the home page; Netlify serves index.html for every path. */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  )
}
