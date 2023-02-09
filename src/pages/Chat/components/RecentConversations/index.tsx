import { IoMdClock } from 'react-icons/io'

import { RecentConversationsCard } from '../RecentConversationsCard'

export function RecentConversations() {
  return (
    <section className="flex h-full max-h-full w-full flex-col gap-4 overflow-y-scroll scrollbar-none">
      <span className="flex w-fit items-center justify-center gap-2 self-start rounded-full bg-gradient-to-r from-app-primary to-[#B66DFF] py-1.5 px-2.5 text-xs font-bold leading-none text-app-text">
        Recentes
        <IoMdClock />
      </span>
      <div className="flex h-full max-h-full w-full flex-col gap-4 overflow-y-scroll scrollbar-none">
        <div className="pointer-events-none relative flex flex-col justify-center gap-2  after:fixed after:bottom-0 after:h-1/4 after:w-full after:bg-gradient-to-t after:from-app-background after:content-['']">
          <RecentConversationsCard
            name="Berenicio"
            lastMessage="É o crime, é nois!"
            lastMessageTime="2 min"
            messagesQnt={3}
          />
          <RecentConversationsCard
            name="Coringa"
            lastMessage="Ovo bota mais carro!!!"
            lastMessageTime="1min"
            messagesQnt={2}
          />
          <RecentConversationsCard
            name="Savio"
            lastMessage="Bora randolar?"
            lastMessageTime="5 min"
            messagesQnt={1}
          />
          <RecentConversationsCard
            name="Alexander"
            lastMessage="Hey, what's up?"
            lastMessageTime="4 min"
            messagesQnt={1}
          />
          <RecentConversationsCard
            name="Jhon"
            lastMessage="Idk"
            lastMessageTime="6 min"
            messagesQnt={2}
          />
          <RecentConversationsCard
            name="Marcos"
            lastMessage="Tks"
            lastMessageTime="1 min"
            messagesQnt={1}
          />
        </div>
      </div>
    </section>
  )
}
