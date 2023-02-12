import { CurrentConversation } from './components/CurrentConversation'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { RecentConversations } from './components/RecentConversations'

export function Chat() {
  return (
    <div className="mx-auto flex h-screen max-h-screen max-w-screen-2xl gap-4 bg-app-background p-8">
      <section className="relative flex max-h-full w-full max-w-full flex-col overflow-hidden lg:w-auto">
        <Header />
        <RecentConversations />
      </section>
      <CurrentConversation />
      <Footer />
    </div>
  )
}
