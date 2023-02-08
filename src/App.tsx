import { Toaster } from 'react-hot-toast'
import { BrowserRouter } from 'react-router-dom'

import { Router } from './router'

export function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </>
  )
}
