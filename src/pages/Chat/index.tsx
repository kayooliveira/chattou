import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { RecentConversations } from './components/RecentConversations'

export function Chat() {
  return (
    <div className="flex max-h-screen max-w-full flex-col gap-4 bg-app-background p-8">
      <Header />
      <RecentConversations />
      <Footer />
    </div>
  )
}
