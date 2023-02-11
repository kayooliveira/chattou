import { format } from 'date-fns'
import { IoMdClock } from 'react-icons/io'
import { useChatStore } from 'store/chat'

import { RecentConversationsCard } from '../RecentConversationsCard'

export function RecentConversations() {
  const chats = useChatStore(state => state.chats)
  return (
    <section className="-mx-4 flex w-full flex-1 shrink-0 flex-col gap-4 overflow-y-scroll px-4 scrollbar-thin scrollbar-track-app-backgroundLight scrollbar-thumb-app-primary scrollbar-track-rounded-full scrollbar-thumb-rounded-full">
      <span className="flex w-fit items-center justify-center gap-2 self-start rounded-full bg-gradient-to-r from-app-primary to-[#B66DFF] py-1.5 px-2.5 text-xs font-bold leading-none text-app-text">
        Recentes
        <IoMdClock />
      </span>
      <div className="flex h-full max-h-full w-full flex-col gap-4">
        <div className="flex flex-col justify-start gap-2 after:pointer-events-none after:absolute after:bottom-0 after:h-1/4 after:w-full after:bg-gradient-to-t after:from-app-background after:content-['']">
          {chats &&
            chats.map(chat => (
              <RecentConversationsCard
                key={chat.id}
                chatId={chat.id}
                name={chat.name}
                lastMessage={chat.lastMessage}
                lastMessageTime={format(chat.lastMessageDate, 'dd/MM/yyyy')}
                messagesQnt={1}
                profilePic={chat.image}
              />
            ))}
          <div className="h-20 w-full" />
        </div>
      </div>
    </section>
  )
}
