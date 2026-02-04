/**
 * @fileoverview Application entry point.
 * 
 * Bootstraps the React application by rendering the root App component
 * into the DOM. Uses StrictMode for development checks.
 * 
 * @module main
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
