import classNames from 'classnames'
import { useConversationStore } from 'store/conversation'

import { CurrentConversation } from './components/CurrentConversation'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { RecentConversations } from './components/RecentConversations'

export function Chat() {
  const isCurrentConversationOpen = useConversationStore(
    state => state.isCurrentConversationOpen
  )
  return (
    <div className="mx-auto flex h-screen max-h-screen max-w-screen-2xl gap-4 bg-app-background p-8">
      <div
        className={classNames(
          'relative flex h-full w-full max-w-full flex-col',
          {
            'w-full md:w-full lg:w-full': !isCurrentConversationOpen,
            'md:w-2/5 lg:w-1/3': isCurrentConversationOpen
          }
        )}
      >
        <Header />
        <RecentConversations />
      </div>
      <CurrentConversation />
      <Footer />
    </div>
  )
}
