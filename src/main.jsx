import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Self-hosted Montserrat (no runtime request to Google Fonts).
import '@fontsource/montserrat/400.css'
import '@fontsource/montserrat/500.css'
import '@fontsource/montserrat/600.css'
import '@fontsource/montserrat/700.css'

import './styles/index.css'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
