import { Chat } from 'pages/Chat'
import { Route, Routes as Switch } from 'react-router-dom'

import { Home } from '../pages/Home'
export function Router() {
  return (
    <Switch>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<Chat />} />
    </Switch>
  )
}
