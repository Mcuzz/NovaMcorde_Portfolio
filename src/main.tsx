import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppRoot } from './AppRoot.tsx'
import { SharedCardPage } from './sections/SharedCardPage.tsx'

const cardParam = new URLSearchParams(window.location.search).get('card')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {cardParam ? <SharedCardPage encoded={cardParam} /> : <AppRoot />}
  </StrictMode>,
)