import { CurrentConversation } from './components/CurrentConversation'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { RecentConversations } from './components/RecentConversations'

export function Chat() {
  return (
    <div className="mx-auto flex h-screen max-h-screen max-w-screen-2xl gap-4 bg-app-background p-8">
      <div className="relative flex h-full max-w-full flex-col md:w-2/5 lg:w-1/3">
        <Header />
        <RecentConversations />
      </div>
      <CurrentConversation />
      <Footer />
    </div>
  )
}
