import { Chat } from 'pages/Chat'
import { Navigate, Route, Routes as Switch } from 'react-router-dom'

import { Home } from '../pages/Home'
import { RequireAuth } from './components/RequireAuth'
export function Router() {
  return (
    <Switch>
      <Route path="/" element={<Home />} />
      <Route element={<RequireAuth />}>
        <Route path="/chat" element={<Chat />} />
      </Route>
      <Route
        path="*"
        element={
          <Navigate state={{ notify: 'Esta página não existe!' }} to="/" />
        }
      />
    </Switch>
  )
}
