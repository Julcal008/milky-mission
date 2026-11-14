/**
 * MILKY MISSION — application entry point.
 * Keep this file boring: mount React, import global styles, render <App />.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/app/App'
import { useMissionStore } from '@/store/mission'
import '@/styles/global.css'

// Load a shared mission before rendering so screens mount with the right config.
const sharedCode = new URLSearchParams(window.location.search).get('m')
if (sharedCode) {
  const loaded = useMissionStore.getState().loadShareCode(sharedCode)
  if (loaded && (!window.location.hash || window.location.hash === '#/')) {
    window.location.hash = '#/design'
  }
}

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element #root not found in index.html')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
