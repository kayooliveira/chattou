import classNames from 'classnames'
import {
  IoMdOptions,
  IoMdChatbubbles,
  IoMdCall,
  IoMdContacts
} from 'react-icons/io'
import { useConversationStore } from 'store/conversation'

export function Footer() {
  const isCurrentConversationOpen = useConversationStore(
    state => state.isCurrentConversationOpen
  )
  const openCurrentConversation = useConversationStore(
    state => state.openCurrentConversation
  )
  const closeCurrentConversation = useConversationStore(
    state => state.closeCurrentConversation
  )
  return (
    <footer className="fixed bottom-2 left-1/2 flex h-fit w-[calc(100%_-_4rem)] -translate-x-1/2 translate-y-0 items-center justify-center gap-8 rounded-full bg-app-backgroundLight px-8 py-4 text-app-light shadow-md shadow-black drop-shadow-2xl lg:hidden">
      <button
        onClick={openCurrentConversation}
        className={classNames('transition-colors hover:text-app-primary', {
          'text-app-primary': isCurrentConversationOpen
        })}
      >
        <IoMdChatbubbles size="30" />
      </button>
      <button
        onClick={closeCurrentConversation}
        className={classNames('transition-colors hover:text-app-primary', {
          'text-app-primary': !isCurrentConversationOpen
        })}
      >
        <IoMdContacts size="30" />
      </button>
      <button className="transition-colors hover:text-app-primary">
        <IoMdCall size="30" />
      </button>
      <button className="transition-colors hover:text-app-primary">
        <IoMdOptions size="30" />
      </button>
    </footer>
  )
}
