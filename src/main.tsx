import React from 'react'
import { createRoot } from 'react-dom/client'

import './styles/global.css'
import { App } from './App'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById('root')!

const root = createRoot(container)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
