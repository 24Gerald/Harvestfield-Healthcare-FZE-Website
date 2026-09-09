import { BrowserRouter, MemoryRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Nav from './components/Nav'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'
import Home from './pages/Home'
import Legal from './pages/Legal'

/** Scroll to top on route change (hash links on the home page are left to the browser). */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
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
          <Route path="/legal" element={<Legal />} />
          {/* Unknown routes fall back to the home page; Netlify serves index.html for every path. */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  )
}
